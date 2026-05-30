// Strava fetcher shell (ADR-0001, tracer for issue #0002).
// Thin: HTTP fetch -> normalize -> idempotent upsert into logs/activities.csv.
// `getActivities` is injectable so the path is testable offline against fixtures.
// The coach agent never runs this; secrets come from env, never the agent.

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { normalizeStravaActivity, normalizeStravaLaps, shouldKeepSplits } from './normalize.js';
import { upsertRowsByKey, writeCsvFile } from './csv.js';
import { dumpRaw, DEFAULT_RAW_DIR } from './raw.js';

const ACTIVITY_COLUMNS = [
  'activity_id', 'date', 'type', 'distance', 'duration',
  'avg_pace', 'avg_hr', 'max_hr', 'elevation', 'rpe', 'notes',
];

const SPLIT_COLUMNS = ['lap', 'distance', 'duration', 'avg_pace', 'avg_hr', 'max_hr'];

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ACTIVITIES_PATH = join(SCRIPTS_DIR, '..', 'logs', 'activities.csv');
const DEFAULT_SPLITS_DIR = join(SCRIPTS_DIR, '..', 'logs', 'splits');

// Real Strava call. Replaced by an injected stub in tests.
async function httpGetActivities({ token, perPage = 30 }) {
  const res = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Strava API ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function runStravaFetch({
  activitiesPath = DEFAULT_ACTIVITIES_PATH,
  splitsDir = DEFAULT_SPLITS_DIR,
  rawDir = DEFAULT_RAW_DIR,
  token = process.env.STRAVA_ACCESS_TOKEN,
  getActivities = httpGetActivities,
} = {}) {
  const payloads = await getActivities({ token });
  // Dump every raw payload BEFORE normalizing — a normalize bug must not lose data.
  for (const p of payloads) dumpRaw({ rawDir, source: 'strava', key: String(p.id), payload: p });

  const rows = payloads.map(normalizeStravaActivity);
  upsertRowsByKey(activitiesPath, ACTIVITY_COLUMNS, 'activity_id', rows);

  // Per-lap splits file for quality sessions only (logs/README.md trigger).
  payloads.forEach((p, i) => {
    const row = rows[i];
    if (!shouldKeepSplits(row.type)) return;
    const laps = normalizeStravaLaps(p);
    if (laps.length === 0) return;
    writeCsvFile(join(splitsDir, `${row.date}-${row.activity_id}.csv`), SPLIT_COLUMNS, laps);
  });

  return rows.length;
}

// CLI entry: `npm run fetch:strava` (needs STRAVA_ACCESS_TOKEN in env).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.env.STRAVA_ACCESS_TOKEN) {
    console.error('STRAVA_ACCESS_TOKEN not set');
    process.exit(1);
  }
  runStravaFetch()
    .then((n) => console.log(`Wrote/updated ${n} activity row(s).`))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
