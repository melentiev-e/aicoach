# Fetcher skeleton: one platform → one normalized row

**Type:** AFK
**Source:** ADR-0001
**Blocked by:** #0001

## What to build

A minimal standalone Node.js fetcher in `/scripts/` that connects to a single
platform (Strava is the simplest start), pulls one activity, normalizes it to the
locked schema, and appends a clean row to `logs/activities.csv`. Tracer bullet: thin
end-to-end path proving auth → fetch → normalize → write, without touching the agent.

Secrets live with the fetcher (env/config), never in the agent's reach. The agent
contract is unchanged — it only reads what is already on disk.

## Acceptance criteria

- [x] `/scripts/` runnable fetcher that authenticates to one platform
- [x] Fetches at least one activity and writes a schema-valid row to `activities.csv`
- [x] Secrets read from env/config, not committed
- [x] Offline-testable against a fixture payload
- [x] Agent code unchanged (still file-read only)

## Resolution (2026-05-30)

Built the Strava tracer in `/scripts/` (Node 24, zero deps, `node:test`), TDD:

- `normalize.js` — pure `normalizeStravaActivity`: m→km (2dp), m/s→`MM:SS`/km,
  sec→`HH:MM:SS`, `start_date_local`→`YYYY-MM-DD`, `workout_type`→closed `type`
  vocab, missing HR/elev left empty (no zeros).
- `csv.js` — `upsertRowsByKey`: idempotent upsert keyed on `activity_id` (#0001
  contract); replaces matching key, appends new, preserves order + header.
- `fetch-strava.js` — thin shell: `httpGetActivities` (Bearer token from
  `STRAVA_ACCESS_TOKEN`) → normalize → upsert into `logs/activities.csv`.
  `getActivities` is injectable → end-to-end path tested offline against the fixture.
- Token from env only; `/scripts/.env` + `.env` already gitignored. Agent code
  untouched.

**Tests: 9/9 pass** (`cd scripts && npm test`). **Status: DONE.**

## Blocked by

- #0001 Lock CSV schema contract
