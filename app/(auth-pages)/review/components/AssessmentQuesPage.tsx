"use client"

import { useState } from "react";
import FinalSubmitionPage from "./FinalSubmitionPage";
import ExtraText from "@/components_new/Layout/ExtraText";

type AssessmentPageProps = {
  assessmentData: any[];
  questionNo: number;
  setQuestionNo: Function;
  answers: Map<string, string>;
  setAnswers: Function;
  submitAssessment: Function
};

const AssesmentQuesPage = ({ assessmentData, questionNo, setQuestionNo, answers, setAnswers, submitAssessment }: AssessmentPageProps) => {
  const [progressBar, setProgressBar] = useState<number>(10);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<String | undefined>("");
  const [showNextQuestion, setShowNextQuestion] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  let currentQuestion = assessmentData[questionNo];
  let numberOfQuestions = assessmentData?.length;

  const handleSubmit = () => {
    if (selectedAnswer === "") {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
      return;
    }
    setShowNextQuestion(true);
  };

  // console.log(currentQuestion)

  const getOptions = (optionsObj: any) => {
    let givenOptions = []
    for (var i = 1; i <= 10; i++) {
      if (optionsObj[`option_${i}`]) {
        givenOptions.push({
          'index': i - 1,
          'option_key': `option_${i}`,
          'option_value': optionsObj[`option_${i}`]
        })
      } else {
        break
      }
    }
    return givenOptions
  }

  const handleSelectedAnswer = (answer: string) => {
    if (answers) {
      let newAnswers = answers
      newAnswers.set(currentQuestion.id, answer)
      setAnswers(newAnswers)
    } else {
      let newAnswers = new Map<string, string>()
      newAnswers.set(currentQuestion.id, answer ?? "")
      setAnswers(newAnswers)
    }
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(undefined);
    let newQuestionNo = questionNo + 1
    setQuestionNo(newQuestionNo);
    setProgressBar(newQuestionNo / numberOfQuestions * 100);
    setShowNextQuestion(false);
  };

  return (
    <>
      {Number(questionNo) === numberOfQuestions ? (
        <FinalSubmitionPage
          submit={submitAssessment}
          title={'You completed assessment review your assessment'}
          icon={""}
          iconbg={"bg-blue-100"}
        />
      ) : (
        <section className="flex flex-col md:flex-row p-4 md:p-0">
          <div className="flex flex-col mb-10 mr-4 md:basis-3/5 w-full justify-between">
            <div >
              <div className="text-3xl font-medium sm:text-[20px]" dangerouslySetInnerHTML={{ __html: currentQuestion?.sections?.title }}>
              </div>
              <div className="text-xl font-medium py-2" dangerouslySetInnerHTML={{ __html: currentQuestion?.question_text }}>
              </div>
              <ExtraText />
            </div>
            <div className="flex flex-col space-y-2 mt-8 md:mt-0">
              <p className="text-xl italic text-greyNavy ">
                Question {questionNo + 1} of {numberOfQuestions}
              </p>
              <div className="flex h-4 w-full md:w-[70%] items-center justify-start rounded-full bg-gray-100 px-1">
                <span
                  className="h-2 rounded-[104px] bg-red-500"
                  style={{ width: `${progressBar}%` }}
                ></span>
              </div>
            </div>

          </div>
          <div className="md:basis-2/5">
            <ul className="space-y-3 pb-3">
              {getOptions(currentQuestion.options).map((option: any) => {
                const letter = String.fromCharCode(65 + option.index); // 65 is the ASCII value for 'A'
                const isSelected = selectedAnswer === option.option_key;
                const bgColor = isSelected ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800";
                return (
                  <li
                    key={option.index}
                    className={
                      `group flex h-auto w-full cursor-pointer items-center gap-4 rounded-xl bg-white p-4 border-2 font-medium drop-shadow-sm ${isSelected
                        ? "border-red-500"
                        : "border-gray-400"
                      }`
                    }
                    onClick={() => handleSelectedAnswer(option.option_key)}
                  >
                    <span
                      className={
                        isSubmitted
                          ? `flex h-6 w-6 items-center justify-center rounded-md text-[18px] uppercase text-greyNavy  sm:text-[28px] ${bgColor}`
                          : `flex h-6 w-6 items-center justify-center rounded-md bg-lightGrey text-[18px] uppercase text-greyNavy group-hover:bg-[#F6E7FF] group-hover:text-purple ${isSelected
                            ? "bg-purple text-white group-hover:bg-purple group-hover:text-white"
                            : "bg-lightGrey"
                          }`
                      }
                    >
                      {letter}
                    </span>
                    <p className="w-[200px] text-base">
                      {option.option_value}
                    </p>
                  </li>
                );
              })}
            </ul>
            {!selectedAnswer ? (
              <button
                className="bg-['linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), #a729f5'] hover:bg-btnHover h-14
                  w-full rounded-xl bg-red-400 py-2 text-xl font-semibold text-white transition-all duration-200 ease-in-out"
                onClick={handleSubmit}
              >
                Choose Answer
              </button>
            ) : (
              <button
                className="hover:bg-btnHover h-14 w-full rounded-xl bg-red-500 py-2 text-xl font-semibold text-white transition-all duration-200 ease-in-out"
                onClick={handleNextQuestion}
              >
                Next Question
              </button>
            )}
            {error ? (
              <p className="mt-3 flex items-center justify-center gap-2 text-[18px] text-red sm:text-2xl">
                <img src="/icon-incorrect.svg" alt="Please select an answer" />
                <span>Please select an answer</span>
              </p>
            ) : null}
          </div>
        </section>
      )}
    </>
  );
};

export default AssesmentQuesPage;
