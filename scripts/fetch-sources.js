// Garmin (wellness) and RUNALYZE (fitness) fetchers (ADR-0001, issue #0004).
// Same shape as the Strava fetcher: raw-dump first, then normalize, then idempotent
// upsert keyed on `date`. Real HTTP getters are injectable for offline testing.

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { normalizeGarminWellness, normalizeRunalyzeFitness } from './normalize.js';
import { upsertRowsByKey } from './csv.js';
import { dumpRaw, DEFAULT_RAW_DIR } from './raw.js';

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_WELLNESS_PATH = join(SCRIPTS_DIR, '..', 'logs', 'wellness.csv');
const DEFAULT_FITNESS_PATH = join(SCRIPTS_DIR, '..', 'logs', 'fitness.csv');

const WELLNESS_COLUMNS = ['date', 'sleep_h', 'hrv', 'rest_hr', 'body_battery', 'soreness', 'mood'];
const FITNESS_COLUMNS = [
  'date', 'vo2max', 'marathon_shape', 'prognosis_marathon', 'prognosis_half',
  'ctl', 'atl', 'tsb', 'threshold_pace', 'threshold_hr',
];

// --- real HTTP getters (replaced by injected stubs in tests) -----------------
async function httpGetGarminDays({ token }) {
  throw new Error('Garmin HTTP getter not yet implemented — inject getDays or wire the API');
}
async function httpGetRunalyzeSnapshots({ token }) {
  throw new Error('RUNALYZE HTTP getter not yet implemented — inject getSnapshots or wire the API');
}

export async function runGarminWellnessFetch({
  wellnessPath = DEFAULT_WELLNESS_PATH,
  rawDir = DEFAULT_RAW_DIR,
  token = process.env.GARMIN_ACCESS_TOKEN,
  getDays = httpGetGarminDays,
} = {}) {
  const payloads = await getDays({ token });
  for (const d of payloads) dumpRaw({ rawDir, source: 'garmin', key: d.calendarDate, payload: d });
  const rows = payloads.map(normalizeGarminWellness);
  upsertRowsByKey(wellnessPath, WELLNESS_COLUMNS, 'date', rows);
  return rows.length;
}

export async function runRunalyzeFitnessFetch({
  fitnessPath = DEFAULT_FITNESS_PATH,
  rawDir = DEFAULT_RAW_DIR,
  token = process.env.RUNALYZE_ACCESS_TOKEN,
  getSnapshots = httpGetRunalyzeSnapshots,
} = {}) {
  const payloads = await getSnapshots({ token });
  for (const f of payloads) dumpRaw({ rawDir, source: 'runalyze', key: f.date, payload: f });
  const rows = payloads.map(normalizeRunalyzeFitness);
  upsertRowsByKey(fitnessPath, FITNESS_COLUMNS, 'date', rows);
  return rows.length;
}
