"use client";
import React from "react";
import { FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import { useCountry } from "../context/CountryContext";
import IconButton from "./ui/IconButton";

const CountryInfoPanel = ({ onAspectSelect }) => {
  const {
    selectedCountry: country,
    clearCountry,
    isProfilesLoading,
    isProfilesLoaded,
    profilesError,
    profilesNotice,
  } = useCountry();

  if (!country) return null;

  return (
    <div
      id="country-info-panel"
      className="fixed bottom-0 left-0 right-0 md:absolute md:top-0 md:right-0 md:w-80 bg-surface-elevated text-foreground border-t md:border-t-0 md:border-l border-border p-6 shadow-2xl rounded-t-lg md:rounded-none z-40 max-h-[80vh] overflow-y-auto"
    >
      <IconButton
        icon={FiX}
        label="Close panel"
        size={20}
        className="absolute top-1 right-1 p-3"
        onClick={clearCountry}
      />

      <h2 className="text-2xl font-bold mb-4">{country.name}</h2>
      <p className="text-sm text-foreground-muted mb-1">
        Continent: {country.continent || "Unknown"}
      </p>
      <p className="text-sm text-foreground-muted mb-3">
        UN Region: {country.region_un || "Unknown"}
      </p>

      <div className="flex items-center justify-between mb-6 border-b border-border pb-3">
        <span className="text-sm text-foreground-secondary">Profiles loaded</span>

        {isProfilesLoading ? (
          <div className="h-5 w-5 rounded-full border-2 border-border-strong border-t-brand animate-spin" />
        ) : profilesError ? (
          <FiAlertCircle
            size={20}
            className="text-danger"
            aria-label="Failed to load profiles"
          />
        ) : profilesNotice ? (
          <FiAlertCircle
            size={20}
            className="text-warning"
            aria-label={profilesNotice}
          />
        ) : isProfilesLoaded ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand text-brand">
            <FiCheck size={12} />
          </div>
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-border-strong" />
        )}
      </div>

      {profilesError && (
        <p className="text-sm text-danger mb-4">{profilesError}</p>
      )}
      {profilesNotice && (
        <p className="text-sm text-warning mb-4">{profilesNotice}</p>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-3">Pride Index</h3>

        {country.pride_index && Object.keys(country.pride_index).length > 0 ? (
          <ul className="space-y-2 text-sm">
            {Object.entries(country.pride_index).map(([aspect, score], idx) => (
              <li key={idx} className="border-b border-border">
                <button
                  type="button"
                  className="flex w-full justify-between items-center py-2 text-left hover:text-brand transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  onClick={() => onAspectSelect(aspect)}
                >
                  <span className="capitalize">{aspect}</span>
                  <span className="font-semibold">{score}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-foreground-muted text-sm">No pride index data.</p>
        )}
      </div>
    </div>
  );
};

export default CountryInfoPanel;