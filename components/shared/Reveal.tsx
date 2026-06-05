'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger index — multiplies the entrance delay. */
  index?: number;
  /** Slide-in direction. */
  from?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  delay?: number;
}

const OFFSET = 28;

/** Scroll-triggered fade/slide reveal. Collapses to a plain fade under reduced motion. */
export default function Reveal({ children, index = 0, from = 'up', className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();

  const offset = reduce
    ? {}
    : {
        up: { y: OFFSET },
        down: { y: -OFFSET },
        left: { x: OFFSET },
        right: { x: -OFFSET },
      }[from];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: delay + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
