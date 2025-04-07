import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  const supabase = createClient();

  try {
    const searchParams = request.nextUrl.searchParams;

    const type = searchParams.get("type") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    let query = supabase.from("writings").select("*").range(offset, offset + limit - 1);
    if (type !== "all") query = query.eq("type", type);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect("/home?error=something_went_wrong");
  }
}

