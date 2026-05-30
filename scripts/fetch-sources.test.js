import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runGarminWellnessFetch, runRunalyzeFitnessFetch } from './fetch-sources.js';

const read = (f) => JSON.parse(readFileSync(new URL(`./fixtures/${f}`, import.meta.url)));
const garmin = read('garmin-wellness.json');
const runalyze = read('runalyze-fitness.json');

const WELLNESS_HEADER = 'date,sleep_h,hrv,rest_hr,body_battery,soreness,mood\n';
const FITNESS_HEADER =
  'date,vo2max,marathon_shape,prognosis_marathon,prognosis_half,ctl,atl,tsb,threshold_pace,threshold_hr\n';

function tmpFile(header) {
  const dir = mkdtempSync(join(tmpdir(), 'aicoach-'));
  const path = join(dir, 'f.csv');
  writeFileSync(path, header);
  return path;
}

test('runGarminWellnessFetch writes a wellness row and dumps raw', async () => {
  const path = tmpFile(WELLNESS_HEADER);
  const rawDir = mkdtempSync(join(tmpdir(), 'aicoach-raw-'));
  const n = await runGarminWellnessFetch({
    wellnessPath: path,
    rawDir,
    getDays: async () => [garmin],
  });
  assert.equal(n, 1);
  assert.equal(readFileSync(path, 'utf8'), WELLNESS_HEADER + '2026-05-24,7.5,62,42,95,,\n');
  assert.ok(existsSync(join(rawDir, 'garmin', '2026-05-24.json')));
});

test('runRunalyzeFitnessFetch writes a fitness row', async () => {
  const path = tmpFile(FITNESS_HEADER);
  const rawDir = mkdtempSync(join(tmpdir(), 'aicoach-raw-'));
  const n = await runRunalyzeFitnessFetch({
    fitnessPath: path,
    rawDir,
    getSnapshots: async () => [runalyze],
  });
  assert.equal(n, 1);
  assert.equal(
    readFileSync(path, 'utf8'),
    FITNESS_HEADER + '2026-05-24,62.5,88,2:41:30,1:17:05,72,65,7,3:38,172\n'
  );
});

test('both fetchers are idempotent on date (re-run replaces, no duplicate)', async () => {
  const wPath = tmpFile(WELLNESS_HEADER);
  const fPath = tmpFile(FITNESS_HEADER);
  const rawDir = mkdtempSync(join(tmpdir(), 'aicoach-raw-'));
  for (let i = 0; i < 2; i++) {
    await runGarminWellnessFetch({ wellnessPath: wPath, rawDir, getDays: async () => [garmin] });
    await runRunalyzeFitnessFetch({ fitnessPath: fPath, rawDir, getSnapshots: async () => [runalyze] });
  }
  assert.equal(readFileSync(wPath, 'utf8').trim().split('\n').length, 2);
  assert.equal(readFileSync(fPath, 'utf8').trim().split('\n').length, 2);
});
