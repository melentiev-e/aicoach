---
name: verify-week
description: Mandatory check run immediately after any write to plan/current-week.md, regardless of which skill or reason caused the write. Confirms every session's pace/HR matches its labeled zone (esp. Easy vs Recovery), that target HR matches the athlete's zone bands, and that every session's distance and the weekly total are arithmetically correct. Trigger right after weekly-review commits a new week, or right after any confirmed in-week edit to current-week.md.
---

# Verify week

The guardrail on `current-week.md`. It never edits the plan itself — it reports
discrepancies and asks for confirmation before anyone applies a fix. This exists
because sessions have occasionally been labeled "Easy" while actually prescribed at
recovery pace/HR, and because composite session distances (warmup + reps + jog
recoveries + cooldown) don't always add up to the stated total.

## Read first
- `CLAUDE.md` §3 (athlete params), §5 (pace zone table — Easy, Recovery, MP, T, I, R).
- `plan/current-week.md` as it stands right after the write being verified.

## Interview only when prescription details are unclear

Follow the mechanical-check exception in
[CLAUDE.md §7.1](../../../CLAUDE.md#71-required-coaching-interview). Do not repeat
the coaching interview. If session intent, components or the applicable zone are
missing/conflicting and affect verification, ask a focused question and wait before
resolving that item or declaring a clean pass. Continue all unambiguous checks.
Do not substitute guessed intent; retain the existing discrepancy/fix-confirmation
workflow below.

## Checks

Run all three for every row in the weekly prescription table, then report all
findings together — don't stop at the first one.

1. **Type ↔ pace/HR match.** For each row, take its stated type (Easy, Recovery,
   Threshold, MP, VO2max, Reps, Hills, Long Run, Rest) and check whether the stated
   pace *and* HR both fall inside that zone's band from §5. Flag if:
   - The type says Easy but the pace/HR band given actually sits in Recovery's band
     (or vice versa) — this is the specific failure mode this skill exists to catch.
   - Pace and HR disagree about which zone the session is in (e.g. pace reads as
     Threshold but HR ceiling given is the Easy ceiling).

2. **HR ↔ athlete's zones.** The target HR range stated on each row must be a subset
   of (or equal to) that zone's HR band in §5 — not some other number that happens to
   be written in. If a row's HR guardrail doesn't trace back to a §5 band, flag it and
   name which band it should reference.

3. **Distance reconciliation.** For each row, recompute the session's total distance
   from its components:
   - Sum explicit distances (warmup, cooldown, rep distances × rep count).
   - For time-based segments (e.g. "3 min jog recovery" with no distance given),
     convert using the Recovery zone's pace band (§5) — use the midpoint of the
     range unless the row specifies otherwise.
   - Compare the recomputed total to the row's stated `distance`. Flag any mismatch
     beyond rounding (~0.5 km tolerance for a single session).
   Then sum all rows' (corrected) distances and compare to the stated Weekly Total
   line. Flag any mismatch.

## On discrepancy

Do not edit `current-week.md`. Present a report: for each finding, the row/line, what
is wrong, and the specific corrected value. Ask the athlete to confirm each fix (or
confirm all at once). Only once confirmed does the calling context (whichever skill
triggered this check) apply the edit — and that edit does not need a second
`verify-week` pass unless something beyond the confirmed fields also changed.

## On clean pass

Say so briefly — no need for a verbose report when everything checks out.

## May write
Nothing. Verification and reporting only.
