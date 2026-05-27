import type { User } from "@supabase/supabase-js";

export function playerNameFromUser(user: User): string {
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const candidates = [
    meta?.full_name,
    meta?.name,
    meta?.given_name,
    user.email?.split("@")[0],
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) {
      const first = c.trim().split(/\s+/)[0];
      return first;
    }
  }
  return "Player";
}
