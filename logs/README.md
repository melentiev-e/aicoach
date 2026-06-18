# `logs/` — data contract

These files are **written by the Node.js fetcher** (`/scripts/`) and **read by the
skills**. The agent never writes them except where a skill's "May write" clause says so.
Changing a column means updating both the fetcher and the skills that read it.

**Conventions (all files):**
- `date` — `YYYY-MM-DD` (the activity's / day's local date).
- Distances in **kilometres** (decimal, e.g. `21.1`).
- Durations as `HH:MM:SS` (or `MM:SS` under an hour).
- Paces as `MM:SS` **per km** (e.g. `3:46`).
- Heart rates in **bpm** (integer).
- Empty cell = no data for that field (don't write `0`).

---

## `activities.csv` — one row per run (rolling training log)

| column | meaning |
|--------|---------|
| `activity_id` | stable platform id; links to `splits/<date>-<activity_id>.csv` |
| `date` | run date |
| `type` | session type (Easy, Long, Threshold, MP, VO2max, Reps, Recovery, Race) |
| `distance` | km |
| `duration` | moving/elapsed time |
| `avg_pace` | min/km |
| `avg_hr` | bpm |
| `max_hr` | bpm |
| `elevation` | total ascent, metres |
| `rpe` | athlete's effort 1–10 (subjective, per-run) |
| `notes` | one-line feel / context |

## `wellness.csv` — daily recovery (drives §8 back-off rules)

| column | meaning |
|--------|---------|
| `date` | day |
| `sleep_h` | hours slept (decimal) |
| `hrv` | overnight HRV (ms) |
| `rest_hr` | resting HR (bpm) — **source of truth lives here** |
| `body_battery` | Garmin Body Battery / readiness (0–100) |
| `soreness` | subjective 1–5 |
| `mood` | subjective 1–5 |

## `fitness.csv` — derived trajectory (drives pace/goal decisions)

Append a row only when RUNALYZE **recomputes** these markers — not every day.

| column | meaning |
|--------|---------|
| `date` | snapshot date |
| `vo2max` | RUNALYZE Effective VO2max |
| `marathon_shape` | Marathon Shape % |
| `prognosis_marathon` | predicted marathon time `HH:MM:SS` |
| `prognosis_half` | predicted half time `HH:MM:SS` |
| `ctl` | Fitness (chronic training load) |
| `atl` | Fatigue (acute training load) |
| `tsb` | Form (training stress balance) |
| `threshold_pace` | derived LT pace, min/km |
| `threshold_hr` | derived LT HR, bpm |

## `splits/<date>-<activity_id>.csv` — per-lap detail (quality sessions only)

One file per quality workout; see `splits/_TEMPLATE.csv` for the header.

| column | meaning |
|--------|---------|
| `lap` | lap/rep number |
| `distance` | km |
| `duration` | lap time |
| `avg_pace` | min/km |
| `avg_hr` | bpm |
| `max_hr` | bpm |
