# Raw payload dump to gitignored /data/raw/

**Type:** AFK
**Source:** ADR-0001
**Blocked by:** #0002

## What to build

Make the fetcher dump every raw API payload to `/data/raw/` before normalization, as
insurance — Garmin/Strava history cannot always be re-fetched. `/data/raw/` is
gitignored; the agent never reads it.

## Acceptance criteria

- [x] Raw response persisted to `/data/raw/` on each fetch, keyed by source + date/id
- [x] `/data/raw/` present in `.gitignore`
- [x] Dump happens before normalization (survives a normalize failure)
- [x] No agent skill reads from `/data/raw/`

## Resolution (2026-05-30)

- `raw.js` — `dumpRaw({ rawDir, source, key, payload })` writes
  `<rawDir>/<source>/<key>.json`, creating dirs; keyed on stable id/date so a
  re-fetch overwrites instead of piling up.
- Wired into `runStravaFetch`: every payload dumped **before** the normalize loop —
  proven by a test that feeds a payload which makes normalize throw and asserts the
  raw file exists anyway.
- `/data/raw/` already gitignored; no skill references it.

**Tests: 13/13 pass.** **Status: DONE.**

## Blocked by

- #0002 Fetcher skeleton
