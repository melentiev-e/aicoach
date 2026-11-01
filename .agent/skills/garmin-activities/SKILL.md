---
name: garmin-activities
description: Primary data retrieval skill to fetch running activities and daily health/recovery metrics (RHR, overnight HRV, sleep score, Garmin Training Effect, and Workout Execution Score) from Garmin Connect Personal API. Read-only.
---

# Retrieve Garmin activities & health metrics

The primary data ingestion skill for the coaching loop. Directly interfaces with the [Garmin Connect Personal API](https://developer.garmin.com/gc-developer-program/personal/swagger-docs/) to retrieve activity logs and daily recovery indicators.

Read `GARMIN_API_KEY` from `.env` in memory. Refer to [garmin-auth](../garmin-auth/SKILL.md) if authentication setup or key validation is needed. Pass the key in headers (`Authorization: Bearer <GARMIN_API_KEY>` or API key header per Garmin Personal API specification).

## Date window & parameters

1. **Establish the query window:**
   - Define start and end timestamps as Unix epoch seconds in UTC.
   - For weekly reviews: the target Monday 00:00:00 to Sunday 23:59:59 (Europe/Kyiv by default).
   - For daily checks: the target day or last 24–48 hours.
   - For monthly summaries: the calendar month.

2. **Endpoints to query:**
   - **Activities:** `GET /activities` (or `GET /activityDetails`) with `uploadStartTimeInSeconds` and `uploadEndTimeInSeconds`.
   - **Daily Health / RHR:** `GET /dailies` for daily resting heart rate and stress summaries.
   - **Sleep & Recovery:** `GET /sleeps` for sleep duration and sleep quality scores (`overallSleepScore`).
   - **HRV Status:** `GET /hrv` for overnight HRV averages, baseline comparison, and balance status.

## Data extraction

### 1. Activity data (Runs)
Filter for running activities (`activityType == RUNNING`):
- **Distance:** Convert meters to km (`distanceInMeters / 1000`).
- **Duration:** Moving duration vs total elapsed seconds.
- **Pace:** Calculate average moving pace (`min/km`).
- **Heart Rate:** Average HR and maximum HR observed.
- **Elevation:** Total ascent in meters.
- **Garmin Quality Metrics:**
  - **Aerobic Training Effect (TE):** 0.0 to 5.0 scale.
  - **Anaerobic Training Effect (TE):** 0.0 to 5.0 scale.
  - **Workout Execution Score:** Percentage (0–100%) indicating how well prescribed workout targets were held.
- **Laps / Splits:** Extract per-lap distances, paces, and average HR for interval, threshold, and marathon-pace segments.

### 2. Daily Health & Recovery data
- **Morning Resting HR (RHR):** Compare daily RHR to the multi-week baseline.
- **Overnight HRV:** Average overnight HRV (ms) and status (Balanced, Unbalanced, Low).
- **Sleep Quality:** Sleep duration and sleep score (0–100).
- **Body Battery & Stress:** Morning charge and daily stress levels.

## Evidence persistence

Store raw JSON responses in the gitignored directory:
`data/raw/garmin/YYYY-MM-DD_<type>.json`
Maintain an ignored manifest of retrieved dates to avoid duplicate calls.

## Error handling & Fallback

- **Auth failure (401/403):** Call `garmin-auth` to refresh tokens or verify `.env` credentials.
- **Rate limiting (429):** Back off and respect retry headers.
- **Temporary unavailability / Service outage:**
  - Inform the calling skill (`weekly-review` or `daily-check`).
  - Seamlessly fall back to [strava-activities](../strava-activities/SKILL.md) for activity data, and ask the athlete for subjective recovery metrics in conversation.

## Return usable evidence

Pass structured summary to the calling coaching skill (`daily-check`, `weekly-review`, `phase-review`, or `race-debrief`):
- Date and session title/type.
- Total distance, moving time, average pace, average and max HR.
- Garmin Aerobic & Anaerobic TE and Execution Score.
- Lap breakdowns for quality segments.
- Recent 7-day RHR and HRV status trends.

Reference: [Garmin Developer Program Personal API Docs](https://developer.garmin.com/gc-developer-program/personal/swagger-docs/).

