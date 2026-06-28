---
name: weekly-review
description: Use weekly (the core coaching loop) to review the whole week's execution vs plan and trends, check wellness, write a dated review, and commit the next binding current-week.md. Trigger when the athlete brings the week's activities.
---

# Weekly review

The core loop. The only skill that **commits** the binding `current-week.md`.

## Read first
- `CLAUDE.md` §6–§10.
- `plan/current-week.md` (what was prescribed), `plan/master-plan.md` (where we are in
  the arc), `plan/calendar-<span>.md` if a provisional draft exists.
- All activity files in `logs/activities/` that belong to this week. If it is not
  clear which files are this week's, ask the athlete to list them (by filename or date).

## Steps

1. **Gather context.** Before diving into the data, ask (if not already provided):
   - Which activity files are this week's (and on which dates)?
   - Session types for each (Easy, Threshold, Long, etc.)?
   - Wellness summary: resting HR trend, HRV, sleep, soreness, mood?
   - Any RUNALYZE numbers if the athlete happened to check?

2. **Derive activity summaries.** For each activity file (§6):
   - Total distance = sum of `Distance km`.
   - Total time = `Cumulative Time` of last row.
   - Avg pace = recalculate from distance / time.
   - Avg HR = weighted average of `Avg HR bpm` (weighted by `Distance km`).
   - Max HR = max of `Max HR bpm`.
   - Elevation = sum of `Total Ascent m`.
   For quality sessions, also read lap-by-lap to check rep execution.

3. **Execution vs plan.** For each prescribed day, compare actual vs target (pace/HR
   at the prescribed effort). Note hit/missed/modified sessions and sessions completed
   vs planned (§9 logistics).

4. **Trends.** Pace-at-HR over the last weeks (the key trend, §6). Weekly volume vs
   the recent multi-week average — watch for sharp load spikes. Intensity distribution
   (~80/20).

5. **Wellness & red flags (§8).** Use the wellness context provided in conversation.
   Resting HR / HRV / sleep trend across the week. Decide whether a back-off or
   recovery week is due (roughly every 3–4 weeks).

6. **Write the review.** `reviews/YYYY-MM-DD.md` — lead with the assessment, then the
   evidence. Keep it honest; "life blew up" weeks are the most valuable to record.

7. **Commit next week.** Re-check the upcoming week against the latest fitness/wellness,
   pull from the provisional calendar if one exists, then write the binding
   `plan/current-week.md` as a date-keyed table:
   `date | type | distance | target pace | target HR | purpose` (§10 — every session
   states its purpose).

## May write
`plan/current-week.md`, `reviews/YYYY-MM-DD.md`.

Do not revise the master plan or pace zones here — that is `phase-review`.
