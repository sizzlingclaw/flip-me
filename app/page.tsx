import { redirect } from "next/navigation";
import WorldSelector from "@/components/WorldSelector";
import { createClient } from "@/lib/supabase/server";
import { playerNameFromUser } from "@/lib/user";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  return <WorldSelector name={playerNameFromUser(user)} />;
}
