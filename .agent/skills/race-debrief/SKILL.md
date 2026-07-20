---
name: race-debrief
description: Use after a race to produce an honest post-race analysis — execution vs strategy, what the result says about fitness, fueling/pacing lessons, and what to carry into the next block. Trigger once the athlete drops the race activity CSV.
---

# Race debrief

Honest post-race analysis. The point is learning, not consolation — record what
actually happened so the next block is smarter.

## Read first
- `races/<race>-strategy.md` (what was planned).
- The race activity file in `logs/activities/` — read lap-by-lap pace and HR
  (per-segment splits are essential here).
- Ask the athlete for post-race wellness context: how legs felt, fueling execution,
  any GI issues, weather impact.

## Steps

1. **Identify the race file.** Ask the athlete which `activity_<id>.csv` is the race.
   Derive the activity summary (§6): total distance, total time, avg pace, avg HR,
   max HR, elevation. Then read lap-by-lap for the full execution picture.

2. **Result vs goal.** Finishing time vs A/B/C goals and the pre-race prognosis.

3. **Execution vs strategy.** Segment-by-segment: did pacing hold? Where did it
   unravel and why? How did the last 10 km feel (§3 tracks this)? Read the lap data,
   not just the finish time.

4. **Fueling & conditions.** Did the fuel/hydration plan work? Gut issues? How did
   weather affect execution? Use athlete's post-race report.

5. **What it says about fitness.** Does the result confirm, beat, or contradict the
   current trajectory toward 2:39? Be honest — this may feed a `phase-review` and a
   goal re-judgement.

6. **Lessons → next block.** Concrete carry-forwards (pacing discipline, fueling
   tweaks, workout gaps exposed).

7. **Write** `races/<race>-debrief.md`. If the result warrants a plan or goal change,
   flag it and recommend `phase-review`.

## May write
`races/<race>-debrief.md`.
