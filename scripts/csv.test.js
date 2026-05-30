import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { upsertRowsByKey } from './csv.js';

const COLS = ['activity_id', 'date', 'type', 'distance'];

function tmpCsv(contents) {
  const dir = mkdtempSync(join(tmpdir(), 'aicoach-'));
  const path = join(dir, 'activities.csv');
  writeFileSync(path, contents);
  return path;
}

test('upsertRowsByKey appends a new row under an existing header', () => {
  const path = tmpCsv('activity_id,date,type,distance\n');
  upsertRowsByKey(path, COLS, 'activity_id', [
    { activity_id: '1', date: '2026-05-24', type: 'Long', distance: '21.10' },
  ]);
  assert.equal(
    readFileSync(path, 'utf8'),
    'activity_id,date,type,distance\n1,2026-05-24,Long,21.10\n'
  );
});

test('upsertRowsByKey replaces a row with a matching key (idempotent re-fetch)', () => {
  const path = tmpCsv('activity_id,date,type,distance\n1,2026-05-24,Easy,5.00\n');
  upsertRowsByKey(path, COLS, 'activity_id', [
    { activity_id: '1', date: '2026-05-24', type: 'Long', distance: '21.10' },
  ]);
  assert.equal(
    readFileSync(path, 'utf8'),
    'activity_id,date,type,distance\n1,2026-05-24,Long,21.10\n'
  );
});

test('upsertRowsByKey preserves unrelated rows and order, appends new keys at end', () => {
  const path = tmpCsv(
    'activity_id,date,type,distance\n1,2026-05-24,Easy,5.00\n2,2026-05-25,Long,30.00\n'
  );
  upsertRowsByKey(path, COLS, 'activity_id', [
    { activity_id: '2', date: '2026-05-25', type: 'Long', distance: '32.00' },
    { activity_id: '3', date: '2026-05-26', type: 'Recovery', distance: '6.00' },
  ]);
  assert.equal(
    readFileSync(path, 'utf8'),
    'activity_id,date,type,distance\n' +
      '1,2026-05-24,Easy,5.00\n' +
      '2,2026-05-25,Long,32.00\n' +
      '3,2026-05-26,Recovery,6.00\n'
  );
});
