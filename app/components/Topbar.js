"use client";
import React, { useEffect, useState } from "react";
import CountrySearch from "./CountrySearch";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import countriesData from "../../public/cc_geo.json";
import Link from "next/link";
import PrideAtlasLogo from "./PrideLogo";
import IconButton from "./ui/IconButton";
import ThemeToggle from "./ThemeToggle";

const Topbar = ({ countries, onSelectCountry }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const hasSearch = Boolean(countries && onSelectCountry);

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
      <div className="fixed top-0 left-0 w-full bg-surface border-b border-border shadow-md z-50 h-16 topbarbox">
        <div className="grid grid-cols-[48px_1fr_48px] md:grid-cols-3 items-center h-full px-4">
          {/* Left */}
          <div className="flex items-center justify-start">
            <IconButton
              icon={FiMenu}
              label="Open menu"
              aria-expanded={menuOpen}
              className="p-2"
              onClick={() => setMenuOpen(true)}
            />
          </div>

          {/* Center */}
          <div className="flex items-center justify-center">
            <PrideAtlasLogo />
          </div>

          {/* Right */}
          <div className="flex items-center justify-end">
            {hasSearch ? (
              <>
                <div className="hidden md:block w-64">
                  <CountrySearch
                    countries={countries}
                    onSelectCountry={onSelectCountry}
                  />
                </div>

                <div className="md:hidden flex items-center">
                  <IconButton
                    icon={mobileSearchOpen ? FiX : FiSearch}
                    label={mobileSearchOpen ? "Close search" : "Open search"}
                    className="p-2"
                    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  />
                </div>
              </>
            ) : (
              <div className="w-10" />
            )}
          </div>
        </div>
      </div>

      {hasSearch && mobileSearchOpen && (
        <div className="fixed top-0 left-0 w-full h-16 bg-surface z-[60] flex items-center px-4 shadow-md">
          <div className="flex-1">
            <CountrySearch
              countries={countries}
              onSelectCountry={(country) => {
                onSelectCountry(country);
                setMobileSearchOpen(false);
              }}
            />
          </div>
          <IconButton
            icon={FiX}
            label="Close search"
            className="ml-2 p-2"
            onClick={() => setMobileSearchOpen(false)}
          />
        </div>
      )}

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
        className={`fixed top-0 left-0 h-full w-64 bg-surface-elevated border-r border-border shadow-xl z-[60] flex flex-col transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          <span className="font-bold text-lg text-foreground">Menu</span>
          <IconButton
            icon={FiX}
            label="Close menu"
            className="p-2"
            onClick={() => setMenuOpen(false)}
          />
        </div>
        <ul className="mt-4 flex flex-col">
          <li className="hover:bg-brand/10">
            <Link
              href="/"
              className="block p-4 text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="hover:bg-brand/10">
            <Link
              href="/about"
              className="block p-4 text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </li>
        </ul>

        <div className="mt-auto border-t border-border p-4">
          <p className="mb-2 text-xs font-medium text-foreground-muted">
            Theme
          </p>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};

export default Topbar;
