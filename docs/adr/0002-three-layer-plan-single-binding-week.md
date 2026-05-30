# Plan is three layers; only the current week is binding

The training plan exists at three granularities: a coarse `master-plan.md` (the
periodized arc), a *provisional* detailed `calendar-<span>.md` for looking ahead,
and a single binding `current-week.md`. Only `current-week.md` is authoritative for
"what do I run today" — `daily-check` matches activities against it and nothing else.
The detailed calendar is always a draft; only `weekly-review` promotes the upcoming
week into `current-week.md`, re-checking it against the latest fitness and wellness
first.

We chose this over making a generated month-long calendar binding because detailed
day-by-day prescriptions go stale fast as fitness and recovery shift week to week —
committing a month in advance just means rewriting it. Keeping a single binding week
guarantees there are never two conflicting answers to "what's my session," while the
provisional calendar still lets the athlete see the road ahead.

## Consequences

- Skills have a clear write split (see CONTEXT.md §12): `phase-review` owns the arc,
  `build-calendar` owns drafts, `weekly-review` alone commits the binding week, and
  `daily-check` only proposes — it never mutates the plan.
