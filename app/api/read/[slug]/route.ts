import {  NextRequest, NextResponse } from "next/server";


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; }>; } 
) {
  const params = await context.params;
  const slug = params.slug || "";
  return NextResponse.json({ slug });
}
