import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generatePuzzle } from "../lib/puzzle.ts";
import { generateHexPuzzle } from "../lib/puzzle-hex.ts";
import { DEFAULT_TAPS, LEVELS_PER_WORLD, type Color, type World } from "../lib/types.ts";

function seededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

interface Row {
  world: World;
  level: number;
  active_mask: boolean[];
  start_state: Color[];
  taps_target: number;
}

const rows: Row[] = [];

for (let level = 1; level <= LEVELS_PER_WORLD; level++) {
  const rng = seededRng(1000 + level);
  const p = generatePuzzle(rng, { targetTaps: DEFAULT_TAPS });
  rows.push({
    world: "tron",
    level,
    active_mask: p.slots.map((s) => s.active),
    start_state: p.slots.map((s) => (s.active ? s.color : "green")),
    taps_target: p.targetTaps,
  });
}

for (let level = 1; level <= LEVELS_PER_WORLD; level++) {
  const rng = seededRng(2000 + level);
  const p = generateHexPuzzle(rng, { targetTaps: DEFAULT_TAPS });
  rows.push({
    world: "honey",
    level,
    active_mask: p.cells.map((c) => c.active),
    start_state: p.cells.map((c) => (c.active ? c.color : "green")),
    taps_target: p.targetTaps,
  });
}

function pgBoolArray(arr: boolean[]): string {
  return `'{${arr.map((b) => (b ? "true" : "false")).join(",")}}'::boolean[]`;
}

function pgTextArray(arr: string[]): string {
  return `'{${arr.map((s) => `"${s}"`).join(",")}}'::text[]`;
}

const lines: string[] = [];
lines.push("delete from flip_me.puzzles;");
lines.push("");
for (const r of rows) {
  lines.push(
    `insert into flip_me.puzzles (world, level, active_mask, start_state, taps_target) values ` +
      `('${r.world}', ${r.level}, ${pgBoolArray(r.active_mask)}, ${pgTextArray(r.start_state)}, ${r.taps_target});`,
  );
}

const here = dirname(fileURLToPath(import.meta.url));
const outPath = join(here, "..", "supabase", "migrations", "0002_seed_puzzles.sql");
writeFileSync(outPath, lines.join("\n") + "\n");

console.log(`Wrote ${rows.length} puzzles to ${outPath}`);
