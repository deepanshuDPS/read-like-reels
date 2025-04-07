import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import profiles from './../../linkedin.json';
import { handlePostgresError, removeKeys } from '@/utils/utils';
import sharp from 'sharp';

const linkedInUrlRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in)\/[a-zA-Z0-9_-]+(\/)?$/;

const uploadImageFromUrl = async (
  imageUrl: string, bucketName: string, fileName: string
) => {
  var supabase = createClient()

  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch image from the URL');
    }

    // Convert the response into a Buffer
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    // Optional: Compress the image using sharp (you can skip this if not needed)
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize(200)
      .jpeg({ quality: 70 }) // Convert to JPEG with 70% quality
      .toBuffer();

    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, compressedImageBuffer);

    if (error) {
      throw error;
    }

    console.log('Image uploaded successfully:', data);

    return {
      props: {
        message: 'Image uploaded successfully!'
      },
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      props: {
        message: 'Error uploading image.'
      },
    };
  }
};



export async function GET(req: Request) {
  var supabase = createClient()
  try {
    // Fetch data from a Supabase table
    const { data, error } = await supabase.from('fetched_profiles').select('linkedInUrl');
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function POST(req: Request) {

  const { linkedin_url } = await req.json();
  if (!linkedin_url || !linkedInUrlRegex.test(linkedin_url)) {
    return NextResponse.json({
      error: 'Invalid LinkedIn URL. Please provide a valid LinkedIn profile or company URL.',
    }, {
      status: 400
    });
  }
  var supabase = createClient()
  let profile_data: any
  // try {
  // var apiKey = process.env.NEXT_PUBLIC_SCRAP_IN_API_KEY!
  // const options = { method: 'GET' };
  //   let scrapInResponse = await fetch('https://api.scrapin.io/enrichment/profile?apikey=' + apiKey + "&linkedinUrl=" + linkedin_url, options)
  //   if (scrapInResponse.status == 200) {
  //     profile_data = await scrapInResponse.json() 
  //     do this step after inserting inserting row
  //     const imageUrl = profile_data.photoUrl
  //     const bucketName = 'profile-pic';
  //     const fileName = `pic-${profile_data.publicIdentifier}.jpg`; // Set the desired file name for the uploaded image
  //     await uploadImageFromUrl(imageUrl, bucketName, fileName)
  //   } else {
  //     return NextResponse.json({ error: scrapInResponse.body }, { status: scrapInResponse.status })
  //   }
  // } catch (e: any) {
  //   return NextResponse.json({ error: e.message }, { status: e.code })
  // }
  var randomeIndex = 8
  profile_data = profiles.profiles_list[randomeIndex]['person'] ?? {}
  profile_data['company'] = profiles.profiles_list[randomeIndex]['company']
  const { linkedInUrl, linkedInIdentifier, publicIdentifier } = profile_data
  profile_data = removeKeys(profile_data, ['linkedInIdentifier', 'publicIdentifier', 'linkedInUrl'])
  // Insert data into the 'users' table
  const { data, error } = await supabase
    .from('fetched_profiles') // Replace 'users' with your table name
    .insert([{ linkedInUrl, linkedInIdentifier, publicIdentifier, profile_data, data_version: 1, created_at: new Date().toISOString(), fetch_count: 1 }]);

  if (error) {
    const errorDetails = handlePostgresError(error)
    return NextResponse.json({ error: errorDetails.message }, { status: errorDetails.status })
  }
  return NextResponse.json({ success: true, data: profile_data });
}
