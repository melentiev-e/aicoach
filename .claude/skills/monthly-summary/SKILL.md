---
name: monthly-summary
description: Use monthly to produce a read-only narrative wrap-up of the calendar month — volume, intensity distribution, fitness and wellness trends, wins, and concerns. Never edits the plan. Trigger at month end or when the athlete wants a progress summary.
---

# Monthly summary

A read-only progress narrative for the calendar month. It reports; it never decides or
edits the plan (that is `phase-review`).

## Read first
- `CLAUDE.md` §9 (what to track).
- The month's rows of `logs/activities.csv` (+ relevant `logs/splits/`),
  `logs/wellness.csv`, `logs/fitness.csv`.
- The month's `reviews/` files for context on what happened and why.

## Steps

1. **Volume & consistency.** Monthly distance, sessions, long-run progression, sessions
   completed vs planned, disruptions.

2. **Intensity.** Distribution across zones, key workout paces hit, MP-work progress.

3. **Physiological trends.** Pace-at-HR over the month, resting HR / HRV trend, and the
   `fitness.csv` movement (VO2max, Shape, CTL/ATL/TSB, prognosis vs 2:39).

4. **Subjective & health.** RPE/fatigue/mood patterns, niggles, illness, sleep.

5. **Wins & concerns.** Lead with the honest headline: is the athlete trending toward
   the goal? Call out what's working and what to watch. Tie every claim to data.

6. **Write** `reviews/YYYY-MM-summary.md`. If the data suggests a plan change, *flag it*
   and recommend running `phase-review` — do not make the change here.

## May write
`reviews/YYYY-MM-summary.md` only. Read-only with respect to the plan.
