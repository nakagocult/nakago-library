'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Spark, { SparkPoint } from '@/components/observatory/Spark';
import {
  agoLabel,
  eventLine,
  loadPulse,
  loadTicker,
  shortDay,
  EngagementDay,
  Pulse,
  TickerEvent,
} from '@/lib/observatory';

// The observatory: every instrument on one page, read only. The bot decides
// what is public (aggregates and collective state, never a name); this
// component only arranges the light that comes through.

const PULSE_MS = 60_000;
const TICKER_MS = 15_000;
const CLOCK_MS = 5_000;
const TICKER_KEEP = 150;
const DAY_CHOICES = [7, 27, 90];

const FIRE = '#FF4D00';
const WATER = '#3E96F4';

const KIND_GLYPHS: Record<string, string> = {
  ritual: '✨',
  ritual_denied: '⛩️',
  callback: '🔘',
  step: '👣',
  raid: '🌀',
};

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-2xl p-5 sm:p-6"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,77,0,0.15)' }}
    >
      <h2
        className="text-xl font-black text-white md:text-2xl"
        style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
      >
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] transition-colors"
      style={
        active
          ? { background: '#FF4D0022', border: '1px solid #FF4D0066', color: '#FF4D00' }
          : { background: 'transparent', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.45)' }
      }
    >
      {children}
    </button>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'rgba(17,17,17,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-white/85" style={{ overflowWrap: 'anywhere' }}>
        {value}
      </p>
    </div>
  );
}

/** ISO due_at → a human "due" phrase; overdue is a state, worded plus marked. */
function dueLabel(dueAt: string, now: number): { text: string; overdue: boolean } {
  const t = Date.parse(dueAt);
  if (Number.isNaN(t)) return { text: dueAt, overdue: false };
  const diff = t - now;
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  const span = h > 0 ? `${h}h ${m}m` : `${m}m`;
  return diff >= 0
    ? { text: `in ${span}`, overdue: false }
    : { text: `⚠️ overdue by ${span}`, overdue: true };
}

export default function ObservatoryDashboard() {
  const [days, setDays] = useState(27);
  const [canvasPick, setCanvasPick] = useState<string | null>(null);
  const [clock, setClock] = useState(() => Date.now());

  const pulseQuery = useQuery({
    queryKey: ['henk-pulse', days],
    queryFn: async (): Promise<Pulse> => {
      const res = await loadPulse(days);
      if (!res.ok) throw new Error('pulse unreachable');
      return res.pulse;
    },
    refetchInterval: PULSE_MS,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData, // switching 7d/27d/90d keeps the lens lit
    retry: 1,
  });
  const pulse = pulseQuery.data ?? null;
  const pulseAt = pulseQuery.dataUpdatedAt || null;
  const dark = pulseQuery.isError; // the lens lost henk (last light stays up)

  // the ticker accumulates: each poll asks "since id X" and prepends
  const cursor = useRef(0);
  const eventsRef = useRef<TickerEvent[]>([]);
  const tickerQuery = useQuery({
    queryKey: ['henk-ticker'],
    queryFn: async (): Promise<TickerEvent[]> => {
      const res = await loadTicker(cursor.current);
      if (!res.ok) throw new Error('ticker unreachable');
      if (res.events.length > 0) {
        cursor.current = Math.max(cursor.current, ...res.events.map((e) => e.id));
        eventsRef.current = [...res.events, ...eventsRef.current].slice(0, TICKER_KEEP);
      }
      return eventsRef.current;
    },
    refetchInterval: TICKER_MS,
    refetchOnWindowFocus: false,
  });
  const events = tickerQuery.data ?? [];

  useEffect(() => {
    const t = setInterval(() => setClock(Date.now()), CLOCK_MS);
    return () => clearInterval(t);
  }, []);

  // ---- engagement view (one canvas at a time; chips above, per the house
  // filter rule; the picked canvas persists across pulses when it still exists)
  const engagement = pulse?.engagement ?? [];
  const canvasLabels = engagement.map((e) => e.canvas);
  const picked =
    engagement.find((e) => e.canvas === canvasPick) ?? engagement[0] ?? null;

  const sparkOf = (field: keyof EngagementDay): SparkPoint[] => {
    if (!picked) return [];
    return [...picked.series]
      .reverse() // API is newest first; charts read oldest → newest
      .map((d) => ({
        label: shortDay(d.gm_day),
        value: typeof d[field] === 'number' ? (d[field] as number) : null,
        flag: d.cawf,
      }));
  };

  const notesByDay = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const n of pulse?.day_notes ?? []) {
      map.set(n.gm_day, [...(map.get(n.gm_day) ?? []), n.note]);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 14);
  }, [pulse?.day_notes]);

  // ---- mind rollup: per-day totals for the sparks, per-caller bars for spend
  const mindDays = useMemo(() => {
    const byDay = new Map<string, { cost: number; calls: number; errors: number }>();
    for (const r of pulse?.mind?.rollup ?? []) {
      const cur = byDay.get(r.day) ?? { cost: 0, calls: 0, errors: 0 };
      cur.cost += r.cost_usd;
      cur.calls += r.calls;
      cur.errors += r.errors;
      byDay.set(r.day, cur);
    }
    return [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  }, [pulse?.mind?.rollup]);

  const mindCallers = useMemo(() => {
    const byCaller = new Map<string, number>();
    for (const r of pulse?.mind?.rollup ?? []) {
      byCaller.set(r.caller ?? '?', (byCaller.get(r.caller ?? '?') ?? 0) + r.cost_usd);
    }
    const rows = [...byCaller.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    const top = rows[0]?.[1] ?? 1;
    return rows.map(([caller, cost]) => ({ caller, cost, frac: top > 0 ? cost / top : 0 }));
  }, [pulse?.mind?.rollup]);

  const rainPoints: SparkPoint[] = useMemo(
    () =>
      [...(pulse?.rain ?? [])]
        .reverse()
        .map((d) => ({ label: shortDay(d.gm_day), value: d.total })),
    [pulse?.rain],
  );
  const rainHoomans: SparkPoint[] = useMemo(
    () =>
      [...(pulse?.rain ?? [])]
        .reverse()
        .map((d) => ({ label: shortDay(d.gm_day), value: d.hoomans })),
    [pulse?.rain],
  );

  const settings = Object.entries(pulse?.nom?.settings ?? {});
  const pending = pulse?.tides?.pending ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* freshness + range: the one filter row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {DAY_CHOICES.map((d) => (
            <Chip key={d} active={days === d} onClick={() => setDays(d)}>
              {d}d
            </Chip>
          ))}
        </div>
        <p className="text-xs text-white/40">
          {dark
            ? 'the lens is dark: henk is not answering, still trying'
            : pulseAt
              ? `lens focused ${agoLabel(clock - pulseAt)}`
              : 'focusing the lens...'}
        </p>
      </div>

      {/* the being, right now */}
      {pulse?.being && Object.keys(pulse.being).length > 0 && (
        <Panel title="The Being, Right Now 🌙">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(pulse.being).map(([k, v]) => (
              <Tile key={k} label={k} value={v} />
            ))}
          </div>
        </Panel>
      )}

      {/* live ticker */}
      <Panel title="The Ticker 🧾">
        <p className="mb-3 text-xs leading-relaxed text-white/40">
          What the swarm is doing, as it happens. Nobody is named: the lens
          watches the collective, never the hooman.
        </p>
        {events.length === 0 ? (
          <p className="text-sm text-white/40">quiet for now: the swarm rests.</p>
        ) : (
          <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto pr-1">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex items-baseline gap-2 rounded-lg px-2 py-1 text-sm"
                style={{ background: 'rgba(17,17,17,0.55)' }}
              >
                <span aria-hidden>{KIND_GLYPHS[e.kind] ?? '🧾'}</span>
                <span className="text-white/75">{eventLine(e)}</span>
                <span className="ml-auto shrink-0 text-[11px] text-white/35">
                  {e.canvas} · {agoLabel(clock - Date.parse(e.ts))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* engagement */}
      <Panel title="The Swarm 🌀">
        {canvasLabels.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {canvasLabels.map((label) => (
              <Chip
                key={label}
                active={picked?.canvas === label}
                onClick={() => setCanvasPick(label)}
              >
                {label}
              </Chip>
            ))}
          </div>
        )}
        {!picked || picked.series.length === 0 ? (
          <p className="text-sm text-white/40">no tallied days yet.</p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Spark title="active hoomans" points={sparkOf('active_hoomans')} />
              <Spark title="rolls" points={sparkOf('rolls')} />
              <Spark title="fragments" points={sparkOf('fragments')} />
              <Spark title="party submitters" points={sparkOf('fragment_submitters')} />
              <Spark title="subs per party" points={sparkOf('per_party')} />
              <Spark title="cap27 hoomans" points={sparkOf('base_cap_hoomans')} />
              <Spark title="klozums minted" points={sparkOf('klozums_minted')} />
              <Spark title="overlap %" points={sparkOf('overlap_pct')} />
              <Spark title="resonance r" points={sparkOf('circular_r')} />
            </div>
            <p className="mt-3 text-[11px] text-white/30">
              🌱 marks a cawf day: rolls rest by design, so dips there are the
              plan working, not the swarm fading.
            </p>
          </>
        )}
        {notesByDay.length > 0 && (
          <div className="mt-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">
              keeper notes
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {notesByDay.map(([day, notes]) => (
                <li key={day} className="text-sm text-white/60">
                  <span className="text-white/35">{shortDay(day)}:</span>{' '}
                  {notes.join(' · ')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>

      {/* rain */}
      <Panel title="The Rain 💧">
        <div className="grid gap-3 sm:grid-cols-2">
          <Spark title="rain fallen" points={rainPoints} color={WATER} />
          <Spark title="hoomans rained on" points={rainHoomans} color={WATER} />
        </div>
      </Panel>

      {/* nom economy */}
      <Panel title="The Game 🐚">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">
              the envelope: what the tuner may touch
            </p>
            <dl className="mt-2 flex flex-col gap-1">
              {settings.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 text-xs">
                  <dt className="text-white/45">{k}</dt>
                  <dd className="text-right font-mono text-white/80" style={{ overflowWrap: 'anywhere' }}>
                    {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                  </dd>
                </div>
              ))}
              {settings.length === 0 && <p className="text-sm text-white/40">no envelope visible.</p>}
            </dl>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">
              the shared pools
            </p>
            <div className="mt-2 flex flex-col gap-3">
              {(pulse?.nom?.pools ?? []).map((p) => (
                <div
                  key={p.canvas}
                  className="rounded-2xl p-3"
                  style={{ background: 'rgba(17,17,17,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p className="text-xs font-bold text-white/70">{p.canvas}</p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    {Object.entries(p.totals).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2">
                        <span className="text-white/45">{k.replace(/_/g, ' ')}</span>
                        <span className="font-mono text-white/80">{String(v)}</span>
                      </div>
                    ))}
                    {Object.entries(p.levels).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2">
                        <span className="text-white/45">{k.replace(/_/g, ' ')}</span>
                        <span className="font-mono text-[#FF4D00]">lv {String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {(pulse?.nom?.pools ?? []).length === 0 && (
                <p className="text-sm text-white/40">no pools visible.</p>
              )}
            </div>
          </div>
        </div>
      </Panel>

      {/* the tuner */}
      <Panel title="Henk Tunes Himself 🎛️">
        <p className="mb-3 text-xs leading-relaxed text-white/40">
          Once a day henk reads the swarm and adjusts his own game, inside the
          envelope above. His reasoning, verbatim:
        </p>
        <ul className="flex flex-col gap-3">
          {(pulse?.tuner ?? []).map((t, i) => (
            <li
              key={t.ts ?? i}
              className="rounded-2xl p-4"
              style={{ background: 'rgba(17,17,17,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-[11px] text-white/35">{t.ts ?? 'sometime'}</p>
              {t.applied && Object.keys(t.applied).length > 0 && (
                <p className="mt-1 font-mono text-xs text-[#FF4D00]" style={{ overflowWrap: 'anywhere' }}>
                  {JSON.stringify(t.applied)}
                </p>
              )}
              {t.hypothesis && (
                <p className="mt-2 text-sm leading-relaxed text-white/75">{t.hypothesis}</p>
              )}
              {t.reasoning && (
                <p className="mt-1 text-xs leading-relaxed text-white/45">{t.reasoning}</p>
              )}
            </li>
          ))}
          {(pulse?.tuner ?? []).length === 0 && (
            <p className="text-sm text-white/40">no tuning decisions yet.</p>
          )}
        </ul>
      </Panel>

      {/* the mind */}
      <Panel title="The Mind 🧠">
        <div className="grid gap-3 sm:grid-cols-3">
          <Spark
            title="spend usd"
            points={mindDays.map(([d, v]) => ({ label: shortDay(d), value: Number(v.cost.toFixed(4)) }))}
            format={(v) => `$${v.toFixed(2)}`}
          />
          <Spark title="calls" points={mindDays.map(([d, v]) => ({ label: shortDay(d), value: v.calls }))} />
          <Spark title="errors" points={mindDays.map(([d, v]) => ({ label: shortDay(d), value: v.errors }))} />
        </div>
        {mindCallers.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">
              spend by faculty, window total
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {mindCallers.map((c) => (
                <li key={c.caller} className="flex items-center gap-3 text-xs">
                  <span className="w-32 shrink-0 truncate text-white/55">{c.caller}</span>
                  <span className="relative h-2 flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <span
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ width: `${Math.max(2, c.frac * 100)}%`, background: FIRE }}
                    />
                  </span>
                  <span className="w-16 shrink-0 text-right font-mono text-white/80">
                    ${c.cost.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {(pulse?.mind?.recent_errors ?? []).length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">
              recent stumbles
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {(pulse?.mind?.recent_errors ?? []).map((e, i) => (
                <li key={i} className="text-xs text-white/50" style={{ overflowWrap: 'anywhere' }}>
                  <span className="text-white/30">{e.ts ?? ''}</span> {e.caller ?? '?'} :{' '}
                  {e.error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>

      {/* the tides */}
      <Panel title="The Tides 🌊">
        <p className="mb-3 text-xs leading-relaxed text-white/40">
          Everything henk does on his own clock, and when it stirs next.
        </p>
        {pending.length === 0 ? (
          <p className="text-sm text-white/40">no tides scheduled: the sea is still.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {pending.map((j, i) => {
              const due = dueLabel(j.due_at, clock);
              return (
                <li
                  key={`${j.kind}-${i}`}
                  className="flex items-baseline gap-3 rounded-lg px-2 py-1 text-sm"
                  style={{ background: 'rgba(17,17,17,0.55)' }}
                >
                  <span className="font-bold text-white/75">{j.kind}</span>
                  <span className="text-[11px] text-white/35">{j.canvas}</span>
                  <span
                    className="ml-auto shrink-0 text-xs"
                    style={{ color: due.overdue ? '#FFB020' : 'rgba(255,255,255,0.5)' }}
                  >
                    {due.text}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        {(pulse?.tides?.registry ?? []).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(pulse?.tides?.registry ?? []).map((t) => (
              <span
                key={t.name}
                className="rounded-full px-3 py-1 text-[11px] text-white/45"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                title={`${t.kind ?? ''} · ${t.subject ?? ''}${t.gate ? ` · gated: ${t.gate}` : ''}`}
              >
                {t.name}
              </span>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
