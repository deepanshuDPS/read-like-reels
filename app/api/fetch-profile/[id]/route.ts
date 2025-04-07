import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  var supabase = createClient()
  try {
    const linkedInIdentifier = params.id; // Access the 'id' path parameter
    // Fetch data from a Supabase table
    const { data, error } = await supabase.from('fetched_profiles').select('profile_data').eq("linkedInIdentifier", linkedInIdentifier);
    if (error) throw error;
    if (data.length > 0)
      return NextResponse.json({ success: true, data: JSON.parse(data[0].profile_data) });
    else return NextResponse.json(null, {
      status: 404
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function POST(req: Request) {
  return NextResponse.json({ success: true });

}
