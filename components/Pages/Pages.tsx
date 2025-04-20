"use client"

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { BookLayout } from "../Pages/Page";


type WritingProps = {
    selectedWriting: any | null;
}

const Pages = ({ selectedWriting }: WritingProps) => {

    const hiddenRef = useRef<HTMLDivElement>(null);
    const [pages, setPages] = useState<string[]>([]);
    const [title, setTitle] = useState<string | null>(null);
    const [textToRead, setTextToRead] = useState<string | null>(null);
    const [openedPages, setOpenedPages] = useState<number>(-1)


    useEffect(() => {
        if (selectedWriting) {
            var tempSelectedText = `<div style='font-size:20px; text-align:center'>${selectedWriting.title}</div><br/>` + `<div>${selectedWriting.text.replace(/\\n/g, "<hr style='opacity:0;margin:1px' />")}</div>`;
            setTimeout(() => {
                setTextToRead(tempSelectedText);
            }, 100);
            setTitle(selectedWriting.title);
        } else {
            setTextToRead(null);
            setTitle(null);
        }
    }, [selectedWriting]);

    useEffect(() => {
        if (!hiddenRef.current) return;

        if (textToRead != null) {
            const words = textToRead.split(" ");
            const tempPages: string[] = [];
            let current = "";

            for (let i = 0; i < words.length; i++) {
                current += words[i] + " ";
                if (hiddenRef.current) {
                    hiddenRef.current.innerHTML = current;

                    const isOverflowing =
                        hiddenRef.current.scrollHeight > hiddenRef.current.clientHeight;

                    if (isOverflowing) {
                        const lastWordIndex = current.lastIndexOf(words[i]);
                        const content = current.slice(0, lastWordIndex).trim();
                        tempPages.push(content);
                        current = words[i] + " ";
                    }
                }
            }

            if (current.trim()) tempPages.push(current.trim());
            setPages(tempPages);
            const width = window.innerWidth;
            if (width < 770) {
                setOpenedPages(-1)
            } else if (tempPages.length > 1) {
                setOpenedPages(1)
            } else {
                setOpenedPages(0)
            }
        }
    }, [textToRead])


    return (
        <div className="w-full flex flex-col pb-8">
            <div
                ref={hiddenRef}
                className="invisible absolute z-20 top-0 left-0 text-sm md:text-base lg:text-lg w-[340px] h-[500px] md:w-[400px] lg:w-[560px] md:h-[500px] lg:h-[700px] px-6 pt-12 leading-relaxed overflow-hidden"
                style={{ position: "absolute", pointerEvents: "none", zIndex: -1, fontFamily: "Tiro Devanagari Hindi" }}
            />
            {textToRead != null && <div
                className="flex flex-col px-4 md:px-44 my-8 w-full"
                style={{ fontFamily: "Tiro Devanagari Hindi" }}
            >
                {/* <div className="text-2xl text-center my-4">{title}</div> */}
                <BookLayout pages={pages} title={title} author={selectedWriting.author} openedPages={openedPages ?? 0} />
                <div className="flex-row gap-4 w-full justify-center items-center my-4 hidden md:flex font-sans">
                    {openedPages > 1 &&
                        <button
                            onClick={() => {
                                if (openedPages > 1) {
                                    setOpenedPages(openedPages - 2)
                                }
                            }
                            }>
                            {"<< Back"}
                        </button>}
                    {openedPages != -1 && pages.length > 2 && <div className=" font-semibold">
                        {`${openedPages}-${openedPages + 1}`} / {pages.length}
                    </div>}
                    {openedPages < pages.length - 1 &&
                        <button
                            onClick={() => {
                                if (openedPages <= pages.length - 1) {
                                    setOpenedPages(openedPages + 2)
                                }
                            }
                            }
                        >
                            {"Next >>"}
                        </button>}
                </div>
            </div>}
        </div >
    );
};



export default Pages;
