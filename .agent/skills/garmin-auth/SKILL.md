---
name: garmin-auth
description: Authorize and manage credentials for Garmin Connect Personal API in the project-root .env. Use when Garmin API access needs initial setup, token refresh, or credential validation; does not retrieve activities or health data directly.
---

# Garmin authorization

Manages credentials and authentication tokens for the [Garmin Connect Personal API](https://developer.garmin.com/gc-developer-program/personal/swagger-docs/).

Read and persist credentials strictly in the gitignored project-root `.env`. Never output secret values into chat, command logs, markdown artifacts, or tracked files.

## Credential storage

The project `.env` stores the credentials required for Garmin API access:
- `GARMIN_API_KEY`: Primary API key / token used for authenticating requests to the Garmin Connect Personal API.
- Optional OAuth keys if configured: `GARMIN_CLIENT_ID`, `GARMIN_CLIENT_SECRET`, `GARMIN_ACCESS_TOKEN`, `GARMIN_EXPIRES_AT`.

Ensure `.env` remains gitignored and has permissions `0600`.

## Setup & Verification

1. **Check existing credentials:**
   - Verify the presence of `GARMIN_API_KEY` in memory without displaying its value.
   - If `GARMIN_API_KEY` is present and non-empty, use it for API requests.

2. **Initial setup guidance:**
   - If credentials are not configured, prompt the athlete to obtain their key from the [Garmin Developer Portal](https://developer.garmin.com/gc-developer-program/personal/swagger-docs/) and add it to `.env`:
     ```bash
     GARMIN_API_KEY=...
     ```

3. **Token refresh:**
   - If an OAuth 2.0 access token has an expiry (`GARMIN_EXPIRES_AT`) and has expired, refresh it according to Garmin's OAuth specification using the stored client credentials or refresh token.
   - Update `.env` atomically, preserving unrelated variables.

## Security & Error Handling

- Never log or print Authorization headers or raw token payloads.
- If an API request returns `401 Unauthorized` or `403 Forbidden`, report that Garmin API credentials need verification or renewal without echoing secret values.
- Once credentials are verified, return control to `garmin-activities`.

Reference: [Garmin Developer Program Personal API Docs](https://developer.garmin.com/gc-developer-program/personal/swagger-docs/).

