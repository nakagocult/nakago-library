'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

type Status = 'pending' | 'success' | 'error';

export default function SpotifyCallbackPage() {
  const [status, setStatus] = useState<Status>('pending');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const verifier = params.get('state');
    const error = params.get('error');

    Promise.resolve()
      .then(() => {
        if (error || !code || !verifier) return Promise.reject();
        return fetch('/api/spotify/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, verifier, redirectUri: `${window.location.origin}/spotify-callback` }),
        }).then((res) => (res.ok ? undefined : Promise.reject()));
      })
      .then(() => {
        setStatus('success');
        window.opener?.postMessage({ source: 'ddergo-spotify-follow', success: true }, window.location.origin);
        setTimeout(() => window.close(), 1200);
      })
      .catch(() => {
        setStatus('error');
        window.opener?.postMessage({ source: 'ddergo-spotify-follow', success: false }, window.location.origin);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0a0a] px-6 text-center text-white">
      {status === 'pending' && (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
          <p className="text-sm text-white/60">Finishing up with Spotify…</p>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle2 className="h-10 w-10 text-[#1DB954]" />
          <p className="text-sm font-bold">Followed DDERGO — you can close this window.</p>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertTriangle className="h-10 w-10 text-[#FF5555]" />
          <p className="text-sm font-bold">Something went wrong. You can close this window and try again.</p>
        </>
      )}
    </main>
  );
}
