"use client";
import React from "react";
import CountryCombobox from "./CountryCombobox";

// Persistent (Topbar) country search. Behavior lives in CountryCombobox.
const CountrySearch = ({ countries, onSelectCountry }) => (
  <CountryCombobox
    countries={countries}
    onSelectCountry={onSelectCountry}
    label="Search for a country"
    placeholder="Search for a country"
  />
);

export default CountrySearch;
