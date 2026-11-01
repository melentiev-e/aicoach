---
name: weekly-review
description: Use weekly (the core coaching loop) to review the whole week's execution vs plan, evaluate Garmin quality & recovery metrics, check tissue status, and commit the next binding plan/current-week.md. Trigger on Sunday evening or Monday morning when reviewing the week.
---

# Weekly review

The core coaching loop. The only skill that **commits** the binding `plan/current-week.md`.

## Read first
- `AGENTS.md` (§5 Methodology, §6 Evaluation Framework, §7 Decision Rules, §8 Workflow).
- `athlete.md` (Current Pace & HR zones, physiological baseline, injury history).
- `plan/current-week.md` (what was prescribed for the active week).
- `plan/master-plan.md` (current phase, volume band, macrocycle targets).
- `plan/calendar-*.md` (if a provisional draft exists for the upcoming week).

## Athlete check-in (focused & concise)
Do not send bureaucratic forms. If the athlete hasn't already provided subjective context, ask 1–2 direct questions:
1. **Tissue status & leg feel:** Any localized soreness, calf/Achilles/shin tightness (0–10 scale)?
2. **Overall fatigue & life context:** Fatigue levels, work stress, travel, or sleep disruptions?

Wait for the athlete's input on these questions before finalizing next week's prescription. Data fetching and preliminary calculations may proceed while waiting.

## Steps

1. **Retrieve the week's data:**
   - **Activities:** Fetch all runs completed during the week via **Garmin API** (primary) or **Strava API** (`strava-activities` as fallback). Capture distance, time, pace, average/max HR, and lap splits for quality segments.
   - **Health & Recovery:** Retrieve weekly trends for Resting HR (RHR), overnight HRV status, sleep score/quality, Body Battery, and Garmin training load.

2. **Evaluate Garmin workout quality:**
   - For quality and key sessions, evaluate Garmin Aerobic & Anaerobic Training Effect (TE) and Workout Execution Score.
   - Check lap execution for interval or threshold reps (did they hold pace within target HR bands?).

3. **Analyze Pace-at-HR & aerobic efficiency:**
   - Track Pace-at-HR trend against recent weeks (is the athlete running the same pace at a lower HR?).
   - Check for aerobic decoupling (cardiac drift >5% during steady-state runs with flat elevation/even pace).

4. **Screen readiness & red flags (`AGENTS.md §7`):**
   - Elevated RHR (>3–5 bpm above baseline) or depressed/unbalanced HRV.
   - Poor sleep stacked over 2+ consecutive nights.
   - Subjective RPE drifting up at easy paces.
   - Any tendon/joint pain or altered gait → triggers immediate load reduction or rest.

5. **Synthesize the week's assessment:**
   - Summarize execution vs plan (completed vs planned distance and key workouts).
   - Evaluate intensity distribution (~80% easy/recovery, ~20% quality).
   - Formulate a clear, direct coaching assessment in Ukrainian.

6. **Commit next week's prescription:**
   - Formulate the binding plan for next week in `plan/current-week.md`.
   - Use the standard date-keyed table format:
     `Date | Type | Distance | Target pace | Target HR | Purpose`
   - Include clear weekly ceiling, conditions, and purpose for every session. Ensure target paces and HR match `athlete.md`.

7. **Invoke `verify-week` (Mandatory):**
   - Run `verify-week` immediately after writing `plan/current-week.md`.
   - Do not consider the week committed until `verify-week` reports a clean pass (or any flagged discrepancies are resolved with the athlete).

## Communication
- Present findings and the plan in **Ukrainian**.
- Lead with the core assessment, follow with the data-backed rationale, and conclude with the clear weekly prescription.

## May write
- `plan/current-week.md`
- Optional summary/review notes if requested.
