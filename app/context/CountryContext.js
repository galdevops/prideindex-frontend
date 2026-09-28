"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const CountryContext = createContext(null);

export const CountryProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryProfilesData, setCountryProfilesData] = useState(null);
  const [isProfilesLoading, setIsProfilesLoading] = useState(false);
  const [isProfilesLoaded, setIsProfilesLoaded] = useState(false);
  const [profilesError, setProfilesError] = useState(null);
  const [profilesNotice, setProfilesNotice] = useState(null);

  // Incremented on every select/clear/fetch so a slower, older profiles
  // response can't overwrite the country the user has since moved to.
  const latestRequestRef = useRef(0);

  const selectCountry = (country) => {
    latestRequestRef.current += 1;
    setSelectedCountry(country);
    setCountryProfilesData(null);
    setIsProfilesLoading(false);
    setIsProfilesLoaded(false);
    setProfilesError(null);
    setProfilesNotice(null);
  };

  const clearCountry = () => {
    latestRequestRef.current += 1;
    setSelectedCountry(null);
    setCountryProfilesData(null);
    setIsProfilesLoading(false);
    setIsProfilesLoaded(false);
    setProfilesError(null);
    setProfilesNotice(null);
  };

  const fetchCountryProfiles = async (countryCode, prideIndex) => {
    if (!countryCode) return null;

    latestRequestRef.current += 1;
    const requestId = latestRequestRef.current;
    const isStale = () => requestId !== latestRequestRef.current;

    if (!prideIndex || Object.keys(prideIndex).length === 0) {
      setCountryProfilesData(null);
      setIsProfilesLoading(false);
      setIsProfilesLoaded(false);
      setProfilesError(null);
      setProfilesNotice("No profiles were found.");
      return null;
    }

    setIsProfilesLoading(true);
    setIsProfilesLoaded(false);
    setProfilesError(null);
    setProfilesNotice(null);
    try {
      const response = await fetch(
        `https://pridedc.vercel.app/api/p/${encodeURIComponent(countryCode)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch country data");
      }

      const countryData = await response.json();

      if (isStale()) return null;

      setCountryProfilesData(countryData);
      setIsProfilesLoading(false);
      setIsProfilesLoaded(true);

      return countryData;
    } catch (error) {
      if (isStale()) return null;

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
      profilesNotice,
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
      profilesNotice,
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