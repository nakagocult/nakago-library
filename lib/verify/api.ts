// Thin client for the wallet-verification gate. Both endpoints are same-origin
// (a reverse proxy forwards /api/verify/* to the Telegram bot's process); we
// never verify signatures or read balances here — we're a courier. See
// imgs/VERIFY_WEB_SIGNER_PRD.md for the full contract.

export interface Challenge {
  message: string;
  expires_at: string; // ISO-8601
}

export interface SubmitResult {
  status: 'ok';
  wallet: string;
  holder: string[]; // collections held; may be empty (linking still succeeds)
}

// Discriminated result so callers can switch on `ok` without try/catch noise.
export type ChallengeResponse =
  | { ok: true; challenge: Challenge }
  | { ok: false; code: string };

export type SubmitResponse =
  | { ok: true; result: SubmitResult }
  | { ok: false; code: string };

// Maps server error codes (and transport failures) to a stable set of keys the
// UI renders. Unknown codes fall through to `unknown`.
const NETWORK_ERROR = 'network_error';
const UNKNOWN_ERROR = 'unknown';

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body?.error || UNKNOWN_ERROR;
  } catch {
    return UNKNOWN_ERROR;
  }
}

export async function getChallenge(t: string): Promise<ChallengeResponse> {
  let res: Response;
  try {
    res = await fetch(`/api/verify/challenge?t=${encodeURIComponent(t)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
  } catch {
    return { ok: false, code: NETWORK_ERROR };
  }

  if (res.ok) {
    try {
      const challenge = (await res.json()) as Challenge;
      if (!challenge?.message) return { ok: false, code: UNKNOWN_ERROR };
      return { ok: true, challenge };
    } catch {
      return { ok: false, code: UNKNOWN_ERROR };
    }
  }
  return { ok: false, code: await readError(res) };
}

// NOTE: body is strictly { t, signature }. We never send the wallet address —
// the server recovers it from the signature and ignores any client-supplied one.
export async function submitSignature(t: string, signature: string): Promise<SubmitResponse> {
  let res: Response;
  try {
    res = await fetch('/api/verify/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ t, signature }),
    });
  } catch {
    return { ok: false, code: NETWORK_ERROR };
  }

  if (res.ok) {
    try {
      const result = (await res.json()) as SubmitResult;
      return { ok: true, result };
    } catch {
      return { ok: false, code: UNKNOWN_ERROR };
    }
  }
  return { ok: false, code: await readError(res) };
}
