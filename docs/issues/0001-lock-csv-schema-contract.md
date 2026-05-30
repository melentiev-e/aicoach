# Lock CSV schema contract

**Type:** HITL
**Source:** ADR-0001
**Blocked by:** None - can start immediately

## What to build

Pin down the CSV schemas that are the contract between the fetcher and the skills:
`activities.csv`, `wellness.csv`, `fitness.csv`, and `splits/<date>-<id>.csv`. This is
the foundational decision — every downstream fetcher and every skill reads against
these columns, so changing one later means touching both sides.

Columns must cover what CLAUDE.md §4/§6 already assume (e.g. activities:
`date, type, distance, duration, avg_pace, avg_hr, max_hr, elevation, rpe, notes`;
wellness: sleep, HRV, resting HR, Body Battery, soreness, mood; fitness: dated
VO2max, Shape %, CTL/ATL/TSB, threshold). Reconcile against the existing
`logs/README.md` and `logs/splits/_TEMPLATE.csv`.

## Acceptance criteria

- [x] Final column list documented for each of the 4 file types
- [x] Units, date format, and null/missing conventions specified
- [x] Reconciled with CLAUDE.md §4/§6 and existing `logs/` headers (no drift)
- [x] Subjective fields (RPE, feel) confirmed living on the activity row

## Resolution (2026-05-30)

Schema was already coherent across `logs/README.md`, the CSV headers, and CLAUDE.md
§4/§6. Locked the open calls in `logs/README.md`:

- `duration` = **moving time** (not elapsed); `avg_pace` derives from it.
- `type` is a **closed vocabulary** (8 values, exact case).
- **Idempotency key**: `activity_id` (activities/splits), `date` (wellness/fitness) —
  re-fetch replaces, never duplicates. Unblocks #0004.
- **Splits trigger**: written iff `type ∈ {Threshold, MP, VO2max, Reps, Race}`.
- Encoding pinned: UTF-8, comma, `\n`, exact header row.

Contract doc of record: `logs/README.md`. **Status: DONE.**

## Blocked by

None - can start immediately
