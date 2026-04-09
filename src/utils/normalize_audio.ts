import {execFile} from 'child_process';
import {promises as fs} from 'fs';
import * as path from 'path';
import {promisify} from 'util';

const execFileAsync = promisify(execFile);

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegPath: string = require('ffmpeg-static');

interface NormalizedEntry {
  name: string;
  mtimeMs: number;
}

const MARKER_FILE = '.normalized';

async function readMarker(dirPath: string): Promise<Map<string, number>> {
  const markerPath = path.join(dirPath, MARKER_FILE);
  try {
    const content = await fs.readFile(markerPath, 'utf-8');
    const entries: NormalizedEntry[] = JSON.parse(content);

    return new Map(entries.map((e) => [e.name, e.mtimeMs]));
  } catch {
    return new Map();
  }
}

async function writeMarker(dirPath: string, entries: Map<string, number>): Promise<void> {
  const markerPath = path.join(dirPath, MARKER_FILE);
  const data: NormalizedEntry[] = Array.from(entries, ([name, mtimeMs]) => ({name, mtimeMs}));
  await fs.writeFile(markerPath, JSON.stringify(data, null, 2));
}

async function normalizeFile(filePath: string): Promise<void> {
  const tempPath = `${filePath}.tmp.mp3`;

  await execFileAsync(ffmpegPath, [
    '-i', filePath,
    '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
    '-ar', '48000',
    '-b:a', '192k',
    '-y',
    tempPath
  ]);

  await fs.rename(tempPath, filePath);
}

export async function normalizeFiles(dirPath: string): Promise<void> {
  const marker = await readMarker(dirPath);
  const files = await fs.readdir(dirPath);
  const mp3Files = files.filter((f) => f.endsWith('.mp3'));

  let normalized = 0;
  let skipped = 0;
  const updatedMarker = new Map<string, number>();

  for (const fileName of mp3Files) {
    const filePath = path.join(dirPath, fileName);
    const stat = await fs.stat(filePath);

    if (marker.get(fileName) === stat.mtimeMs) {
      updatedMarker.set(fileName, stat.mtimeMs);
      skipped++;
      continue;
    }

    console.info(`Normalizing audio: ${fileName}`);
    try {
      await normalizeFile(filePath);
      const newStat = await fs.stat(filePath);
      updatedMarker.set(fileName, newStat.mtimeMs);
      normalized++;
    } catch (error) {
      console.error(`Failed to normalize ${fileName}:`, error);
    }
  }

  await writeMarker(dirPath, updatedMarker);

  if (normalized > 0 || skipped > 0) {
    console.info(`Audio normalization: ${normalized} processed, ${skipped} skipped`);
  }
}
