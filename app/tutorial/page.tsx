import { redirect } from "next/navigation";
import Tutorial from "@/components/Tutorial";
import { createClient } from "@/lib/supabase/server";

export default async function TutorialPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  return <Tutorial />;
}
