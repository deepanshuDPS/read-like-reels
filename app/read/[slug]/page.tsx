import Pages from "@/components/Pages/Pages";
import { createClient } from "@/utils/supabase/server";


export default async function Index({
  params,
}: {
  params: { slug: string };
}){
  const supabase = createClient();
  const slug = params.slug;
  let query = supabase.from("writings")
    .select("*").eq("slug", slug);
  const { data, error } = await query;
  return (
    <>
      <Pages selectedWriting={(data as any[])[0]} />
    </>
  );
}
