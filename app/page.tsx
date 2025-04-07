import Home from "@/components/home/Home";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams; // ✅ Correct way to get search params

//   const type = searchParams.get("type") || "all";
//   const page = parseInt(searchParams.get("page") || "1", 10);
//   const limit = parseInt(searchParams.get("limit") || "10", 10);

//   return NextResponse.json({ type, page, limit });
// }


export default async function Index({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const supabase = createClient();
  const type = searchParams.type || "quote";
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 10
  const offset = (page - 1) * limit;

  let query = supabase.from("writings")
    .select("*") // Only fetch first 200 chars
    .range(offset, offset + limit - 1);
  if (type !== "all") query = query.eq("type", type);

  const { data, error } = await query;
  return (
    <>
      <Home writings={data} type={type} />
    </>
  );
}
