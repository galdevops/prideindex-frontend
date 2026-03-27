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

  const setProfilesLoading = (loading) => {
    setIsProfilesLoading(loading);
    if (loading) {
      setIsProfilesLoaded(false);
      setProfilesError(null);
    }
  };

  const setProfilesSuccess = (data) => {
    setCountryProfilesData(data);
    setIsProfilesLoading(false);
    setIsProfilesLoaded(true);
    setProfilesError(null);
  };

  const setProfilesFailure = (error) => {
    setCountryProfilesData(null);
    setIsProfilesLoading(false);
    setIsProfilesLoaded(false);
    setProfilesError(error || "Failed to load profiles");
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
      setProfilesLoading,
      setProfilesSuccess,
      setProfilesFailure,
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
    <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
  );
};

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
};