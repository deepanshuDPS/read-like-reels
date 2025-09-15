import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

const generateKeywords = async (text: string) => {
  const prompt = `Extract relevant keywords related to feelings/emotions/thoughts from the following text with no duplicates:\n\n${text}\n\nKeywords:`;
  let maxTokens = 500
  if (text.split(" ").length < 500) {
    maxTokens = text.split(" ").length
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: Math.floor(maxTokens * 4 / 3),
      temperature: 0.75,
    });

    // Extracting the keywords from the model's response
    const ks = response.choices[0].message.content ?? ""
    const keywords = ks?.trim().split(',').map(keyword => keyword.trim());
    const finalKeywords = keywords.filter((it) => it.trim() != '');
    return finalKeywords;
  } catch (error) {
    console.error('Error generating keywords:', error);
  }
}

const generateEmbeddedText = async () => {
  const supabase = createClient();
  const writings = await supabase.from("writings").select("*").is("embedding", null).limit(5);
  let embedCount = writings.data?.length ?? 0
  writings.data?.forEach(async (item) => {
    let keywords = await generateKeywords(item.text.replace(/ +/g, ' '))
    let stringKeywords = keywords?.join(", ") ?? ""
    // // Example for updating embeddings
    const embedding = await generateEmbedding(stringKeywords);
    const { data, error } = await supabase.from("writings").update({ embedding }).eq("id", item.id);
    if (error) {
      console.log("error", embedCount)
      embedCount++
      console.error("❌ Update error:", error.message);
    } else {
      console.log("success", embedCount)
      embedCount--
      console.log("✅ Update successful:", data);
    }
  });
  if (embedCount == 0) {
    return true
  } else {
    return false
  }
}

async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const passkey = searchParams.get("passkey") || "";
  try {
    // Fetch data from a Supabase table
    if (passkey === process.env.NEXT_PUBLIC_PROCESS_KEY) {
      let result = await generateEmbeddedText()
      if (result) {
        return NextResponse.json({ success: true, message: 'Embed successful' });
      } else {
        return NextResponse.json({ success: false, message: "Some content not embedded" });
      }
    } else {
      return NextResponse.json({ success: false, message: "Not able to process" });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function POST(req: Request) {
  return NextResponse.json({ success: true });

}
