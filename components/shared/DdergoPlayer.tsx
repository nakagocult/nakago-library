'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Disc3 } from 'lucide-react';
import { DDERGO_ARTIST_ID, DDERGO_ARTIST_URL, DDERGO_STREAMS } from '@/lib/site';

// Minimal shape of the controller object Spotify's iFrame API hands back —
// the full SDK has no published TS types, so this covers only what we use.
interface SpotifyEmbedController {
  loadUri: (uri: string) => void;
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

const SCRIPT_ID = 'spotify-iframe-api';

export default function DdergoPlayer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);
  const [activeStream, setActiveStream] = useState<string>(DDERGO_STREAMS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;
    let timedOut = false;

    const boot = (api: SpotifyIframeApi) => {
      api.createController(mount, { uri: DDERGO_STREAMS[0].uri, width: '100%', height: 152 }, (controller) => {
        if (cancelled || timedOut) return;
        controllerRef.current = controller;
        controller.addListener('playback_update', (e) => setIsPlaying(!e.data.isPaused));
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
    };
  }, []);

  const selectStream = (id: string) => {
    const stream = DDERGO_STREAMS.find((s) => s.id === id);
    if (!stream || !stream.enabled) return;
    setActiveStream(id);
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
      {/* Header: vinyl + title + follow */}
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

        <a
          href={DDERGO_ARTIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-white transition-transform hover:scale-[1.04]"
          style={{ background: '#1DB954', boxShadow: '0 0 16px rgba(29,185,84,0.5)' }}
        >
          Follow <ExternalLink className="h-3 w-3" />
        </a>
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

      {/* Embedded player — real Spotify playback chrome (play, seek, shuffle) */}
      <div className="overflow-hidden rounded-2xl" style={{ minHeight: 152 }}>
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
