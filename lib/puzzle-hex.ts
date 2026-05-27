import { solveGF2 } from "./gf2";
import { hexNeighbors } from "./hex";
import { type Mask, randomHexMask } from "./masks";
import {
  DEFAULT_TAPS,
  type Color,
  HEX_COLS,
  HEX_SIZE,
  type HexPuzzle,
  type HexSlot,
} from "./types";

function indexOf(row: number, col: number): number {
  return row * HEX_COLS + col;
}

function rowColOf(index: number): { row: number; col: number } {
  return { row: Math.floor(index / HEX_COLS), col: index % HEX_COLS };
}

export function hexTapTargets(slotIndex: number, active: boolean[]): number[] {
  const { row, col } = rowColOf(slotIndex);
  if (!active[slotIndex]) return [];
  const out = [slotIndex];
  for (const nb of hexNeighbors(row, col)) {
    const idx = indexOf(nb.row, nb.col);
    if (active[idx]) out.push(idx);
  }
  return out;
}

export function applyHexTap(colors: Color[], slotIndex: number, active: boolean[]): Color[] {
  const next = colors.slice();
  for (const t of hexTapTargets(slotIndex, active)) {
    next[t] = next[t] === "red" ? "green" : "red";
  }
  return next;
}

function buildHexTapMatrix(activeIndices: number[], active: boolean[]): number[] {
  const pos = new Map<number, number>();
  activeIndices.forEach((idx, i) => pos.set(idx, i));
  const n = activeIndices.length;
  const matrix = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    const targets = hexTapTargets(activeIndices[i], active);
    for (const t of targets) {
      const j = pos.get(t)!;
      matrix[j] |= 1 << i;
    }
  }
  return matrix;
}

export function hexMinSolutionLength(colors: Color[], activeIndices: number[], active: boolean[]): number {
  const matrix = buildHexTapMatrix(activeIndices, active);
  let rhs = 0;
  activeIndices.forEach((idx, i) => {
    if (colors[idx] === "red") rhs |= 1 << i;
  });
  return solveGF2(matrix, rhs, activeIndices.length).minWeight;
}

export function generateHexPuzzle(
  rng: () => number = Math.random,
  options?: { targetTaps?: number; mask?: Mask },
): HexPuzzle {
  const target = options?.targetTaps ?? DEFAULT_TAPS;
  const explicitMask = options?.mask;

  for (let attempt = 0; attempt < 200; attempt++) {
    const mask = explicitMask ?? randomHexMask(rng);
    const active = mask.slice();
    const activeIndices: number[] = [];
    for (let i = 0; i < HEX_SIZE; i++) if (active[i]) activeIndices.push(i);
    if (activeIndices.length < target) continue;

    let colors: Color[] = new Array<Color>(HEX_SIZE).fill("green");
    const shuffled = activeIndices.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const picks = shuffled.slice(0, target);
    for (const idx of picks) colors = applyHexTap(colors, idx, active);

    const min = hexMinSolutionLength(colors, activeIndices, active);
    if (min === target) {
      const cells: HexSlot[] = [];
      for (let i = 0; i < HEX_SIZE; i++) {
        const { row, col } = rowColOf(i);
        cells.push({
          row,
          col,
          index: i,
          active: active[i],
          color: active[i] ? colors[i] : "green",
        });
      }
      return { world: "honey", cells, targetTaps: target };
    }
  }

  throw new Error(`failed to generate hex puzzle with target=${target} after 200 attempts`);
}

export function hexPuzzleFromRow(active_mask: boolean[], start_state: Color[], targetTaps: number): HexPuzzle {
  const cells: HexSlot[] = [];
  for (let i = 0; i < HEX_SIZE; i++) {
    const { row, col } = rowColOf(i);
    cells.push({
      row,
      col,
      index: i,
      active: active_mask[i],
      color: active_mask[i] ? start_state[i] : "green",
    });
  }
  return { world: "honey", cells, targetTaps };
}

export function isHexSolved(cells: HexSlot[]): boolean {
  return cells.every((c) => !c.active || c.color === "green");
}

export function tapHexCell(cells: HexSlot[], slotIndex: number): { cells: HexSlot[]; flipped: number[] } {
  const active = cells.map((c) => c.active);
  const colors = cells.map((c) => c.color);
  const flipped = hexTapTargets(slotIndex, active);
  const next = applyHexTap(colors, slotIndex, active);
  return {
    cells: cells.map((c, i) => ({ ...c, color: next[i] })),
    flipped,
  };
}
