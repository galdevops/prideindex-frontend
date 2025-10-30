"use client";
import React, { useState } from "react";
import CountrySearch from "./CountrySearch";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import countriesData from "../data/countries.json";

const Topbar = ({ onSelectCountry }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center justify-between px-4 h-16">
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
          <span className="font-bold text-lg">MyMapApp</span>
        </div>

        {/* Right: CountrySearch / Mobile Search */}
        <div className="flex items-center">
          {/* Desktop */}
          <div className="hidden md:block w-64">
            <CountrySearch
              countries={countriesData.features}
              onSelectCountry={onSelectCountry}
            />
          </div>

          {/* Mobile: search icon */}
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

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed top-16 left-0 w-full px-4 z-50 md:hidden bg-white shadow-md max-h-[calc(100vh-4rem)] overflow-y-auto">
          <CountrySearch
            countries={countriesData.features}
            onSelectCountry={(country) => {
              onSelectCountry(country);
              setMobileSearchOpen(false);
            }}
          />
        </div>
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-gray-700 hover:text-cyan-500 focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>
        <ul className="mt-4 flex flex-col">
          <li className="p-4 hover:bg-cyan-100 cursor-pointer">Home</li>
          <li className="p-4 hover:bg-cyan-100 cursor-pointer">Contact</li>
          <li className="p-4 hover:bg-cyan-100 cursor-pointer">About</li>
        </ul>
      </div>
    </>
  );
};

export default Topbar;
