---
name: verify-week
description: Mandatory check run immediately after any write to plan/current-week.md, regardless of which skill or reason caused the write. Confirms every session's pace/HR matches its labeled zone (esp. Easy vs Recovery), that target HR matches the athlete's zone bands in athlete.md, and that every session's distance and the weekly total are arithmetically correct. Trigger right after weekly-review commits a new week, or right after any confirmed in-week edit to current-week.md.
---

# Verify week

The guardrail on `plan/current-week.md`. It never edits the plan itself — it reports discrepancies and asks for confirmation before anyone applies a fix. This exists because sessions have occasionally been labeled "Easy" while actually prescribed at recovery pace/HR, and because composite session distances (warmup + reps + jog recoveries + cooldown) don't always add up to the stated total.

## Read first
- `athlete.md` (Current Pace & Heart Rate Zones table).
- `AGENTS.md` (Operating Manual, Decision Rules, and Methodology).
- `plan/current-week.md` as it stands right after the write being verified.

## Interview only when prescription details are unclear
This is a mechanical check: run checks immediately. Do not start a general wellness interview or delay unambiguous checks. If session intent, components, or the applicable zone are missing or conflicting and affect verification, ask a single focused question to clarify. Continue all unambiguous checks.

## Checks

Run all three checks for every row in the weekly prescription table, then report all findings together:

1. **Type ↔ Pace/HR match:** For each row, take its stated type (Easy, Recovery, Threshold, MP, VO2max, Reps, Hills, Long Run, Rest) and verify that the stated pace *and* HR both fall within that zone's band defined in `athlete.md`. Flag if:
   - The type says "Easy" but the pace or HR band given actually sits in "Recovery" (or vice versa).
   - Pace and HR disagree about which zone the session is in (e.g. pace reads as Threshold, but HR ceiling is set to Easy).

2. **HR ↔ Athlete's zones:** The target HR range stated on each row must match (or be a valid subset of) the zone's HR band in `athlete.md` — not an arbitrary number. If a row's HR guardrail does not match `athlete.md`, flag it and specify the correct band.

3. **Distance reconciliation:** For each row, recompute the session's total distance from its individual components:
   - Sum explicit distances (warmup, cooldown, rep distance × rep count).
   - For time-based segments (e.g. "3 min jog recovery" with no distance given), convert using the Recovery zone's pace band in `athlete.md` (use the midpoint of the range unless specified otherwise).
   - Compare the recomputed total to the row's stated distance. Flag any mismatch greater than rounding tolerance (~0.5 km for a single session).
   - Sum all rows' (corrected) distances and compare to the stated Weekly Total line. Flag any mismatch.

## On discrepancy

Do not edit `plan/current-week.md` directly. Present a concise report in Ukrainian: for each finding, show the date/session, what is wrong, and the proposed correction. Ask the athlete to confirm each fix. Once confirmed, the calling skill applies the edit.

## On clean pass

State a concise confirmation in Ukrainian (e.g., "План на тиждень перевірено через `verify-week`: розрахунки та зони коректні.").

## May write
Nothing. Verification and reporting only.
