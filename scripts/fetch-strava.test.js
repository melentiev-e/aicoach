import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runStravaFetch } from './fetch-strava.js';

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/strava-activity.json', import.meta.url))
);
const quality = JSON.parse(
  readFileSync(new URL('./fixtures/strava-quality-activity.json', import.meta.url))
);
const HEADER =
  'activity_id,date,type,distance,duration,avg_pace,avg_hr,max_hr,elevation,rpe,notes\n';

function tmpActivities() {
  const dir = mkdtempSync(join(tmpdir(), 'aicoach-'));
  const path = join(dir, 'activities.csv');
  writeFileSync(path, HEADER);
  return path;
}

test('runStravaFetch writes a normalized row end-to-end (offline, injected fetcher)', async () => {
  const path = tmpActivities();
  const count = await runStravaFetch({
    activitiesPath: path,
    getActivities: async () => [fixture], // injected: no network
  });
  assert.equal(count, 1);
  assert.equal(
    readFileSync(path, 'utf8'),
    HEADER + '12345678901,2026-05-24,Long,21.10,01:19:28,3:46,159,172,45,,\n'
  );
});

test('runStravaFetch is idempotent: re-running does not duplicate', async () => {
  const path = tmpActivities();
  const opts = { activitiesPath: path, getActivities: async () => [fixture] };
  await runStravaFetch(opts);
  await runStravaFetch(opts);
  const lines = readFileSync(path, 'utf8').trim().split('\n');
  assert.equal(lines.length, 2); // header + one row
});

test('runStravaFetch writes a splits file for a quality session only', async () => {
  const path = tmpActivities();
  const splitsDir = mkdtempSync(join(tmpdir(), 'aicoach-splits-'));
  const rawDir = mkdtempSync(join(tmpdir(), 'aicoach-raw-'));
  await runStravaFetch({
    activitiesPath: path,
    splitsDir,
    rawDir,
    getActivities: async () => [fixture, quality], // Long (no splits) + Threshold (splits)
  });
  // quality -> splits file named <date>-<activity_id>.csv
  const splitsPath = join(splitsDir, '2026-05-27-22222222222.csv');
  assert.ok(existsSync(splitsPath));
  assert.equal(
    readFileSync(splitsPath, 'utf8'),
    'lap,distance,duration,avg_pace,avg_hr,max_hr\n' +
      '1,2.00,07:24,3:42,168,175\n' +
      '2,2.00,07:18,3:39,171,178\n'
  );
  // easy/long activity -> no splits file
  assert.equal(existsSync(join(splitsDir, '2026-05-24-12345678901.csv')), false);
});

test('runStravaFetch dumps raw payload, before normalization (survives a normalize failure)', async () => {
  const path = tmpActivities();
  const rawDir = mkdtempSync(join(tmpdir(), 'aicoach-raw-'));
  const bad = { id: 999 }; // missing start_date_local -> normalize throws
  await assert.rejects(
    runStravaFetch({ activitiesPath: path, rawDir, getActivities: async () => [bad] })
  );
  // raw was written despite the later normalize crash
  assert.ok(existsSync(join(rawDir, 'strava', '999.json')));
});
