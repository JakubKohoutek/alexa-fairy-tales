import {appendFileSync, mkdirSync} from 'fs';
import * as path from 'path';

const LOG_DIR = path.resolve(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

try {
  mkdirSync(LOG_DIR, {recursive: true});
} catch {
  // ignore — will fall back to console only
}

function timestamp(): string {
  return new Date().toISOString();
}

function writeToFile(level: string, args: unknown[]): void {
  const message = args.map((a) => (a instanceof Error ? a.stack || a.message : String(a))).join(' ');
  try {
    appendFileSync(LOG_FILE, `${timestamp()} [${level}] ${message}\n`);
  } catch {
    // file logging unavailable — console still works
  }
}

export const logger = {
  info(...args: unknown[]): void {
    console.info(...args);
    writeToFile('INFO', args);
  },

  error(...args: unknown[]): void {
    console.error(...args);
    writeToFile('ERROR', args);
  },

  warn(...args: unknown[]): void {
    console.warn(...args);
    writeToFile('WARN', args);
  }
};
