import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  var supabase = createClient()
  try {
    const assessmentId = params.id; // Access the 'id' path parameter
    // Fetch data from a Supabase table
    const { data, error } = await supabase
    .from('questions')
    .select(`
      *,
      sections(id, title, assessment_id),
      options(*)
    `
    )
    .eq('is_mandate', true)
    
    let filteredData = {}
    if (data) {
      // Filter the results based on sections.assessment_id after fetching
      filteredData = data.filter(question =>
        question.sections?.assessment_id == assessmentId || question.sections == null
      );
    }
    if (error) throw error;
    return NextResponse.json({ success: true, data: filteredData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function POST(req: Request) {
  return NextResponse.json({ success: true });

}
