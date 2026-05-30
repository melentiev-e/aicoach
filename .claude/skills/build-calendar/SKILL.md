---
name: build-calendar
description: Use on demand to expand the master plan into a detailed, provisional day-by-day training calendar for a week or a month. Output is a DRAFT for looking ahead, never binding. Trigger when the athlete wants to see the road ahead.
---

# Build calendar

Expands the coarse arc into concrete sessions for a chosen span. The output is
**provisional** — a draft to look ahead and plan around. It is never binding; only
`weekly-review` commits a week into `current-week.md`.

## Read first
- `CLAUDE.md` §5 (methodology, pace zones), §10 (output conventions).
- `plan/master-plan.md` (the arc + current phase), pace zones in `CLAUDE.md`.
- Latest `logs/fitness.csv` and recent `logs/wellness.csv` for current readiness.

## Steps

1. **Ask the span** if not given: a week or a month (or a named training block).

2. **Expand the arc.** For each day in the span, lay out a concrete session consistent
   with the phase focus and volume band: day | type | distance | target pace | target
   HR | purpose. Respect ~80/20 intensity, recovery weeks every 3–4 weeks, the long-run
   day, and the athlete's weekly availability/constraints (§3).

3. **Stay within durability.** Don't exceed the master plan's volume band to chase a
   number. Mark recovery weeks explicitly.

4. **Write the draft** to `plan/calendar-<span>.md` (e.g. `calendar-2026-06.md`). State
   at the top that it is provisional and will be re-checked week by week before any week
   is committed.

## May write
`plan/calendar-<span>.md` only — provisional. Never `current-week.md` or `master-plan.md`.
