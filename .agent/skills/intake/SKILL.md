---
name: intake
description: Use ONCE at the start of the coaching relationship to set up the athlete profile, derive pace zones, judge whether the goal is realistic, and build the first plan. Trigger when the project is new or the athlete has never been profiled.
---

# Intake

The initial onboarding skill. Run once at the beginning of the coaching relationship to establish the athlete profile, derive pace zones, calibrate goals, and generate the initial training plans.

## Read first
- `AGENTS.md` (Role, Coaching Philosophy, Architecture, and Methodology).

## Athlete intake interview
Conduct a conversational, structured intake covering:
1. **Goals & timeline:** Target race, distance, target time, and date.
2. **Race history & PBs:** Recent and lifetime PBs (5k, 10k, HM, Marathon), including pacing feel and race conditions.
3. **Current training & volume:** Average weekly mileage over the last 4–12 weeks, longest recent runs, session types, and consistency.
4. **Physiological baselines:** Observed max HR, baseline resting HR, typical HRV, and any known Garmin/Runalyze VO2max or LT estimates.
5. **Injury & durability profile:** Previous running injuries, current muscle or tendon vulnerabilities (calves, Achilles, knees, shins).
6. **Logistics & preferences:** Available running days per week, preferred long run day, terrain, and cross-training habits.
7. **Fueling & gear:** Experience with gels/hydration during long runs, GI tolerance.

## Steps

1. **Populate `athlete.md`:**
   - Create or update the complete profile in **`athlete.md`** (Identity, Running History, Physiology, Constraints, and Coaching Notes).
   - This file serves as the permanent single source of truth for the athlete's parameters.

2. **Conduct an honest goal evaluation:**
   - Assess current fitness vs the goal time using equivalent race performances and aerobic endurance indicators.
   - If the goal is overly aggressive for the timeline, state this honestly and propose a calibrated target or multi-cycle progression.

3. **Derive initial pace & HR zones:**
   - Derive the six core training zones (Easy, Recovery, Marathon Pace, Threshold, VO2max, Reps) from current fitness markers.
   - Record these in the `Current Pace & Heart Rate Zones` table within **`athlete.md`**.

4. **Construct the macrocycle roadmap:**
   - Draft `plan/master-plan.md` detailing the periodization phases (Base, Strength/Hills, Specific, Taper) up to race day, with volume bands gated by tissue durability.

5. **Commit the first training week:**
   - Create the initial binding prescription in `plan/current-week.md`.
   - Run `verify-week` to ensure zone consistency and distance arithmetic.

6. **Establish API data flow:**
   - Explain the data retrieval process: training and recovery data flow automatically via **Garmin API** (primary) and **Strava API** (auxiliary via `strava-auth`).
   - Remind the athlete that subjective inputs (RPE, tendon/muscle feel 0–10, life context) are simply shared in conversation. No manual CSV exports are required.

## Communication
- Conduct the intake and deliver all initial plans in **Ukrainian**.

## May write
- `athlete.md`
- `plan/master-plan.md`
- `plan/current-week.md`
