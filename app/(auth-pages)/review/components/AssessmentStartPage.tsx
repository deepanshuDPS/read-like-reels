"use client"

import ExtraText from "@/components_new/Layout/ExtraText";

type StartPageProps = {
    reviewed: any;
    setSelectedCompany: Function
};

export default function AssessmentStartPage({ reviewed, setSelectedCompany }: StartPageProps) {

    let companies = reviewed.positions.positionHistory
    if (reviewed.company) {
        companies.push({
            'companyName': reviewed.company['name']
        })
    }
    companies = companies.filter((item: any, index: number, self: any) =>
        index === self.findIndex((t: any) => t.companyName === item.companyName)
    );
    companies.push({
        'companyName': 'Other'
    })
    return <div className="flex flex-col md:flex-row w-full m-auto px-4 py-2 md:py-0 md:p-0">
        <div className="md:basis-3/5 flex flex-col mx-auto mt-8 justify-start text-xl items-start px-4">
            <h2 className="flex flex-col w-full text-[30px] leading-tight">
                <span className="font-extralight">Welcome to the</span>
                <span className="font-medium">Manager Survey!</span>
            </h2>
            <h3 className="text-[14px] font-light italic leading-normal text-gray-400 sm:text-xl">
                Pick a company from which review related.
            </h3>
            <ExtraText />
        </div>
        <div className="md:basis-2/5 flex flex-wrap mx-auto mt-4 justify-start ">
            {companies.map((position: any) => {
                return (
                    <button
                        onClick={() => setSelectedCompany(position.companyName)}
                        className="flex h-10 cursor-pointer m-1 items-center rounded-full bg-white px-4 py-2 border-2 hover:bg-gray-100 transition-all duration-200 ease-in-out">
                        <p className="text-[16px] font-medium text-start whitespace-nowrap overflow-hidden">{position.companyName}</p>
                    </button>
                );
            })}
            <ExtraText />
        </div>
    </div>
}