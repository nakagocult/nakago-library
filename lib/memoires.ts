// Client-side loader for the memoires page — the life henk remembers living.
// The bot's weekly memoir rumination digests the community's voted memories
// into first-person experiences; monthly the era rumination names the chapter
// he is in and closes the old one with an epitaph; scars are the weeks that
// cut deep and linger. All of it is served read-only by the bot's observatory
// lens (bots/henk/the_council/witness/observatory.py, NARRATIVE_SELF_PLAN):
//   GET /api/henk/memoires   (same-origin — rewritten to the bot process,
//                             the /verify + /observatory plumbing)
// Henk speaks only of the collective here: no hooman names, ever.

export interface MemoireExperience {
  week: string; // ISO week key, e.g. "2026W30"
  text: string; // one first-person line
  ts: string; // ISO timestamp
}

export interface MemoireEra {
  name: string;
  ts: string; // when the era opened
}

export interface MemoireEpitaph {
  era: string; // the era this line closed
  text: string;
  ts: string;
}

export interface MemoireScar {
  text: string;
  born: string; // ISO week key
}

export interface Memoires {
  experiences: MemoireExperience[]; // newest first
  eras: MemoireEra[]; // newest first
  epitaphs: MemoireEpitaph[];
  era_current: string | null;
  scars: MemoireScar[];
  identity_chars: number;
}

export type MemoiresResponse = { ok: true; memoires: Memoires } | { ok: false };

export async function loadMemoires(): Promise<MemoiresResponse> {
  try {
    const res = await fetch('/api/henk/memoires', {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return { ok: false };
    return { ok: true, memoires: (await res.json()) as Memoires };
  } catch {
    return { ok: false };
  }
}

/** "2026W30" -> "week 30, 2026" (tolerates unknown shapes by echoing them). */
export function formatWeek(week: string): string {
  const m = /^(\d{4})W(\d{2})$/.exec(week);
  if (!m) return week;
  return `week ${Number(m[2])}, ${m[1]}`;
}
