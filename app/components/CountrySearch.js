"use client";
import React, { useState } from "react";

const CountrySearch = ({ countries, onSelectCountry }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setNotFound(false);

    if (value.length > 0) {
      const matches = countries
        .filter((c) =>
          c.properties.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5); // limit suggestions
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (country) => {
    setSearch("");
    setSuggestions([]);
    setNotFound(false);
    if (onSelectCountry) {
      onSelectCountry(country);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else {
      setNotFound(true);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="country-search-input" className="sr-only">
          Search country
        </label>
        <input
          id="country-search-input"
          type="text"
          value={search}
          onChange={handleChange}
          placeholder="Search country..."
          className="w-full p-2 rounded-md border border-border-strong bg-surface text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand"
        />
        {suggestions.length > 0 && (
          <ul className="absolute w-full bg-surface-elevated border border-border mt-1 rounded-md max-h-40 overflow-y-auto z-50 shadow-lg">
            {suggestions.map((country) => (
              <li key={country.properties.iso_a2}>
                <button
                  type="button"
                  className="w-full text-left p-2 hover:bg-brand/10 focus:bg-brand/10 focus:outline-none cursor-pointer text-foreground"
                  onClick={() => handleSelect(country)}
                >
                  {country.properties.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
      {notFound && (
        <p className="mt-1 text-sm text-warning">Country not found.</p>
      )}
    </div>
  );
};

export default CountrySearch;
