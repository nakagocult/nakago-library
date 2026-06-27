'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Link2,
  PenLine,
  Clock,
  XCircle,
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import {
  getChallenge,
  submitSignature,
  type Challenge,
  type SubmitResult,
} from '@/lib/verify/api';

// Terminal failure states (no retry) vs. inline errors (re-sign allowed).
type Status =
  | 'loading' // fetching the challenge
  | 'invalid' // no / malformed ?t — terminal
  | 'expired' // nonce unknown, used, or timed out — terminal
  | 'load_error' // transient failure fetching the challenge — retryable
  | 'ready' // have the message; awaiting connect → sign
  | 'signing' // wallet prompt open
  | 'submitting' // POSTing the signature
  | 'success'; // linked

// Copy for inline submit errors (PRD §5). The user can re-sign; the nonce stays
// valid until its TTL or a successful submit.
const SUBMIT_ERROR_COPY: Record<string, string> = {
  wallet_taken: 'That wallet is already linked to another account.',
  hooman_taken: 'Your account already has a linked wallet.',
  bad_signature: "Couldn't read that signature — try signing again.",
  rpc_error: "Couldn't reach the chain just now. Try again in a minute.",
  rate_limited: 'Too many attempts. Wait a moment and retry.',
  collection_unavailable: 'Verification is temporarily unavailable — try again shortly.',
  bad_origin: 'Something went wrong with this request. Reload and try again.',
  user_rejected: 'Signature cancelled. Sign the message to link your wallet.',
  network_error: 'Network hiccup — check your connection and try again.',
  unknown: 'Something went wrong. Try signing again.',
};

function truncate(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function VerifyConsole() {
  const searchParams = useSearchParams();
  const nonce = searchParams.get('t');

  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [status, setStatus] = useState<Status>(nonce ? 'loading' : 'invalid');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  // Fetch the challenge. State updates happen only after the await, so this is
  // safe to call straight from an effect (no synchronous setState cascade).
  const loadChallenge = useCallback(async () => {
    if (!nonce) return;
    const resp = await getChallenge(nonce);
    if (resp.ok) {
      setChallenge(resp.challenge);
      setStatus('ready');
    } else if (resp.code === 'nonce_invalid') {
      setStatus('expired');
    } else if (resp.code === 'missing_nonce') {
      setStatus('invalid');
    } else {
      setErrorCode(resp.code);
      setStatus('load_error');
    }
  }, [nonce]);

  useEffect(() => {
    // Fetch-on-mount: setState lands after the await, but the rule flags the call
    // site statically. Same pattern the rest of the app uses for effect fetches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (nonce) void loadChallenge();
  }, [nonce, loadChallenge]);

  // Countdown from expires_at; flip to the expired state when it runs out so the
  // user isn't left signing a dead nonce.
  useEffect(() => {
    if (!challenge?.expires_at) return;
    const expiry = new Date(challenge.expires_at).getTime();
    if (Number.isNaN(expiry)) return;

    const tick = () => {
      const left = Math.round((expiry - Date.now()) / 1000);
      setSecondsLeft(Math.max(0, left));
      if (left <= 0) {
        setStatus((s) => (s === 'success' ? s : 'expired'));
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [challenge]);

  const handleSign = useCallback(async () => {
    if (!challenge || !nonce) return;
    setErrorCode(null);
    setStatus('signing');

    let signature: string;
    try {
      // EIP-191 personal_sign on the EXACT server message — byte-for-byte, no
      // reformatting (PRD §3/§7). The backend re-derives & recovers the address.
      signature = await signMessageAsync({ message: challenge.message });
    } catch {
      setErrorCode('user_rejected');
      setStatus('ready');
      return;
    }

    setStatus('submitting');
    // Body is strictly { t, signature } — never the address.
    const resp = await submitSignature(nonce, signature);
    if (resp.ok) {
      setResult(resp.result);
      setStatus('success');
    } else if (resp.code === 'nonce_invalid') {
      setStatus('expired');
    } else {
      setErrorCode(resp.code);
      setStatus('ready');
    }
  }, [challenge, nonce, signMessageAsync]);

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
      style={{
        background: 'rgba(17,17,17,0.72)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        border: '1px solid rgba(255,77,0,0.2)',
        boxShadow: '0 0 40px rgba(255,77,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <AnimatePresence mode="wait">
        {/* Loading the challenge */}
        {status === 'loading' && (
          <Centered key="loading">
            <Loader2 className="h-7 w-7 animate-spin text-[#FF4D00]" />
            <p className="text-sm text-white/45">Fetching your challenge…</p>
          </Centered>
        )}

        {/* Terminal: bad link */}
        {status === 'invalid' && (
          <Terminal
            key="invalid"
            icon={<XCircle className="h-7 w-7 text-white/50" />}
            title="Invalid link"
            body={
              <>
                This verification link is invalid. Run <Code>/verify</Code> in Telegram to get a
                fresh one.
              </>
            }
          />
        )}

        {/* Terminal: expired / used */}
        {status === 'expired' && (
          <Terminal
            key="expired"
            icon={<Clock className="h-7 w-7 text-white/50" />}
            title="Link expired"
            body={
              <>
                This link expired or was already used. Run <Code>/verify</Code> again in Telegram
                for a new one (links last ~10 minutes and work once).
              </>
            }
          />
        )}

        {/* Transient load failure — retryable */}
        {status === 'load_error' && (
          <Centered key="load_error">
            <AlertTriangle className="h-7 w-7 text-[#FF5555]" />
            <p className="text-sm text-white/60">
              {SUBMIT_ERROR_COPY[errorCode ?? 'unknown'] ?? SUBMIT_ERROR_COPY.unknown}
            </p>
            <button
              onClick={() => {
                setErrorCode(null);
                setStatus('loading');
                void loadChallenge();
              }}
              className="claim-action mt-2 max-w-xs"
            >
              Try again
            </button>
          </Centered>
        )}

        {/* Success */}
        {status === 'success' && result && (
          <SuccessView key="success" result={result} />
        )}

        {/* Active flow: ready / signing / submitting */}
        {(status === 'ready' || status === 'signing' || status === 'submitting') && challenge && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {/* Countdown */}
            {secondsLeft != null && (
              <div className="mb-4 flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/35">
                <Clock className="h-3.5 w-3.5" />
                Expires in {formatCountdown(secondsLeft)}
              </div>
            )}

            {/* Message preview — render the server text verbatim */}
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/40">
              You will sign this message
            </p>
            <pre
              className="mb-5 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-2xl p-4 text-xs leading-relaxed text-white/70"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
            >
              {challenge.message}
            </pre>

            {/* Action */}
            <div className="relative z-20">
              {!isConnected ? (
                <div className="claim-connect flex justify-center">
                  <ConnectButton label="Connect Wallet" />
                </div>
              ) : (
                <button
                  onClick={() => void handleSign()}
                  disabled={status === 'signing' || status === 'submitting'}
                  className="claim-action"
                >
                  {status === 'signing' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Confirm in your wallet…
                    </span>
                  ) : status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Linking…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <PenLine className="h-4 w-4" /> Sign to verify
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Inline error (re-sign allowed) */}
            <AnimatePresence>
              {errorCode && status === 'ready' && (
                <motion.div
                  key="inline-err"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-center text-xs font-bold"
                  style={{ background: '#FF555512', border: '1px solid #FF555540', color: '#FF5555' }}
                >
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {SUBMIT_ERROR_COPY[errorCode] ?? SUBMIT_ERROR_COPY.unknown}
                </motion.div>
              )}
            </AnimatePresence>

            {isConnected && address && (
              <p className="mt-3 text-center text-[10px] text-white/25">Connected {truncate(address)}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuccessView({ result }: { result: SubmitResult }) {
  const hasHoldings = result.holder.length > 0;
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 py-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: '#00FF8814', border: '1px solid #00FF8855', boxShadow: '0 0 30px #00FF8822' }}
      >
        <CheckCircle2 className="h-8 w-8 text-[#00FF88]" />
      </motion.div>

      <h2
        className="text-3xl font-black text-white"
        style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
      >
        It is done
      </h2>

      <p className="flex items-center gap-1.5 text-sm font-bold text-white/70">
        <Link2 className="h-4 w-4 text-[#FF4D00]" />
        <span style={{ fontFamily: 'ui-monospace, monospace' }}>{truncate(result.wallet)}</span>
      </p>

      <p className="max-w-sm text-sm leading-relaxed text-white/50">
        {hasHoldings ? (
          <>Bound to your SOTH, and your holder mark is set.</>
        ) : (
          <>
            Bound to your SOTH. No Naka relic in it yet, so grab one to set your holder mark.
          </>
        )}
      </p>

      <div
        className="mt-2 rounded-2xl px-5 py-3 text-sm font-bold text-[#FF4D00]"
        style={{ background: '#FF4D000f', border: '1px solid #FF4D0033' }}
      >
        Henk will confirm in Telegram.
      </div>
    </motion.div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-3 py-10 text-center"
    >
      {children}
    </motion.div>
  );
}

function Terminal({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <Centered>
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {icon}
      </div>
      <h2
        className="text-2xl font-black text-white"
        style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
      >
        {title}
      </h2>
      <p className="max-w-sm text-sm leading-relaxed text-white/50">{body}</p>
    </Centered>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="rounded px-1.5 py-0.5 text-[#FF4D00]"
      style={{ background: '#FF4D0014', fontFamily: 'ui-monospace, monospace' }}
    >
      {children}
    </code>
  );
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
