'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, ListMusic, X } from 'lucide-react';
import { DDERGO_ARTIST_URL, DDERGO_ARTIST_IMG } from '@/lib/site';
import type { RadioTrack } from '@/lib/ddergo-tracks';

function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/**
 * Slim, always-docked DDERGO radio. Mounted once in the root layout, so it
 * keeps playing uninterrupted across client-side page navigations. Uses a
 * single <audio preload="none"> element: nothing is fetched until the first
 * play, so it stays lightning-fast even with a large library.
 *
 * Hidden until the intro finishes (or something asks to play), and renders
 * nothing at all when public/audio/ is empty.
 */
export default function RadioDock({ tracks }: { tracks: RadioTrack[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [listOpen, setListOpen] = useState(false);

  const hasTracks = tracks.length > 0;

  const play = useCallback(
    (i: number) => {
      const audio = audioRef.current;
      const track = tracks[i];
      if (!audio || !track) return;
      if (i !== index) {
        audio.src = track.src;
        setIndex(i);
      }
      audio.play().catch(() => {}); // browsers may block until a user gesture
    },
    [tracks, index],
  );

  const pickRandom = useCallback(() => {
    if (tracks.length <= 1) return 0;
    let n = index ?? 0;
    while (n === index) n = Math.floor(Math.random() * tracks.length);
    return n;
  }, [tracks.length, index]);

  const playNext = useCallback(() => {
    if (!hasTracks) return;
    play(shuffle ? pickRandom() : index === null ? 0 : (index + 1) % tracks.length);
  }, [hasTracks, shuffle, pickRandom, index, tracks.length, play]);

  const playPrev = useCallback(() => {
    if (!hasTracks) return;
    play(shuffle ? pickRandom() : index === null ? 0 : (index - 1 + tracks.length) % tracks.length);
  }, [hasTracks, shuffle, pickRandom, index, tracks.length, play]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !hasTracks) return;
    if (index === null) {
      play(shuffle ? pickRandom() : 0);
    } else if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [hasTracks, index, isPlaying, play, shuffle, pickRandom]);

  // Reveal once the intro is gone; also let anything dispatch naka:play-random
  // (nav "Radio" item, etc.) to wake + shuffle-start the dock.
  useEffect(() => {
    const onReady = () => setReady(true);
    if (sessionStorage.getItem('naka_intro_done')) Promise.resolve().then(onReady);
    const onPlayRandom = () => {
      setReady(true);
      setShuffle(true);
      play(pickRandom());
    };
    window.addEventListener('naka:intro-done', onReady);
    window.addEventListener('naka:play-random', onPlayRandom);
    return () => {
      window.removeEventListener('naka:intro-done', onReady);
      window.removeEventListener('naka:play-random', onPlayRandom);
    };
  }, [play, pickRandom]);

  if (!ready || !hasTracks) return null;

  const current = index === null ? null : tracks[index];

  return (
    <>
      {/* Spacer so the fixed bar never covers the footer's last content. */}
      <div aria-hidden className="h-[72px]" />

      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={playNext}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {/* Track list popover */}
      {listOpen && (
        <div
          className="fixed bottom-[76px] left-1/2 z-[61] max-h-[50vh] w-[min(420px,calc(100vw-1.5rem))] -translate-x-1/2 overflow-y-auto rounded-2xl p-1.5"
          style={{
            background: 'rgba(17,17,17,0.95)',
            border: '1px solid rgba(29,185,84,0.3)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center justify-between px-2.5 py-2">
            <span
              className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              DDERGO RECORDS — {tracks.length} tracks
            </span>
            <button type="button" onClick={() => setListOpen(false)} aria-label="Close list" className="text-white/40 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          {tracks.map((t, i) => {
            const active = i === index;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => play(i)}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-white/5"
                style={{ background: active ? 'rgba(29,185,84,0.12)' : 'transparent' }}
              >
                <div
                  className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-white/5"
                  style={t.art ? { backgroundImage: `url(${t.art})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                />
                <span className="min-w-0 flex-1 truncate text-[13px]" style={{ color: active ? '#1DB954' : 'rgba(255,255,255,0.8)' }}>
                  {t.title}
                </span>
                {active && isPlaying ? <Pause className="h-3.5 w-3.5 flex-shrink-0 text-[#1DB954]" /> : <Play className="h-3.5 w-3.5 flex-shrink-0 text-white/30" />}
              </button>
            );
          })}
        </div>
      )}

      {/* The dock bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[60]"
        style={{
          background: 'rgba(10,10,10,0.92)',
          borderTop: '1px solid rgba(29,185,84,0.25)',
          backdropFilter: 'blur(16px) saturate(160%)',
          WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4">
          {/* Art / vinyl */}
          <div
            className="vinyl-disc flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
            style={{
              background: `url(${current?.art ?? DDERGO_ARTIST_IMG}) center/cover`,
              border: '2px solid rgba(29,185,84,0.4)',
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          />

          {/* Prev (hidden on xs) */}
          <button type="button" onClick={playPrev} aria-label="Previous" className="hidden text-white/60 transition-colors hover:text-white sm:block">
            <SkipBack className="h-5 w-5" />
          </button>

          {/* Play / pause */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-black transition-transform hover:scale-[1.08]"
            style={{ background: '#1DB954', boxShadow: '0 0 16px rgba(29,185,84,0.5)' }}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
          </button>

          {/* Next */}
          <button type="button" onClick={playNext} aria-label="Next" className="text-white/60 transition-colors hover:text-white">
            <SkipForward className="h-5 w-5" />
          </button>

          {/* Title + scrubber */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-white/85">
              {current ? current.title : 'DDERGO Radio'}
              <span className="ml-1.5 font-normal text-white/35">{current ? '· DDERGO RECORDS' : '· tap play'}</span>
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="hidden w-8 text-right text-[10px] tabular-nums text-white/35 sm:block">{formatTime(time)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={time}
                onChange={(e) => {
                  const audio = audioRef.current;
                  if (audio) audio.currentTime = Number(e.target.value);
                }}
                aria-label="Seek"
                className="radio-scrubber h-1 w-full cursor-pointer"
                style={{ accentColor: '#1DB954' }}
              />
              <span className="hidden w-8 text-[10px] tabular-nums text-white/35 sm:block">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Shuffle */}
          <button
            type="button"
            onClick={() => setShuffle((s) => !s)}
            aria-label="Shuffle"
            aria-pressed={shuffle}
            title={shuffle ? 'Shuffle on' : 'Shuffle off'}
            className="flex-shrink-0 transition-colors"
            style={{ color: shuffle ? '#1DB954' : 'rgba(255,255,255,0.4)' }}
          >
            <Shuffle className="h-[18px] w-[18px]" />
          </button>

          {/* Track list */}
          <button
            type="button"
            onClick={() => setListOpen((v) => !v)}
            aria-label="Track list"
            aria-expanded={listOpen}
            className="flex-shrink-0 text-white/60 transition-colors hover:text-white"
          >
            <ListMusic className="h-[18px] w-[18px]" />
          </button>

          {/* Follow on Spotify (hidden on xs) */}
          <a
            href={DDERGO_ARTIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden flex-shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-white transition-transform hover:scale-[1.04] sm:block"
            style={{ background: '#1DB954' }}
          >
            Follow
          </a>
        </div>
      </div>
    </>
  );
}
