import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  normalizeGarminWellness,
  normalizeRunalyzeFitness,
  normalizeStravaLaps,
  shouldKeepSplits,
} from './normalize.js';

const read = (f) => JSON.parse(readFileSync(new URL(`./fixtures/${f}`, import.meta.url)));

test('normalizeGarminWellness maps a Garmin day to a wellness row', () => {
  const row = normalizeGarminWellness(read('garmin-wellness.json'));
  assert.deepEqual(row, {
    date: '2026-05-24',
    sleep_h: '7.5',       // 27000s -> hours, 1dp
    hrv: '62',
    rest_hr: '42',
    body_battery: '95',
    soreness: '',         // subjective, not from Garmin
    mood: '',
  });
});

test('normalizeRunalyzeFitness maps a snapshot to a fitness row', () => {
  const row = normalizeRunalyzeFitness(read('runalyze-fitness.json'));
  assert.deepEqual(row, {
    date: '2026-05-24',
    vo2max: '62.5',
    marathon_shape: '88',
    prognosis_marathon: '2:41:30',
    prognosis_half: '1:17:05',
    ctl: '72',
    atl: '65',
    tsb: '7',
    threshold_pace: '3:38',
    threshold_hr: '172',
  });
});

test('normalizeStravaLaps maps laps to split rows', () => {
  const rows = normalizeStravaLaps(read('strava-quality-activity.json'));
  assert.deepEqual(rows, [
    { lap: '1', distance: '2.00', duration: '07:24', avg_pace: '3:42', avg_hr: '168', max_hr: '175' },
    { lap: '2', distance: '2.00', duration: '07:18', avg_pace: '3:39', avg_hr: '171', max_hr: '178' },
  ]);
});

test('shouldKeepSplits is true only for quality session types', () => {
  for (const t of ['Threshold', 'MP', 'VO2max', 'Reps', 'Race']) {
    assert.equal(shouldKeepSplits(t), true, t);
  }
  for (const t of ['Easy', 'Long', 'Recovery']) {
    assert.equal(shouldKeepSplits(t), false, t);
  }
});
