"use server";

import { createClient } from "@/lib/supabase/server";
import type { World } from "@/lib/types";

export async function recordCompletion(world: World, level: number, tapsUsed: number) {
  if (level < 1 || level > 20) return { ok: false };
  if (!Number.isFinite(tapsUsed)) return { ok: false };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data: existing } = await supabase
    .from("progress")
    .select("best_taps_used")
    .eq("world", world)
    .eq("level", level)
    .maybeSingle<{ best_taps_used: number }>();

  const newBest = existing ? Math.min(existing.best_taps_used, tapsUsed) : tapsUsed;
  const now = new Date().toISOString();

  const payload = {
    user_id: user.id,
    world,
    level,
    taps_used: tapsUsed,
    best_taps_used: newBest,
    last_completed_at: now,
    ...(existing ? {} : { first_completed_at: now }),
  };

  const { error } = await supabase.from("progress").upsert(payload, { onConflict: "user_id,world,level" });
  if (error) {
    console.error("[progress] recordCompletion error:", error.message);
    return { ok: false };
  }

  return { ok: true, newBest, isNewBest: !existing || tapsUsed < existing.best_taps_used };
}

export async function getProgressForWorld(world: World): Promise<Array<{ level: number; bestTapsUsed: number }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("progress")
    .select("level,best_taps_used")
    .eq("world", world);

  if (error || !data) return [];
  return (data as Array<{ level: number; best_taps_used: number }>).map((r) => ({
    level: r.level,
    bestTapsUsed: r.best_taps_used,
  }));
}
