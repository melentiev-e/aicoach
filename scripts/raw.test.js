import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { dumpRaw } from './raw.js';

function tmpRoot() {
  return mkdtempSync(join(tmpdir(), 'aicoach-raw-'));
}

test('dumpRaw writes the payload verbatim under <rawDir>/<source>/<key>.json', () => {
  const rawDir = tmpRoot();
  const payload = { id: 42, foo: 'bar' };
  const path = dumpRaw({ rawDir, source: 'strava', key: '42', payload });
  assert.equal(path, join(rawDir, 'strava', '42.json'));
  assert.deepEqual(JSON.parse(readFileSync(path, 'utf8')), payload);
});

test('dumpRaw creates the source subdir if missing', () => {
  const rawDir = tmpRoot();
  dumpRaw({ rawDir, source: 'garmin', key: '2026-05-24', payload: { x: 1 } });
  assert.ok(existsSync(join(rawDir, 'garmin')));
});

test('dumpRaw keys files so re-dumping the same key overwrites (no pileup)', () => {
  const rawDir = tmpRoot();
  dumpRaw({ rawDir, source: 'strava', key: '42', payload: { v: 1 } });
  dumpRaw({ rawDir, source: 'strava', key: '42', payload: { v: 2 } });
  assert.equal(readdirSync(join(rawDir, 'strava')).length, 1);
});
