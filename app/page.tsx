import Home from "@/components/home/Home";
import { createClient } from "@/utils/supabase/server";


export default async function Index({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const supabase = createClient();
  const type = searchParams.type || "quote";
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 10
  const offset = (page - 1) * limit;

  let query = supabase
    .from("writings")
    .select("*", { count: "exact" }) // this adds a count of total rows
    .range(offset, offset + limit - 1);
  if (type !== "all") query = query.eq("type", type);

  const { data, count, error } = await query;
  const totalPages = Math.ceil((count ?? 10) / limit);
  return (
    <>
      <Home writings={data} type={type} pages={totalPages} currentPage={page} />
    </>
  );
}
