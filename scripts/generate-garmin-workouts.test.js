import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Decoder, Stream } from '@garmin/fitsdk';
import { generateGarminWorkouts } from './generate-garmin-workouts.js';

test('generateGarminWorkouts writes FIT workouts that decode without errors', () => {
  const dir = mkdtempSync(join(tmpdir(), 'aicoach-workouts-'));
  const weekPath = join(dir, 'current-week.md');
  const outDir = join(dir, 'out');

  writeFileSync(
    weekPath,
    `| Date | Type | Distance | Target pace | Target HR | Purpose |\n`
      + `|------|------|----------|-------------|-----------|---------|\n`
      + `| 2026-06-09 Tue | Easy | 12 km | 4:40-5:05/km | < 148 | Aerobic |\n`
      + `| 2026-06-11 Thu | Threshold | 11 km | 2 km WU + 2x3 km @ 4:05-4:10/km (3 min jog) + 2 km CD | 168-174 | LT |\n`
  );

  const result = generateGarminWorkouts({
    currentWeekPath: weekPath,
    outDir,
  });

  assert.equal(result.files.length, 2);

  for (const fitPath of result.files) {
    const bytes = readFileSync(fitPath);
    const stream = Stream.fromBuffer(bytes);
    const decoder = new Decoder(stream);
    assert.equal(decoder.isFIT(), true);
    const { errors, messages } = decoder.read();
    assert.equal(errors.length, 0);
    assert.ok((messages.workoutMesgs ?? []).length >= 1);
    assert.ok((messages.workoutStepMesgs ?? []).length >= 1);
  }

  const easyBytes = readFileSync(result.files.find((f) => f.endsWith('2026-06-09-easy.fit')));
  const easyDecoded = new Decoder(Stream.fromBuffer(easyBytes)).read();
  const easyStep = easyDecoded.messages.workoutStepMesgs[0];
  assert.equal(easyStep.durationType, 'distance');
  assert.equal(easyStep.durationDistance, 12000);
  assert.equal(easyStep.targetType, 'heartRate');
  assert.equal(easyStep.customTargetHeartRateHigh, 248);
});
