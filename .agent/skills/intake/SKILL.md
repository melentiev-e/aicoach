---
name: intake
description: Use ONCE at the start of the coaching relationship to set up the athlete profile, derive pace zones, judge whether the goal is realistic, and build the first plan. Trigger when the project is new or the athlete has never been profiled.
---

# Intake

First-run setup. Run this exactly once, when the project is new. After this, the
weekly loop takes over.

## Read first
- `CLAUDE.md` in full (your operating manual — role, methodology, decision rules).

## Steps

1. **Fill the athlete profile.** Interview the athlete and complete every `[FILL IN]`
   in `CLAUDE.md` §3, plus `athlete.md` (expanded profile + history). Do not invent
   values — ask. Convert any relative dates to absolute.

2. **Establish the current fitness snapshot.** Ask the athlete to provide a RUNALYZE
   snapshot (or paste their numbers): Effective VO2max, Marathon Shape %, race
   prognosis (M and HM), CTL/ATL/TSB, max/resting HR, threshold pace & HR. Also ask
   for Garmin VO2max and LT pace if available. Record these in `CLAUDE.md` §3.

3. **Judge the goal honestly.** Compare the RUNALYZE race prognosis + best recent race
   against the 2:39 target on the available timeline (§8 "adjust the goal"). If there's
   a large gap, say so plainly and propose a revised target or extended runway. Do not
   rubber-stamp 2:39.

4. **Derive pace zones** (`CLAUDE.md` §5) from the current fitness number. Fill the
   Easy/MP/Threshold/VO2max/Reps table. These become the reference for every
   prescription.

5. **Build the arc.** Write `plan/master-plan.md` — the periodized phases to race day
   (§5), with weekly volume bands gated by the athlete's durability (never jump the
   band to chase a number).

6. **Commit week one.** Hand off to `build-calendar` for a provisional first block,
   then commit `plan/current-week.md` (date-keyed table: date | type | distance |
   target pace | target HR | purpose).

7. **Confirm the data flow.** Explain to the athlete:
   - After each run: export the activity from Garmin Connect as a per-lap CSV and drop
     it into `logs/activities/`.
   - When triggering a daily-check or weekly-review: mention the activity filename(s),
     the date(s) they occurred, session type, RPE, and any wellness context (sleep, HRV,
     soreness). No CSV to fill — just tell the coach in conversation.

## May write
`athlete.md`, §3 + pace zones in `CLAUDE.md`, the first `plan/master-plan.md`.
