'use client';

import { motion, type TargetAndTransition } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Cartoon Shiba Inu sticker components
// Technique: paint-order="stroke fill" creates a solid white border around shapes
// without doubling geometry. drop-shadow adds sticker depth.
// ─────────────────────────────────────────────────────────────────────────────

// Pre-computed sun-ray endpoints (no Math.cos/sin in render)
// Circle r=18 centred at (60,14) — angles 0°,40°,80°,120°,160°,200°,240°,280°,320°
const SUN_RAYS = [
  { x2: 78.0,  y2: 14.0  },
  { x2: 73.8,  y2: 25.6  },
  { x2: 63.1,  y2: 31.8  },
  { x2: 51.0,  y2: 29.4  },
  { x2: 43.2,  y2: 20.2  },
  { x2: 42.0,  y2: 8.6   },
  { x2: 47.5,  y2: -1.8  },
  { x2: 59.0,  y2: -3.8  },
  { x2: 69.6,  y2: 2.2   },
];

// ─── Reusable SVG shapes ───────────────────────────────────────────────────────

// Head shape — bezier-curve rounded head for organic look
const HEAD = 'M60,20 C34,20 16,36 14,62 C12,82 22,100 40,110 C48,114 54,116 60,116 C66,116 72,114 80,110 C98,100 108,82 106,62 C104,36 86,20 60,20Z';

// Left/right ear paths
const EAR_L = 'M24,56 L10,12 L44,44Z';
const EAR_L_INNER = 'M26,52 L16,20 L40,44Z';
const EAR_R = 'M96,56 L110,12 L76,44Z';
const EAR_R_INNER = 'M94,52 L104,20 L80,44Z';

// Muzzle area
const MUZZLE = 'M60,118'; // using ellipse instead

// Shared paint props for white outline
const OUTLINE = { stroke: 'white', strokeWidth: 7, paintOrder: 'stroke fill' } as const;
const THIN_OUTLINE = { stroke: 'white', strokeWidth: 4, paintOrder: 'stroke fill' } as const;

// ─── Expression: Eyes ──────────────────────────────────────────────────────────
function NormalEyes() {
  return (
    <>
      {/* Eye whites */}
      <ellipse cx="42" cy="66" rx="11" ry="12" fill="#1A0800" {...OUTLINE} />
      <ellipse cx="78" cy="66" rx="11" ry="12" fill="#1A0800" {...OUTLINE} />
      {/* Shine */}
      <circle cx="45" cy="61" r="4" fill="white" />
      <circle cx="81" cy="61" r="4" fill="white" />
      <circle cx="46" cy="62.5" r="1.5" fill="white" opacity="0.6" />
    </>
  );
}

function StarEyes() {
  return (
    <>
      <ellipse cx="42" cy="66" rx="11" ry="12" fill="#1A0800" {...OUTLINE} />
      <ellipse cx="78" cy="66" rx="11" ry="12" fill="#1A0800" {...OUTLINE} />
      <text x="42" y="71" textAnchor="middle" fill="#FFD700" fontSize="13" fontFamily="Arial">★</text>
      <text x="78" y="71" textAnchor="middle" fill="#FFD700" fontSize="13" fontFamily="Arial">★</text>
    </>
  );
}

function DollarEyes() {
  return (
    <>
      <ellipse cx="42" cy="66" rx="11" ry="12" fill="#1A0800" {...OUTLINE} />
      <ellipse cx="78" cy="66" rx="11" ry="12" fill="#1A0800" {...OUTLINE} />
      <text x="42" y="72" textAnchor="middle" fill="#FFD700" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif">$</text>
      <text x="78" y="72" textAnchor="middle" fill="#FFD700" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif">$</text>
    </>
  );
}

function LaserEyes() {
  return (
    <>
      <ellipse cx="42" cy="66" rx="11" ry="12" fill="#CC0000" {...OUTLINE} />
      <ellipse cx="78" cy="66" rx="11" ry="12" fill="#CC0000" {...OUTLINE} />
      <ellipse cx="42" cy="62" r="4" fill="#FF6600" />
      <ellipse cx="78" cy="62" r="4" fill="#FF6600" />
    </>
  );
}

function SunglassEyes() {
  return (
    <>
      {/* Glasses frames */}
      <rect x="28" y="58" width="26" height="18" rx="6" fill="#00DFFF" stroke="#0a0a0a" strokeWidth="2" />
      <rect x="66" y="58" width="26" height="18" rx="6" fill="#00DFFF" stroke="#0a0a0a" strokeWidth="2" />
      {/* Bridge */}
      <path d="M54,67 L66,67" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
      {/* Arms */}
      <path d="M28,67 L18,64" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M92,67 L102,64" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

// ─── Expression: Mouths ───────────────────────────────────────────────────────
function HappyMouth() {
  return <path d="M48,96 Q60,108 72,96" fill="none" stroke="#1A0800" strokeWidth="3" strokeLinecap="round" />;
}
function BigSmileMouth() {
  return <path d="M44,96 Q60,112 76,96" fill="#FF8A80" stroke="#1A0800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
}
function OMouth() {
  return <ellipse cx="60" cy="100" rx="10" ry="11" fill="#FF8A80" stroke="#1A0800" strokeWidth="2.5" />;
}
function SmugMouth() {
  return <path d="M49,97 Q60,102 73,95" fill="none" stroke="#1A0800" strokeWidth="3" strokeLinecap="round" />;
}
function SadMouth() {
  return (
    <>
      <path d="M49,102 Q60,94 71,102" fill="none" stroke="#1A0800" strokeWidth="3" strokeLinecap="round" />
      {/* Tears */}
      <ellipse cx="33" cy="80" rx="5" ry="9" fill="#90CAF9" opacity="0.9" />
      <ellipse cx="87" cy="80" rx="5" ry="9" fill="#90CAF9" opacity="0.9" />
    </>
  );
}

// ─── Base Shiba face ──────────────────────────────────────────────────────────
function ShibaBase({
  eyes,
  mouth,
  cheekColor = 'rgba(255,110,100,0.4)',
}: {
  eyes: React.ReactNode;
  mouth: React.ReactNode;
  cheekColor?: string;
}) {
  return (
    <>
      {/* Ears — back layer first */}
      <path d={EAR_L} fill="#D07818" {...OUTLINE} />
      <path d={EAR_R} fill="#D07818" {...OUTLINE} />
      {/* Pink inner ear */}
      <path d={EAR_L_INNER} fill="#FFB8B8" />
      <path d={EAR_R_INNER} fill="#FFB8B8" />
      {/* Head */}
      <path d={HEAD} fill="#F5A035" {...OUTLINE} />
      {/* Forehead lighter patch */}
      <ellipse cx="60" cy="48" rx="24" ry="17" fill="#F8B84A" />
      {/* Muzzle */}
      <ellipse cx="60" cy="93" rx="27" ry="21" fill="#FFF0D0" {...THIN_OUTLINE} />
      {/* Nose */}
      <ellipse cx="60" cy="86" rx="6" ry="4.5" fill="#1A0800" />
      {/* Cheeks */}
      <ellipse cx="26" cy="83" rx="12" ry="9" fill={cheekColor} />
      <ellipse cx="94" cy="83" rx="12" ry="9" fill={cheekColor} />
      {/* Eyes */}
      {eyes}
      {/* Mouth */}
      {mouth}
    </>
  );
}

// ─── Sticker wrapper ───────────────────────────────────────────────────────────
function SW({
  size = 140,
  delay = 0,
  anim,
  children,
}: {
  size?: number;
  delay?: number;
  anim?: TargetAndTransition;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
      animate={anim ?? { y: [0, -10, 0] }}
      transition={{ duration: 3.5 + delay * 0.3, repeat: Infinity, ease: 'easeInOut', delay }}
      whileHover={{ scale: 1.18, rotate: 5, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.9 }}
    >
      {/* drop-shadow gives the 3-D depth; the white stroke IS the outline */}
      <div style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.8)) drop-shadow(0 0 2px rgba(255,255,255,0.3))' }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          {children}
        </svg>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STICKER EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

// 1. NAKA GO UP! — happy + rocket
export function NakaGoIPSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={0}>
      <ShibaBase eyes={<NormalEyes />} mouth={<BigSmileMouth />} />
      {/* Rocket top-right */}
      <g transform="translate(85,2) rotate(25)">
        <rect x="3" y="2" width="12" height="26" rx="6" fill="#FF4D00" stroke="white" strokeWidth="3" paintOrder="stroke fill" />
        <polygon points="9,0 3,7 15,7" fill="#FF6600" stroke="white" strokeWidth="2" paintOrder="stroke fill" />
        <circle cx="9" cy="13" r="4" fill="white" opacity="0.65" />
        <polygon points="9,28 2,20 2,34" fill="#FFD700" />
        <polygon points="9,28 16,20 16,34" fill="#FFD700" />
      </g>
      {/* Stars */}
      <text x="8" y="22" fill="#FFD700" fontSize="11">★</text>
      {/* Label */}
      <text x="60" y="127" textAnchor="middle" fill="#FF4D00" fontSize="12" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="1.5"
        stroke="white" strokeWidth="4" paintOrder="stroke fill">NAKA GO UP!</text>
    </SW>
  );
}

// 2. NAKA GO — standard happy
export function NakaGoSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={0.3}>
      <ShibaBase eyes={<NormalEyes />} mouth={<HappyMouth />} />
      <text x="8" y="22" fill="#FF4D00" fontSize="10">★</text>
      <text x="104" y="28" fill="#FFD700" fontSize="9">★</text>
      <text x="60" y="127" textAnchor="middle" fill="#FF4D00" fontSize="14" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="2"
        stroke="white" strokeWidth="4" paintOrder="stroke fill">NAKA GO</text>
    </SW>
  );
}

// 3. NAKA MOON — star eyes + crescent
export function MoonSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={0.5} anim={{ y: [0, -12, 0], rotate: [0, -3, 0] }}>
      <ShibaBase eyes={<StarEyes />} mouth={<HappyMouth />} />
      {/* Crescent moon */}
      <path d="M46,12 A18,18 0 0,0 74,12 A14,14 0 0,1 46,12" fill="#FFD700" stroke="white" strokeWidth="3" paintOrder="stroke fill" />
      {/* Stars */}
      <text x="6" y="20" fill="#FFD700" fontSize="9">★</text>
      <text x="105" y="16" fill="#FFD700" fontSize="8">★</text>
      <text x="12" y="40" fill="#FFD700" fontSize="7">✦</text>
      <text x="100" y="44" fill="#FFD700" fontSize="7">✦</text>
      <text x="60" y="127" textAnchor="middle" fill="#FFD700" fontSize="12" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="2"
        stroke="#1A0900" strokeWidth="4" paintOrder="stroke fill">NAKA MOON</text>
    </SW>
  );
}

// 4. HODL — crown + smug
export function HodlSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={0.2}>
      <ShibaBase eyes={<NormalEyes />} mouth={<SmugMouth />} />
      {/* Crown */}
      <polygon points="28,34 28,10 44,22 60,4 76,22 92,10 92,34"
        fill="#FFD700" stroke="white" strokeWidth="4" paintOrder="stroke fill" />
      <circle cx="60" cy="5" r="5.5" fill="#FF4D00" stroke="white" strokeWidth="2.5" paintOrder="stroke fill" />
      <circle cx="28" cy="11" r="4" fill="#FF4D00" stroke="white" strokeWidth="2" paintOrder="stroke fill" />
      <circle cx="92" cy="11" r="4" fill="#FF4D00" stroke="white" strokeWidth="2" paintOrder="stroke fill" />
      <circle cx="60" cy="22" r="3.5" fill="#00BFFF" />
      <text x="60" y="127" textAnchor="middle" fill="#FFD700" fontSize="16" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="3"
        stroke="#1A0900" strokeWidth="4" paintOrder="stroke fill">HODL</text>
    </SW>
  );
}

// 5. GM FRENS — big smile + sun
export function GmFrensSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={0.7} anim={{ y: [0, -8, 0], scale: [1, 1.04, 1] }}>
      <ShibaBase eyes={<NormalEyes />} mouth={<BigSmileMouth />} />
      {/* Sun rays (pre-computed, no Math in render) */}
      {SUN_RAYS.map((r, i) => (
        <line key={i} x1="60" y1="14" x2={r.x2} y2={r.y2} stroke="#FFD700" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      ))}
      <circle cx="60" cy="14" r="8" fill="#FFD700" stroke="white" strokeWidth="3" paintOrder="stroke fill" />
      <text x="60" y="127" textAnchor="middle" fill="#FF8C00" fontSize="12" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="2"
        stroke="white" strokeWidth="4" paintOrder="stroke fill">GM FRENS</text>
    </SW>
  );
}

// 6. WAGMI — rainbow arcs
export function WagmiSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={0.4} anim={{ y: [0, -14, 0] }}>
      <ShibaBase eyes={<NormalEyes />} mouth={<BigSmileMouth />} />
      {/* Rainbow arcs */}
      <path d="M8,60 Q8,22 60,22 Q112,22 112,60" fill="none" stroke="#FF4D00" strokeWidth="5" />
      <path d="M13,62 Q13,28 60,28 Q107,28 107,62" fill="none" stroke="#FFD700" strokeWidth="5" />
      <path d="M18,64 Q18,34 60,34 Q102,34 102,64" fill="none" stroke="#00CC66" strokeWidth="5" />
      <path d="M23,66 Q23,40 60,40 Q97,40 97,66" fill="none" stroke="#00BFFF" strokeWidth="5" />
      <text x="60" y="127" textAnchor="middle" fill="#CC44FF" fontSize="15" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="3"
        stroke="white" strokeWidth="4" paintOrder="stroke fill">WAGMI</text>
    </SW>
  );
}

// 7. DIAMOND HANDS — dollar eyes + diamonds
export function DiamondHandsSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={0.9}>
      <ShibaBase eyes={<DollarEyes />} mouth={<HappyMouth />} />
      {/* Diamonds */}
      <polygon points="14,22 22,10 30,22 22,38"
        fill="#00BFFF" stroke="white" strokeWidth="3" paintOrder="stroke fill" />
      <polygon points="14,22 22,10 22,38" fill="#80DFFF" opacity="0.7" />
      <polygon points="90,22 98,10 106,22 98,38"
        fill="#00BFFF" stroke="white" strokeWidth="3" paintOrder="stroke fill" />
      <polygon points="90,22 98,10 98,38" fill="#80DFFF" opacity="0.7" />
      <text x="60" y="127" textAnchor="middle" fill="#00BFFF" fontSize="10" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="1.5"
        stroke="#0a0a0a" strokeWidth="4" paintOrder="stroke fill">DIAMOND HANDS</text>
    </SW>
  );
}

// 8. TO THE MOON — rocket ride, open mouth
export function RocketSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={1.1} anim={{ y: [0, -16, 0], rotate: [0, 4, 0] }}>
      <ShibaBase eyes={<NormalEyes />} mouth={<OMouth />} />
      {/* Rocket */}
      <g transform="translate(82,-2) rotate(30)">
        <rect x="2" y="2" width="14" height="28" rx="7" fill="#FF4D00" stroke="white" strokeWidth="3.5" paintOrder="stroke fill" />
        <polygon points="9,0 2,8 16,8" fill="#FF6600" stroke="white" strokeWidth="2.5" paintOrder="stroke fill" />
        <circle cx="9" cy="14" r="5" fill="white" opacity="0.65" />
        <polygon points="9,30 1,22 1,37" fill="#FFD700" />
        <polygon points="9,30 17,22 17,37" fill="#FFD700" />
      </g>
      {/* Speed lines */}
      <line x1="56" y1="8" x2="74" y2="2" stroke="#FF4D00" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1="62" y1="16" x2="82" y2="10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <text x="60" y="127" textAnchor="middle" fill="#FF6B00" fontSize="12" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="2"
        stroke="white" strokeWidth="4" paintOrder="stroke fill">TO THE MOON</text>
    </SW>
  );
}

// 9. THE CULT — laser eyes + beams
export function CultSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={0.6}>
      <ShibaBase eyes={<LaserEyes />} mouth={<SmugMouth />} />
      {/* Laser beams */}
      <line x1="31" y1="66" x2="0"   y2="74" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
      <line x1="89" y1="66" x2="120" y2="74" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
      <circle cx="0"   cy="74" r="5" fill="#FF0000" opacity="0.6" />
      <circle cx="120" cy="74" r="5" fill="#FF0000" opacity="0.6" />
      {/* Cult symbol */}
      <circle cx="60" cy="13" r="10" fill="none" stroke="#9B30FF" strokeWidth="3" />
      <polygon points="60,5 63,10 68,10 64,14 66,19 60,16 54,19 56,14 52,10 57,10" fill="#9B30FF" opacity="0.9" />
      <text x="60" y="127" textAnchor="middle" fill="#9B30FF" fontSize="13" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="2.5"
        stroke="#0a0a0a" strokeWidth="4" paintOrder="stroke fill">THE CULT</text>
    </SW>
  );
}

// 10. BORN 1948 — smug + red stamp
export function KimonoSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={0.8}>
      <ShibaBase eyes={<NormalEyes />} mouth={<SmugMouth />} />
      {/* Red kanji stamp */}
      <rect x="76" y="4" width="38" height="30" rx="5" fill="#CC0000" opacity="0.9"
        stroke="white" strokeWidth="3" paintOrder="stroke fill"
        transform="rotate(-8,95,19)" />
      <text x="95" y="24" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold"
        fontFamily="serif" transform="rotate(-8,95,19)">中</text>
      <text x="60" y="127" textAnchor="middle" fill="#FF4D00" fontSize="13" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="2"
        stroke="white" strokeWidth="4" paintOrder="stroke fill">BORN 1948</text>
    </SW>
  );
}

// 11. 中号 — big kanji watermark
export function KanjiSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={1.2} anim={{ y: [0, -10, 0], rotate: [0, -4, 0] }}>
      {/* Kanji watermark behind everything */}
      <text x="60" y="102" textAnchor="middle" fill="#FFD700" fontSize="88"
        fontFamily="serif" opacity="0.10">中</text>
      <ShibaBase eyes={<NormalEyes />} mouth={<HappyMouth />} />
      <text x="60" y="127" textAnchor="middle" fill="#FFD700" fontSize="17" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="3"
        stroke="#1A0900" strokeWidth="4" paintOrder="stroke fill">中号</text>
    </SW>
  );
}

// 12. BASED — sunglasses + smug
export function BasedSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={1.4}>
      <ShibaBase eyes={<SunglassEyes />} mouth={<SmugMouth />} />
      <text x="60" y="127" textAnchor="middle" fill="#00FFFF" fontSize="16" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="3"
        stroke="#0a0a0a" strokeWidth="4" paintOrder="stroke fill">BASED</text>
    </SW>
  );
}

// 13. ON FIRE — flames around head
export function FireSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={0.15} anim={{ y: [0, -10, 0], scale: [1, 1.04, 1] }}>
      <ShibaBase eyes={<NormalEyes />} mouth={<BigSmileMouth />} />
      {/* Flames — drawn OVER the head */}
      <path d="M14,65 Q6,44 12,28 Q16,44 22,32 Q28,46 20,65Z" fill="#FF4D00" opacity="0.9" />
      <path d="M15,65 Q9,48 14,36 Q17,48 20,65Z" fill="#FFD700" opacity="0.85" />
      <path d="M106,65 Q114,44 108,28 Q104,44 98,32 Q92,46 100,65Z" fill="#FF4D00" opacity="0.9" />
      <path d="M105,65 Q111,48 106,36 Q103,48 100,65Z" fill="#FFD700" opacity="0.85" />
      <path d="M40,18 Q32,4 44,0 Q48,12 56,6 Q52,20 64,10 Q60,24 72,14 Q68,28 56,20Z" fill="#FF4D00" opacity="0.88" />
      <path d="M46,17 Q40,6 48,2 Q51,12 56,18Z" fill="#FFD700" opacity="0.85" />
      <text x="60" y="127" textAnchor="middle" fill="#FF2200" fontSize="14" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="2.5"
        stroke="white" strokeWidth="4" paintOrder="stroke fill">ON FIRE</text>
    </SW>
  );
}

// 14. COOKIES & CREAM — big smile + cookie
export function CookieSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={1.0}>
      <ShibaBase eyes={<NormalEyes />} mouth={<BigSmileMouth />} />
      {/* Cookie top-left */}
      <circle cx="20" cy="20" r="14" fill="#C8860A" stroke="white" strokeWidth="3.5" paintOrder="stroke fill" />
      <circle cx="20" cy="20" r="11.5" fill="#D49530" />
      <circle cx="16" cy="15" r="3" fill="#5C2D0A" />
      <circle cx="24" cy="13" r="2.5" fill="#5C2D0A" />
      <circle cx="13" cy="23" r="2.5" fill="#5C2D0A" />
      <circle cx="24" cy="24" r="3" fill="#5C2D0A" />
      <circle cx="20" cy="19" r="2" fill="#5C2D0A" />
      {/* Bite mark */}
      <path d="M30,12 Q36,6 36,20 Q30,16 30,12Z" fill="#070707" />
      <text x="60" y="127" textAnchor="middle" fill="#CC8800" fontSize="10" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="1.5"
        stroke="white" strokeWidth="3.5" paintOrder="stroke fill">COOKIES &amp; CREAM</text>
    </SW>
  );
}

// 15. NGMI — sad + tears
export function NgmiSticker({ size = 150 }: { size?: number }) {
  return (
    <SW size={size} delay={1.6} anim={{ y: [0, -6, 0] }}>
      <ShibaBase eyes={<NormalEyes />} mouth={<SadMouth />} />
      {/* Rain drops below */}
      <ellipse cx="32" cy="120" rx="2.5" ry="5" fill="#90CAF9" opacity="0.75" />
      <ellipse cx="52" cy="125" rx="2.5" ry="5" fill="#90CAF9" opacity="0.65" />
      <ellipse cx="68" cy="122" rx="2.5" ry="5" fill="#90CAF9" opacity="0.75" />
      <ellipse cx="88" cy="126" rx="2.5" ry="5" fill="#90CAF9" opacity="0.65" />
      <text x="60" y="127" textAnchor="middle" fill="#90CAF9" fontSize="16" fontWeight="900"
        fontFamily="'Bebas Neue',Impact,sans-serif" letterSpacing="3"
        stroke="#0a0a0a" strokeWidth="4" paintOrder="stroke fill">NGMI</text>
    </SW>
  );
}
