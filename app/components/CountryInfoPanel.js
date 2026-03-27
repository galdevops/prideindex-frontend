"use client";
import React from "react";
import { useCountry } from "../context/CountryContext";

const CountryInfoPanel = ({ onAspectSelect }) => {
  const {
    selectedCountry: country,
    clearCountry,
    isProfilesLoading,
    isProfilesLoaded,
  } = useCountry();

  if (!country) return null;

  return (
    <div
      id="country-info-panel"
      className="fixed bottom-0 left-0 right-0 md:absolute md:top-0 md:right-0 md:w-80 bg-gray-900 bg-opacity-95 text-white p-6 shadow-2xl rounded-t-2xl md:rounded-none z-40 max-h-[80vh] overflow-y-auto"
    >
      <button
        onClick={clearCountry}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4">{country.name}</h2>
      <p className="text-sm text-gray-400 mb-1">
        Continent: {country.continent || "Unknown"}
      </p>
      <p className="text-sm text-gray-400 mb-3">
        UN Region: {country.region_un || "Unknown"}
      </p>

      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
        <span className="text-sm text-gray-300">Profiles loaded</span>

        {isProfilesLoading ? (
          <div className="h-5 w-5 rounded-full border-2 border-gray-600 border-t-cyan-400 animate-spin" />
        ) : isProfilesLoaded ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-cyan-400 text-cyan-400 text-xs font-bold">
  v
</div>
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Pride Index</h3>

        {country.pride_index && Object.keys(country.pride_index).length > 0 ? (
          <ul className="space-y-2 text-sm">
            {Object.entries(country.pride_index).map(([aspect, score], idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b border-gray-700 pb-2 cursor-pointer hover:text-cyan-400 transition-colors"
                onClick={() => onAspectSelect(aspect)}
              >
                <span className="capitalize">{aspect}</span>
                <span className="font-semibold">{score}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No pride index data.</p>
        )}
      </div>
    </div>
  );
};

export default CountryInfoPanel;