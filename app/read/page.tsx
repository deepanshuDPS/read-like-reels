import Pages from "@/components/Pages/Pages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id") || "-1";
  return NextResponse.json({ id });
}


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
