import { neighbors, orientationOf } from "./grid";
import { solveGF2 } from "./gf2";
import { type Mask, randomTriangleMask } from "./masks";
import {
  DEFAULT_TAPS,
  type Color,
  GRID_COLS,
  GRID_SIZE,
  type Slot,
  type TrianglePuzzle,
} from "./types";

function indexOf(row: number, col: number): number {
  return row * GRID_COLS + col;
}

function rowColOf(index: number): { row: number; col: number } {
  return { row: Math.floor(index / GRID_COLS), col: index % GRID_COLS };
}

export function tapTargets(slotIndex: number, active: boolean[]): number[] {
  const { row, col } = rowColOf(slotIndex);
  if (!active[slotIndex]) return [];
  const out = [slotIndex];
  for (const nb of neighbors(row, col)) {
    const idx = indexOf(nb.row, nb.col);
    if (active[idx]) out.push(idx);
  }
  return out;
}

export function applyTap(colors: Color[], slotIndex: number, active: boolean[]): Color[] {
  const next = colors.slice();
  for (const t of tapTargets(slotIndex, active)) {
    next[t] = next[t] === "red" ? "green" : "red";
  }
  return next;
}

function buildTapMatrix(activeIndices: number[], active: boolean[]): number[] {
  const pos = new Map<number, number>();
  activeIndices.forEach((idx, i) => pos.set(idx, i));
  const n = activeIndices.length;
  const matrix = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    const targets = tapTargets(activeIndices[i], active);
    for (const t of targets) {
      const j = pos.get(t)!;
      matrix[j] |= 1 << i;
    }
  }
  return matrix;
}

export function minSolutionLength(colors: Color[], activeIndices: number[], active: boolean[]): number {
  const matrix = buildTapMatrix(activeIndices, active);
  let rhs = 0;
  activeIndices.forEach((idx, i) => {
    if (colors[idx] === "red") rhs |= 1 << i;
  });
  return solveGF2(matrix, rhs, activeIndices.length).minWeight;
}

export function generatePuzzle(
  rng: () => number = Math.random,
  options?: { targetTaps?: number; mask?: Mask },
): TrianglePuzzle {
  const target = options?.targetTaps ?? DEFAULT_TAPS;
  const explicitMask = options?.mask;

  for (let attempt = 0; attempt < 200; attempt++) {
    const mask = explicitMask ?? randomTriangleMask(rng);
    const active = mask.slice();
    const activeIndices: number[] = [];
    for (let i = 0; i < GRID_SIZE; i++) if (active[i]) activeIndices.push(i);
    if (activeIndices.length < target) continue;

    let colors: Color[] = new Array<Color>(GRID_SIZE).fill("green");
    const shuffled = activeIndices.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const picks = shuffled.slice(0, target);
    for (const idx of picks) colors = applyTap(colors, idx, active);

    const min = minSolutionLength(colors, activeIndices, active);
    if (min === target) {
      const slots: Slot[] = [];
      for (let i = 0; i < GRID_SIZE; i++) {
        const { row, col } = rowColOf(i);
        slots.push({
          row,
          col,
          index: i,
          orientation: orientationOf(row, col),
          active: active[i],
          color: active[i] ? colors[i] : "green",
        });
      }
      return { world: "tron", slots, targetTaps: target };
    }
  }

  throw new Error(`failed to generate triangle puzzle with target=${target} after 200 attempts`);
}

export function puzzleFromRow(active_mask: boolean[], start_state: Color[], targetTaps: number): TrianglePuzzle {
  const slots: Slot[] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const { row, col } = rowColOf(i);
    slots.push({
      row,
      col,
      index: i,
      orientation: orientationOf(row, col),
      active: active_mask[i],
      color: active_mask[i] ? start_state[i] : "green",
    });
  }
  return { world: "tron", slots, targetTaps };
}

export function isSolved(slots: Slot[]): boolean {
  return slots.every((s) => !s.active || s.color === "green");
}

export function tapSlot(slots: Slot[], slotIndex: number): { slots: Slot[]; flipped: number[] } {
  const active = slots.map((s) => s.active);
  const colors = slots.map((s) => s.color);
  const flipped = tapTargets(slotIndex, active);
  const next = applyTap(colors, slotIndex, active);
  return {
    slots: slots.map((s, i) => ({ ...s, color: next[i] })),
    flipped,
  };
}
