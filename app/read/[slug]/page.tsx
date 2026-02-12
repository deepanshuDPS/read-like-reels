import Pages from "@/components/Pages/Pages";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 60;

// Fetch a single writing safely
async function fetchWriting(slug: string) {
  const supabase = await createClient({ revalidate: 60 });

  return await supabase
    .from("writings")
    .select("*")
    .eq("slug", slug)
    .single(); // ✅ ensures only one row
}

// ✅ Metadata (Next 14 async params compatible)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await fetchWriting(slug);

  if (error || !data) {
    return {
      title: "Writing Not Found",
      description: "This writing does not exist.",
      icons: {
        icon: "/Icon/favicon.ico",
      },
    };
  }

  return {
    title: data.title,
    description: data.text?.substring(0, 100) + "...",
    icons: {
      icon: "/Icon/favicon.ico",
    },
  };
}

// ✅ Page Component (Next 14 async params compatible)
export default async function Index({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await fetchWriting(slug);

  if (error || !data) {
    return <div>Writing not found.</div>;
  }

  return <Pages selectedWriting={data} />;
}
