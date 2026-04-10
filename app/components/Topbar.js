"use client";
import React, { useState } from "react";
import CountrySearch from "./CountrySearch";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import countriesData from "../../public/cc_geo.json";
import Link from "next/link";
import PrideAtlasLogo from "./PrideLogo";

const Topbar = ({ onSelectCountry }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-16 topbarbox">
        <div className="grid grid-cols-[48px_1fr_48px] md:grid-cols-3 items-center h-full px-4">
          {/* Left */}
          <div className="flex items-center justify-start">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 text-gray-700 hover:text-cyan-500 focus:outline-none"
            >
              <FiMenu size={24} />
            </button>
          </div>

          {/* Center */}
          <div className="flex items-center justify-center">
            <PrideAtlasLogo />
          </div>

          {/* Right */}
          <div className="flex items-center justify-end">
            <div className="hidden md:block w-64">
              <CountrySearch
                countries={countriesData.features}
                onSelectCountry={onSelectCountry}
              />
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="p-2 text-gray-700 hover:text-cyan-500 focus:outline-none"
              >
                {mobileSearchOpen ? <FiX size={24} /> : <FiSearch size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="fixed top-0 left-0 w-full h-16 bg-white z-[60] flex items-center px-4 shadow-md">
          <div className="flex-1">
            <CountrySearch
              countries={countriesData.features}
              onSelectCountry={(country) => {
                onSelectCountry(country);
                setMobileSearchOpen(false);
              }}
            />
          </div>
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="ml-2 p-2 text-gray-700 hover:text-cyan-500 focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>
      )}

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