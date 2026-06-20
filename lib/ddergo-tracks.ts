// Server-only. Auto-discovers DDERGO's self-hosted tracks from public/audio/
// so adding music is just dropping files into that folder — no manifest to edit.
//
// Conventions:
//   - Any audio file (.mp3/.m4a/.aac/.ogg/.wav/.flac) becomes a track.
//   - Filename becomes the title: a leading "01 " / "01 - " / "01_" sets play
//     order and is stripped; underscores/dashes become spaces.
//       e.g.  "03 - Tokyo Nights.mp3"  ->  order 3, title "Tokyo Nights"
//   - An image with the same basename (.jpg/.jpeg/.png/.webp) is used as art:
//       e.g.  "03 - Tokyo Nights.jpg"  ->  cover for that track.
//
// Runs at build time (the homepage layout is static), so the list is baked in
// per deploy and ships zero extra work to the client.
import fs from 'node:fs';
import path from 'node:path';

export interface RadioTrack {
  id: string;
  title: string;
  src: string;
  art: string | null;
}

const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');
const AUDIO_EXT = new Set(['.mp3', '.m4a', '.aac', '.ogg', '.wav', '.flac']);
const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

function parseName(base: string): { order: number; title: string } {
  const m = base.match(/^\s*(\d+)\s*[-_.)]*\s*(.*)$/);
  const order = m && m[2] ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
  const rest = (m && m[2]) || base;
  const title = rest.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return { order, title };
}

export function getDdergoTracks(): RadioTrack[] {
  let entries: string[];
  try {
    entries = fs.readdirSync(AUDIO_DIR);
  } catch {
    return []; // folder missing / empty — dock renders nothing.
  }

  const lowerSet = new Set(entries.map((e) => e.toLowerCase()));

  return entries
    .filter((f) => AUDIO_EXT.has(path.extname(f).toLowerCase()))
    .map((file) => {
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      const { order, title } = parseName(base);

      let art: string | null = null;
      for (const ie of IMAGE_EXT) {
        if (lowerSet.has((base + ie).toLowerCase())) {
          art = `/audio/${encodeURIComponent(base + ie)}`;
          break;
        }
      }

      return { order, id: base, title, src: `/audio/${encodeURIComponent(file)}`, art };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .map(({ id, title, src, art }) => ({ id, title, src, art }));
}
