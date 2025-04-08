import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  console.log(params); // ✅ { slug: "your-slug" }
  const slug = params.slug || "";
  return NextResponse.json({ slug });
}
