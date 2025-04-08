import Pages from "@/components/Pages/Pages";
import { createClient } from "@/utils/supabase/server";


async function fetchWriting(slug:string) {
  const supabase = createClient();
  return await supabase.from("writings")
    .select("*").eq("slug", slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data, error } = await fetchWriting(params.slug);
  return {
    title: (data as any[])[0].title,
    description: (data as any[])[0].text.substring(0, 100) + "...",
  };
}

export default async function Index({
  params,
}: {
  params: { slug: string };
}){
  
  const { data, error } = await fetchWriting(params.slug);
  return (
    <>
      <Pages selectedWriting={(data as any[])[0]} />
    </>
  );
}
