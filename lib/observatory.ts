// Client for henk's public metrics lens (the observatory). Both endpoints are
// same-origin (/api/henk/* is rewritten to the bot process, the /verify
// pattern). The bot curates what is public — aggregates and collective state
// only, no names, ever — so this file is a courier plus display math.

export interface EngagementDay {
  gm_day: string;
  active_hoomans: number | null;
  new_hoomans: number | null;
  returned_7d: number | null;
  rolls: number | null;
  rounds: number | null;
  fragments: number | null;
  fragment_submitters: number | null;
  klozums_minted: number | null;
  base_cap_hoomans: number | null;
  dominance_pct: number | null;
  burst_median_gap_s: number | null;
  overlap_pct: number | null;
  circular_r: number | null;
  messages: number | null;
  commands: number | null;
  chatters_anon: number | null;
  per_party: number | null;
  cawf: boolean;
}

export interface CanvasEngagement {
  canvas: string;
  series: EngagementDay[];
}

export interface DayNote {
  gm_day: string;
  note: string;
}

export interface TuneDecision {
  ts: string | null;
  reasoning: string | null;
  hypothesis: string | null;
  applied: Record<string, unknown> | null;
}

export interface MindRollupRow {
  day: string;
  caller: string;
  calls: number;
  cost_usd: number;
  prompt_tokens: number;
  completion_tokens: number;
  avg_latency_ms: number | null;
  errors: number;
}

export interface MindError {
  ts: string | null;
  caller: string | null;
  model: string | null;
  error: string;
}

export interface RainDay {
  gm_day: string;
  total: number;
  hoomans: number;
  avg_mult: number;
  rest_total: number;
  cawf_total: number;
}

export interface TideEntry {
  name: string;
  kind: string | null;
  subject: string | null;
  gate: string | null;
}

export interface PendingJob {
  kind: string;
  canvas: string;
  due_at: string;
}

export interface PoolState {
  canvas: string;
  totals: Record<string, number>;
  levels: Record<string, number>;
}

export interface Pulse {
  days: number;
  being?: Record<string, string>;
  canvases?: Array<{ label: string; rituals: string[]; powers: string[] }>;
  engagement?: CanvasEngagement[];
  day_notes?: DayNote[];
  nom?: { settings: Record<string, unknown>; pools: PoolState[] };
  tuner?: TuneDecision[];
  mind?: { rollup: MindRollupRow[]; recent_errors: MindError[] };
  rain?: RainDay[];
  tides?: { registry: TideEntry[]; pending: PendingJob[] };
}

export interface TickerEvent {
  id: number;
  ts: string;
  kind: string;
  ref: string | null;
  canvas: string;
}

export type PulseResponse = { ok: true; pulse: Pulse } | { ok: false };
export type TickerResponse = { ok: true; events: TickerEvent[] } | { ok: false };

export async function loadPulse(days = 30): Promise<PulseResponse> {
  try {
    const res = await fetch(`/api/henk/pulse?days=${days}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return { ok: false };
    return { ok: true, pulse: (await res.json()) as Pulse };
  } catch {
    return { ok: false };
  }
}

export async function loadTicker(after = 0): Promise<TickerResponse> {
  try {
    const res = await fetch(`/api/henk/ticker?after=${after}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return { ok: false };
    const body = (await res.json()) as { events?: TickerEvent[] };
    return { ok: true, events: body.events ?? [] };
  } catch {
    return { ok: false };
  }
}

// ---- display helpers ----

/** "2026-07-10" → "Jul 10". Invalid input comes back unchanged. */
export function shortDay(gmDay: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(gmDay);
  if (!m) return gmDay;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** Seconds-ago as a compact human phrase for the freshness stamp. */
export function agoLabel(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 90) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 90) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

/** The collective phrasing of a ticker event: the lens never names anyone. */
export function eventLine(e: TickerEvent): string {
  const ref = e.ref ?? '';
  switch (e.kind) {
    case 'ritual':
      return ref ? `a hooman performed /${ref}` : 'a hooman performed a ritual';
    case 'ritual_denied':
      return ref ? `the gate held /${ref} closed` : 'the gate held a ritual closed';
    case 'callback':
      return ref ? `a button was pressed: ${ref}` : 'a button was pressed';
    case 'step':
      return ref ? `a hooman walked ${ref}` : 'a hooman walked a step';
    case 'raid':
      return 'the swarm stirred for a raid';
    default:
      return ref ? `${e.kind}: ${ref}` : e.kind;
  }
}
