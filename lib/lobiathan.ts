// Client-side loader for the lobiathan gallery — the one collective beast the
// cult evolves in Telegram. Hoomans whisper /offer fragments to henk all week;
// at the weekly close he weaves them into the creature's next form (quiet weeks
// let it decay). The bot pushes each week's render + mutation log to Vercel
// Blob (bots/henk/the_tides/weavings/beast.py); this repo only *reads* it:
//   1. fetch the published pointer  latest.json   ({ week, history })
//   2. fetch each week's            <week>/meta.json
//   3. resolve each week's image against the Blob base.
//
// Nothing here runs at build time — the data updates weekly and may not exist
// yet, so the page fetches live and degrades gracefully when unconfigured or
// before the first week has been woven.

// Public Blob read prefix, e.g.
//   https://<store>.public.blob.vercel-storage.com/lobiathan
export const LOBIATHAN_BASE_URL = process.env.NEXT_PUBLIC_LOBIATHAN_BASE_URL ?? '';

/** Minimal published pointer the page hits first. */
export interface LobiathanLatest {
  week: string; // ISO week key, e.g. "2026-W30"
  history: string[]; // every published week key, ascending
}

/** One week's published meta.json. */
export interface LobiathanMeta {
  week: string;
  image: string; // bare filename, resolved against "<week>/"
  morphology: string; // terse comma separated trait list
  log: string; // the week's mutation log (field journal prose)
}

/** One week, page-ready: meta plus the absolute image URL. */
export interface LobiathanWeek extends LobiathanMeta {
  src: string;
}

/** Join a base prefix and a (possibly already-absolute) path with one slash. */
function joinUrl(prefix: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${prefix.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

// Vercel's Image Optimization cache is keyed on the source URL and survives
// redeploys; a same-week re-weave overwrites beast.png in place, so a version
// query forces a re-fetch when that happens. Same trick as lib/mosaic.ts.
const LOBIATHAN_CACHE_BUST = '1';

function withBust(url: string): string {
  if (!LOBIATHAN_CACHE_BUST) return url;
  return `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(LOBIATHAN_CACHE_BUST)}`;
}

/** Pretty-print an ISO week key as e.g. "Week 30 · 2026". */
export function formatWeek(week: string): string {
  const m = /^(\d{4})-W(\d{2})$/.exec(week);
  if (!m) return week;
  return `Week ${Number(m[2])} · ${m[1]}`;
}

/**
 * Load the beast's full published history, oldest week first, or `null` when
 * there's nothing to show (not configured, or no week published yet). Weeks
 * whose meta fails to load are skipped rather than sinking the whole gallery.
 * Throws only on unexpected pointer failures so the page can offer a retry.
 */
export async function loadLobiathanHistory(): Promise<LobiathanWeek[] | null> {
  if (!LOBIATHAN_BASE_URL) return null; // unconfigured

  const pointerRes = await fetch(joinUrl(LOBIATHAN_BASE_URL, 'latest.json'), { cache: 'no-store' });
  if (pointerRes.status === 404) return null; // no week woven yet
  if (!pointerRes.ok) throw new Error(`Lobiathan pointer responded ${pointerRes.status}`);
  const latest = (await pointerRes.json()) as LobiathanLatest;

  const weeks = (latest.history?.length ? latest.history : [latest.week]).slice().sort();

  const metas = await Promise.all(
    weeks.map(async (week): Promise<LobiathanWeek | null> => {
      try {
        const res = await fetch(joinUrl(LOBIATHAN_BASE_URL, `${week}/meta.json`), { cache: 'no-store' });
        if (!res.ok) return null;
        const meta = (await res.json()) as LobiathanMeta;
        return {
          ...meta,
          week: meta.week || week,
          src: withBust(joinUrl(LOBIATHAN_BASE_URL, `${week}/${meta.image || 'beast.png'}`)),
        };
      } catch {
        return null;
      }
    })
  );

  const resolved = metas.filter((m): m is LobiathanWeek => m !== null);
  return resolved.length ? resolved : null;
}
