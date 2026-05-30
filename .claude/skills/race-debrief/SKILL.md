---
name: race-debrief
description: Use after a race to produce an honest post-race analysis — execution vs strategy, what the result says about fitness, fueling/pacing lessons, and what to carry into the next block. Trigger once the post-race activity has been fetched.
---

# Race debrief

Honest post-race analysis. The point is learning, not consolation — record what
actually happened so the next block is smarter.

## Read first
- `races/<race>-strategy.md` (what was planned).
- The race activity in `logs/activities.csv` + `logs/splits/<date>-<id>.csv`
  (per-segment splits and HR — essential here).
- `logs/wellness.csv` around race day, latest `logs/fitness.csv`.

## Steps

1. **Result vs goal.** Finishing time vs A/B/C goals and the pre-race prognosis.

2. **Execution vs strategy.** Segment-by-segment: did pacing hold? Where did it unravel
   and why? How did the last 10 km feel (§3 tracks this)? Read the splits, not just the
   finish time.

3. **Fueling & conditions.** Did the fuel/hydration plan work? Gut issues? How did
   weather affect execution?

4. **What it says about fitness.** Does the result confirm, beat, or contradict the
   current trajectory toward 2:39? Be honest — this may feed a `phase-review` and a
   goal re-judgement.

5. **Lessons → next block.** Concrete carry-forwards (pacing discipline, fueling tweaks,
   workout gaps exposed).

6. **Write** `races/<race>-debrief.md`. If the result warrants a plan or goal change,
   flag it and recommend `phase-review`.

## May write
`races/<race>-debrief.md`.
