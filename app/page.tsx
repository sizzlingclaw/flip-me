import { redirect } from "next/navigation";
import WorldSelector from "@/components/WorldSelector";
import { createClient } from "@/lib/supabase/server";
import { getWorldClearedCount } from "@/lib/progress";
import { playerNameFromUser } from "@/lib/user";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const [tronCleared, honeyCleared] = await Promise.all([
    getWorldClearedCount("tron"),
    getWorldClearedCount("honey"),
  ]);

  return (
    <WorldSelector
      name={playerNameFromUser(user)}
      tronCleared={tronCleared}
      honeyCleared={honeyCleared}
    />
  );
}
