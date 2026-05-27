export type World = "tron" | "honey";

export type Color = "red" | "green";

export type Orientation = "up" | "down";

export interface Slot {
  row: number;
  col: number;
  index: number;
  orientation: Orientation;
  active: boolean;
  color: Color;
}

export interface HexSlot {
  row: number;
  col: number;
  index: number;
  active: boolean;
  color: Color;
}

export type Cell = Slot | HexSlot;

export interface TrianglePuzzle {
  world: "tron";
  slots: Slot[];
  targetTaps: number;
}

export interface HexPuzzle {
  world: "honey";
  cells: HexSlot[];
  targetTaps: number;
}

export type Puzzle = TrianglePuzzle | HexPuzzle;

export const GRID_ROWS = 5;
export const GRID_COLS = 4;
export const GRID_SIZE = GRID_ROWS * GRID_COLS;

export const HEX_ROWS = 5;
export const HEX_COLS = 4;
export const HEX_SIZE = HEX_ROWS * HEX_COLS;

export const DEFAULT_TAPS = 4;
export const DEFAULT_ACTIVE_COUNT = 16;
export const LEVELS_PER_WORLD = 20;

export interface LevelPuzzleRow {
  world: World;
  level: number;
  active_mask: boolean[];
  start_state: Color[];
  taps_target: number;
}
