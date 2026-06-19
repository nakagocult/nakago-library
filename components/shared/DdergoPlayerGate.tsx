'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DdergoPlayer = dynamic(() => import('./DdergoPlayer'), {
  ssr: false,
  loading: () => <DdergoPlayerSkeleton />,
});

function DdergoPlayerSkeleton() {
  return (
    <div
      className="mx-auto h-[180px] w-full max-w-md animate-pulse rounded-3xl"
      style={{ background: 'rgba(17,17,17,0.72)', border: '1px solid rgba(29,185,84,0.15)' }}
    />
  );
}

/**
 * Keeps the Spotify player's JS chunk, fetches, and third-party script out of
 * the critical path: it doesn't mount (and so doesn't fetch tracks or load
 * the Spotify iframe API) until the intro screen has finished, or until the
 * radio FAB asks for it directly.
 */
export default function DdergoPlayerGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onReady = () => setReady(true);
    if (sessionStorage.getItem('naka_intro_done')) {
      Promise.resolve().then(onReady);
      return;
    }
    window.addEventListener('naka:intro-done', onReady);
    window.addEventListener('naka:play-random', onReady);
    return () => {
      window.removeEventListener('naka:intro-done', onReady);
      window.removeEventListener('naka:play-random', onReady);
    };
  }, []);

  if (!ready) return <DdergoPlayerSkeleton />;
  return <DdergoPlayer />;
}
