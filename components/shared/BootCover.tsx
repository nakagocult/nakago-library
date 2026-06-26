'use client';

import { useEffect } from 'react';

// Lifts the black boot curtain (rendered as static HTML in the layout) once
// React has hydrated and the intro screen has made its show/skip decision.
// The double rAF guarantees we wait for the post-hydration paint — by then the
// intro's useLayoutEffect has already removed itself for returning visitors, so
// the curtain fades onto either the intro (first-timers) or the site (returners)
// with no flash of the hero images or aurora in between.
export default function BootCover() {
  useEffect(() => {
    const el = document.getElementById('boot-cover');
    if (!el) return;
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => el.classList.add('boot-hidden')),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  return null;
}
