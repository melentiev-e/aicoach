// Orchestrator (ADR-0001, issue #0004): runs all three source fetchers in one pass.
// Each fetcher owns its own raw-dump + normalize + idempotent upsert, so this is
// just glue. The coach agent never runs this; it reads the resulting /logs/ files.

import { fileURLToPath } from 'node:url';
import { runStravaFetch } from './fetch-strava.js';
import { runGarminWellnessFetch, runRunalyzeFitnessFetch } from './fetch-sources.js';

export async function runAllFetches(opts = {}) {
  const [activities, wellness, fitness] = await Promise.all([
    runStravaFetch(opts.strava ?? {}),
    runGarminWellnessFetch(opts.garmin ?? {}),
    runRunalyzeFitnessFetch(opts.runalyze ?? {}),
  ]);
  return { activities, wellness, fitness };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAllFetches()
    .then((c) =>
      console.log(
        `activities: ${c.activities}, wellness: ${c.wellness}, fitness: ${c.fitness}`
      )
    )
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
