"use client";
import { useRef } from "react";
import WorldMap from "./components/WorldMapTest";
import useCountriesData from "./lib/useCountriesData";
import Topbar from "./components/Topbar";
import { useCountry } from "./context/CountryContext";

export default function Home() {
  const worldMapRef = useRef(null);
  const { selectCountry, fetchCountryProfiles } = useCountry();
  const { status, data: countriesData, retry } = useCountriesData();

  // Same path as a map click: update context, load profiles, then let the map
  // highlight and fly to the country.
  const handleSearchSelect = (country) => {
    const countryProps = country.properties;

    // Search features come from the API dataset, where pride_index is
    // already an object. (Map clicks get Mapbox-serialized properties, where
    // it is a JSON string.)
    let prideIndex = {};
    const rawPrideIndex = countryProps.pride_index;
    if (rawPrideIndex && typeof rawPrideIndex === "object") {
      prideIndex = rawPrideIndex;
    } else if (typeof rawPrideIndex === "string") {
      try {
        prideIndex = JSON.parse(rawPrideIndex || "{}");
      } catch {
        prideIndex = {};
      }
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
      <h1 className="sr-only">PrideAtlas</h1>
      <Topbar
        countries={countriesData?.features}
        onSelectCountry={handleSearchSelect}
      />
      <div className="pt-16"></div>

      {status === "ready" && (
        <WorldMap ref={worldMapRef} countriesData={countriesData} />
      )}

      {status === "loading" && (
        <div
          role="status"
          className="flex h-[calc(100dvh-4rem)] w-full items-center justify-center text-foreground-secondary"
        >
          Loading map
          <span aria-hidden="true" className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="flex h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center gap-4 px-6 text-center"
        >
          <h2 className="text-h3 font-bold text-foreground">Oops...</h2>
          <p className="max-w-sm text-foreground-secondary">
            We couldn&apos;t load the map right now. Please check your
            connection and try again in a moment.
          </p>
          <button
            type="button"
            onClick={retry}
            className="min-h-11 rounded-md border border-brand px-5 text-brand hover:bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
