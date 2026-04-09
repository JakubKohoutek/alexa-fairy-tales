import {execFile, execFileSync} from 'child_process';
import {promises as fs} from 'fs';
import * as path from 'path';
import {promisify} from 'util';

import {logger} from './logger';

const execFileAsync = promisify(execFile);

function findFfmpeg(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('ffmpeg-static');
  } catch {
    // fall through to system ffmpeg
  }

  try {
    return execFileSync('which', ['ffmpeg'], {encoding: 'utf-8'}).trim();
  } catch {
    return '';
  }
}

const ffmpegPath = findFfmpeg();

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

  try {
    await execFileAsync(ffmpegPath, [
      '-i', filePath,
      '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
      '-ar', '48000',
      '-b:a', '192k',
      '-y',
      tempPath
    ], {maxBuffer: 50 * 1024 * 1024});

    await fs.rename(tempPath, filePath);
  } catch (error) {
    // Clean up temp file on failure
    await fs.unlink(tempPath).catch(() => {});
    throw error;
  }
}

export async function normalizeFiles(dirPath: string): Promise<void> {
  if (!ffmpegPath) {
    logger.info('ffmpeg not available, skipping audio normalization');

    return;
  }

  const marker = await readMarker(dirPath);
  const files = await fs.readdir(dirPath);
  const mp3Files = files.filter((f) => f.endsWith('.mp3') && !f.endsWith('.tmp.mp3'));

  const toNormalize: string[] = [];
  const updatedMarker = new Map<string, number>();

  for (const fileName of mp3Files) {
    const filePath = path.join(dirPath, fileName);
    const stat = await fs.stat(filePath);

    if (marker.get(fileName) === stat.mtimeMs) {
      updatedMarker.set(fileName, stat.mtimeMs);
    } else {
      toNormalize.push(fileName);
    }
  }

  if (toNormalize.length === 0) {
    return;
  }

  normalizationStatus.total = toNormalize.length;
  normalizationStatus.completed = 0;
  logger.info(`Audio normalization: ${toNormalize.length} files to process`);

  for (const fileName of toNormalize) {
    const filePath = path.join(dirPath, fileName);

    normalizationStatus.current = fileName;
    logger.info(`Normalizing audio (${normalizationStatus.completed + 1}/${toNormalize.length}): ${fileName}`);
    try {
      await normalizeFile(filePath);
      const newStat = await fs.stat(filePath);
      updatedMarker.set(fileName, newStat.mtimeMs);
      normalizationStatus.completed++;
    } catch (error) {
      logger.error(`Failed to normalize ${fileName}:`, error);
      normalizationStatus.completed++;
    }
  }

  normalizationStatus.current = null;
  normalizationStatus.total = 0;
  await writeMarker(dirPath, updatedMarker);
  logger.info(`Audio normalization complete: ${toNormalize.length} files processed`);
}

export const normalizationStatus = {
  total: 0,
  completed: 0,
  current: null as string | null
};
