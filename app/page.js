"use client";
import { useRef, useState } from "react";
import WorldMap from "./components/WorldMap";
import countriesData from "./data/countries.json";
import Topbar from "./components/Topbar";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const worldMapRef = useRef(null);

  return (
    <div className="">
      <Topbar
        countries={countriesData.features}
        onSelectCountry={(country) => {
          const countryProps = country.properties;
          const lat = parseFloat(countryProps.label_y);
          const lng = parseFloat(countryProps.label_x);
          const panel = document.getElementById("country-info-panel");
        let offsetY = 0;
        if (panel) {
          // Get panel height and move half of it upward
          offsetY = panel.offsetHeight / 2;
        }
          worldMapRef.current.flyTo({
          center: [lng, lat],
          zoom: 4,
          essential: true,
          speed: 0.8,
          offset: [0, -offsetY]
        });

          setSelectedCountry({
            name: countryProps.name,
            continent: countryProps.continent,
            region_un: countryProps.region_un,
            pride_index: countryProps.pride_index || "[]",
          });
          worldMapRef.current.selectCountry(countryProps);
        }}
      />
      <div className="pt-16"></div>
      <WorldMap
        ref={worldMapRef}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
      />
    </div>
  );
}
