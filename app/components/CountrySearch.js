"use client";
import React, { useState } from "react";

const CountrySearch = ({ countries, onSelectCountry }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

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
    setSearch(country.properties.name);
    setSuggestions([]);
    if (onSelectCountry) {
      onSelectCountry(country);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else {
      alert("Country not found");
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={search}
          onChange={handleChange}
          placeholder="Search country..."
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        {suggestions.length > 0 && (
          <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md max-h-40 overflow-y-auto z-50">
            {suggestions.map((country) => (
              <li
                key={country.properties.ne_id}
                className="p-2 hover:bg-cyan-100 cursor-pointer text-gray-800"
                onClick={() => handleSelect(country)}
              >
                {country.properties.name}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default CountrySearch;
