import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Define a type for the response data
type Data = {
  success: boolean;
  data?: any;
  message?: string;
};

export async function GET(req: Request) {
  var supabase = createClient()
  try {
    // Fetch data from a Supabase table
    const { data, error } = await supabase.from('faqs').select('*');
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function POST(req: Request) {
  return NextResponse.json({ success: true });

}
