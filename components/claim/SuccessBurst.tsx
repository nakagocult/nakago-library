'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

interface SuccessBurstProps {
  colors: [string, string];
}

export default function SuccessBurst({ colors }: SuccessBurstProps) {
  const reduce = useReducedMotion();

  const shards = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const distance = 120 + (i % 5) * 34;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          color: i % 2 === 0 ? colors[0] : colors[1],
          size: 5 + (i % 3) * 3,
          rotate: (i * 47) % 360,
        };
      }),
    [colors],
  );

  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 3.4, opacity: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute h-32 w-32 rounded-full"
        style={{ background: `radial-gradient(circle, ${colors[1]}66, transparent 70%)` }}
      />
      {shards.map((s, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: s.x, y: s.y, opacity: 0, scale: 0.4, rotate: s.rotate }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
          style={{
            width: s.size,
            height: s.size * 2,
            borderRadius: 2,
            background: s.color,
            boxShadow: `0 0 10px ${s.color}`,
          }}
        />
      ))}
    </div>
  );
}
