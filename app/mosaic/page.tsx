'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Grid3x3, Image as ImageIcon, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { loadLatestMosaic, formatCycle, type ResolvedMosaic } from '@/lib/mosaic';

type ViewMode = 'composite' | 'grid';

export default function MosaicPage() {
  const { data, isLoading, isError, isFetching, error, refetch } = useQuery({
    queryKey: ['mosaic-latest'],
    queryFn: loadLatestMosaic,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: '#111', border: '1px solid rgba(255,77,0,0.3)', boxShadow: '0 0 30px rgba(255,77,0,0.2)' }}
        >
          <Grid3x3 className="h-8 w-8 text-[#FF4D00]" />
        </motion.div>
        <h1
          className="text-5xl font-black leading-none text-white md:text-6xl"
          style={{ fontFamily: 'Akihabored, Bebas Neue, Impact, sans-serif', letterSpacing: '0.04em' }}
        >
          <span className="text-gradient-fire">MOSAIC</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/45">
          Each cycle, every hooman&apos;s mosaic fragment becomes its own universe — then they&apos;re
          stitched together at the seams into a single monthly weave.
        </p>
      </div>

      {isLoading ? (
        <StateBox>
          <Loader2 className="h-5 w-5 animate-spin text-white/40" />
          <p className="text-sm text-white/40">Unrolling the latest weave…</p>
        </StateBox>
      ) : isError ? (
        <StateBox>
          <AlertTriangle className="h-5 w-5 text-[#FF4D00]/70" />
          <p className="text-sm text-white/50">Couldn&apos;t load the mosaic.</p>
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
          <p className="text-sm text-white/50">No mosaic woven yet.</p>
          <p className="max-w-sm text-[13px] leading-relaxed text-white/30">
            The grid is stitched at each cycle&apos;s close, on the 27th. Once the first one lands,
            it shows up here.
          </p>
        </StateBox>
      ) : (
        <MosaicView data={data} />
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

function MosaicView({ data }: { data: ResolvedMosaic }) {
  const [mode, setMode] = useState<ViewMode>('composite');
  const realTiles = data.tiles.filter((t) => !t.failed).length;

  return (
    <div>
      {/* Cycle meta + view toggle */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2
            className="text-2xl font-black text-white"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', letterSpacing: '0.03em' }}
          >
            {formatCycle(data.cycleDate)}
          </h2>
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-black text-[#FF4D00]"
            style={{ background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.25)' }}
          >
            {realTiles} {realTiles === 1 ? 'fragment' : 'fragments'}
          </span>
        </div>

        <div
          className="flex items-center gap-1 rounded-full p-1"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ToggleButton active={mode === 'composite'} onClick={() => setMode('composite')} icon={<ImageIcon className="h-3.5 w-3.5" />}>
            Weave
          </ToggleButton>
          <ToggleButton active={mode === 'grid'} onClick={() => setMode('grid')} icon={<Grid3x3 className="h-3.5 w-3.5" />}>
            Fragments
          </ToggleButton>
        </div>
      </div>

      {mode === 'composite' ? <CompositeView data={data} /> : <GridView data={data} />}
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] transition-colors"
      style={{
        fontFamily: 'Bebas Neue, Impact, sans-serif',
        background: active ? '#FF4D00' : 'transparent',
        color: active ? '#000' : 'rgba(255,255,255,0.5)',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function CompositeView({ data }: { data: ResolvedMosaic }) {
  return (
    <motion.a
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      href={data.compositeSrc}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block w-full overflow-hidden rounded-2xl"
      style={{ aspectRatio: `${data.cols} / ${data.rows}`, border: '1px solid rgba(255,77,0,0.2)', background: 'rgba(0,0,0,0.5)' }}
      title="Open full resolution"
    >
      <Image
        src={data.compositeSrc}
        alt={`Mosaic weave — ${formatCycle(data.cycleDate)}`}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 1024px"
      />
    </motion.a>
  );
}

function GridView({ data }: { data: ResolvedMosaic }) {
  // Place tiles by their (row, col) so a ragged last row leaves real gaps.
  const byCell = new Map(data.tiles.map((t) => [`${t.row}-${t.col}`, t]));
  const cells = [];
  for (let r = 0; r < data.rows; r++) {
    for (let c = 0; c < data.cols; c++) {
      cells.push({ r, c, tile: byCell.get(`${r}-${c}`) ?? null });
    }
  }

  // Rendered tile width ≈ container / cols; tell next/image so it fetches a
  // thumbnail near that size instead of the full-res PNG.
  const sizes = `(max-width: 640px) ${Math.round(100 / data.cols)}vw, ${Math.round(1024 / data.cols)}px`;

  return (
    <div
      className="grid gap-2 sm:gap-3"
      style={{ gridTemplateColumns: `repeat(${data.cols}, minmax(0, 1fr))` }}
    >
      {cells.map(({ r, c, tile }) =>
        tile ? <TileCard key={`${r}-${c}`} tile={tile} sizes={sizes} /> : <div key={`${r}-${c}`} aria-hidden />
      )}
    </div>
  );
}

function TileCard({ tile, sizes }: { tile: ResolvedMosaic['tiles'][number]; sizes: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-xl"
      style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="relative aspect-square w-full">
        {tile.failed ? (
          <div className="flex h-full w-full items-center justify-center bg-white/[0.02] text-white/15">
            <AlertTriangle className="h-5 w-5" />
          </div>
        ) : (
          <Image
            src={tile.src}
            alt={tile.username ? `@${tile.username}` : `Tile ${tile.row},${tile.col}`}
            fill
            className="object-cover"
            sizes={sizes}
          />
        )}
      </div>
      {tile.username && (
        <div className="px-2 py-1.5 text-center">
          <p className="truncate text-[11px] text-white/45">@{tile.username}</p>
        </div>
      )}
    </motion.div>
  );
}
