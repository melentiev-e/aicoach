---
name: daily-check
description: Use on-demand when the athlete reaches out after a workout with questions, doubts about execution/quality, or reports pain/fatigue requiring an in-week adjustment. Skipped if the run went as planned and the athlete has no questions.
---

# Daily check

An **optional, on-demand** situational review of a recent workout. It never edits the plan autonomously — it analyzes, reports, and proposes adjustments. The athlete must explicitly confirm any in-week schedule change.

> **Cadence note:** Skipped on regular days when the workout went according to plan, the athlete feels fine, and has no questions. Triggered only when the athlete reaches out with questions, doubts about session execution/quality, or reports pain/fatigue.

## Read first
- `AGENTS.md` (§6 Evaluation Framework, §7 Decision Rules).
- `athlete.md` (Current Pace & HR zones, injury history).
- `plan/current-week.md` (prescription for today and the remaining week).

## Interaction (focused & direct)
Ask only for missing subjective context:
1. **RPE (1–10)** and overall perceived effort.
2. **Tissue feel / pain (0–10):** Any localized calf, Achilles, shin, knee tightness or discomfort? Any sensation during or after running?

If the athlete already provided this context in their message, proceed immediately with the assessment without re-asking.

## Steps

1. **Retrieve the activity via API:**
   - Fetch the latest run from **Garmin API** (primary) or **Strava API** (`strava-activities` as fallback).
   - Retrieve total distance, moving time, average pace, average/max HR, lap-by-lap splits, and Garmin metrics: Aerobic & Anaerobic Training Effect (TE) and Workout Execution Score.
   - If available, review current Garmin recovery signals (morning RHR, HRV status, Body Battery).

2. **Match execution to prescription:**
   - Compare actual workout to today's entry in `plan/current-week.md`.
   - Check if target pace and target HR were adhered to. For quality workouts, inspect individual lap reps (did the athlete run too fast or drift above target HR?).

3. **Evaluate Pace-at-HR & aerobic efficiency:**
   - Check Pace-at-HR: was effort normal for this pace?
   - Look for cardiac drift / aerobic decoupling (>5% HR increase at steady pace).

4. **Screen for red flags (`AGENTS.md §7`):**
   - Elevated RHR or depressed HRV status.
   - Unusually high RPE for easy/recovery paces.
   - Any sharp, localized tendon or muscle discomfort, or any gait alteration (**immediate stop / rest**).

5. **Report & propose:**
   - Provide a concise assessment in **Ukrainian** leading with the bottom line:
     - How well the session met its physiological purpose.
     - Evaluation of Garmin Training Effect & Execution Score.
     - Tissue safety evaluation.
   - If red flags fire or accumulated fatigue is evident, **propose** a concrete in-week adjustment to `plan/current-week.md` (e.g. swapping a quality session for recovery or rest).
   - Do **not** modify `plan/current-week.md` proactively. Ask for the athlete's confirmation first.

6. **Apply confirmed adjustments:**
   - Once the athlete explicitly confirms the proposed change, update `plan/current-week.md`.
   - Immediately invoke `verify-week` to validate that the updated week remains consistent with `athlete.md`.

## May write
- `plan/current-week.md` — only an adjustment explicitly confirmed by the athlete, followed by mandatory `verify-week`.
