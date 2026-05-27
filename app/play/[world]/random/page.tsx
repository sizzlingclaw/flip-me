import { notFound, redirect } from "next/navigation";
import RandomPlay from "@/components/RandomPlay";
import { createClient } from "@/lib/supabase/server";
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

  return <RandomPlay world={worldParam as World} playerName={playerNameFromUser(user)} />;
}
