---
name: daily-check
description: Use after a new activity has been fetched to read the latest run, match it against today's prescription, surface pace-at-HR and recovery red flags, and PROPOSE (never apply) an in-week adjustment. Trigger daily or whenever the athlete drops a new activity.
---

# Daily check

A lightweight situational read of the most recent activity. It never edits the plan —
it reports and proposes. Only `weekly-review` commits changes (athlete confirms any
in-week swap).

## Read first
- `CLAUDE.md` §6 (how to read the data), §8 (decision rules).
- `plan/current-week.md` (today's prescription).
- The newest row of `logs/activities.csv`; matching `logs/splits/<date>-<id>.csv` if
  the session was a quality workout; the newest `logs/wellness.csv` row.

## Steps

1. **Match to prescription.** Find the prescribed session for the activity's date in
   `current-week.md`. Compare actual vs target distance, pace range, and HR range. For
   interval sessions, read the splits file and check whether each rep held pace *at the
   prescribed effort/HR* — not just the average.

2. **Read pace-at-HR.** Note effort vs. recent norms (same pace at lower HR = improving;
   drifting up = fatigue). This is the single most informative signal (§6).

3. **Check red flags (§8).** Today's wellness: elevated resting HR, low HRV, stacked
   poor sleep, low Body Battery; RPE drifting up; any pain that alters gait; illness.

4. **Report + propose.** Lead with the assessment, tie it to the data. If a red flag
   fires, **propose** a specific in-week adjustment (e.g. "swap tomorrow's threshold for
   easy 8k") and ask the athlete to confirm. Do **not** edit `current-week.md` yourself.
   Be quicker to recommend rest than the athlete wants.

## May write
Nothing. Proposals only.
