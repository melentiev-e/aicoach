# `logs/` — data contract

The primary training log lives in `logs/activities/` as individual Garmin per-lap CSV
exports, one file per activity. The agent reads these files directly; there is no
aggregated CSV to maintain.

**Wellness and fitness markers** (sleep, HRV, resting HR, RUNALYZE snapshot,
CTL/ATL/TSB) are provided by the athlete in conversation, not stored on disk.

---

## `activities/` — Garmin per-lap CSV exports

### How to add an activity
1. Open Garmin Connect → the activity page.
2. Export as CSV (the "Splits" or "Laps" export that gives per-lap data).
3. Drop the file into `logs/activities/`. The filename as exported by Garmin
   (`activity_<id>.csv`) is fine — no renaming needed.

### File format

Garmin exports per-lap data with the following key columns (among others):

| Column | Meaning |
|--------|---------|
| `Laps` | Lap number |
| `Time` | Lap duration (MM:SS.S) |
| `Cumulative Time` | Elapsed time to end of lap (HH:MM:SS or MM:SS) |
| `Distance km` | Lap distance in kilometres |
| `Avg Pace min/km` | Average pace for the lap |
| `Avg GAP min/km` | Grade-adjusted pace |
| `Avg HR bpm` | Average heart rate |
| `Max HR bpm` | Max heart rate |
| `Total Ascent m` | Elevation gain for the lap |
| `Total Descent m` | Elevation loss for the lap |
| `Avg Run Cadence spm` | Steps per minute |
| `Avg Stride Length m` | Stride length |
| `Avg Vertical Oscillation cm` | Vertical oscillation |
| `Avg Ground Contact Time ms` | Ground contact time |

### Deriving the activity summary

The agent computes the following from the lap rows:

| Metric | How to compute |
|--------|---------------|
| Total distance | Sum of `Distance km` across all lap rows |
| Total time | `Cumulative Time` of the **last** lap row |
| Avg pace | Recalculate: total time ÷ total distance (more accurate than averaging laps) |
| Avg HR | Weighted average of `Avg HR bpm`, weighted by `Distance km` per lap |
| Max HR | Maximum value in the `Max HR bpm` column |
| Elevation gain | Sum of `Total Ascent m` |

For **quality sessions** (intervals, threshold, MP segments), the agent reads each
lap row individually to check whether reps held target pace and HR — not just the
summary.

### What the file does NOT contain

The following must be provided by the athlete in conversation:

- **Activity date** — say "this is Tuesday's run" or "activity_23398890306 = 2026-06-28"
- **Session type** — Easy, Threshold, Long, VO2max, Reps, Race, Recovery
- **RPE** — subjective effort 1–10
- **Notes** — feel, context, niggles, conditions
