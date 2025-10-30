"use client";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import mapboxgl from "mapbox-gl";
import CountryInfoPanel from "./CountryInfoPanel";
import AspectModal from "./AspectModal";
import IndividualModal from "./IndividualModal";

import countryData from "../data/example.json";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const WorldMap = forwardRef(({ selectedCountry, onSelectCountry }, ref) => {
  const cCyan = "#0ff";
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  // === Country Aspect Exploration state ===
  const [selectedAspect, setSelectedAspect] = useState(null);
  const [showAspectModal, setShowAspectModal] = useState(false);
  const [countryDetails, setCountryDetails] = useState(null);
  const [selectedIndividual, setSelectedIndividual] = useState(null);
  const [showIndividualModal, setShowIndividualModal] = useState(false);

  const handleSelectAspect = (aspectName) => {
    setSelectedAspect(aspectName);
    setShowAspectModal(true);
  };

  const handleCloseAspectModal = () => {
    setShowAspectModal(false);
    setSelectedAspect(null);
  };

  // When an individual is selected from AspectModal
  const handleSelectIndividual = (person) => {
    setSelectedIndividual(person);
    setShowIndividualModal(true);
  };

  // When closing individual modal
  const handleCloseIndividualModal = () => {
    setShowIndividualModal(false);
    setSelectedIndividual(null);
  };

  const getIndividualsForAspect = (country, aspectName) => {
      const aspects = country.aspects
      const individuals = aspects[aspectName] || []
      return individuals
    };

  useImperativeHandle(ref, () => ({
    flyTo: (coords) => {
      if (mapRef.current) {
        mapRef.current.flyTo({ center: coords, zoom: 3 });
      }
    },
    selectCountry: (countryProps) => {
      if (!mapRef.current) return;

      const map = mapRef.current;

      // Highlight country
      map.setFilter("country-selected", ["==", "ne_id", countryProps.ne_id]);

      // Fly to country
      const lat = parseFloat(countryProps.label_y);
      const lng = parseFloat(countryProps.label_x);
      map.flyTo({ center: [lng, lat], zoom: 4, essential: true, speed: 0.8 });
    },
  }));

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 20],
      zoom: 1.5,
      minZoom: 1,
      maxZoom: 5,
      dragRotate: false,
      pitchWithRotate: false,
      projection: "mercator", // Flat projection,
      renderWorldCopies: false, // Flat projection,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("countries", {
        type: "geojson",
        data: "/countries.geojson",
      });

      // Hide all built-in label layers except country names
      const layers = map.getStyle().layers;
      layers.forEach((layer) => {
        if (
          layer.type === "symbol" &&
          layer.layout &&
          layer.layout["text-field"] &&
          !layer.id.includes("country")
        ) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      map.addLayer({
        id: "country-fills",
        type: "fill",
        source: "countries",
        paint: {
          "fill-color": cCyan,
          "fill-opacity": 0.3,
          "fill-outline-color": cCyan,
        },
      });

      map.addLayer({
        id: "country-hover",
        type: "fill",
        source: "countries",
        paint: {
          "fill-color": cCyan,
          "fill-opacity": 0.4, // stronger glow
        },
        filter: ["==", "ne_id", ""], // initially nothing is highlighted
      });

      // Add a layer for selected country
      map.addLayer({
        id: "country-selected",
        type: "line",
        source: "countries",
        paint: {
          "line-color": cCyan,
          "line-width": 2,
        },
        filter: ["==", "ne_id", ""], // initially nothing is selected
      });

      // Update hover
      map.on("mousemove", "country-fills", (e) => {
        if (e.features.length > 0) {
          const iso = e.features[0].properties.ne_id;
          map.setFilter("country-hover", ["==", "ne_id", iso]);
        } else {
          map.setFilter("country-hover", ["==", "ne_id", ""]);
        }
      });

      // Hover pointer
      map.on("mouseenter", "country-fills", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "country-fills", () => {
        map.getCanvas().style.cursor = "";
        map.setFilter("country-hover", ["==", "name", ""]);
      });

      // Click handler — set selected country
      map.on("click", "country-fills", (e) => {
        const countryProps = e.features[0].properties;

        // GeoJSON stores nested data as strings — parse it
        let prideIndex = [];
        try {
          prideIndex = JSON.parse(countryProps.pride_index);
        } catch {
          prideIndex = [];
        }

        onSelectCountry({
          name: countryProps.name,
          continent: countryProps.continent,
          region_un: countryProps.region_un,
          pride_index: prideIndex,
        });

        // In click handler, after onSelectCountry
        const iso = countryProps.ne_id;
        map.setFilter("country-selected", ["==", "ne_id", iso]);

        // Fly to clicked country
        const lat = parseFloat(countryProps.label_y);
        const lng = parseFloat(countryProps.label_x);
        map.flyTo({
          center: [lng, lat],
          zoom: 4,
          essential: true,
          speed: 0.8,
        });
      });

      // Fetch detailed country data asynchronously in the background
      (async () => {
        try {
          // const response = await fetch(
          //   `https://external-api.com/country/?country=${encodeURIComponent(
          //     countryProps.name
          //   )}`
          // );
          // if (!response.ok) throw new Error("Failed to fetch country data");
          // const countryData = await response.json();

          // Store countryData in state for AspectModal and related components
          let countryDataset = countryData
          setCountryDetails(countryDataset); // <-- make sure setCountryDetails is useState in WorldMap.js
        } catch (error) {
          console.error("Error fetching country data:", error);
        }
      })();
    });

    return () => map.remove();
  }, []);

  return (
    <div className="relative w-full h-screen z-40 overflow-hidden">
      <div ref={mapContainer} className="relative w-full h-screen md:h-full" />
      {/* Radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />

      {selectedCountry && (
        <CountryInfoPanel
          country={selectedCountry}
          onClose={() => onSelectCountry(null)}
          onAspectSelect={handleSelectAspect}
        />
      )}
      {showAspectModal && selectedAspect && countryDetails && (
        <AspectModal
          aspectName={selectedAspect}
          individuals={getIndividualsForAspect(countryDetails, selectedAspect)}
          onClose={handleCloseAspectModal}
          onSelectIndividual={handleSelectIndividual}
        />
      )}

      {showIndividualModal && selectedIndividual && (
        <IndividualModal
          individual={selectedIndividual}
          onClose={handleCloseIndividualModal}
        />
      )}

      <div id="modal-root" className="z-50" />
    </div>
  );
});

export default WorldMap;
