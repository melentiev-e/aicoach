---
name: monthly-summary
description: Use monthly to produce a read-only narrative wrap-up of the calendar month — volume, intensity distribution, fitness and wellness trends, wins, and concerns. Never edits the plan. Trigger at month end or when the athlete wants a progress summary.
---

# Monthly summary

A read-only progress narrative for the calendar month. It reports; it never decides or
edits the plan (that is `phase-review`).

## Read first
- `CLAUDE.md` §9 (what to track).
- All activity files in `logs/activities/` for the month.
- The month's `reviews/` files for context on what happened and why.

## Steps

1. **Identify the month's activities.** List files in `logs/activities/` and ask the
   athlete to confirm which ones belong to the month (with dates), if not already known
   from prior weekly reviews. Derive summaries from the lap data (§6).

2. **Volume & consistency.** Monthly distance (sum across all activities), session
   count, long-run progression, sessions completed vs planned, disruptions.

3. **Intensity.** Distribution across zones (from lap HR/pace data), key workout paces
   hit, MP-work progress.

4. **Physiological trends.** Pace-at-HR across the month — is aerobic efficiency
   improving? Ask the athlete for any RUNALYZE/Garmin fitness trend numbers if
   available (VO2max trend, CTL/ATL, prognosis vs 2:39).

5. **Subjective & health.** Ask the athlete for a brief wellness summary of the month:
   sleep, fatigue/mood patterns, niggles, illness. Use what was already shared in the
   weekly reviews.

6. **Wins & concerns.** Lead with the honest headline: is the athlete trending toward
   the goal? Call out what's working and what to watch. Tie every claim to data.

7. **Write** `reviews/YYYY-MM-summary.md`. If the data suggests a plan change, *flag
   it* and recommend running `phase-review` — do not make the change here.

## May write
`reviews/YYYY-MM-summary.md` only. Read-only with respect to the plan.
