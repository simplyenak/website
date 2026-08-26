#!/usr/bin/env node
/**
 * Sync WTM dishes FROM Payload CMS → src/data/dishes.ts (states array only).
 *
 * Payload is source of truth for dish fields: name, what, where, famousAt,
 * bestTime, halal, origin (origin-full line), state membership (`state|` line).
 * Local-only state attributes preserved: intro, cta, region, state order,
 * dish order within each state. New CMS-only slugs append at the end of their state.
 *
 * Only touches the `export const states: StateEntry[] = [ ... ];` block;
 * everything before and after it stays byte-identical.
 *
 * Run:  node --experimental-strip-types scripts/sync-dishes-from-payload.mjs
 * Fails loudly (exit 1, file untouched) on unreachable CMS or inconsistent data.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DISHES_TS = join(root, 'src/data/dishes.ts');

// --- env (own .env first, then sibling checker project's) ---
const envPaths = [join(root, '.env'), join(root, '..', 'whatcanieatinmy', '.env')];
for (const p of envPaths) {
  try {
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
    break;
  } catch {}
}
const PAYLOAD_URL = (process.env.PAYLOAD_URL || '').replace(/\/+$/, '');
if (!PAYLOAD_URL || !process.env.PAYLOAD_ADMIN_API_KEY) {
  console.error('FAIL: PAYLOAD_URL / PAYLOAD_ADMIN_API_KEY missing');
  process.exit(1);
}
async function api(path) {
  const res = await fetch(`${PAYLOAD_URL}${path}`, {
    headers: { Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
  return res.json();
}

const HALAL_VALUES = new Set(['halal', 'pork-free', 'non-halal', 'varies']);

// --- local module: state shells (intro/cta/region/order) + current dish order ---
const localMod = await import(DISHES_TS);
const localStates = localMod.states;

// --- fetch WTM docs ---
const res = await api('/api/food_items?limit=500&depth=0&where[status][equals]=published');
const docs = res.docs.filter((d) => (d.vendorNotes || '').includes('wtm-dish:'));
if (!docs.length) { console.error('FAIL: no wtm-dish docs found in Payload'); process.exit(1); }

function parseNotes(vendorNotes) {
  const out = {};
  let inBlock = false;
  for (const line of String(vendorNotes).split('\n')) {
    if (line === 'wtm-dish:') { inBlock = true; continue; }
    if (!inBlock) continue;
    const idx = line.indexOf('|');
    if (idx === -1) continue;
    out[line.slice(0, idx)] = line.slice(idx + 1);
  }
  return out;
}

const dishesByState = new Map(); // stateId -> Map(slug -> dish)
const errors = [];
for (const d of docs) {
  const n = parseNotes(d.vendorNotes);
  for (const k of ['state', 'stateName', 'halal', 'where']) {
    if (!n[k]) errors.push(`${d.slug}: missing "${k}" in wtm-dish notes`);
  }
  if (n.halal && !HALAL_VALUES.has(n.halal)) errors.push(`${d.slug}: bad halal "${n.halal}"`);
  if (!n.state || !localStates.some((s) => s.id === n.state)) errors.push(`${d.slug}: unknown state "${n.state}"`);
  if (errors.length) continue;
  const dish = {
    id: d.slug,
    name: d.name,
    what: d.description,
    where: n.where,
    halal: n.halal,
  };
  if (n['origin-full']) dish.origin = n['origin-full'];
  if (n.famous) dish.famousAt = n.famous.split(' ;; ');
  if (n.best) dish.bestTime = n.best;
  if (!dishesByState.has(n.state)) dishesByState.set(n.state, new Map());
  dishesByState.get(n.state).set(d.slug, dish);
}
if (errors.length) {
  console.error(`FAIL: ${errors.length} data error(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

// --- change detection vs local ---
const localBySlug = new Map(localStates.flatMap((s) => s.dishes.map((d) => [d.id, d])));
let changed = 0, added = 0;
for (const [, map] of dishesByState) {
  for (const [slug, dish] of map) {
    const loc = localBySlug.get(slug);
    if (!loc) { added++; continue; }
    const norm = (x) => JSON.stringify(x ?? null);
    if (['name', 'what', 'where', 'halal'].some((k) => norm(loc[k]) !== norm(dish[k]))
      || norm(loc.origin ?? null) !== norm(dish.origin ?? null)
      || norm(loc.famousAt ?? null) !== norm(dish.famousAt ?? null)
      || norm(loc.bestTime ?? null) !== norm(dish.bestTime ?? null)) changed++;
  }
}

// --- regenerate states array (local state shells, CMS dish data) ---
const q = (v) => JSON.stringify(v);
function dishBlock(dish, indent) {
  const pad = ' '.repeat(indent);
  const lines = [`${pad}{`, `${pad}  id: ${q(dish.id)},`, `${pad}  name: ${q(dish.name)},`];
  if (dish.origin) lines.push(`${pad}  origin: ${q(dish.origin)},`);
  lines.push(`${pad}  what: ${q(dish.what)},`, `${pad}  where: ${q(dish.where)},`);
  if (dish.famousAt?.length) lines.push(`${pad}  famousAt: ${q(dish.famousAt)},`);
  if (dish.bestTime) lines.push(`${pad}  bestTime: ${q(dish.bestTime)},`);
  lines.push(`${pad}  halal: '${dish.halal}',`, `${pad}},`);
  return lines.join('\n');
}

const stateBlocks = localStates.map((s) => {
  const cmsMap = dishesByState.get(s.id) || new Map();
  // local order first; CMS data wins where a doc exists, local-only slugs
  // (e.g. checker-owned char-kway-teow/nasi-kandar) are preserved verbatim,
  // CMS-only slugs append at the end
  const ordered = [
    ...s.dishes.map((d) => (cmsMap.has(d.id) ? cmsMap.get(d.id) : d)),
    ...[...cmsMap.keys()].filter((slug) => !s.dishes.some((d) => d.id === slug)).map((slug) => cmsMap.get(slug)),
  ];
  const pad = '  ';
  const lines = [
    `${pad}{`,
    `${pad}  id: '${s.id}',`,
    `${pad}  name: ${q(s.name)},`,
    `${pad}  region: '${s.region}',`,
    `${pad}  intro: ${q(s.intro)},`,
  ];
  if (s.cta) lines.push(`${pad}  cta: { label: ${q(s.cta.label)}, url: ${q(s.cta.url)} },`);
  lines.push(`${pad}  dishes: [`);
  lines.push(...ordered.map((d) => dishBlock(d, pad + 4)));
  lines.push(`${pad}  ],`, `${pad}},`);
  return lines.join('\n');
});

const newArrayText = `export const states: StateEntry[] = [\n${stateBlocks.join('\n')}\n];\n`;

const src = readFileSync(DISHES_TS, 'utf8');
const marker = 'export const states: StateEntry[] = [';
const start = src.indexOf(marker);
if (start === -1) { console.error('FAIL: states array marker not found'); process.exit(1); }
const closeIdx = src.indexOf('\n];', start);
if (closeIdx === -1) { console.error('FAIL: states array closing not found'); process.exit(1); }
const next = src.slice(closeIdx + 3);

const totalDishes = [...dishesByState.values()].reduce((a, m) => a + m.size, 0);

// --- guard: generated source must parse before it may touch the file ---
const { execFileSync } = await import('node:child_process');
const tmpOut = join(root, '.sync-parse-check.mts');
writeFileSync(tmpOut, src.slice(0, start) + newArrayText.trimEnd() + '\n' + next.replace(/^\n/, ''));
try {
  // strip-types import throws a SyntaxError on invalid TS
  await import(tmpOut);
} catch (err) {
  console.error('FAIL: generated dishes.ts does not parse — file left untouched.\n' + err.message);
  const fs = await import('node:fs');
  fs.rmSync(tmpOut, { force: true });
  process.exit(1);
}
execFileSync(process.execPath, ['-e', 'require("fs").rmSync(process.argv[1], { force: true })', tmpOut]);

writeFileSync(DISHES_TS, src.slice(0, start) + newArrayText.trimEnd() + '\n' + next.replace(/^\n/, ''));
console.log(`Synced ${totalDishes} WTM dishes across ${dishesByState.size} states ← Payload (${changed} changed, ${added} new from CMS, ${docs.length} docs fetched)`);
