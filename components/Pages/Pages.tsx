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
    const [value, setValue] = useState('');
    const [openedIndexes, setOpenedIndexes] = useState<number[]>([]);

    const handleChange = (event: any) => {
        const numericValue = event.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
        setValue(numericValue);
    };


    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") {
            const pageNumber = parseInt(value);
            if (openedPages > 0 && pageNumber <= pages.length) {
                setOpenedPages(pageNumber - 1);
            } else {
                alert("Please enter a valid page number");
            }
        }
    };

    useEffect(() => {
        if (selectedWriting) {
            var tempSelectedText = `<div style='font-size:20px; text-align:center'>${selectedWriting.title}</div><br/>` + `<div>${selectedWriting.text.replace(/\\n/g, "<hr style='opacity:0;margin:1px' />")}</div>`;
            setTextToRead(tempSelectedText);
            if ([1, 2].includes(window.history.length)) {
                setTimeout(() => {
                    setTextToRead(tempSelectedText + "<br/>");
                }, 250);
            }
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
                setValue("1")
            } else {
                setOpenedPages(0)
            }
        }
    }, [textToRead])

    const handleShare = async (title: string, type: string, slug: string) => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: title,
              text: `Checkout this ${type == 'story' ? 'Story' : 'essay'}`,
              url: `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}/read/${slug}`,
            });
            console.log("Link shared successfully!");
          } catch (err) {
            console.error("Error sharing:", err);
          }
        } else {
          alert("Sharing is not supported in this browser.");
        }
      };
    


    return (
        <div className="w-full flex flex-col pb-8">
            <svg width="36px" height="36px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleShare(selectedWriting.title, selectedWriting.type, selectedWriting.slug)} className="block md:hidden mx-4 my-2 bg-gray-100 rounded-full p-1 shadow-sm cursor-pointer" style={{alignSelf:'end'}}>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.734 15.8974L19.22 12.1374C19.3971 11.9927 19.4998 11.7761 19.4998 11.5474C19.4998 11.3187 19.3971 11.1022 19.22 10.9574L14.734 7.19743C14.4947 6.9929 14.1598 6.94275 13.8711 7.06826C13.5824 7.19377 13.3906 7.47295 13.377 7.78743V9.27043C7.079 8.17943 5.5 13.8154 5.5 16.9974C6.961 14.5734 10.747 10.1794 13.377 13.8154V15.3024C13.3888 15.6178 13.5799 15.8987 13.8689 16.0254C14.158 16.1521 14.494 16.1024 14.734 15.8974Z" stroke="#636363" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div
                ref={hiddenRef}
                className="invisible absolute z-20 top-0 left-0 text-lg md:text-lg lg:text-xl w-[340px] h-[500px] md:w-[400px] lg:w-[560px] md:h-[500px] lg:h-[700px] px-6 pt-12 leading-relaxed overflow-hidden"
                style={{ position: "absolute", pointerEvents: "none", zIndex: -1, fontFamily: "Tiro Devanagari Hindi" }}
            />
            {textToRead != null && <div
                className="flex flex-col px-4 md:px-44 my-8 w-full"
                style={{ fontFamily: "Tiro Devanagari Hindi" }}
            >
                {/* <div className="text-2xl text-center my-4">{title}</div> */}
                <BookLayout pages={pages} title={title} author={selectedWriting.author} openedPages={openedPages ?? 0} />
                {pages.length > 1 && <div className="hidden flex-row justify-center items-center my-4 md:flex">
                    {openedPages > 1 && <button
                        onClick={() => {
                            if (openedPages > 1) {
                                if (openedPages - 2 != 0) {
                                    setOpenedPages(openedPages - 2)
                                    setValue((openedPages - 2).toString())
                                } else {
                                    setOpenedPages(1)
                                    setValue("1")
                                }
                            }
                        }}
                        className="text-black font-semibold text-sm cursor-pointer">← Previous</button>}
                    <input className="w-8 h-6 mx-2 text-center p-0 border-black rounded-md border-[1px]"
                        value={value}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange} /> of {pages.length}
                    {openedPages < pages.length && <button
                        onClick={() => {
                            if (openedPages <= pages.length - 1) {
                                if (openedPages + 2 != pages.length + 1) {
                                    setOpenedPages(openedPages + 2)
                                    setValue((openedPages + 2).toString())
                                } else {
                                    setOpenedPages(pages.length)
                                    setValue(pages.length.toString())
                                }
                            }
                        }}
                        className="mx-2 text-black font-semibold text-sm cursor-pointer">Next →</button>}
                </div>}
                {/* <div className="flex-row gap-4 w-full justify-center items-center my-4 hidden md:flex font-sans">
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
                </div> */}
            </div>}
        </div >
    );
};



export default Pages;
