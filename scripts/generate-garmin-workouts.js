import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Encoder, Profile } from '@garmin/fitsdk';

function paceToSpeed(pace) {
  const [m, s] = pace.split(':').map(Number);
  return 1000 / (m * 60 + s);
}

function parseDistanceKm(raw) {
  const m = raw.match(/(\d+(?:\.\d+)?)\s*km/i);
  if (!m) return null;
  return Number(m[1]);
}

function parseHr(raw) {
  const cap = raw.match(/<\s*(\d+)/);
  if (cap) {
    return { low: null, high: Number(cap[1]) };
  }

  const range = raw.match(/(\d+)\s*[\-–]\s*(\d+)/);
  if (range) {
    return { low: Number(range[1]), high: Number(range[2]) };
  }

  return null;
}

function parsePaceRange(raw) {
  const m = raw.match(/(\d+:\d{2})\s*[\-–]\s*(\d+:\d{2})\s*\/km/);
  if (!m) return null;

  const a = paceToSpeed(m[1]);
  const b = paceToSpeed(m[2]);
  return { low: Math.min(a, b), high: Math.max(a, b) };
}

function parseCurrentWeekTable(md) {
  const lines = md.split(/\r?\n/);
  const rows = [];

  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const cols = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());

    if (cols.length !== 6) continue;
    if (cols[0] === 'Date' || cols[0].startsWith('------')) continue;

    rows.push({
      dateLabel: cols[0],
      type: cols[1],
      distance: cols[2],
      targetPace: cols[3],
      targetHr: cols[4],
      purpose: cols[5],
    });
  }

  return rows;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function hrToWorkoutHr(bpm) {
  // FIT workout_hr: >100 means bpm offset by +100.
  return bpm + 100;
}

function metersToDurationValue(meters) {
  // workout_step.durationValue uses scale 100 for distance subfield in FIT profile.
  return Math.round(meters * 100);
}

function secondsToDurationValue(seconds) {
  // workout_step.durationValue uses scale 1000 for time subfield in FIT profile.
  return Math.round(seconds * 1000);
}

function speedToTargetValue(speedMs) {
  // customTargetValue uses scale 1000 for speed subfields in FIT profile.
  return Math.round(speedMs * 1000);
}

function easyStep(name, km, hr) {
  const step = {
    wktStepName: name,
    intensity: 'active',
    durationType: 'distance',
    durationValue: metersToDurationValue(km * 1000),
    targetType: 'open',
  };

  if (hr?.high) {
    step.targetType = 'heartRate';
    step.customTargetValueLow = hr?.low ? hrToWorkoutHr(hr.low) : 0;
    step.customTargetValueHigh = hrToWorkoutHr(hr.high);
  }

  return step;
}

function paceStep(name, km, paceRange, intensity = 'active') {
  const step = {
    wktStepName: name,
    intensity,
    durationType: 'distance',
    durationValue: metersToDurationValue(km * 1000),
    targetType: 'open',
  };

  if (paceRange) {
    step.targetType = 'speed';
    step.customTargetValueLow = speedToTargetValue(paceRange.low);
    step.customTargetValueHigh = speedToTargetValue(paceRange.high);
  }

  return step;
}

function timeStep(name, seconds, intensity = 'rest') {
  return {
    wktStepName: name,
    intensity,
    durationType: 'time',
    durationValue: secondsToDurationValue(seconds),
    targetType: 'open',
  };
}

function buildWorkoutSteps(row) {
  const type = row.type.toLowerCase();
  const distanceKm = parseDistanceKm(row.distance) ?? 0;
  const hr = parseHr(row.targetHr);
  const paceRange = parsePaceRange(row.targetPace);

  if (type.includes('rest')) return null;

  if (type.includes('threshold')) {
    return [
      easyStep('Warm up', 2, { high: 148 }),
      paceStep('Threshold rep 1', 3, paceRange, 'interval'),
      timeStep('Jog recover', 180, 'recovery'),
      paceStep('Threshold rep 2', 3, paceRange, 'interval'),
      easyStep('Cool down', 2, { high: 148 }),
    ];
  }

  if (type.includes('strides')) {
    const steps = [easyStep('Easy run', Math.max(distanceKm - 0.6, 0), hr)];
    for (let i = 0; i < 6; i += 1) {
      steps.push(paceStep(`Stride ${i + 1}`, 0.1, {
        low: paceToSpeed('3:40'),
        high: paceToSpeed('3:20'),
      }, 'interval'));
      steps.push(timeStep('Walk recover', 75, 'recovery'));
    }
    return steps;
  }

  return [easyStep('Main run', distanceKm, hr)];
}

function buildFitWorkout({ name, notes, steps, fileNumber }) {
  const encoder = new Encoder();
  const now = new Date();

  encoder.onMesg(Profile.MesgNum.FILE_ID, {
    type: 'workout',
    manufacturer: 'development',
    product: 1,
    timeCreated: now,
    number: fileNumber,
  });

  encoder.onMesg(Profile.MesgNum.WORKOUT, {
    messageIndex: 0,
    sport: 'running',
    capabilities: ['custom'],
    numValidSteps: steps.length,
    wktName: name,
    wktDescription: notes,
  });

  steps.forEach((step, index) => {
    encoder.onMesg(Profile.MesgNum.WORKOUT_STEP, {
      messageIndex: index,
      ...step,
    });
  });

  return encoder.close();
}

export function generateGarminWorkouts({
  currentWeekPath,
  outDir,
} = {}) {
  const weekPath = currentWeekPath
    ? resolve(currentWeekPath)
    : resolve(dirname(fileURLToPath(import.meta.url)), '..', 'plan', 'current-week.md');

  const outputDir = outDir
    ? resolve(outDir)
    : resolve(dirname(fileURLToPath(import.meta.url)), '..', 'plan', 'garmin-workouts');

  const markdown = readFileSync(weekPath, 'utf8');
  const rows = parseCurrentWeekTable(markdown);
  mkdirSync(outputDir, { recursive: true });

  for (const file of readdirSync(outputDir)) {
    if (file.toLowerCase().endsWith('.fit')) {
      unlinkSync(join(outputDir, file));
    }
  }

  const created = [];

  rows.forEach((row, i) => {
    const steps = buildWorkoutSteps(row);
    if (!steps || steps.length === 0) return;

    const date = row.dateLabel.split(' ')[0];
    const workoutName = `${date} ${row.type}`.slice(0, 64);
    const fileName = `${date}-${slugify(row.type)}.fit`;
    const filePath = join(outputDir, fileName);

    const fitFile = buildFitWorkout({
      name: workoutName,
      notes: `${row.targetPace}; HR ${row.targetHr}`,
      steps,
      fileNumber: i + 1,
    });

    writeFileSync(filePath, fitFile);
    created.push(filePath);
  });

  return {
    weekPath,
    outputDir,
    files: created,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outArg = process.argv[2];
  const weekArg = process.argv[3];
  const result = generateGarminWorkouts({
    outDir: outArg,
    currentWeekPath: weekArg,
  });

  if (result.files.length === 0) {
    console.log('No workouts generated (only rest days found).');
  } else {
    console.log(`Generated ${result.files.length} workout FIT file(s) in ${result.outputDir}`);
    result.files.forEach((f) => console.log(`- ${basename(f)}`));
  }
}
