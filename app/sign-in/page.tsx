import { redirect } from "next/navigation";
import SignInButton from "@/components/SignInButton";
import { createClient } from "@/lib/supabase/server";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  const { error } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center h-dvh px-6 gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight" style={{ color: "var(--cyan)" }}>
          Flip Me
        </h1>
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
          Two worlds. One goal. Flip everything green.
        </p>
      </div>
      <div className="w-full max-w-xs flex flex-col gap-3">
        <SignInButton />
        {error ? (
          <p className="text-xs text-center" style={{ color: "var(--red)" }}>
            Sign-in failed. Try again.
          </p>
        ) : null}
      </div>
    </div>
  );
}
