---
name: monthly-summary
description: Use monthly to produce a read-only narrative wrap-up of the calendar month — volume, intensity distribution, fitness and wellness trends, wins, and concerns. Never edits the plan. Trigger at month end or when the athlete wants a progress summary.
---

# Monthly summary

A read-only narrative progress review for the calendar month. It synthesizes execution trends and recovery patterns; it never edits the plan (any macrocycle or zone adjustments belong to `phase-review`).

## Read first
- `AGENTS.md` (§5 Training Methodology, §6 Evaluation Framework).
- `athlete.md` (Current Pace & HR zones, physiological baseline).
- Completed weekly reviews and activities for the target month.

## Athlete check-in (focused)
Ask for high-level monthly context if not already documented:
1. Overall monthly recovery feel, sleep quality, or life stress patterns.
2. Any niggles, injury concerns, or illnesses during the month.
3. Personal reflections, wins, or anxieties about progression.

## Steps

1. **Synthesize monthly activities:**
   - Retrieve the month's runs via **Garmin API** (primary) or **Strava API** (`strava-activities`).
   - Calculate total monthly distance, session count, long run progression, and consistency.

2. **Evaluate intensity distribution:**
   - Review time and mileage spent across zones (Easy/Recovery vs Threshold/MP/VO2max).
   - Check adherence to the ~80/20 intensity target.

3. **Assess physiological & aerobic trends:**
   - Evaluate Pace-at-HR progression across the month (has aerobic efficiency improved at easy/threshold paces?).
   - Review monthly resting HR and overnight HRV trends from Garmin.

4. **Identify wins & concerns:**
   - Highlight key developmental milestones (e.g. consistent volume, solid threshold reps, healthy tendons).
   - Flag emerging limiters or signs of accumulated fatigue/strain.

5. **Generate narrative review:**
   - Deliver an honest, structured narrative review in **Ukrainian**.
   - If the summary reveals a need to revise macrocycle targets or recalibrate pace zones, recommend initiating a `phase-review`.

## May write
- `reviews/YYYY-MM-summary.md` (optional report storage). Read-only with respect to training plans.
