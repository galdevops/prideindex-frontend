"use client";
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import mapboxgl from "mapbox-gl";
import CountryInfoPanel from "./CountryInfoPanel";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const WorldMap = forwardRef(({ selectedCountry, onSelectCountry }, ref) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

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
          "fill-color": "#0ff",
          "fill-opacity": 0.3,
          "fill-outline-color": "#0ff",
        },
      });

      map.addLayer({
        id: "country-hover",
        type: "fill",
        source: "countries",
        paint: {
          "fill-color": "#0ff",
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
          "line-color": "#0ff",
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
          speed: 0.8
        });
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />
      {/* Radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />

      {selectedCountry && (
        <CountryInfoPanel
          country={selectedCountry}
          onClose={() => onSelectCountry(null)}
        />
      )}
    </div>
  );
});

export default WorldMap;
