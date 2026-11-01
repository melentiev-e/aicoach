---
name: race-debrief
description: Use after a race to produce an honest post-race analysis — execution vs strategy, what the result says about fitness, fueling/pacing lessons, and what to carry into the next block. Trigger once the athlete drops the race activity CSV.
---

# Race debrief

An honest, analytical post-race debrief. The primary focus is objective learning to ensure subsequent training blocks are smarter and more targeted.

## Read first
- `races/<race>-strategy.md` (the tactical plan prepared prior to the race).
- `athlete.md` (race history and current pace zones).
- Race activity data retrieved via **Garmin API** (or **Strava API**).

## Athlete interview (focused)
Ask for immediate subjective impressions:
1. **Perceived effort & pacing breakdown:** Where did the race feel controlled, and where did it become difficult? How did the final 10 km unfold?
2. **Fueling & GI execution:** Did carb and fluid intake go according to plan? Any gastrointestinal distress?
3. **Physical & musculoskeletal status:** Any cramps, acute joint/tendon pain, or blisters?
4. **External conditions:** How did real-world weather or pack dynamics affect pacing?

## Steps

1. **Retrieve and analyze race activity data:**
   - Fetch official race activity from **Garmin API** (primary) or **Strava API** (`strava-activities`).
   - Analyze overall time, average pace, average/max HR, and lap/5k split pacing consistency.
   - Look closely at segment pacing (e.g. first half vs second half split; kilometers 32–42 pace drop-off).

2. **Evaluate execution vs strategy:**
   - Compare actual splits against the pre-race pacing plan in `races/<race>-strategy.md`.
   - Identify whether early discipline was maintained or if aggressive opening miles led to late deceleration.

3. **Evaluate fueling & environment:**
   - Cross-reference energy levels with actual carb/fluid consumption reported by the athlete.

4. **Derive fitness insights:**
   - What does this result prove about current aerobic capacity, lactate threshold, and marathon-specific endurance?
   - Compare outcome against existing anchors in `athlete.md`.

5. **Formulate concrete takeaways:**
   - Define 2–3 actionable lessons for the next training cycle (e.g., pacing discipline, fueling adjustments, or specific aerobic build needs).
   - If performance materially shifted fitness markers, recommend running `phase-review` to update `athlete.md` and `plan/master-plan.md`.

## Communication
- Provide a supportive, direct, and evidence-grounded debrief in **Ukrainian**.

## May write
- `races/<race>-debrief.md`
