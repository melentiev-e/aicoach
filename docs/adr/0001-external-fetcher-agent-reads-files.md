# Data ingestion: an external script fetches, the agent only reads files

The coach agent must never reach the network. A standalone Node.js fetcher
(run on a schedule, outside the agent) pulls from Strava/Garmin/RUNALYZE,
normalises the data, and writes clean files to disk. Every skill reads only
what is already on disk.

We chose this over giving the agent direct API access because it keeps the
"coach reads what's in front of it" model intact (CONTEXT.md §7), isolates
brittle, rate-limited, frequently-changing platform APIs and their secrets in
one replaceable place, and makes every skill deterministic and offline-testable
against fixture files. The cost is a second moving part (the fetcher) that the
athlete maintains and must run for fresh data to appear.

Note: this supersedes the literal wording of CONTEXT.md §7 ("you cannot pull
data automatically") — automation now exists, but it lives in the fetcher, not
the agent. The agent's contract is unchanged: it still only reads files.

## Consequences

- The fetcher owns normalisation. CSV schemas (`activities.csv`, `wellness.csv`,
  `fitness.csv`, `splits/`) are the contract between fetcher and skills; changing
  a schema means touching both sides.
- Raw API payloads are also dumped to a gitignored `/data/raw/` as insurance,
  since Garmin/Strava history cannot always be re-fetched.
