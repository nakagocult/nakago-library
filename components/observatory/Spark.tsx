'use client';

import { useRef, useState } from 'react';

// One small time-series, one hue, one axis: the observatory is a wall of
// these instead of multi-series plots (the metrics live on different scales,
// and one axis per chart is the rule). The one sanctioned second series is a
// point's `bar` — translucent bars behind the line, SAME unit and axis (the
// event charts ride it as distinct hoomans, always ≤ the count line), so the
// one-axis rule holds. Marks per the house chart spec: 2px line, recessive
// baseline, muted min/max hints in ink (never series color), the latest value
// direct-labeled, and a full-height crosshair + tooltip on hover with the
// whole card as the hit target.

export interface SparkPoint {
  label: string;
  value: number | null;
  bar?: number | null; // companion series on the same axis (e.g. hoomans)
  flag?: boolean; // e.g. a cawf day: ring the dot so the day explains itself
}

interface SparkProps {
  title: string;
  points: SparkPoint[]; // oldest → newest
  color?: string;
  format?: (v: number) => string;
  barTitle?: string; // tooltip wording for the bar series
}

const W = 320;
const H = 56;
const PAD = 4;

function fmtDefault(v: number): string {
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
}

export default function Spark({
  title,
  points,
  color = '#FF4D00',
  format = fmtDefault,
  barTitle = 'hoomans',
}: SparkProps) {
  const [hover, setHover] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const values = points.map((p) => p.value).filter((v): v is number => v !== null);
  const bars = points
    .map((p) => p.bar)
    .filter((v): v is number => typeof v === 'number');
  const hasData = values.length > 0;
  const min = hasData ? Math.min(...values, 0) : 0;
  // bars share the axis (same unit, bar ≤ value in practice) — still fold
  // them into the scale so a stray taller bar can never overflow the frame
  const max = hasData ? Math.max(...values, ...bars) : 1;
  const span = max - min || 1;

  const x = (i: number) =>
    points.length > 1 ? PAD + (i * (W - PAD * 2)) / (points.length - 1) : W / 2;
  const y = (v: number) => H - PAD - ((v - min) * (H - PAD * 2)) / span;

  // null values break the line into segments rather than lying across the gap
  const segments: string[] = [];
  let current: string[] = [];
  points.forEach((p, i) => {
    if (p.value === null) {
      if (current.length > 1) segments.push(current.join(' '));
      current = [];
    } else {
      current.push(`${x(i)},${y(p.value)}`);
    }
  });
  if (current.length > 1) segments.push(current.join(' '));

  const last = [...points].reverse().find((p) => p.value !== null);
  const hoverPoint = hover !== null ? points[hover] : null;

  const onMove = (e: React.PointerEvent) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box || points.length === 0) return;
    const frac = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
    setHover(Math.round(frac * (points.length - 1)));
  };

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'rgba(17,17,17,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">
          {title}
        </span>
        <span className="text-sm font-black text-white/85">
          {hoverPoint && hoverPoint.value !== null
            ? format(hoverPoint.value)
            : last && last.value !== null
              ? format(last.value)
              : 'no data yet'}
        </span>
      </div>
      <div
        ref={boxRef}
        className="relative mt-2 touch-none"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="block h-14 w-full"
          role="img"
          aria-label={title}
        >
          {/* recessive baseline */}
          <line x1={0} x2={W} y1={H - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          {/* the companion bars sit behind the line, same axis */}
          {points.map((p, i) => {
            if (typeof p.bar !== 'number' || p.bar <= 0) return null;
            const step = points.length > 1 ? (W - PAD * 2) / (points.length - 1) : W;
            const bw = Math.min(12, step * 0.6);
            const y0 = y(Math.max(min, 0));
            return (
              <rect
                key={`b${i}`}
                x={x(i) - bw / 2}
                y={y(p.bar)}
                width={bw}
                height={Math.max(0, y0 - y(p.bar))}
                fill={color}
                fillOpacity={0.25}
                rx={1}
              />
            );
          })}
          {segments.map((seg, i) => (
            <polyline
              key={i}
              points={seg}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* flagged days (cawf: the weekly rest day) get a hollow ring */}
          {points.map((p, i) =>
            p.flag && p.value !== null ? (
              <circle
                key={`f${i}`}
                cx={x(i)}
                cy={y(p.value)}
                r={3}
                fill="#0a0a0a"
                stroke={color}
                strokeWidth={1.5}
              />
            ) : null,
          )}
          {hover !== null && (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={0}
              y2={H}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          )}
          {hoverPoint && hoverPoint.value !== null && (
            <circle cx={x(hover as number)} cy={y(hoverPoint.value)} r={4} fill={color} stroke="#0a0a0a" strokeWidth={2} />
          )}
        </svg>
        {hoverPoint && (
          <div
            className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-bold text-white/85"
            style={{
              left: `${(hover as number) / Math.max(1, points.length - 1) * 100}%`,
              background: '#161616',
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            {hoverPoint.label}
            {' : '}
            {hoverPoint.value === null ? 'no data' : format(hoverPoint.value)}
            {typeof hoverPoint.bar === 'number'
              ? ` · ${format(hoverPoint.bar)} ${barTitle}`
              : ''}
            {hoverPoint.flag ? ' 🌱' : ''}
          </div>
        )}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-white/30">
        <span>{points[0]?.label ?? ''}</span>
        <span>
          {hasData ? `${format(min)} to ${format(max)}` : ''}
        </span>
        <span>{points[points.length - 1]?.label ?? ''}</span>
      </div>
    </div>
  );
}
