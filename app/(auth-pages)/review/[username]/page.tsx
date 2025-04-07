import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AssessmentSetup from "../components/AssessmentSetup";
import { cookies } from 'next/headers';  // Import cookies from next/headers

interface Props {
  params: {
    username: string; // This matches the dynamic route parameter [username]
  };
}

async function makeReviewRequest(body: Record<string, any>) {
  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/review`
  const cookiesParams: any = cookies()

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'cookie': cookiesParams._headers.headers.cookie,  // Pass the user's cookies to the request
          },
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error:", error);
      throw error;
  }
}

export default async function Review({ params }: Props) {
  const supabase = createClient();
  const assessmentId = 1;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/start-with?error=Please SignUp/SignIn before review");
  }
  const { username } = params;
  const cookiesParams: any = cookies()
  const assessmentRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/assessment/${assessmentId}`, {
    method: 'GET',
    headers: {
      'cookie': cookiesParams._headers.headers.cookie,  // Pass the user's cookies to the request
    },
  });
  const userRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-profile/user/${username}`);
  if (userRes.status == 404) {
    redirect("/404")
  }
  const body = await userRes.json()
  const rUser = body.data;
  rUser['linkedinIdentifier'] = body.linkedinIdentifier
  const assessment = (await assessmentRes.json()).data;
  const sectionQuesSorted = assessment.filter((ques: any) => ques.section_id != null).sort((a: any, b: any) => a.sequence - b.sequence);
  const extraQuesSorted = assessment.filter((ques: any) => ques.section_id == null)
    .sort((a: any, b: any) => b.priority - a.priority);

  const mergedQuestions = []
  let isMerged = false
  for (var i = 0; i < extraQuesSorted.length; i++) {
    mergedQuestions.push(extraQuesSorted[i])
    if (!isMerged && i + 1 != extraQuesSorted.length && extraQuesSorted[i + 1].priority < 0) {
      for (var j = 0; j < sectionQuesSorted.length; j++) {
        mergedQuestions.push(sectionQuesSorted[j])
      }
      isMerged = true
    }
  }
  return (
    <div className="w-full flex flex-col pt-24 pb-8">
      <AssessmentSetup reviewed={rUser} reviewer={user} username={username} questions={mergedQuestions} cookies={cookiesParams._headers.headers.cookie} />
      {/* {JSON.stringify(assessment)} */}
      {/* {JSON.stringify(user)} */}
    </div>
  );
}

{/* <div x-show="openSettings" className="bg-white absolute right-0 w-40 py-2 mt-1 border border-gray-200 shadow-2xl hidden" >
            <div className="py-2 border-b">
              <p className="text-gray-400 text-xs px-6 uppercase mb-1">Settings</p>
              <button className="w-full flex items-center px-6 py-1.5 space-x-2 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                <span className="text-sm text-gray-700">Share Profile</span>
              </button>
              <button className="w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                </svg>
                <span className="text-sm text-gray-700">Block User</span>
              </button>
              <button className="w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm text-gray-700">More Info</span>
              </button>
            </div>
            <div className="py-2">
              <p className="text-gray-400 text-xs px-6 uppercase mb-1">Feedback</p>
              <button className="w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span className="text-sm text-gray-700">Report</span>
              </button>
            </div>
          </div> */}
