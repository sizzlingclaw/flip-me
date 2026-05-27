import { notFound, redirect } from "next/navigation";
import RandomPlay from "@/components/RandomPlay";
import { createClient } from "@/lib/supabase/server";
import { getCompletedLevels } from "@/lib/progress";
import { playerNameFromUser } from "@/lib/user";
import type { World } from "@/lib/types";

export default async function RandomPlayPage({
  params,
}: {
  params: Promise<{ world: string }>;
}) {
  const { world: worldParam } = await params;
  if (worldParam !== "tron" && worldParam !== "honey") notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const world = worldParam as World;
  const completedMap = await getCompletedLevels(world);
  const completedLevels = Array.from(completedMap.keys());

  return (
    <RandomPlay
      world={world}
      playerName={playerNameFromUser(user)}
      completedLevels={completedLevels}
    />
  );
}
