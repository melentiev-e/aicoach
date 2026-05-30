// Raw payload dump (ADR-0001, issue #0003). Insurance: every fetched payload is
// persisted before normalization, so a normalize bug can't lose un-refetchable
// Garmin/Strava history. /data/raw/ is gitignored and never read by the agent.

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_RAW_DIR = join(SCRIPTS_DIR, '..', 'data', 'raw');

// Keyed by source + stable id/date so a re-fetch overwrites rather than piles up.
export function dumpRaw({ rawDir = DEFAULT_RAW_DIR, source, key, payload }) {
  const dir = join(rawDir, source);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, `${key}.json`);
  writeFileSync(path, JSON.stringify(payload, null, 2));
  return path;
}
