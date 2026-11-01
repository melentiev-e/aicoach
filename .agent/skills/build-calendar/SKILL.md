---
name: build-calendar
description: Use on demand to expand the master plan into a detailed, provisional day-by-day training calendar for a week or a month. Output is a DRAFT for looking ahead, never binding. Trigger when the athlete wants to see the road ahead.
---

# Build calendar

Expands the macrocycle roadmap in `plan/master-plan.md` into concrete, day-by-day sessions for a requested span (e.g., upcoming month or multi-week block).

> **Provisional status:** The resulting calendar is strictly a **provisional forward-looking draft**. It is never binding; only `weekly-review` commits the active week into `plan/current-week.md` based on real-time recovery.

## Read first
- `athlete.md` (Current Pace & HR Zones, preferences, and availability).
- `plan/master-plan.md` (Current phase, volume band, and workout focus).
- `AGENTS.md` (§3 Project Architecture, §5 Training Methodology).

## Athlete interview (focused)
Clarify scheduling constraints for the requested span:
1. **Target span:** Which weeks or month are being drafted?
2. **Logistical constraints:** Any planned travel, busy work days, or preferred days for long runs / rest days?

## Steps

1. **Review phase parameters:**
   - Check `plan/master-plan.md` for target weekly mileage bands and key session types for this phase.
   - Reference the active pace and HR zones defined in `athlete.md`.

2. **Draft the day-by-day schedule:**
   - Structure each week adhering to the ~80/20 intensity distribution.
   - Design sessions with date, type, planned distance, target pace, target HR, and purpose.
   - Incorporate a scheduled recovery week every 3–4 weeks.
   - Respect musculoskeletal durability: never inflate volume arbitrarily just to reach a round number.

3. **Output the provisional calendar:**
   - Save the draft to `plan/calendar-<span>.md` (e.g. `plan/calendar-2026-11.md`).
   - Add a clear header noting that dates and sessions are provisional drafts subject to weekly adaptation in `plan/current-week.md`.

## Communication
- Present a clear summary of the planned block in **Ukrainian**, highlighting phase objectives, volume trajectory, and key workout focus.

## May write
- `plan/calendar-<span>.md` only. Never `plan/current-week.md` or `plan/master-plan.md`.
