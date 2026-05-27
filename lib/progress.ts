import "server-only";
import { createClient } from "./supabase/server";
import type { World } from "./types";

interface ProgressRow {
  world: World;
  level: number;
  taps_used: number;
  best_taps_used: number;
}

export async function getCompletedLevels(world: World): Promise<Map<number, number>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Map();

  const { data, error } = await supabase
    .from("progress")
    .select("world,level,taps_used,best_taps_used")
    .eq("world", world);

  if (error || !data) {
    if (error) console.error("[progress] getCompletedLevels error:", error.message);
    return new Map();
  }

  const map = new Map<number, number>();
  for (const row of data as ProgressRow[]) {
    map.set(row.level, row.best_taps_used);
  }
  return map;
}

export async function getWorldClearedCount(world: World): Promise<number> {
  const m = await getCompletedLevels(world);
  return m.size;
}
