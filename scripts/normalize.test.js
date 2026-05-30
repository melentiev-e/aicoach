import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeStravaActivity } from './normalize.js';

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/strava-activity.json', import.meta.url))
);

test('normalizeStravaActivity maps a Strava run to a locked-schema activities row', () => {
  const row = normalizeStravaActivity(fixture);
  assert.deepEqual(row, {
    activity_id: '12345678901', // stable platform id, string (CSV key)
    date: '2026-05-24',         // start_date_local -> YYYY-MM-DD
    type: 'Long',               // workout_type 2 -> Long (closed vocab)
    distance: '21.10',          // metres -> km, 2 dp
    duration: '01:19:28',       // moving_time seconds -> HH:MM:SS
    avg_pace: '3:46',           // 1000 / average_speed -> MM:SS per km
    avg_hr: '159',              // rounded bpm
    max_hr: '172',
    elevation: '45',            // total ascent, rounded metres
    rpe: '',                    // subjective, not from Strava
    notes: '',
  });
});

test('normalizeStravaActivity defaults unknown workout_type to Easy', () => {
  const row = normalizeStravaActivity({ ...fixture, workout_type: 0 });
  assert.equal(row.type, 'Easy');
});

test('normalizeStravaActivity maps workout_type 1 to Race', () => {
  const row = normalizeStravaActivity({ ...fixture, workout_type: 1 });
  assert.equal(row.type, 'Race');
});

test('normalizeStravaActivity leaves missing HR fields empty (no zeros)', () => {
  const { average_heartrate, max_heartrate, ...noHr } = fixture;
  const row = normalizeStravaActivity(noHr);
  assert.equal(row.avg_hr, '');
  assert.equal(row.max_hr, '');
});
