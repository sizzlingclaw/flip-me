import { GRID_COLS, GRID_ROWS, type Orientation } from "./types";

export const BASE = 2;
export const HEIGHT = BASE * Math.sqrt(3) / 2;

export const VIEW_W = (GRID_COLS - 1) * (BASE / 2) + BASE;
export const VIEW_H = GRID_ROWS * HEIGHT;

export function orientationOf(row: number, col: number): Orientation {
  return (row + col) % 2 === 0 ? "up" : "down";
}

export function indexOf(row: number, col: number): number {
  return row * GRID_COLS + col;
}

export function rowColOf(index: number): { row: number; col: number } {
  return { row: Math.floor(index / GRID_COLS), col: index % GRID_COLS };
}

export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS;
}

export function neighbors(row: number, col: number): Array<{ row: number; col: number }> {
  const result: Array<{ row: number; col: number }> = [];
  const orient = orientationOf(row, col);
  if (inBounds(row, col - 1)) result.push({ row, col: col - 1 });
  if (inBounds(row, col + 1)) result.push({ row, col: col + 1 });
  if (orient === "up" && inBounds(row + 1, col)) result.push({ row: row + 1, col });
  if (orient === "down" && inBounds(row - 1, col)) result.push({ row: row - 1, col });
  return result;
}

export function trianglePoints(row: number, col: number): string {
  const xLeft = col * (BASE / 2);
  const xRight = xLeft + BASE;
  const xMid = xLeft + BASE / 2;
  const yTop = row * HEIGHT;
  const yBot = yTop + HEIGHT;
  if (orientationOf(row, col) === "up") {
    return `${xLeft},${yBot} ${xRight},${yBot} ${xMid},${yTop}`;
  }
  return `${xLeft},${yTop} ${xRight},${yTop} ${xMid},${yBot}`;
}

export function triangleCentroid(row: number, col: number): { x: number; y: number } {
  const xLeft = col * (BASE / 2);
  const yTop = row * HEIGHT;
  return {
    x: xLeft + BASE / 2,
    y: yTop + (orientationOf(row, col) === "up" ? HEIGHT * 2 / 3 : HEIGHT / 3),
  };
}
