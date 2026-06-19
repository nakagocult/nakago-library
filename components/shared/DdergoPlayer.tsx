'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Disc3, Check, Loader2 } from 'lucide-react';
import { DDERGO_ARTIST_ID, DDERGO_ARTIST_URL, DDERGO_FOLLOW_SCOPE, DDERGO_STREAMS } from '@/lib/site';
import { buildSpotifyAuthUrl } from '@/lib/spotify/pkce';

// Minimal shape of the controller object Spotify's iFrame API hands back —
// the full SDK has no published TS types, so this covers only what we use.
interface SpotifyEmbedController {
  loadUri: (uri: string) => void;
  play: () => void;
  togglePlay: () => void;
  addListener: (event: 'playback_update', cb: (e: { data: { isPaused: boolean } }) => void) => void;
  removeListener: (event: 'playback_update') => void;
  destroy: () => void;
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyEmbedController) => void,
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
  }
}

interface Track {
  id: string;
  name: string;
  uri: string;
  durationMs: number;
  albumArt: string | null;
}

const SCRIPT_ID = 'spotify-iframe-api';
const NEXT_PUBLIC_SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

function formatDuration(ms: number) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

type FollowState = 'idle' | 'connecting' | 'followed' | 'error';

export default function DdergoPlayer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);
  const autoplayedRef = useRef(false);
  const [activeStream, setActiveStream] = useState<string>(DDERGO_STREAMS[0].id);
  const [activeTrackUri, setActiveTrackUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [controllerReady, setControllerReady] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [followState, setFollowState] = useState<FollowState>('idle');

  // Load the real DDERGO catalog from our own API route (Spotify Client
  // Credentials — public data, no user login needed) so the card shows an
  // actual track list instead of just a black-box embed.
  useEffect(() => {
    fetch('/api/spotify/tracks')
      .then((res) => res.json())
      .then((data) => setTracks(data.tracks ?? []))
      .catch(() => setTracks([]));
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;
    let timedOut = false;

    const boot = (api: SpotifyIframeApi) => {
      api.createController(mount, { uri: DDERGO_STREAMS[0].uri, width: '100%', height: 80 }, (controller) => {
        if (cancelled || timedOut) return;
        controllerRef.current = controller;
        setControllerReady(true);
        controller.addListener('playback_update', (e) => setIsPlaying(!e.data.isPaused));
        // Best-effort autoplay — most browsers block unprompted audio on
        // first visit, so this silently no-ops there. The top play button
        // is the reliable path; this just catches the browsers that allow it.
        if (!autoplayedRef.current) {
          autoplayedRef.current = true;
          controller.play();
        }
      });
    };

    const existing = document.getElementById(SCRIPT_ID);
    const prevReady = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (api) => {
      prevReady?.(api);
      boot(api);
    };

    if (!existing) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      script.onerror = () => !cancelled && setApiFailed(true);
      document.body.appendChild(script);
    }

    const timeout = setTimeout(() => {
      if (!controllerRef.current && !cancelled) {
        timedOut = true;
        setApiFailed(true);
      }
    }, 8000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controllerRef.current?.destroy();
      controllerRef.current = null;
      setControllerReady(false);
    };
  }, []);

  // Spotify "Follow" in real-time, without ever navigating the main tab
  // away — a small popup handles the one-time Spotify login/consent
  // (every "Connect with Spotify" feature anywhere needs this once), then
  // posts the result back here and closes itself.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.source !== 'ddergo-spotify-follow') return;
      setFollowState(e.data.success ? 'followed' : 'error');
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const handleFollow = async () => {
    if (!NEXT_PUBLIC_SPOTIFY_CLIENT_ID) {
      window.open(DDERGO_ARTIST_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    setFollowState('connecting');
    const redirectUri = `${window.location.origin}/spotify-callback`;
    const { url } = await buildSpotifyAuthUrl(NEXT_PUBLIC_SPOTIFY_CLIENT_ID, redirectUri, DDERGO_FOLLOW_SCOPE);
    const popup = window.open(url, 'ddergo-spotify-follow', 'width=420,height=620');
    if (!popup) setFollowState('error');
  };

  const togglePlay = () => controllerRef.current?.togglePlay();

  const playTrack = (track: Track) => {
    setActiveTrackUri(track.uri);
    controllerRef.current?.loadUri(track.uri);
    controllerRef.current?.play();
  };

  const selectStream = (id: string) => {
    const stream = DDERGO_STREAMS.find((s) => s.id === id);
    if (!stream || !stream.enabled) return;
    setActiveStream(id);
    setActiveTrackUri(null);
    controllerRef.current?.loadUri(stream.uri);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl p-5"
      style={{
        background: 'rgba(17,17,17,0.72)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '1px solid rgba(29,185,84,0.25)',
        boxShadow: '0 0 40px rgba(29,185,84,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Header: vinyl + title + top play/pause + follow */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="vinyl-disc flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full"
          style={{
            background:
              'repeating-radial-gradient(circle, #0a0a0a 0px, #0a0a0a 2px, #1a1a1a 3px, #1a1a1a 4px)',
            border: '2px solid rgba(29,185,84,0.4)',
            animationPlayState: isPlaying ? 'running' : 'paused',
          }}
        >
          <div
            className="flex h-5 w-5 items-center justify-center rounded-full"
            style={{ background: '#1DB954' }}
          >
            <Disc3 className="h-3 w-3 text-black" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="truncate text-base font-black uppercase tracking-[0.12em] text-white"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            DDERGO
          </p>
          <p className="text-[11px] text-white/40">
            {isPlaying ? 'Now streaming' : 'Live on Spotify'}
          </p>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          disabled={!controllerReady && !apiFailed}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-black transition-transform hover:scale-[1.08] disabled:opacity-40"
          style={{ background: '#1DB954', boxShadow: '0 0 16px rgba(29,185,84,0.5)' }}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={handleFollow}
          disabled={followState === 'connecting' || followState === 'followed'}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-white transition-transform hover:scale-[1.04] disabled:hover:scale-100"
          style={{ background: followState === 'followed' ? 'rgba(29,185,84,0.25)' : '#1DB954', border: followState === 'followed' ? '1px solid #1DB954' : 'none' }}
        >
          {followState === 'connecting' && <Loader2 className="h-3 w-3 animate-spin" />}
          {followState === 'followed' && <Check className="h-3 w-3" />}
          {followState === 'followed' ? 'Following' : followState === 'connecting' ? 'Connecting' : 'Follow'}
        </button>
      </div>

      {/* Stream bar — mood / genre tabs */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {DDERGO_STREAMS.map((stream) => {
          const active = activeStream === stream.id;
          return (
            <button
              key={stream.id}
              type="button"
              onClick={() => selectStream(stream.id)}
              disabled={!stream.enabled}
              title={stream.enabled ? undefined : 'Coming soon'}
              className="flex-shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] transition-colors disabled:cursor-not-allowed disabled:opacity-35"
              style={{
                background: active ? 'rgba(29,185,84,0.18)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${active ? 'rgba(29,185,84,0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: active ? '#1DB954' : 'rgba(255,255,255,0.6)',
              }}
            >
              {stream.label}
            </button>
          );
        })}
      </div>

      {/* Track list — real DDERGO catalog, click any row to play it on-site */}
      {tracks.length > 0 && (
        <div className="mb-3 max-h-56 space-y-0.5 overflow-y-auto pr-1">
          {tracks.map((track) => {
            const active = activeTrackUri === track.uri;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => playTrack(track)}
                className="flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors"
                style={{ background: active ? 'rgba(29,185,84,0.12)' : 'transparent' }}
              >
                <div
                  className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-white/5"
                  style={track.albumArt ? { backgroundImage: `url(${track.albumArt})`, backgroundSize: 'cover' } : undefined}
                />
                <span
                  className="min-w-0 flex-1 truncate text-[12px]"
                  style={{ color: active ? '#1DB954' : 'rgba(255,255,255,0.75)' }}
                >
                  {track.name}
                </span>
                <span className="flex-shrink-0 text-[10px] text-white/30">{formatDuration(track.durationMs)}</span>
                {active && isPlaying ? (
                  <Pause className="h-3 w-3 flex-shrink-0 text-[#1DB954]" />
                ) : (
                  <Play className="h-3 w-3 flex-shrink-0 text-white/30" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Embedded player — the actual Spotify playback engine driving
          everything above. Kept small/secondary; our own controls on top
          are the primary interface. */}
      <div className="overflow-hidden rounded-xl" style={{ minHeight: tracks.length > 0 ? 0 : 80 }}>
        <div ref={mountRef} />
        {apiFailed && (
          <iframe
            src={`https://open.spotify.com/embed/artist/${DDERGO_ARTIST_ID}`}
            width="100%"
            height={152}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ border: 'none', display: 'block' }}
            title="DDERGO on Spotify"
          />
        )}
      </div>
    </div>
  );
}
