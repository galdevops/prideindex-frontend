"use client";
import { useRef, useState } from "react";
import CountrySearch from "./components/CountrySearch";
import WorldMap from "./components/WorldMap";
import countriesData from "./data/countries.json";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const worldMapRef = useRef(null);

  return (
    <div className="p-8">
      <CountrySearch
        countries={countriesData.features}
        
        onSelectCountry={(country) => {
          const countryProps = country.properties
          const lat = parseFloat(countryProps.label_y);
          const lng = parseFloat(countryProps.label_x);
          worldMapRef.current.flyTo([lng, lat]);

          setSelectedCountry({
            name: countryProps.name,
            continent: countryProps.continent,
            region_un: countryProps.region_un,
            pride_index: countryProps.pride_index || "[]",
          });
          worldMapRef.current.selectCountry(country.properties)
        }}
      />

      <WorldMap
        ref={worldMapRef}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
      />
    </div>
  );
}
