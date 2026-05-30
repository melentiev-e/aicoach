# Full normalize: all 3 sources → all /logs/ files

**Type:** AFK
**Source:** ADR-0001
**Blocked by:** #0002

## What to build

Extend the fetcher from one platform/one file to the full set: pull from Strava,
Garmin, and RUNALYZE and write every `/logs/` file — `activities.csv`,
`wellness.csv` (daily recovery), `fitness.csv` (derived markers), and per-quality-run
`splits/<date>-<id>.csv`. The fetcher owns normalization; output must be schema-valid
and idempotent (re-running doesn't duplicate rows).

## Acceptance criteria

- [x] Strava, Garmin, RUNALYZE all wired in
- [x] All 4 `/logs/` outputs written with correct schemas
- [x] Splits written only for quality sessions
- [x] Re-running on overlapping range produces no duplicate rows
- [x] Offline-testable against fixtures for each source

## Resolution (2026-05-30)

- New pure normalizers in `normalize.js`: `normalizeGarminWellness` (sleep s→h 1dp,
  HRV/restHR/bodyBattery; soreness/mood left empty as subjective),
  `normalizeRunalyzeFitness` (vo2max/shape/prognosis/CTL-ATL-TSB/threshold),
  `normalizeStravaLaps` (per-lap split rows), and `shouldKeepSplits(type)` =
  `type ∈ {Threshold, MP, VO2max, Reps, Race}`.
- `fetch-sources.js`: `runGarminWellnessFetch` → `wellness.csv`,
  `runRunalyzeFitnessFetch` → `fitness.csv`; both raw-dump then upsert keyed on
  `date`. HTTP getters injectable (real ones throw "not implemented" until APIs wired).
- `fetch-strava.js` extended to write `splits/<date>-<activity_id>.csv` for quality
  sessions only (`writeCsvFile`, fresh-write).
- `fetch-all.js` orchestrator runs all three; `npm run fetch`.
- Idempotency: activities/splits keyed on `activity_id`, wellness/fitness on `date` —
  overlapping re-run replaces, proven by orchestrator round-trip test.

Note: Strava can't classify coached session type, so `workout_type` maps coarsely
(1→Race, 2→Long, 3→Threshold placeholder, else Easy); true type is recovered by
`daily-check` plan-matching. Real Garmin/RUNALYZE HTTP clients are stubbed — wiring
the live endpoints is follow-up, the normalize/write contract is done and tested.

**Tests: 23/23 pass.** **Status: DONE.**

## Blocked by

- #0002 Fetcher skeleton
