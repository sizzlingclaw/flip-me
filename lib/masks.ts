import { GRID_COLS, GRID_ROWS, HEX_COLS, HEX_ROWS } from "./types";

export type Mask = boolean[];

function maskFromGrid(grid: string[], rows: number, cols: number): Mask {
  if (grid.length !== rows) throw new Error(`mask rows mismatch: got ${grid.length}, want ${rows}`);
  const out: Mask = new Array(rows * cols).fill(false);
  for (let r = 0; r < rows; r++) {
    const row = grid[r].replace(/\s+/g, "");
    if (row.length !== cols) throw new Error(`mask cols mismatch on row ${r}: got ${row.length}, want ${cols}`);
    for (let c = 0; c < cols; c++) {
      out[r * cols + c] = row[c] === "X";
    }
  }
  return out;
}

export const TRIANGLE_MASKS_16: Mask[] = [
  maskFromGrid([
    "_XX_",
    "XXXX",
    "XXXX",
    "XXXX",
    "_XX_",
  ], GRID_ROWS, GRID_COLS),
  maskFromGrid([
    "XXXX",
    "_XXX",
    "XXXX",
    "XXX_",
    "_XX_",
  ], GRID_ROWS, GRID_COLS),
  maskFromGrid([
    "XXXX",
    "X__X",
    "XXXX",
    "X__X",
    "XXXX",
  ], GRID_ROWS, GRID_COLS),
];

export const HEX_MASKS_16: Mask[] = [
  maskFromGrid([
    "_XX_",
    "XXXX",
    "XXXX",
    "XXXX",
    "_XX_",
  ], HEX_ROWS, HEX_COLS),
  maskFromGrid([
    "XXXX",
    "_XXX",
    "XXXX",
    "XXX_",
    "_XX_",
  ], HEX_ROWS, HEX_COLS),
  maskFromGrid([
    "XXXX",
    "X__X",
    "XXXX",
    "X__X",
    "XXXX",
  ], HEX_ROWS, HEX_COLS),
];

for (const m of TRIANGLE_MASKS_16) {
  if (m.filter(Boolean).length !== 16) throw new Error("triangle mask must have 16 active");
}
for (const m of HEX_MASKS_16) {
  if (m.filter(Boolean).length !== 16) throw new Error("hex mask must have 16 active");
}

export function randomTriangleMask(rng: () => number = Math.random): Mask {
  return TRIANGLE_MASKS_16[Math.floor(rng() * TRIANGLE_MASKS_16.length)];
}

export function randomHexMask(rng: () => number = Math.random): Mask {
  return HEX_MASKS_16[Math.floor(rng() * HEX_MASKS_16.length)];
}

export const TUTORIAL_MASK_SINGLE: Mask = maskFromGrid([
  "____",
  "____",
  "_X__",
  "____",
  "____",
], GRID_ROWS, GRID_COLS);

export const TUTORIAL_MASK_ROW: Mask = maskFromGrid([
  "____",
  "____",
  "XXX_",
  "____",
  "____",
], GRID_ROWS, GRID_COLS);

export const TUTORIAL_MASK_DIAMOND: Mask = maskFromGrid([
  "_XX_",
  "_XX_",
  "XXXX",
  "_XX_",
  "_XX_",
], GRID_ROWS, GRID_COLS);
