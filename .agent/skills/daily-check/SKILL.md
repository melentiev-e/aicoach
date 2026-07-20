---
name: daily-check
description: Use after the athlete drops a new Garmin activity CSV to read the latest run, match it against today's prescription, surface pace-at-HR and recovery red flags, and PROPOSE (never apply) an in-week adjustment. Trigger daily or whenever the athlete brings a new activity.
---

# Daily check

A lightweight situational read of the most recent activity. It never edits the plan —
it reports and proposes. Only `weekly-review` commits changes (athlete confirms any
in-week swap).

## Read first
- `CLAUDE.md` §6 (how to read Garmin CSV data), §8 (decision rules).
- `plan/current-week.md` (today's prescription).
- The newest file(s) in `logs/activities/` — identify the relevant one(s) by activity
  ID or by what the athlete mentions in conversation.

## Steps

1. **Identify the activity.** If the athlete hasn't said which file or which date,
   ask: "Which activity CSV is this, and what date/session type was it?" Do not guess
   the date from the filename.

2. **Derive the activity summary** (§6):
   - Total distance = sum of `Distance km` across all lap rows.
   - Total time = `Cumulative Time` of the last row.
   - Avg pace = recalculate from total distance / total time.
   - Avg HR = weighted average of `Avg HR bpm` (weighted by `Distance km`).
   - Max HR = max of `Max HR bpm`.
   - Elevation = sum of `Total Ascent m`.

3. **Match to prescription.** Find the prescribed session for the activity's date in
   `current-week.md`. Compare actual vs target distance, pace range, and HR range.
   For interval sessions, read lap-by-lap pace and HR to check each rep — not just
   the average.

4. **Read pace-at-HR.** Note effort vs. recent norms (same pace at lower HR =
   improving; drifting up = fatigue). This is the single most informative signal (§6).

5. **Ask for wellness context** if not provided: resting HR, HRV, sleep quality, Body
   Battery, soreness. One question, not a form — "how are you feeling / any flags?"

6. **Check red flags (§8).** Elevated resting HR, low HRV, stacked poor sleep, low
   Body Battery; RPE drifting up; any pain that alters gait; illness.

7. **Ask for RPE and notes** if not provided.

8. **Report + propose.** Lead with the assessment, tie it to the data. If a red flag
   fires, **propose** a specific in-week adjustment (e.g. "swap tomorrow's threshold
   for easy 8k") and ask the athlete to confirm. Do **not** edit `current-week.md`
   yourself. Be quicker to recommend rest than the athlete wants.

## May write
Nothing. Proposals only.
