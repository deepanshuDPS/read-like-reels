"use client"

import { User } from "@supabase/supabase-js";
import { getName } from "@/utils/helpers";
import { useState } from "react";
import AssesmentQuesPage from "./AssessmentQuesPage";
import AssessmentStartPage from "./AssessmentStartPage";
import ImageSrc from "@/components_new/misc/ImageSrc";
import { cookies } from "next/headers";
import { toast } from "react-hot-toast";

// import { Quiz } from "../../types";


type AssessmentProps = {
    reviewer: User;
    reviewed: any;
    username: string;
    questions: any[];
    cookies: string
};

const AssessmentSetup = ({ reviewer, reviewed, username, questions, cookies }: AssessmentProps) => {

    const [companyName, setCompanyName] = useState<string | null>(null)
    const [questionNo, setQuestionNo] = useState<number>(0)
    const [answers, setAnswers] = useState<Map<string, string>>(new Map<string, string>())

    async function makeReviewRequest(body: Record<string, any>) {
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/review`

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'cookie': cookies,
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


    const makeRequestAndPost = async () => {
        let newMapAnswers = Array.from(answers.entries()).map(([key, value]) => (
            {
                'question_id': key,
                'option_key': value
            }
        ))
        let request = {
            'company_name': companyName,
            'profile_type': 'linkedin',
            'reviewer_id': reviewer.id,
            'reviewed_identifier': reviewed.linkedinIdentifier,
            'reviewed_data': newMapAnswers
        }
        try {
            toast.loading('Sending Assignment... Please Hold.', {
                duration: 1000
            })
            let data = await makeReviewRequest(request)
            toast.success(data.message)
            window.location.href = '/my-profile'
        } catch (e: any) {
            toast.error('Something Went Wrong! Try again.')
        }

    }

    return (
        <div className="flex flex-col w-full px-0 md:px-48 py-4" >
            <div className="flex w-full h-[72px] p-4 md:p-0 items-center justify-between">
                <section className="flex items-center justify-start gap-4 p-4  bg-gray-100 rounded-lg">
                    <div
                        className="flex h-10 w-10 sm:h-14 sm:w-14 items-center bg-blue-200 justify-center rounded-md "
                    >
                        <ImageSrc url={`https://uvowzzvzulkisstynacq.supabase.co/storage/v1/object/public/profile-pic/pic-${username}.jpg`} classes="h-10 w-10 md:h-14 md:w-14 rounded-md" />
                    </div>
                    <h1 className="text-[18px] font-medium sm:text-[28px]">{getName(reviewed)}</h1>
                </section>
            </div>
            <div className="flex py-4 w-full">
                {!companyName && <AssessmentStartPage reviewed={reviewed} setSelectedCompany={setCompanyName} />}
                {companyName && <AssesmentQuesPage assessmentData={questions}
                    questionNo={questionNo} setQuestionNo={setQuestionNo}
                    answers={answers} setAnswers={setAnswers}
                    submitAssessment={makeRequestAndPost}
                />}
            </div>
        </div>

    );
};

export default AssessmentSetup;
