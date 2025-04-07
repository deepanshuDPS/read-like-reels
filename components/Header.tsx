"use client";

import React, { useEffect, useState } from "react";

const Header = () => {

  // pb-4
  return (
    <nav className=" bg-gray-100">
      <div className="z-10 max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/Icon/favicon.ico" className="h-4 md:h-8" />
          <span className="self-center text-sm md:text-base font-semibold whitespace-nowrap ">Read like Reels</span>
        </a>
        {/* 
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-8 h-8 md:w-10 md:h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}>
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className={`${
          isMenuOpen ? 'block' : 'hidden'
        } w-full md:block md:w-auto`} id="navbar-default">
          <ul className={"text-lg font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-transparent"}>
            <li>
              <Link to="/" className={"block py-2 px-3 rounded md:p-0 md:hover:text-blue-700 " + checkPage("/")} >Home</Link>
            </li>
            <li>
              <Link to="/about" className={"block py-2 px-3 rounded md:p-0 md:hover:text-blue-700  " + checkPage("/about")}  >About</Link>
            </li>
            <li>
              <Link to="/contact-us" className={"block py-2 px-3 rounded md:p-0 md:hover:text-blue-700  " + checkPage("/contact-us")} >Contact</Link>
            </li>
          </ul>
        </div>
         */}
      </div>
    </nav>

  );
};

export default Header;


