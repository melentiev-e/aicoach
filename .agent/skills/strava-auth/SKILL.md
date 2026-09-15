---
name: strava-auth
description: Authorize this project's Strava connection, exchange an OAuth code, refresh an expired access token, or resolve missing activity-read permission. Use when Strava access needs setup or repair; does not retrieve training history or change activities.
---

# Strava authorization

Use the project-root `.env`. Read credentials programmatically without printing
their values. Do not ask for secrets already configured or copy them into chat,
source code, command arguments, reports or tracked files. Use a standard-library
HTTP client to send form fields in memory; never execute `.env` as shell code.

## Required clarification

Reuse the current request and project context. Ask only for a missing app identity,
callback or access preference that affects authorization. No wellness interview
is needed for authentication. Wait for actual Strava consent or missing credentials;
do not treat opening the authorization page as granting permission.

## Existing connection first

1. Inspect presence of `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`,
   `STRAVA_ACCESS_TOKEN`, `STRAVA_REFRESH_TOKEN`, `STRAVA_EXPIRES_AT` and
   `STRAVA_SCOPE` without displaying values. The expiry is Unix seconds.
2. Reuse a valid token. If expired or about to expire, POST form data to
   `https://www.strava.com/oauth/token` with `grant_type=refresh_token`, client ID,
   client secret and refresh token. If expiry is unknown, try the requested read
   first; a missing-scope error must not trigger a refresh loop.
3. Validate a successful response has nonempty access/refresh tokens and a numeric
   expiry. Persist all returned tokens and expiry immediately, preserving unrelated
   `.env` entries and scope when the response omits it. Serialize refreshes; reread
   `.env` before each refresh so a previously rotated refresh token is not reused.
4. Write through an owner-only temporary file in the project root and atomically
   replace `.env` with mode 0600. Keep `.env` gitignored; never stage it. On a write
   failure, preserve any new token response in an owner-only ignored recovery file,
   report the storage failure without secrets and stop; do not discard rotated tokens.

## New grant or missing permission

- `activity:read` covers Everyone/Followers activities; `activity:read_all` also
  covers Only You activities. This project has authorized `activity:read_all` for
  complete reviews. Do not request write or profile permissions for activity retrieval.
- Build `https://www.strava.com/oauth/authorize` with URL-encoded `client_id`,
  `redirect_uri`, `response_type=code`, `approval_prompt=force`, requested `scope`
  and a fresh random `state`. Use the app's configured callback; the existing
  project flow uses `http://localhost/`. Keep the expected state locally until used.
- Open the URL with an available browser tool. The athlete signs in and grants
  access. If localhost has no listener, ask for the resulting redirect URL even
  if the page fails to load. Validate callback, matching state, absence of OAuth
  error and returned scope before exchanging the code. Do not log the full URL.
- POST to the token endpoint with `grant_type=authorization_code`, client ID,
  client secret and the one-use code. Save validated tokens as above and record
  the scope actually granted. Do not persist the consumed code as a reusable secret.
- If a client secret is missing, ask the athlete to put it in local `.env`, not
  chat. A rejected/expired code needs a fresh authorization; do not keep retrying it.

## Errors and boundaries

Report status and sanitized error fields, never the token response or request
headers. Missing `activity:read_permission` requires a new grant; refreshing cannot
add scope. Retry a failed activity request only once after a successful refresh.
Stop on a rejected refresh grant and obtain authorization again. Respect sandbox
network/browser approval requirements. Do not change account settings or activities.

May write `.env` and narrowly scoped ignored OAuth state/recovery files only.
Verify credentials are present, `.env` is ignored and mode 0600; report success
without secret values. Resume the calling retrieval skill after access is ready.

Reference: [Strava OAuth documentation](https://developers.strava.com/docs/authentication/).
