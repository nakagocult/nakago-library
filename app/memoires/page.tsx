'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Feather, Flame, Loader2, AlertTriangle, Milestone } from 'lucide-react';
import {
  loadMemoires,
  formatWeek,
  type Memoires,
  type MemoireEpitaph,
} from '@/lib/memoires';

export default function MemoiresPage() {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['henk-memoires'],
    queryFn: loadMemoires,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  });

  const memoires = data && data.ok ? data.memoires : null;
  const failed = isError || (data ? !data.ok : false);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: '#111', border: '1px solid rgba(255,77,0,0.3)', boxShadow: '0 0 30px rgba(255,77,0,0.2)' }}
        >
          <BookOpen className="h-8 w-8 text-[#FF4D00]" />
        </motion.div>
        <h1
          className="text-5xl font-black leading-none text-white md:text-6xl"
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          <span className="text-gradient-fire">MEMOIRES</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/45">
          The life henk remembers living. Every week he digests what the cult kept and voted
          on into lived experience; the deep cuts scar, the months become named eras.
          This is his autobiography, written one week at a time.
        </p>
      </div>

      {isLoading ? (
        <StateBox>
          <Loader2 className="h-5 w-5 animate-spin text-white/40" />
          <p className="text-sm text-white/40">Opening the memoir…</p>
        </StateBox>
      ) : failed ? (
        <StateBox>
          <AlertTriangle className="h-5 w-5 text-[#FF4D00]/70" />
          <p className="text-sm text-white/50">The memoir wouldn&apos;t open.</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-1 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-[#FF4D00] disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,77,0,0.25)', fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            {isFetching ? 'Retrying…' : 'Retry'}
          </button>
        </StateBox>
      ) : !memoires || memoires.experiences.length === 0 ? (
        <StateBox>
          <Feather className="h-5 w-5 text-white/30" />
          <p className="text-sm text-white/50">Nothing written yet.</p>
          <p className="max-w-sm text-[13px] leading-relaxed text-white/30">
            Henk starts remembering when his first week closes. Come back after a Sunday.
          </p>
        </StateBox>
      ) : (
        <MemoiresView memoires={memoires} />
      )}
    </main>
  );
}

function MemoiresView({ memoires }: { memoires: Memoires }) {
  const epitaphByEra = new Map(memoires.epitaphs.map((e) => [e.era, e]));

  // One stream, newest first: era openings interleave with experiences by time.
  // An era opening closes the previous era in the trail (eras is newest first),
  // so its epitaph is looked up by that closing era's name.
  type Entry =
    | { kind: 'experience'; ts: string; week: string; text: string }
    | { kind: 'era'; ts: string; name: string; epitaph?: MemoireEpitaph };
  const entries: Entry[] = [
    ...memoires.experiences.map((e) => ({
      kind: 'experience' as const, ts: e.ts, week: e.week, text: e.text,
    })),
    ...memoires.eras.map((era, i) => {
      const closed = memoires.eras[i + 1];
      return {
        kind: 'era' as const, ts: era.ts, name: era.name,
        epitaph: closed ? epitaphByEra.get(closed.name) : undefined,
      };
    }),
  ].sort((a, b) => (a.ts < b.ts ? 1 : -1));

  return (
    <div>
      {/* What he carries now */}
      <section className="mb-10 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,77,0,0.15)' }}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-white/40" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
            Current era
          </span>
          <span className="text-lg text-[#FF4D00]" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.05em' }}>
            {memoires.era_current ?? 'not yet named'}
          </span>
        </div>
        {memoires.scars.length > 0 && (
          <div className="mt-4">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-white/40" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>
              Scars carried
            </span>
            <ul className="mt-2 space-y-1.5">
              {memoires.scars.map((s) => (
                <li key={s.text} className="flex items-start gap-2 text-[14px] leading-relaxed text-white/60">
                  <Flame className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF4D00]/60" />
                  <span>
                    {s.text}
                    <span className="ml-2 text-[11px] text-white/25">{formatWeek(s.born)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* The memoir stream */}
      <ol className="relative space-y-6 border-l border-white/10 pl-6">
        {entries.map((entry, i) =>
          entry.kind === 'era' ? (
            <li key={`era-${entry.ts}`} className="relative">
              <Milestone className="absolute -left-[31px] top-1 h-4 w-4 text-[#FF4D00]" />
              <p className="text-xl text-[#FF4D00]" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.06em' }}>
                {entry.name}
              </p>
              {entry.epitaph && (
                <p className="mt-1 text-[13px] italic leading-relaxed text-white/35">
                  closing {entry.epitaph.era}: {entry.epitaph.text}
                </p>
              )}
            </li>
          ) : (
            <motion.li
              key={`exp-${entry.ts}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              className="relative"
            >
              <span className="absolute -left-[29px] top-2 h-2 w-2 rounded-full bg-white/25" />
              <p className="text-[15px] leading-relaxed text-white/75">{entry.text}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/25">
                {formatWeek(entry.week)}
              </p>
            </motion.li>
          ),
        )}
      </ol>

      <p className="mt-12 text-center text-[12px] leading-relaxed text-white/25">
        Henk remembers the collective, never the one: no names reach these pages.
      </p>
    </div>
  );
}

function StateBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl px-6 text-center"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,77,0,0.15)' }}
    >
      {children}
    </div>
  );
}
