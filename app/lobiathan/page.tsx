'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { loadLobiathanHistory, formatWeek, type LobiathanWeek } from '@/lib/lobiathan';

export default function LobiathanPage() {
  const { data, isLoading, isError, isFetching, error, refetch } = useQuery({
    queryKey: ['lobiathan-history'],
    queryFn: loadLobiathanHistory,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header — this page carries the lobiathan's own wordmark in place of the
          usual icon tile + gradient title; an sr-only h1 keeps the accessible
          title. The mark's black ground melts into the site background, so it
          floats like the other header tiles rather than sitting in a frame. */}
      <div className="mb-12 text-center">
        <h1 className="sr-only">LOBIATHAN</h1>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mx-auto max-w-md overflow-hidden rounded-2xl sm:max-w-lg"
          style={{ boxShadow: '0 0 45px rgba(255,77,0,0.12)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lobiathan-wordmark.webp" alt="LOBIATHAN" className="w-full" />
        </motion.div>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/45">
          One creature, grown by the whole cult. Every offering whispered to henk feeds it;
          once a week he weaves them into the lobiathan&apos;s next form.
          This is its whole life, first form to now.
        </p>
      </div>

      {isLoading ? (
        <StateBox>
          <Loader2 className="h-5 w-5 animate-spin text-white/40" />
          <p className="text-sm text-white/40">Tracking the lobiathan…</p>
        </StateBox>
      ) : isError ? (
        <StateBox>
          <AlertTriangle className="h-5 w-5 text-[#FF4D00]/70" />
          <p className="text-sm text-white/50">Couldn&apos;t find the lobiathan.</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-1 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-[#FF4D00] disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,77,0,0.25)', fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            {isFetching ? 'Retrying…' : 'Retry'}
          </button>
          {error instanceof Error && (
            <p className="mt-1 max-w-md break-words text-[11px] leading-relaxed text-white/25">{error.message}</p>
          )}
        </StateBox>
      ) : !data ? (
        <StateBox>
          <Sparkles className="h-5 w-5 text-white/30" />
          <p className="text-sm text-white/50">No lobiathan woven yet.</p>
          <p className="max-w-sm text-[13px] leading-relaxed text-white/30">
            It takes its first form when the first week of offerings closes.
            Once it hatches, its whole evolution lives here.
          </p>
        </StateBox>
      ) : (
        <LobiathanView weeks={data} />
      )}
    </main>
  );
}

function StateBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-2xl py-16 text-center"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {children}
    </div>
  );
}

function LobiathanView({ weeks }: { weeks: LobiathanWeek[] }) {
  const current = weeks[weeks.length - 1];
  const past = weeks.slice(0, -1);

  return (
    <div>
      <CurrentForm week={current} generation={weeks.length} />

      {past.length > 0 && (
        <>
          <div className="mb-5 mt-14 flex items-center gap-3">
            <h2
              className="text-2xl font-black text-white"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
            >
              The Evolution
            </h2>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-black text-[#FF4D00]"
              style={{ background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.25)' }}
            >
              {weeks.length} {weeks.length === 1 ? 'form' : 'forms'}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((w, i) => (
              <FormCard key={w.week} week={w} generation={i + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CurrentForm({ week, generation }: { week: LobiathanWeek; generation: number }) {
  const traits = week.morphology
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2
          className="text-2xl font-black text-white"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
        >
          Current Form
        </h2>
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-black text-[#FF4D00]"
          style={{ background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.25)' }}
        >
          {formatWeek(week.week)} · form {generation}
        </span>
      </div>

      <a
        href={week.src}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: '1 / 1', maxHeight: '640px', border: '1px solid rgba(255,77,0,0.2)', background: 'rgba(0,0,0,0.5)' }}
        title="Open full size"
      >
        <Image
          src={week.src}
          alt={`The lobiathan · ${formatWeek(week.week)}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 1024px"
          priority
        />
      </a>

      {traits.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {traits.map((t) => (
            <span
              key={t}
              className="rounded-full px-2.5 py-1 text-[11px] text-white/55"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {week.log && (
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm italic leading-relaxed text-white/45">
          {week.log}
        </p>
      )}
    </motion.div>
  );
}

function FormCard({ week, generation }: { week: LobiathanWeek; generation: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-xl"
      style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.5)' }}
    >
      <a href={week.src} target="_blank" rel="noopener noreferrer" title="Open full size">
        <div className="relative aspect-square w-full">
          <Image
            src={week.src}
            alt={`The lobiathan · ${formatWeek(week.week)}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 340px"
          />
        </div>
      </a>
      <div className="px-3 py-2.5">
        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#FF4D00]/80"
           style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
          {formatWeek(week.week)} · form {generation}
        </p>
        {week.log && (
          <p className="mt-1 line-clamp-4 text-[12px] italic leading-relaxed text-white/40">{week.log}</p>
        )}
      </div>
    </motion.div>
  );
}
