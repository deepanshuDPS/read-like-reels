import Pages from "@/components/Pages/Pages";
import { createClient } from "@/utils/supabase/server";

// Revalidate this page (and Supabase requests) every 60 seconds
export const revalidate = 60;


async function fetchWriting(slug:string) {
  // pass the same revalidate value to the Supabase client so its
  // network requests include Next.js caching hints
  const supabase = createClient({ revalidate: 60 });
  return await supabase.from("writings")
    .select("*").eq("slug", slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data, error } = await fetchWriting(params.slug);
  return {
    title: (data as any[])[0].title,
    description: (data as any[])[0].text.substring(0, 100) + "...",
    icons: {
      icon: "/Icon/favicon.ico",
    },
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
