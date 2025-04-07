"use client"

import ButtonPrimary from "@/components_new/misc/ButtonPrimary";

type ScorePageProps = {
  title: string;
  icon: string;
  iconbg: string;
  submit: Function
};

const FinalSubmitionPage = ({
  title,
  icon,
  iconbg,
  submit
}: ScorePageProps) => {
  return (
    <section className="mt-8 px-6 sm:px-16 xl:mt-0 xl:flex xl:px-0">
      <div className="xl:w-1/2">
        <h2 className="text-[40px] font-extralight leading-none sm:text-[64px]">
          Assessment completed
        </h2>
      </div>
      <div className="xl:w-1/2 xl:space-y-8">
        <section className="mb-3 mt-10 flex flex-col items-center rounded-xl bg-white p-8 drop-shadow-sm  sm:p-12 xl:mb-0 xl:mt-0 xl:w-[564px]">
          <div className="flex h-[72px] items-center justify-center">
            <div className="flex items-center justify-center gap-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-md sm:h-14 sm:w-14"
                style={{ backgroundColor: iconbg }}
              >
                <img
                  src={icon}
                  alt={title}
                  className="h-7 w-7 sm:h-10 sm:w-10"
                />
              </div>
              <h1 className="text-[18px] font-medium sm:text-[28px]">
                {title}
              </h1>
            </div>
          </div>
          {/* <div className="flex flex-col items-center">
            <div className="font-medium">
              {Array.from(score.entries()).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </div>
          </div> */}
        </section>
        <ButtonPrimary
          onClick={() => submit()}
        >
          Submit Assessment
        </ButtonPrimary>
      </div>
    </section>
  );
};

export default FinalSubmitionPage;
