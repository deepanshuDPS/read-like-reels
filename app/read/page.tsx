import Pages from "@/components/Pages/Pages";
import { createClient } from "@/utils/supabase/server";


export default async function Index({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const supabase = createClient();
  const id = searchParams.id;
  let query = supabase.from("writings")
    .select("*").eq("id", id);
  const { data, error } = await query;
  return (
    <>
      <Pages selectedWriting={(data as any[])[0]} />
    </>
  );
}
