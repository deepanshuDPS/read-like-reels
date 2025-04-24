"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import OpenAI from 'openai';
import { createClient } from "@/utils/supabase/client";
import { userAgent } from "next/server";


type WritingProps = {
  writings: any[] | null;
  type: string
  pages: number
  currentPage: number
}

const Home = ({ writings, type, pages, currentPage }: WritingProps) => {

  // Breakpoints for different screen sizes
  const breakpointColumns = {
    default: 3, // 3 columns on large screens
    1024: 2, // 2 columns on medium screens
    640: 1, // 1 column on small screens
  };

  // const bgColors = [
  //   "bg-blue-200", "bg-green-200",
  //   "bg-yellow-200", "bg-purple-200",
  //   "bg-pink-200", "bg-indigo-200",
  //   "bg-red-200",
  //   "bg-teal-200", "bg-orange-200",
  //   "bg-gray-200", "bg-lime-200",
  //   "bg-rose-200", "bg-cyan-200",
  //   "bg-amber-200", "bg-violet-200",
  // ];

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Store this in .env
    dangerouslyAllowBrowser: true
  });
  const supabase = createClient();

  const searchWriting = async (userPrompt: string) => {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // supports Hindi & English
      input: userPrompt,
    });
    const promptEmbedding = response.data[0].embedding;
    const { data, error } = await supabase.rpc("match_writings", {
      query_embedding: promptEmbedding,
      match_threshold: 0.2 , // Adjust as needed
      match_count: 100,
    });

    if (error) console.error("❌ Error in search:", error);
    else console.log("🔍 Search Results:", data);
  }

  // const generateEmbeddedText = async (id:number) => {

  //   const supabase = createClient();
  //   const writings = await supabase.from("writings").select("*").eq("id", id);
  //   writings.data?.forEach(async (item) => {
  //     const text = `${item.title} ${item.text}`; // Full text for semantic meaning
  //     const embeddingResponse = await openai.embeddings.create({
  //       model: "text-embedding-3-small",
  //       input: text,
  //     });
  //     console.log(item.id, item.title, item.embedding);
  //     const embedding = embeddingResponse.data[0].embedding;
  //     console.log(embedding);
  //     const { data, error } = await supabase
  //       .from("writings")
  //       .update({ embedding })
  //       .eq("id", item.id);

  //     if (error) {
  //       console.error("❌ Update error:", error.message);
  //     } else {
  //       console.log("✅ Update successful:", data);
  //     }
  //   });
  // }


  const types = ["quote", "poem", "paragraph", "story", "essay"];
  const menuItems = [{
    title: "Quotes",
    maxLength: 100,
    readMode: false
  }, {
    title: "Poems",
    maxLength: 200,
    readMode: false
  }, {
    title: "Paragraphs",
    maxLength: 400,
    readMode: true
  }, {
    title: "Stories",
    maxLength: 400,
    readMode: true
  }, {
    title: "Essays",
    maxLength: 400,
    readMode: true
  }];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [value, setValue] = useState('');
  const router = useRouter()

  const handleChange = (event: any) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    setValue(numericValue);
  }; const [openedIndexes, setOpenedIndexes] = useState<number[]>([]);

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      const pageNumber = parseInt(value);
      if (pageNumber > 0 && pageNumber <= pages) {
        router.push("?type=" + types[selectedIndex] + "&page=" + pageNumber);
      } else {
        alert("Please enter a valid page number");
      }
    }
  };
  useEffect(() => {
    setValue(currentPage.toString())
    setOpenedIndexes([])
    setSelectedIndex(types.indexOf(type))
  }, [type, currentPage])


  //${bgColors[index % bgColors.length]}
  return (
    <div className="w-full flex flex-col pb-8">
      <div className="flex w-full items-center -top-[180px] md:-top-[140px] pb-16 sticky z-10" >
        <div className="flex w-full flex-col items-center justify-center bg-gray-100 rounded-b-[64px] py-8 z-10 md:px-40 px-auto">
          <div className="text-xl text-center px-4">AI Search – Find writings that match what's on your mind.</div>
          <div className="flex flex-row bg-white rounded-full  py-1 pl-6 pr-1 my-4 w-[300px] md:w-[700px]">
            {/* shadow-md */}
            <input className="bg-transparent w-full border-none outline-none pointer-events-none opacity-50" placeholder="This feature coming soon" />
            <button className="bg-black rounded-full px-4 md:px-16 py-2 text-white text-sm font-medium opacity-50" onClick={() => {
              //generateEmbeddedText(2)
              // searchWriting("searching meaning in life");
            }}>Search</button>
          </div>
        </div>

        <div className="flex w-full flex-col-reverse items-center bg-gray-200 rounded-b-[64px] absolute h-32 bottom-0 px-8 md:px-40 px-auto">
          <div className="flex flex-row justify-start md:justify-center gap-5 md:gap-14 mb-4 overflow-x-scroll md:overflow-x-hidden w-[300px] md:w-full" style={{ scrollbarWidth: 'none' }}>
            {menuItems.map((item, index) => (
              <Link key={index} className={`cursor-pointer ` + (selectedIndex === index ? "text-blue-700 font-semibold text-[17px] md:text-xl" : "text-gray-500 font-medium text-base md:text-lg ")}
                href={"?type=" + types[index]}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
        </div>
      </div>
      <div className="flex flex-col px-4 md:px-44">
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex gap-6 p-6"
          style={{ fontFamily: "Tiro Devanagari Hindi" }}
          columnClassName="masonry-column"
        >
          {writings?.map((item, index) => {
            let maxLength = menuItems[selectedIndex].maxLength || 200;
            let text = item.text
            let textTrimmed = item.text.replace(/\\n/g, "").length > maxLength
            return (<div
              className={`relative bg-[#fdfbfb] shadow-md px-6 pb-6 pt-12 rounded-xl mb-6 cursor-pointer`}
              onClick={() => {
                if (!menuItems[selectedIndex].readMode) {
                  let newOpenedIndexes = [...openedIndexes]
                  if (!newOpenedIndexes.includes(index)) {
                    newOpenedIndexes.push(index)
                    setOpenedIndexes(newOpenedIndexes)
                  }
                } else {
                  router.push("/read/" + (item.slug ?? "--"))
                }
              }}
            >
              <div className="h-8 absolute top-0 w-full bg-gradient-to-t from-black to-[#333e46] right-0 left-0 rounded-t-xl shadow-sm "></div>
              <h2 className="text-xl font-bold my-1">{item.title}</h2>
              <p className="text-base text-black mb-2" dangerouslySetInnerHTML={{ __html: !openedIndexes.includes(index) ? text.replace(/\\n/g, "<br/>").substring(0, maxLength) : text.replace(/\\n/g, "<br/>") }} />
              {textTrimmed && !openedIndexes.includes(index) &&
                <button className="flex items-center text-black font-semibold mt-2">
                  Read more <span className="ml-2">→</span>
                </button>}
              <h2 className="text-xs font-light text-black my-1 italic">- {item.author}</h2>
            </div>)
          })}
        </Masonry>
      </div>
      <div className="flex flex-row justify-center items-center">
        {currentPage > 1 && <Link href={"?type=" + types[selectedIndex] + "&page=" + (currentPage - 1)} className="text-black font-semibold text-sm cursor-pointer">← Previous</Link>}
        <input className="w-8 h-6 mx-2 text-center p-0 border-black rounded-md border-[1px]"
          value={value}
          onKeyDown={handleKeyDown}
          onChange={handleChange} /> of {pages}
        {currentPage < pages && <Link href={"?type=" + types[selectedIndex] + "&page=" + (currentPage + 1)} className="mx-2 text-black font-semibold text-sm cursor-pointer">Next →</Link>}
      </div>
    </div >
  );
};



export default Home;
