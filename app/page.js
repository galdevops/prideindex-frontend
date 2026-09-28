"use client";
import { useRef } from "react";
import WorldMap from "./components/WorldMapTest";
import countriesData from "../public/cc_geo.json";
import Topbar from "./components/Topbar";
import { useCountry } from "./context/CountryContext";

export default function Home() {
  const worldMapRef = useRef(null);
  const { selectCountry, fetchCountryProfiles } = useCountry();

  // Same path as a map click: update context, load profiles, then let the map
  // highlight and fly to the country.
  const handleSearchSelect = (country) => {
    const countryProps = country.properties;

    let prideIndex = {};
    try {
      prideIndex = JSON.parse(countryProps.pride_index || "{}");
    } catch {
      prideIndex = {};
    }

    selectCountry({
      name: countryProps.name,
      continent: countryProps.continent,
      region_un: countryProps.region_un,
      country_code: countryProps.iso_a2,
      pride_index: prideIndex,
    });
    worldMapRef.current?.selectCountry(countryProps);
    fetchCountryProfiles(countryProps.iso_a2, prideIndex);
  };

  return (
    <div className="">
      <h1 className="sr-only">Worldwide Pride Index</h1>
      <Topbar
        countries={countriesData.features}
        onSelectCountry={handleSearchSelect}
      />
      <div className="pt-16"></div>
      <WorldMap ref={worldMapRef} />
    </div>
  );
}
