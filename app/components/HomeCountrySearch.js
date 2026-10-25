"use client";
import React from "react";
import CountryCombobox from "./CountryCombobox";

// Centered intro search shown over the map on the initial homepage state.
// The wrapper ignores pointer events so the map stays usable around the
// search; the blur layer softens the map behind it without blocking it.
const HomeCountrySearch = ({ countries, onSelectCountry, onExplore }) => (
  <div className="pointer-events-none fixed inset-x-0 bottom-0 top-16 z-[45] flex items-center justify-center px-4 [@media(max-height:32rem)]:items-start [@media(max-height:32rem)]:pt-4">
    <div aria-hidden="true" className="absolute inset-0 backdrop-blur-sm" />
    <section
      aria-label="Explore LGBTQ+ contributors around the world"
      className="pointer-events-auto relative w-full max-w-[34rem]"
    >
      <CountryCombobox
        countries={countries}
        onSelectCountry={onSelectCountry}
        label="Search for a country"
        placeholder="Search for a country"
        size="hero"
      />
      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={onExplore}
          className="min-h-11 rounded-md px-3 text-sm font-medium text-foreground underline underline-offset-4 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Take me to the world map instead
        </button>
      </div>
    </section>
  </div>
);

export default HomeCountrySearch;
