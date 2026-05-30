import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runAllFetches } from './fetch-all.js';

const read = (f) => JSON.parse(readFileSync(new URL(`./fixtures/${f}`, import.meta.url)));
const strava = read('strava-activity.json');
const quality = read('strava-quality-activity.json');
const garmin = read('garmin-wellness.json');
const runalyze = read('runalyze-fitness.json');

function harness() {
  const dir = mkdtempSync(join(tmpdir(), 'aicoach-all-'));
  const activitiesPath = join(dir, 'activities.csv');
  const wellnessPath = join(dir, 'wellness.csv');
  const fitnessPath = join(dir, 'fitness.csv');
  writeFileSync(activitiesPath, 'activity_id,date,type,distance,duration,avg_pace,avg_hr,max_hr,elevation,rpe,notes\n');
  writeFileSync(wellnessPath, 'date,sleep_h,hrv,rest_hr,body_battery,soreness,mood\n');
  writeFileSync(fitnessPath, 'date,vo2max,marathon_shape,prognosis_marathon,prognosis_half,ctl,atl,tsb,threshold_pace,threshold_hr\n');
  return {
    strava: { activitiesPath, splitsDir: join(dir, 'splits'), rawDir: join(dir, 'raw'), getActivities: async () => [strava, quality] },
    garmin: { wellnessPath, rawDir: join(dir, 'raw'), getDays: async () => [garmin] },
    runalyze: { fitnessPath, rawDir: join(dir, 'raw'), getSnapshots: async () => [runalyze] },
    paths: { activitiesPath, wellnessPath, fitnessPath },
  };
}

test('runAllFetches writes all log files from all three sources', async () => {
  const h = harness();
  const counts = await runAllFetches(h);
  assert.deepEqual(counts, { activities: 2, wellness: 1, fitness: 1 });
  assert.equal(readFileSync(h.paths.activitiesPath, 'utf8').trim().split('\n').length, 3); // header + 2
  assert.equal(readFileSync(h.paths.wellnessPath, 'utf8').trim().split('\n').length, 2);
  assert.equal(readFileSync(h.paths.fitnessPath, 'utf8').trim().split('\n').length, 2);
});

test('runAllFetches is idempotent across an overlapping re-run (no duplicate rows)', async () => {
  const h = harness();
  await runAllFetches(h);
  await runAllFetches(h);
  assert.equal(readFileSync(h.paths.activitiesPath, 'utf8').trim().split('\n').length, 3);
  assert.equal(readFileSync(h.paths.wellnessPath, 'utf8').trim().split('\n').length, 2);
  assert.equal(readFileSync(h.paths.fitnessPath, 'utf8').trim().split('\n').length, 2);
});
