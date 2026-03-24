"use client";
import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import PrideAtlasLogo from "./PrideLogo";

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-16 topbarbox">
        <div className="grid grid-cols-3 items-center h-full px-4">
          {/* Left */}
          <div className="flex items-center justify-start">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="p-2 text-gray-700 hover:text-cyan-500 focus:outline-none"
            >
              <FiMenu size={24} />
            </button>
          </div>

          {/* Center */}
          <div className="flex items-center justify-center">
            <PrideAtlasLogo />
          </div>

          {/* Right placeholder for balance */}
          <div className="flex items-center justify-end">
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 bg-black/30 z-50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-[60] transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <span className="font-bold text-lg text-gray-700">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 text-gray-700 hover:text-cyan-500 focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>

        <ul className="mt-4 flex flex-col">
          <li className="hover:bg-cyan-100">
            <Link
              href="/"
              className="block p-4 text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="hover:bg-cyan-100">
            <Link
              href="/about"
              className="block p-4 text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Topbar;