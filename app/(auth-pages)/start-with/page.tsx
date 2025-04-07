import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginButton from "./components/LoginButton";

export default async function Login() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/my-profile");
  }

  return (
    <main className="flex-1 flex flex-col gap-6 px-4">
      <LoginButton />
    </main>
  );
}
