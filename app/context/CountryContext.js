"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

const CountryContext = createContext(null);

export const CountryProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryProfilesData, setCountryProfilesData] = useState(null);
  const [isProfilesLoading, setIsProfilesLoading] = useState(false);
  const [isProfilesLoaded, setIsProfilesLoaded] = useState(false);
  const [profilesError, setProfilesError] = useState(null);

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setCountryProfilesData(null);
    setIsProfilesLoading(false);
    setIsProfilesLoaded(false);
    setProfilesError(null);
  };

  const clearCountry = () => {
    setSelectedCountry(null);
    setCountryProfilesData(null);
    setIsProfilesLoading(false);
    setIsProfilesLoaded(false);
    setProfilesError(null);
  };

  const fetchCountryProfiles = async (countryCode) => {
    if (!countryCode) return null;

    setIsProfilesLoading(true);
    setIsProfilesLoaded(false);
    setProfilesError(null);

    console.log("Fetching country profiles for:", countryCode);

    try {
      const response = await fetch(
        `https://pridedc.vercel.app/api/p/${encodeURIComponent(countryCode)}`
      );

      console.log("Fetching country profiles for:", countryCode);
      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch country data");
      }

      const countryData = await response.json();

      console.log("Fetched country data:", countryData);

      setCountryProfilesData(countryData);
      setIsProfilesLoading(false);
      setIsProfilesLoaded(true);

      return countryData;
    } catch (error) {
      console.error("Error fetching country data:", error);
      setCountryProfilesData(null);
      setIsProfilesLoading(false);
      setIsProfilesLoaded(false);
      setProfilesError(error.message || "Failed to fetch country data");
      return null;
    }
  };

  const value = useMemo(
    () => ({
      selectedCountry,
      countryProfilesData,
      isProfilesLoading,
      isProfilesLoaded,
      profilesError,
      selectCountry,
      clearCountry,
      fetchCountryProfiles,
    }),
    [
      selectedCountry,
      countryProfilesData,
      isProfilesLoading,
      isProfilesLoaded,
      profilesError,
    ]
  );

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => {
  const context = useContext(CountryContext);

  if (!context) {
    throw new Error("useCountry must be used within CountryProvider");
  }

  return context;
};