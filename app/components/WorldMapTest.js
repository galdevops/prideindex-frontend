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
import { useCountry } from "../context/CountryContext";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const WorldMap = forwardRef((props, ref) => {
  const cCyan = "#0ff";
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const latestRequestIdRef = useRef(0);

  const {
    selectedCountry,
    countryProfilesData,
    isProfilesLoading,
    isProfilesLoaded,
    selectCountry,
    clearCountry,
    setProfilesLoading,
    setProfilesSuccess,
    setProfilesFailure,
  } = useCountry();

  const [selectedAspect, setSelectedAspect] = useState(null);
  const [showAspectModal, setShowAspectModal] = useState(false);
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

  const handleSelectIndividual = (person) => {
    setSelectedIndividual(person);
    setShowIndividualModal(true);
  };

  const handleCloseIndividualModal = () => {
    setShowIndividualModal(false);
    setSelectedIndividual(null);
  };

  const getIndividualsForAspect = (countryData, aspectName) => {
    const aspects = countryData?.aspects || {};
    return aspects[aspectName] || [];
  };

  useImperativeHandle(ref, () => ({
    flyTo: (options) => {
      if (!mapRef.current) return;

      if (Array.isArray(options)) {
        mapRef.current.flyTo({ center: options, zoom: 3 });
      } else {
        mapRef.current.flyTo(options);
      }
    },

    selectCountry: (countryProps) => {
      if (!mapRef.current || !countryProps) return;

      const map = mapRef.current;

      if (countryProps.ne_id) {
        map.setFilter("country-selected", ["==", "ne_id", countryProps.ne_id]);
      }

      const lat = parseFloat(countryProps.label_y);
      const lng = parseFloat(countryProps.label_x);

      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      let offset = [0, 0];

      if (isMobile) {
        const panel = document.getElementById("country-info-panel");
        if (panel) {
          offset = [0, -panel.offsetHeight / 2];
        }
      }

      map.flyTo({
        center: [lng, lat],
        zoom: 4,
        essential: true,
        speed: 0.8,
        offset,
      });
    },
  }));

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 20],
      zoom: 1.5,
      minZoom: 1,
      maxZoom: 5,
      dragRotate: false,
      pitchWithRotate: false,
      projection: "mercator",
      renderWorldCopies: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("countries", {
        type: "geojson",
        data: "/cc_geo.json",
      });

      const layers = map.getStyle().layers || [];
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
          "fill-opacity": 0.4,
        },
        filter: ["==", "ne_id", ""],
      });

      map.addLayer({
        id: "country-selected",
        type: "line",
        source: "countries",
        paint: {
          "line-color": cCyan,
          "line-width": 2,
        },
        filter: ["==", "ne_id", ""],
      });

      map.on("mousemove", "country-fills", (e) => {
        if (e.features && e.features.length > 0) {
          const neId = e.features[0].properties?.ne_id || "";
          map.setFilter("country-hover", ["==", "ne_id", neId]);
        } else {
          map.setFilter("country-hover", ["==", "ne_id", ""]);
        }
      });

      map.on("mouseenter", "country-fills", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "country-fills", () => {
        map.getCanvas().style.cursor = "";
        map.setFilter("country-hover", ["==", "ne_id", ""]);
      });

      map.on("click", "country-fills", async (e) => {
        if (!e.features || e.features.length === 0) return;

        const countryProps = e.features[0].properties || {};

        let prideIndex = {};
        try {
          prideIndex = countryProps.pride_index
            ? JSON.parse(countryProps.pride_index)
            : {};
        } catch {
          prideIndex = {};
        }

        const nextSelectedCountry = {
          name: countryProps.name,
          continent: countryProps.continent,
          region_un: countryProps.region_un,
          country_code: countryProps.iso_a2 || countryProps.country_code || "",
          pride_index: prideIndex,
        };

        selectCountry(nextSelectedCountry);

        const neId = countryProps.ne_id || "";
        map.setFilter("country-selected", ["==", "ne_id", neId]);

        const lat = parseFloat(countryProps.label_y);
        const lng = parseFloat(countryProps.label_x);

        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
          const isMobile = window.matchMedia("(max-width: 767px)").matches;

          if (isMobile) {
            setTimeout(() => {
              const panel = document.getElementById("country-info-panel");
              const offsetY = panel ? panel.offsetHeight / 2 : 0;

              map.flyTo({
                center: [lng, lat],
                zoom: 4,
                essential: true,
                speed: 0.8,
                offset: [0, -offsetY],
              });
            }, 150);
          } else {
            map.flyTo({
              center: [lng, lat],
              zoom: 4,
              essential: true,
              speed: 0.8,
              offset: [0, 0],
            });
          }
        }

        const requestId = ++latestRequestIdRef.current;
        const lookupValue =
          nextSelectedCountry.country_code || nextSelectedCountry.name;

        try {
          setProfilesLoading(true);

          const response = await fetch(
            `https://pridedc.vercel.app/api/p/${encodeURIComponent(lookupValue)}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch country data");
          }

          const countryData = await response.json();

          if (requestId !== latestRequestIdRef.current) return;

          setProfilesSuccess(countryData);
        } catch (error) {
          if (requestId !== latestRequestIdRef.current) return;

          console.error("Error fetching country data:", error);
          setProfilesFailure(error.message || "Failed to fetch country data");
        }
      });
    });

    return () => {
      map.remove();
    };
  }, [selectCountry, setProfilesLoading, setProfilesSuccess, setProfilesFailure]);

  return (
    <div className="relative w-full h-screen z-40 overflow-hidden">
      <div ref={mapContainer} className="relative w-full h-screen md:h-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />

      {selectedCountry && (
        <CountryInfoPanel
          country={selectedCountry}
          onClose={clearCountry}
          onAspectSelect={handleSelectAspect}
          isProfilesLoading={isProfilesLoading}
          isProfilesLoaded={isProfilesLoaded}
        />
      )}

      {showAspectModal && selectedAspect && countryProfilesData && (
        <AspectModal
          aspectName={selectedAspect}
          individuals={getIndividualsForAspect(
            countryProfilesData,
            selectedAspect
          )}
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

WorldMap.displayName = "WorldMap";

export default WorldMap;