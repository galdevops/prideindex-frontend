"use client";
import React, { useState } from "react";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import Link from "next/link";

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center justify-between px-4 h-16 topbarbox">
        {/* Left: Hamburger */}
        <div className="flex items-center">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 text-gray-700 hover:text-cyan-500 focus:outline-none"
          >
            <FiMenu size={24} />
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          {/* <span className="font-bold text-lg text-gray-700">Worldwide Pride Index</span> */}
          <Link href="/" className="font-bold text-lg text-gray-700">
            Worldwide Pride Index
          </Link>
        </div>

      </div>

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <span className="font-bold text-lg text-gray-700">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-gray-700 hover:text-cyan-500 focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>
        <ul className="mt-4 flex flex-col">
          {/* <li className="p-4 hover:bg-cyan-100 cursor-pointer text-gray-700">Home</li>
          <li className="p-4 hover:bg-cyan-100 cursor-pointer text-gray-700">About</li> */}
          <li className="hover:bg-cyan-100">
    <Link href="/" className="block p-4 text-gray-700">
      Home
    </Link>
  </li>
  <li className="hover:bg-cyan-100">
    <Link href="/about" className="block p-4 text-gray-700">
      About
    </Link>
  </li>
        </ul>
      </div>
    </>
  );
};

export default Topbar;
