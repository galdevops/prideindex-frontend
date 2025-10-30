"use client";
import { useRef, useState } from "react";
import WorldMap from "./components/WorldMap";
import countriesData from "./data/countries.json";
import Topbar from "./components/Topbar";


export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const worldMapRef = useRef(null);

  const handleSearchCountryFlyTo = (countryProps) => {
    const lat = parseFloat(countryProps.label_y);
    const lng = parseFloat(countryProps.label_x);

    let offset = [0, 0]; // default for desktop
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      const panel = document.getElementById("country-info-panel");
      const offsetY = panel ? panel.offsetHeight / 2 : 0;
      offset = [0, -offsetY];
    }

    worldMapRef.current.flyTo({ center: [lng, lat], zoom: 4, essential: true, speed: 0.8, offset });
    worldMapRef.current.selectCountry(countryProps);
  };

  return (
    <div className="">
      <Topbar
        countries={countriesData.features}
        onSelectCountry={(country) => {
          const countryProps = country.properties;
          
          const lat = parseFloat(countryProps.label_y);
          const lng = parseFloat(countryProps.label_x);
          const isMobile = window.matchMedia("(max-width: 767px)").matches;
          let offsetY = 0;

          if (isMobile) {
            setTimeout(() => {
              const panel = document.getElementById("country-info-panel");
              offsetY = panel ? panel.offsetHeight / 2 : 0;

              worldMapRef.current.flyTo({
                center: [lng, lat],
                zoom: 4,
                essential: true,
                speed: 0.8,
                offset: [0, -offsetY],
              });
            }, 150);
          }
          else {
            worldMapRef.current.flyTo({
            center: [lng, lat],
            zoom: 4,
            essential: true,
            speed: 0.8,
            offset: [0, -offsetY]
          });}

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
