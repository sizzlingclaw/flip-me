import { HEX_COLS, HEX_ROWS } from "./types";

export const HEX_S = 1;
export const HEX_W = HEX_S * Math.sqrt(3);
export const HEX_H = HEX_S * 2;
export const HEX_VS = HEX_H * 0.75;

export const HEX_VIEW_W = HEX_COLS * HEX_W + HEX_W / 2;
export const HEX_VIEW_H = HEX_ROWS * HEX_VS + HEX_S * 0.5;

const HEX_NEIGHBORS_EVEN: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [-1, -1],
  [0, 1],
  [-1, 1],
];

const HEX_NEIGHBORS_ODD: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [1, -1],
  [0, -1],
  [1, 1],
  [0, 1],
];

export function hexIndex(row: number, col: number): number {
  return row * HEX_COLS + col;
}

export function hexRowCol(index: number): { row: number; col: number } {
  return { row: Math.floor(index / HEX_COLS), col: index % HEX_COLS };
}

export function hexInBounds(row: number, col: number): boolean {
  return row >= 0 && row < HEX_ROWS && col >= 0 && col < HEX_COLS;
}

export function hexNeighbors(row: number, col: number): Array<{ row: number; col: number }> {
  const deltas = row % 2 === 0 ? HEX_NEIGHBORS_EVEN : HEX_NEIGHBORS_ODD;
  const result: Array<{ row: number; col: number }> = [];
  for (const [dc, dr] of deltas) {
    const r = row + dr;
    const c = col + dc;
    if (hexInBounds(r, c)) result.push({ row: r, col: c });
  }
  return result;
}

export function hexCenter(row: number, col: number): { x: number; y: number } {
  const xOffset = row % 2 === 1 ? HEX_W / 2 : 0;
  return {
    x: col * HEX_W + xOffset + HEX_W / 2,
    y: row * HEX_VS + HEX_S,
  };
}

export function hexPoints(row: number, col: number): string {
  const { x: cx, y: cy } = hexCenter(row, col);
  const parts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = ((i * 60 - 90) * Math.PI) / 180;
    const px = cx + HEX_S * Math.cos(angle);
    const py = cy + HEX_S * Math.sin(angle);
    parts.push(`${px.toFixed(4)},${py.toFixed(4)}`);
  }
  return parts.join(" ");
}
