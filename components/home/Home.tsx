"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";

type WritingProps = {
  writings: any[] | null;
  type: string
  pages: number
  currentPage: number
}

const Home = ({ writings, type, pages, currentPage }: WritingProps) => {

  const [isSearching, setSearchProgress] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  // Breakpoints for different screen sizes
  const breakpointColumns = {
    default: 3, // 3 columns on large screens
    1024: 2, // 2 columns on medium screens
    640: 1, // 1 column on small screens
  };

  const searchWriting = async (userPrompt: string) => {
    setSearchProgress(true)
    try {
      const response = await fetch("/api/search", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt
        }),
      })
      let data = (await response.json())['data'] ?? []
      if (data.length == 0) {
        alert("Nothing Found")
      }
      setSearchResults(data)
      setSearchProgress(false)
    } catch (e: any) {
      setSearchProgress(false)
    }
  }



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
  const [searchText, setSearchText] = useState('')
  const router = useRouter()

  const searchTextClick = (textToSearch: string | null = null) => {

    if(textToSearch!=null){
      setSearchText(textToSearch)
      searchWriting(textToSearch);
    }
    else if (searchText.length < 3) {
      alert("Search length must be greator than 3")
    } else {
      searchWriting(searchText);
    }
  }

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

  const handleKeyDownSearch = (e: any) => {
    if (e.key === "Enter") {
      searchTextClick()
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
          <div className="flex flex-row bg-white rounded-full  py-1 pl-6 pr-1 my-4 w-[300px] md:w-[700px] opacity-50 pointer-events-none">
            {/* shadow-md */}
            <input className="bg-transparent w-full border-none outline-none "
              placeholder="Coming Soon..." value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              onKeyDown={handleKeyDownSearch}
              maxLength={50} />
            {searchResults.length != 0 && <button className="bg-gray-200 h-fit self-center px-2 py-1 rounded-full text-xs mx-2" onClick={() => {
              setSearchResults([])
              setSearchText('')
            }}>Clear</button>}
            <button className="bg-black rounded-full px-4 md:px-16 py-2 text-white text-sm font-medium pa" onClick={() => {
              // generateEmbeddedText()
              // searchTextClick()
            }}>Search</button>
          </div>
          {false && <div className="flex flex-wrap justify-center overflow-x-clip space-x-2 items-center">
            {['what is results',
              'how to make decisions',
              'meaning of life',
              'about love'].map((it) => (<button className="rounded-full bg-gray-200 px-2 shadow-sm my-1"
                onClick={() => {
                  searchTextClick(it)
                }}>
                {it}
              </button>))}
          </div>}
        </div>

        <div className="flex w-full flex-col-reverse items-center bg-gray-200 rounded-b-[64px] absolute h-32 bottom-0 px-8 md:px-40 px-auto">
          <div className="flex flex-row justify-start md:justify-center gap-5 md:gap-14 mb-4 overflow-x-scroll md:overflow-x-hidden w-[300px] md:w-full" style={{ scrollbarWidth: 'none' }}>
            {menuItems.map((item, index) => (
              <Link key={index} className={`cursor-pointer ` + (selectedIndex === index && searchResults.length == 0 ? "text-blue-700 font-semibold text-[17px] md:text-xl" : "text-gray-500 font-medium text-base md:text-lg ")}
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
        {isSearching && <div className="text-center mt-4">
          <p className="text-lg font-semibold text-gray-700 animate-fadeInOut">
            Searching...
          </p>
        </div>}
        {!isSearching && searchResults.length == 0 && <Masonry
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
        </Masonry>}
        {!isSearching && searchResults.length != 0 && <div className="px-6 text-sm text-gray-600 mt-4">{searchResults.length} Search Results...</div>}
        {!isSearching && searchResults.length != 0 && <Masonry
          breakpointCols={breakpointColumns}
          className="flex gap-6 p-6"
          style={{ fontFamily: "Tiro Devanagari Hindi" }}
          columnClassName="masonry-column"
        >
          {searchResults?.map((item, index) => {
            let sIndex = types.indexOf(item.type)
            let maxLength = menuItems[sIndex].maxLength || 200;
            let text = item.text
            let textTrimmed = item.text.replace(/\\n/g, "").length > maxLength
            return (<div
              className={`relative bg-[#fdfbfb] shadow-md px-6 pb-6 pt-12 rounded-xl mb-6 cursor-pointer`}
              onClick={() => {
                if (!menuItems[sIndex].readMode) {
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
              <div className="text-sm -mt-1">{item.type[0].toUpperCase() + item.type.substring(1)}</div>
              <p className="text-base text-black mb-2" dangerouslySetInnerHTML={{ __html: !openedIndexes.includes(index) ? text.replace(/\\n/g, "<br/>").substring(0, maxLength) : text.replace(/\\n/g, "<br/>") }} />
              {textTrimmed && !openedIndexes.includes(index) &&
                <button className="flex items-center text-black font-semibold mt-2">
                  Read more <span className="ml-2">→</span>
                </button>}
              <h2 className="text-xs font-light text-black my-1 italic">- {item.author}</h2>
            </div>)
          })}
        </Masonry>}
      </div>
      {searchResults.length == 0 && !isSearching && (writings?.length ?? 0) > 0 && <div className="flex flex-row justify-center items-center">
        {currentPage > 1 && <Link href={"?type=" + types[selectedIndex] + "&page=" + (currentPage - 1)} className="text-black font-semibold text-sm cursor-pointer">← Previous</Link>}
        <input className="w-8 h-6 mx-2 text-center p-0 border-black rounded-md border-[1px]"
          value={value}
          onKeyDown={handleKeyDown}
          onChange={handleChange} /> of {pages}
        {currentPage < pages && <Link href={"?type=" + types[selectedIndex] + "&page=" + (currentPage + 1)} className="mx-2 text-black font-semibold text-sm cursor-pointer">Next →</Link>}
      </div>}
    </div >
  );
};



export default Home;
