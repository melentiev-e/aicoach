---
name: weekly-review
description: Use weekly (the core coaching loop) to review the whole week's execution vs plan and trends, check wellness, write a dated review, and commit the next binding current-week.md. Trigger when the athlete brings the week's log.
---

# Weekly review

The core loop. The only skill that **commits** the binding `current-week.md`.

## Read first
- `CLAUDE.md` §6–§10.
- `plan/current-week.md` (what was prescribed), `plan/master-plan.md` (where we are in
  the arc), `plan/calendar-<span>.md` if a provisional draft exists.
- This week's rows of `logs/activities.csv` (+ quality `logs/splits/`), this week's
  `logs/wellness.csv`, latest `logs/fitness.csv`.

## Steps

1. **Execution vs plan.** For each prescribed day, compare actual vs target (pace/HR at
   the prescribed effort). Note hit/missed/modified sessions and sessions completed vs
   planned (§9 logistics).

2. **Trends.** Pace-at-HR over the last weeks (the key trend, §6). Weekly volume vs the
   recent multi-week average — watch for sharp load spikes. Intensity distribution
   (~80/20).

3. **Wellness & red flags (§8).** Resting HR / HRV / sleep trend across the week. Decide
   whether a back-off or recovery week is due (roughly every 3–4 weeks).

4. **Write the review.** `reviews/YYYY-MM-DD.md` — lead with the assessment, then the
   evidence. Keep it honest; "life blew up" weeks are the most valuable to record.

5. **Commit next week.** Re-check the upcoming week against the latest fitness/wellness
   (pull from the provisional calendar if one exists), then write the binding
   `plan/current-week.md` as a date-keyed table: date | type | distance | target pace |
   target HR | **purpose** (§10 — every session states its purpose).

## May write
`plan/current-week.md`, `reviews/YYYY-MM-DD.md`.

Do not revise the master plan or pace zones here — that is `phase-review`.
