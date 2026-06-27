// Client-side loader for the monthly mosaic artifact.
//
// The mosaic is rendered off-site (the henk bot VM) at each cycle close and
// pushed to Vercel Blob — see imgs/MOSAIC_PLAN.md. This repo only *reads* it:
//   1. fetch the published pointer  latest/<chat_id>.json
//   2. follow it to that cycle's    manifest.json
//   3. resolve the bare tile / composite filenames against the Blob base.
//
// Nothing here runs at build time — the data updates monthly and may not exist
// yet, so the page fetches live and degrades gracefully when unconfigured or
// before the first cycle has been woven.

// Public Blob read prefix (the plan's `publish_base_url`), e.g.
//   https://<store>.public.blob.vercel-storage.com/mosaics
// The site shows one global monthly mosaic — the bot publishes a single
// `latest.json` at this base, not a per-chat pointer.
export const MOSAIC_BASE_URL = process.env.NEXT_PUBLIC_MOSAIC_BASE_URL ?? '';

/** Minimal published pointer the page hits first. */
export interface MosaicLatest {
  cycle_date: string; // yyyymmdd
  base: string; // "<cycle_date>/"
  manifest: string; // "<cycle_date>/manifest.json"
}

export interface MosaicTile {
  row: number;
  col: number;
  file: string; // bare "tile_<r>_<c>.png", resolved against the cycle base
  fragment?: string;
  hooman_id?: string | number | null;
  username?: string | null;
  created_at?: string;
  failed?: boolean;
}

export interface MosaicManifest {
  rows: number;
  cols: number;
  pitch?: number;
  overlap?: number;
  tile_size?: number;
  composite?: string; // bare name, defaults to "composite.png"
  tiles: MosaicTile[];
}

/** Everything the page needs, with every URL already absolute. */
export interface ResolvedMosaic {
  cycleDate: string;
  rows: number;
  cols: number;
  compositeSrc: string;
  tiles: Array<MosaicTile & { src: string }>;
}

/** Join a base prefix and a (possibly already-absolute) path with one slash. */
function joinUrl(prefix: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${prefix.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

// Vercel's Image Optimization cache is keyed on the source URL and survives
// redeploys, so when the bot overwrites a tile/composite at the *same* filename
// the page keeps serving the stale optimized copy. Appending a version query
// changes the cache key and forces a re-fetch. Bump this whenever an image is
// re-rendered under an existing filename within the same cycle. (Once the bot
// emits unique filenames per render this becomes a no-op safety net.)
const MOSAIC_CACHE_BUST = '1';

/** Append the cache-bust version to a resolved image URL. */
function withBust(url: string): string {
  if (!MOSAIC_CACHE_BUST) return url;
  return `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(MOSAIC_CACHE_BUST)}`;
}

/** Pretty-print a yyyymmdd cycle key as e.g. "June 2026". */
export function formatCycle(cycleDate: string): string {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(cycleDate);
  if (!m) return cycleDate;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Load the latest published mosaic, or `null` when there's nothing to show
 * (not configured, or no cycle published yet). Throws only on unexpected
 * network / parse failures so the page can offer a retry.
 */
export async function loadLatestMosaic(): Promise<ResolvedMosaic | null> {
  if (!MOSAIC_BASE_URL) return null; // unconfigured

  const pointer = await fetch(joinUrl(MOSAIC_BASE_URL, 'latest.json'), { cache: 'no-store' });
  if (pointer.status === 404) return null; // no cycle woven yet
  if (!pointer.ok) throw new Error(`Mosaic pointer responded ${pointer.status}`);
  const latest = (await pointer.json()) as MosaicLatest;

  const manifestRes = await fetch(joinUrl(MOSAIC_BASE_URL, latest.manifest), { cache: 'no-store' });
  if (!manifestRes.ok) throw new Error(`Mosaic manifest responded ${manifestRes.status}`);
  const manifest = (await manifestRes.json()) as MosaicManifest;

  const cycleBase = joinUrl(MOSAIC_BASE_URL, latest.base);

  return {
    cycleDate: latest.cycle_date,
    rows: manifest.rows,
    cols: manifest.cols,
    compositeSrc: withBust(joinUrl(cycleBase, manifest.composite ?? 'composite.png')),
    tiles: (manifest.tiles ?? []).map((t) => ({ ...t, src: withBust(joinUrl(cycleBase, t.file)) })),
  };
}
