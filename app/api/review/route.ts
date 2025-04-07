import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextApiRequest } from 'next';



export async function POST(req: Request) {
  var supabase = createClient()
  var body = await new Response(req.body).json()
  let beforeReviewerHash = body.reviewer_id

  const bcrypt = require('bcrypt');
  // const fixedSalt = bcrypt.genSaltSync(10)
  // console.log(fixedSalt)
  const encReviewer = await bcrypt.hash(beforeReviewerHash, '$2b$10$J0OkHps9xcjn47AudiWrVO');
  const uniqueReviewedData = body.reviewed_data.filter((item: any, index: number, self: any) =>
    index === self.findIndex((t: any) => t.question_id === item.question_id)
  );
  // check if the review already exists
  try {
    // Fetch data from a Supabase table

    // check for company exist or not
    const { data: cData, error: cError } = await supabase.from('companies').select('id')
      .eq('company_name', body.company_name)

    if (cError) throw cError;
    let cId = -1
    if (cData?.length == 1) {
      cId = cData[0].id
    } else {
      // Step 1: Create a new company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({ company_name: body.company_name })
        .select('id')
        .single();
      if (companyError) throw companyError;
      cId = companyData.id;
    }
    const { data, error } = await supabase.from('reviews').select('id')
      .eq('reviewed_identifier', body.reviewed_identifier)
      .eq('enc_reviewer', encReviewer)

    if (data?.length == 1) {
      let reviewId = data[0].id
      // update company at the review id
      // delete all previous reviewed_data and add new add new with correponding id
      // Update the company name in the review record with the provided review ID
      const { data: rData, error } = await supabase
        .from('reviews')
        .update({ company_id: cId, updated_at: new Date() })
        .eq('id', reviewId);

      if (error) throw error;

      // Step 2: Delete previous `reviewed_data` for this review_id
      const { error: deleteReviewedDataError } = await supabase
        .from('reviewed_data')
        .delete()
        .eq('review_id', reviewId);

      if (deleteReviewedDataError) throw deleteReviewedDataError;

      // Step 2: Insert new `reviewed_data` entries with the same `review_id`
      const reviewedDataToInsert = uniqueReviewedData.map((data: any) => ({
        review_id: reviewId,
        question_id: data.question_id,
        option_key: data.option_key,
      }));

      const { data: insertedReviewedData, error: insertReviewedDataError } = await supabase
        .from('reviewed_data')
        .insert(reviewedDataToInsert);

      if (insertReviewedDataError) throw insertReviewedDataError;

      // Return success with updated data
      return NextResponse.json({ success: true, message: 'Assessment Submitted successfully' });;

    } else {
      // new review
      // create review
      // take review_id
      // Step 2: Create a review for this company
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          company_id: cId,
          reviewed_identifier: body.reviewed_identifier,
          enc_reviewer: encReviewer,
          profile_type: body.profile_type
        })
        .select('id')
        .single();

      if (reviewError) throw reviewError;
      const reviewId = reviewData.id;
      // Step 3: Remove duplicates from `reviewedData` before inserting

      const reviewedDataToInsert = uniqueReviewedData.map((data: any) => ({
        review_id: reviewId,
        question_id: data.question_id,
        option_key: data.option_key,
      }));

      const { data: finalData, error: reviewedDataError } = await supabase
        .from('reviewed_data')
        .insert(reviewedDataToInsert);

      // console.log(finalData)
      if (reviewedDataError) throw reviewedDataError;

      // Step 4: Return success
      return NextResponse.json({ success: true, message: 'Assessment Submitted successfully' });;
      // return success
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, {
      status: 409
    });
  }
}
