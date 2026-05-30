// Pure normalizers: platform payload -> locked-schema row (see logs/README.md).
// No I/O here so this stays offline-testable against fixtures.

const STRAVA_WORKOUT_TYPE = {
  1: 'Race',
  2: 'Long',
  3: 'Threshold', // Strava "workout" -> generic quality placeholder; real session
                  // type is recovered later by plan-matching in daily-check
  // 0 / undefined -> Easy
};

// Quality sessions get a per-lap splits file (logs/README.md splits trigger).
const QUALITY_TYPES = new Set(['Threshold', 'MP', 'VO2max', 'Reps', 'Race']);
export function shouldKeepSplits(type) {
  return QUALITY_TYPES.has(type);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

// seconds -> HH:MM:SS (or MM:SS under an hour)
export function formatDuration(totalSeconds) {
  const s = Math.round(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${pad2(h)}:${pad2(m)}:${pad2(sec)}` : `${pad2(m)}:${pad2(sec)}`;
}

// average_speed (m/s) -> MM:SS per km
export function formatPace(metresPerSecond) {
  const secPerKm = Math.round(1000 / metresPerSecond);
  const m = Math.floor(secPerKm / 60);
  const sec = secPerKm % 60;
  return `${m}:${pad2(sec)}`;
}

const str = (v) => (v == null ? '' : String(v));
const round = (v) => (v == null ? '' : String(Math.round(v)));

export function normalizeStravaActivity(a) {
  return {
    activity_id: String(a.id),
    date: a.start_date_local.slice(0, 10),
    type: STRAVA_WORKOUT_TYPE[a.workout_type] ?? 'Easy',
    distance: (a.distance / 1000).toFixed(2),
    duration: formatDuration(a.moving_time),
    avg_pace: formatPace(a.average_speed),
    avg_hr: round(a.average_heartrate),
    max_hr: round(a.max_heartrate),
    elevation: round(a.total_elevation_gain),
    rpe: '',
    notes: '',
  };
}

// Garmin daily wellness -> wellness.csv row. soreness/mood are subjective (not Garmin).
export function normalizeGarminWellness(d) {
  return {
    date: d.calendarDate,
    sleep_h: d.sleepTimeSeconds == null ? '' : (d.sleepTimeSeconds / 3600).toFixed(1),
    hrv: str(d.avgOvernightHrv),
    rest_hr: str(d.restingHeartRate),
    body_battery: str(d.bodyBatteryHighestValue),
    soreness: '',
    mood: '',
  };
}

// RUNALYZE recomputed snapshot -> fitness.csv row.
export function normalizeRunalyzeFitness(f) {
  return {
    date: f.date,
    vo2max: str(f.vo2max),
    marathon_shape: str(f.marathonShape),
    prognosis_marathon: str(f.prognosis?.marathon),
    prognosis_half: str(f.prognosis?.half),
    ctl: str(f.ctl),
    atl: str(f.atl),
    tsb: str(f.tsb),
    threshold_pace: str(f.threshold?.pace),
    threshold_hr: str(f.threshold?.hr),
  };
}

// Strava activity laps -> per-lap split rows.
export function normalizeStravaLaps(activity) {
  return (activity.laps ?? []).map((lap, i) => ({
    lap: String(lap.lap_index ?? i + 1),
    distance: (lap.distance / 1000).toFixed(2),
    duration: formatDuration(lap.moving_time),
    avg_pace: formatPace(lap.average_speed),
    avg_hr: round(lap.average_heartrate),
    max_hr: round(lap.max_heartrate),
  }));
}
