"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const FullViewWorldMap = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 20],
      zoom: 1.5,
        projection: "globe",
        renderWorldCopies: false
    });

    map.on("load", () => {
      map.addSource("countries", {
        type: "geojson",
        data: "/countries.geojson",
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

      map.on("mouseenter", "country-fills", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "country-fills", () => {
        map.getCanvas().style.cursor = "";
      });

      // Hover event: just log PrideIndex
    //   map.on("mousemove", "country-fills", (e) => {
    //     if (e.features.length > 0) {
    //       const country = e.features[0].properties;
    //       console.log(country.name, country.pride_index);
    //     }
    //   });

      map.on("click", "country-fills", (e) => {
        const country = e.features[0].properties;
        console.log("Clicked country:", country.name);
        });

    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className="w-full h-screen" />;
};

export default FullViewWorldMap;
