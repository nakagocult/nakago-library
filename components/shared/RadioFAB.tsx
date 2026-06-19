'use client';

import { Disc3 } from 'lucide-react';

/**
 * Always-visible top-left shuffle control. Clicking it works even before the
 * lazy-loaded DdergoPlayer below has mounted — it sets a flag the player
 * picks up once it's ready, then scrolls down to reveal it.
 */
export default function RadioFAB() {
  const handleClick = () => {
    sessionStorage.setItem('naka_pending_random_play', '1');
    window.dispatchEvent(new Event('naka:play-random'));
    document.getElementById('ddergo')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Shuffle play DDERGO"
      title="Shuffle play DDERGO"
      className="fixed left-4 top-36 z-[60] flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-[1.08] md:top-20"
      style={{
        background: 'rgba(17,17,17,0.85)',
        border: '1px solid rgba(29,185,84,0.4)',
        boxShadow: '0 0 18px rgba(29,185,84,0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Disc3 className="h-5 w-5 text-[#1DB954]" />
    </button>
  );
}
