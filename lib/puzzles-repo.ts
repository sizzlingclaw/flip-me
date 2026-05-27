import "server-only";
import { createClient } from "./supabase/server";
import { puzzleFromRow } from "./puzzle";
import { hexPuzzleFromRow } from "./puzzle-hex";
import type { Color, Puzzle, World } from "./types";

interface PuzzleRow {
  world: World;
  level: number;
  active_mask: boolean[];
  start_state: string[];
  taps_target: number;
}

export async function getLevelPuzzle(world: World, level: number): Promise<Puzzle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("puzzles")
    .select("world,level,active_mask,start_state,taps_target")
    .eq("world", world)
    .eq("level", level)
    .maybeSingle<PuzzleRow>();

  if (error || !data) return null;

  const startState = data.start_state.map((s) => (s === "red" ? "red" : "green")) as Color[];
  if (world === "tron") {
    return puzzleFromRow(data.active_mask, startState, data.taps_target);
  }
  return hexPuzzleFromRow(data.active_mask, startState, data.taps_target);
}
