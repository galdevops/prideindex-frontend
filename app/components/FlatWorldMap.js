"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const FlatWorldMap = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 2],      // Center for flat world view
      zoom: 1.2,            // Zoom adjusted to fit world in component
      projection: "mercator", // Flat projection,
      renderWorldCopies: false
    });

    map.on("load", () => {
      // Add countries GeoJSON source
      map.addSource("countries", {
        type: "geojson",
        data: "/countries.geojson",
      });

      // Add fill layer with neon cyan style
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
    });

    // Hover popup logic (console log PrideIndex for now)
    // map.on("mousemove", "country-fills", (e) => {
    //   if (e.features.length > 0) {
    //     const country = e.features[0].properties;
    //     console.log(`${country.name} PrideIndex:`, country.pride_index);
    //   }
    // });

    // Cursor pointer change
    map.on("mouseenter", "country-fills", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "country-fills", () => {
      map.getCanvas().style.cursor = "";
    });

    // Optional: click handler for future full data fetch
    map.on("click", "country-fills", (e) => {
      const country = e.features[0].properties;
      console.log("Clicked country:", country.name);
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className="w-full rounded-md shadow-lg h-screen" />;
};

export default FlatWorldMap;
