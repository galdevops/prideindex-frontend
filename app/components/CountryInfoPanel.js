"use client";
import React from "react";

const CountryInfoPanel = ({ country, onClose }) => {
  if (!country) return null;

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-gray-900 bg-opacity-95 text-white p-6 shadow-2xl overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4">{country.name}</h2>
      <p className="text-sm text-gray-400 mb-2">
        Continent: {country.continent || "Unknown"}
      </p>
      <p className="text-sm text-gray-400 mb-6">
        UN Region: {country.region_un || "Unknown"}
      </p>

      <div>
        <h3 className="text-lg font-semibold mb-2">Pride Index</h3>
        <ul className="space-y-2 text-sm">
          {country.pride_index?.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between border-b border-gray-700 pb-1"
            >
              <span className="capitalize">{Object.keys(item)[0]}</span>
              <span>{Object.values(item)[0]}</span>
            </li>
          )) || <p>No pride index data.</p>}
        </ul>
      </div>
    </div>
  );
};

export default CountryInfoPanel;
