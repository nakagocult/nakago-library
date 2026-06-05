'use client';

import { motion } from 'framer-motion';

interface ShibaMascotProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

// SVG Shiba Inu placeholder - will be replaced with actual image
export default function ShibaMascot({ size = 300, className = '', animate: shouldAnimate = true }: ShibaMascotProps) {
  const wrapper = (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: '0 0 40px rgba(255,77,0,0.5), 0 0 80px rgba(255,77,0,0.2)',
          borderRadius: '50%',
        }}
      />

      {/* Circle background */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 35%, #2a1a0a 0%, #1a0a00 50%, #0a0505 100%)',
          border: '3px solid rgba(255,77,0,0.4)',
        }}
      />

      {/* Shiba SVG illustration */}
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        style={{ padding: '15%' }}
      >
        {/* Body */}
        <ellipse cx="100" cy="130" rx="45" ry="40" fill="#E8873A" />
        {/* Head */}
        <circle cx="100" cy="80" r="42" fill="#E8873A" />
        {/* Cheeks */}
        <ellipse cx="72" cy="90" rx="18" ry="12" fill="#F5A04A" />
        <ellipse cx="128" cy="90" rx="18" ry="12" fill="#F5A04A" />
        {/* Ears */}
        <polygon points="65,45 48,18 85,38" fill="#C8622A" />
        <polygon points="135,45 152,18 115,38" fill="#C8622A" />
        <polygon points="68,43 55,25 82,40" fill="#FF9966" />
        <polygon points="132,43 145,25 118,40" fill="#FF9966" />
        {/* Eyes */}
        <circle cx="84" cy="76" r="9" fill="#1a0a00" />
        <circle cx="116" cy="76" r="9" fill="#1a0a00" />
        <circle cx="87" cy="73" r="3" fill="white" />
        <circle cx="119" cy="73" r="3" fill="white" />
        {/* Nose */}
        <ellipse cx="100" cy="91" rx="8" ry="5" fill="#1a0a00" />
        <ellipse cx="98" cy="89" rx="2" ry="1.5" fill="#555" />
        {/* Mouth */}
        <path d="M92 97 Q100 104 108 97" fill="none" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round" />
        {/* White chest */}
        <ellipse cx="100" cy="120" rx="22" ry="20" fill="#FFF0E0" />
        {/* Tail */}
        <path d="M145 130 Q175 110 168 85 Q162 65 150 75 Q162 85 155 108 Q148 125 140 130" fill="#E8873A" />
        {/* Front paws */}
        <ellipse cx="78" cy="165" rx="12" ry="8" fill="#E8873A" />
        <ellipse cx="122" cy="165" rx="12" ry="8" fill="#E8873A" />
        {/* Paw pads */}
        <ellipse cx="78" cy="167" rx="7" ry="5" fill="#C8622A" />
        <ellipse cx="122" cy="167" rx="7" ry="5" fill="#C8622A" />
        {/* Noble expression line */}
        <path d="M75 68 Q84 64 84 68" fill="none" stroke="#1a0a00" strokeWidth="1.5" />
        <path d="M116 68 Q116 64 125 68" fill="none" stroke="#1a0a00" strokeWidth="1.5" />
      </svg>
    </div>
  );

  if (!shouldAnimate) return wrapper;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ animation: 'float 4s ease-in-out infinite' }}
    >
      {wrapper}
    </motion.div>
  );
}
