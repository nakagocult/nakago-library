'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MASCOT_URL } from '@/lib/utils/constants';

interface ShibaMascotProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function ShibaMascot({ size = 300, className = '', animate: shouldAnimate = true }: ShibaMascotProps) {
  const [imgError, setImgError] = useState(false);

  const content = (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          boxShadow: '0 0 60px rgba(255,77,0,0.6), 0 0 120px rgba(255,77,0,0.25)',
          borderRadius: '50%',
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,77,0,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Mascot image */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ border: '3px solid rgba(255,77,0,0.5)' }}
      >
        {!imgError ? (
          <Image
            src={MASCOT_URL}
            alt="Naka Go — The Shiba Who Saved His Breed"
            width={size}
            height={size}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            priority
          />
        ) : (
          /* SVG fallback if no image uploaded yet */
          <div style={{ background: 'radial-gradient(circle at 40% 35%, #2a1a0a 0%, #1a0a00 50%, #0a0505 100%)', width: '100%', height: '100%' }}>
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ padding: '12%' }}>
              <ellipse cx="100" cy="130" rx="45" ry="40" fill="#E8873A" />
              <circle cx="100" cy="80" r="42" fill="#E8873A" />
              <ellipse cx="72" cy="90" rx="18" ry="12" fill="#F5A04A" />
              <ellipse cx="128" cy="90" rx="18" ry="12" fill="#F5A04A" />
              <polygon points="65,45 48,18 85,38" fill="#C8622A" />
              <polygon points="135,45 152,18 115,38" fill="#C8622A" />
              <polygon points="68,43 55,25 82,40" fill="#FF9966" />
              <polygon points="132,43 145,25 118,40" fill="#FF9966" />
              <circle cx="84" cy="76" r="9" fill="#1a0a00" />
              <circle cx="116" cy="76" r="9" fill="#1a0a00" />
              <circle cx="87" cy="73" r="3" fill="white" />
              <circle cx="119" cy="73" r="3" fill="white" />
              <ellipse cx="100" cy="91" rx="8" ry="5" fill="#1a0a00" />
              <ellipse cx="98" cy="89" rx="2" ry="1.5" fill="#555" />
              <path d="M92 97 Q100 104 108 97" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="100" cy="120" rx="22" ry="20" fill="#FFF0E0" />
              <path d="M145 130 Q175 110 168 85 Q162 65 150 75 Q162 85 155 108 Q148 125 140 130" fill="#E8873A" />
              <ellipse cx="78" cy="165" rx="12" ry="8" fill="#E8873A" />
              <ellipse cx="122" cy="165" rx="12" ry="8" fill="#E8873A" />
              <ellipse cx="78" cy="167" rx="7" ry="5" fill="#C8622A" />
              <ellipse cx="122" cy="167" rx="7" ry="5" fill="#C8622A" />
              <path d="M75 68 Q84 64 84 68" fill="none" stroke="#1a0a00" strokeWidth="1.5" />
              <path d="M116 68 Q116 64 125 68" fill="none" stroke="#1a0a00" strokeWidth="1.5" />
              {/* Medal */}
              <circle cx="100" cy="158" r="10" fill="#FFD700" stroke="#C8962A" strokeWidth="1.5" />
              <text x="100" y="162" textAnchor="middle" fontSize="9" fill="#8B4513" fontWeight="bold">中</text>
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  if (!shouldAnimate) return content;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, y: [0, -12, 0] }}
      transition={{
        scale: { duration: 0.8, ease: 'easeOut' },
        opacity: { duration: 0.8, ease: 'easeOut' },
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
      }}
    >
      {content}
    </motion.div>
  );
}
