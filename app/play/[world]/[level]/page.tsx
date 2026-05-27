import { notFound, redirect } from "next/navigation";
import TronBoard from "@/components/TronBoard";
import HoneyBoard from "@/components/HoneyBoard";
import { createClient } from "@/lib/supabase/server";
import { getLevelPuzzle } from "@/lib/puzzles-repo";
import { LEVELS_PER_WORLD, type World } from "@/lib/types";
import { playerNameFromUser } from "@/lib/user";

export default async function PlayLevelPage({
  params,
}: {
  params: Promise<{ world: string; level: string }>;
}) {
  const { world: worldParam, level: levelParam } = await params;
  if (worldParam !== "tron" && worldParam !== "honey") notFound();
  const world = worldParam as World;
  const level = Number.parseInt(levelParam, 10);
  if (!Number.isInteger(level) || level < 1 || level > LEVELS_PER_WORLD) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const playerName = playerNameFromUser(user);
  const puzzle = await getLevelPuzzle(world, level);
  if (!puzzle) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 gap-4">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Level {level} is not seeded yet.
        </p>
        <a href="/" className="text-sm underline" style={{ color: "var(--fg)" }}>
          Back to worlds
        </a>
      </div>
    );
  }

  if (puzzle.world === "tron") {
    return <TronBoard puzzle={puzzle} level={level} playerName={playerName} />;
  }
  return <HoneyBoard puzzle={puzzle} level={level} playerName={playerName} />;
}
