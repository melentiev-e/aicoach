// Minimal CSV upsert keyed on a column (idempotency contract, see logs/README.md).
// Re-fetching an existing key REPLACES its row; new keys append at the end.
// UTF-8, comma-separated, \n line endings, header row preserved verbatim.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

function parse(text) {
  const lines = text.replace(/\n$/, '').split('\n');
  const header = lines.shift();
  return { header, rows: lines.filter((l) => l.length > 0) };
}

function serializeRow(columns, row) {
  return columns.map((c) => row[c] ?? '').join(',');
}

function keyOf(line, columns, keyColumn) {
  const idx = columns.indexOf(keyColumn);
  return line.split(',')[idx];
}

// Write a CSV fresh (header + rows), creating parent dirs. Used for per-activity
// splits files, which are rewritten wholesale on each fetch (idempotent by nature).
export function writeCsvFile(path, columns, rows) {
  mkdirSync(dirname(path), { recursive: true });
  const header = columns.join(',');
  const body = rows.map((r) => columns.map((c) => r[c] ?? '').join(',')).join('\n');
  writeFileSync(path, rows.length ? `${header}\n${body}\n` : `${header}\n`);
}

export function upsertRowsByKey(path, columns, keyColumn, newRows) {
  const { header, rows } = parse(readFileSync(path, 'utf8'));

  const byKey = new Map(rows.map((line) => [keyOf(line, columns, keyColumn), line]));
  const order = rows.map((line) => keyOf(line, columns, keyColumn));

  for (const row of newRows) {
    const k = String(row[keyColumn]);
    if (!byKey.has(k)) order.push(k);
    byKey.set(k, serializeRow(columns, row));
  }

  const out = [header, ...order.map((k) => byKey.get(k))].join('\n') + '\n';
  writeFileSync(path, out);
}
