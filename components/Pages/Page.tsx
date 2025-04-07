// Page.tsx
import React from "react";

interface PageProps {
    content: string;
    pageNo: number;
    author: string;
    title: string;
}

export const Page: React.FC<PageProps> = ({ content, pageNo, author, title }) => (
    <div className="w-fit relative bg-[#f5f1e854]  border-[1px] border-black">
        {pageNo !=1 && <div className={"text-[10px] md:text-xs text-gray-500 absolute top-3 md:top-4 font-thin right-6"}>{author}</div>}
        {pageNo !=1 && <div className={"text-xs md:text-base text-gray-500 absolute top-3 md:top-4 left-6"}>{title}</div>}
        <div className="text-sm md:text-base w-[280px] h-[350px] md:w-[400px] md:h-[500px] overflow-hidden px-6 pt-12" dangerouslySetInnerHTML={{ __html: content }} />
        <div className="text-[10px] md:text-xs text-gray-700 text-center my-1 md:my-2">{pageNo}</div>
    </div>
);

interface BookLayoutProps {
    pages: string[];
    title: string | null;
    author: string | null;
    openedPages: number;
}

export const BookLayout: React.FC<BookLayoutProps> = ({ pages, title, openedPages, author }) => {

    return (<div className="flex flex-col justify-center gap-6 items-center md:flex-row">
        {pages.map((content, index) => {
            let showPage = false;
            if (openedPages == -1) {
                showPage = true;
            } else {
                showPage = (index == openedPages || index == openedPages - 1);
            }
            return <>
                {showPage ? <Page key={index} content={content} pageNo={index + 1} author={author ?? ""} title={title ?? ""} /> : <></>}
            </>
        })}
    </div>)
};