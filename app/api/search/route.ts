import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';



export async function POST(req: Request) {
  try {
    var supabase = createClient()
    var body = await new Response(req.body).json()
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
    });
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002", // supports Hindi & English
      input: body.userPrompt,
    });
    const promptEmbedding = response.data[0].embedding;
    let data = null
    let error = null
    let response1 = await supabase.rpc("match_writings", {
      query_embedding: promptEmbedding,
      match_threshold: 0.775, // Adjust as needed
      match_count: 100,
    });
    data = response1.data
    error = response1.error
    if (!error && data.length > 0 && data.length < 4) {
      let response2 = await supabase.rpc("match_writings", {
        query_embedding: promptEmbedding,
        match_threshold: 0.725, // Again try
        match_count: 100,
      });
      data = response2.data
      error = response2.error
    }
    // Step 4: Return success
    if (!error) {
      return NextResponse.json({ success: true, message: 'Search Results', data });;
    } else {
      return NextResponse.json({ success: false, message: error.message }, {
        status: 400
      });
    }
    // return success
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, {
      status: 409
    });
  }
}
