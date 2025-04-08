import {  NextResponse } from "next/server";


export async function GET(
  { params }: { params: { slug: string } }
) {
  const slug = params.slug || "";
  return NextResponse.json({ slug });
}
