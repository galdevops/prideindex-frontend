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
import { useTheme } from "../context/ThemeContext";
import { getVisibilityRank } from "../lib/visibility";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MAP_STYLES = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
};

// Country overlay violet per basemap: the lighter violet reads on dark-v11,
// the deeper brand violet (light --brand) holds contrast on light-v11.
const MAP_BRAND = {
  light: "#5b3a8a",
  dark: "#8b5cf6",
};

// The theme is on <html> before the map mounts (see the inline script in
// layout.js), so the first style can be chosen without waiting on React state.
const readDomTheme = () =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const WorldMap = forwardRef((props, ref) => {
  const {
    selectedCountry,
    countryProfilesData,
    isProfilesLoading,
    isProfilesLoaded,
    selectCountry,
    clearCountry,
    fetchCountryProfiles,
  } = useCountry();

  const { resolvedTheme } = useTheme();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  // Theme of the style currently on the map, and the last country outlined,
  // so a style swap can rebuild the overlay layers to match.
  const mapThemeRef = useRef(null);
  const selectedIsoRef = useRef("");

  const [selectedAspect, setSelectedAspect] = useState(null);
  const [showAspectModal, setShowAspectModal] = useState(false);
  const [selectedIndividual, setSelectedIndividual] = useState(null);
  const [showIndividualModal, setShowIndividualModal] = useState(false);

  // A different country (from map click or search) invalidates any open
  // aspect/profile modal, which belong to the previous country.
  const countryCode = selectedCountry?.country_code;
  useEffect(() => {
    setShowAspectModal(false);
    setSelectedAspect(null);
    setShowIndividualModal(false);
    setSelectedIndividual(null);
  }, [countryCode]);

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

  const getIndividualsForAspect = (country, aspectName) => {
    const aspects = country?.aspects || {};
    const individuals = aspects[aspectName] || [];

    return [...individuals].sort(
      (a, b) => getVisibilityRank(b?.visibility) - getVisibilityRank(a?.visibility)
    );
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
      if (!mapRef.current) return;

      const map = mapRef.current;

      selectedIsoRef.current = countryProps.iso_a2;
      if (map.getLayer("country-selected")) {
        map.setFilter("country-selected", ["==", "iso_a2", countryProps.iso_a2]);
      }

      const lat = parseFloat(countryProps.label_y);
      const lng = parseFloat(countryProps.label_x);
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      const flyToCountry = (offset) =>
        map.flyTo({
          center: [lng, lat],
          zoom: 4,
          essential: true,
          speed: 0.8,
          offset,
        });

      if (isMobile) {
        // Wait for the info panel to render so its height is measurable,
        // same as the map-click path.
        setTimeout(() => {
          const panel = document.getElementById("country-info-panel");
          flyToCountry([0, panel ? -panel.offsetHeight / 2 : 0]);
        }, 150);
      } else {
        flyToCountry([0, 0]);
      }
    },
  }));

  useEffect(() => {
    const initialTheme = readDomTheme();
    mapThemeRef.current = initialTheme;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[initialTheme],
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

    // setStyle() drops every source and layer the app added, so the overlay
    // is rebuilt on each style load (first load and every theme swap).
    // Delegated listeners below are stored on the map and survive the swap.
    map.on("style.load", () => {
      const cBrand = MAP_BRAND[mapThemeRef.current];

      if (!map.getSource("countries")) {
        map.addSource("countries", {
          type: "geojson",
          data: "/cc_geo.json",
        });
      }

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
          "fill-color": cBrand,
          "fill-opacity": 0.3,
          "fill-outline-color": cBrand,
        },
      });

      map.addLayer({
        id: "country-hover",
        type: "fill",
        source: "countries",
        paint: {
          "fill-color": cBrand,
          "fill-opacity": 0.4,
        },
        filter: ["==", "iso_a2", ""],
      });

      map.addLayer({
        id: "country-selected",
        type: "line",
        source: "countries",
        paint: {
          "line-color": cBrand,
          "line-width": 2,
        },
        filter: ["==", "iso_a2", selectedIsoRef.current],
      });
    });

    // Bound once, before the layers exist. Mapbox skips a delegated
    // listener whose layer is missing (e.g. mid theme swap).
    map.on("mousemove", "country-fills", (e) => {
      if (e.features.length > 0) {
        const iso = e.features[0].properties.iso_a2;
        map.setFilter("country-hover", ["==", "iso_a2", iso]);
      } else {
        map.setFilter("country-hover", ["==", "iso_a2", ""]);
      }
    });

    map.on("mouseenter", "country-fills", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "country-fills", () => {
      map.getCanvas().style.cursor = "";
      map.setFilter("country-hover", ["==", "iso_a2", ""]);
    });

    map.on("click", "country-fills", async (e) => {

      const countryProps = e.features[0].properties;

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

      const iso = countryProps.iso_a2;
      selectedIsoRef.current = iso;
      map.setFilter("country-selected", ["==", "iso_a2", iso]);

      const lat = parseFloat(countryProps.label_y);
      const lng = parseFloat(countryProps.label_x);
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      let offsetY = 0;

      if (isMobile) {
        setTimeout(() => {
          const panel = document.getElementById("country-info-panel");
          offsetY = panel ? panel.offsetHeight / 2 : 0;

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
          offset: [0, -offsetY],
        });
      }

      await fetchCountryProfiles(countryProps.iso_a2, prideIndex);
    });

    return () => map.remove();
  }, []);

  // Follow the app theme: swap the basemap when the resolved theme changes.
  // resolvedTheme is null until the provider has read the saved choice.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !resolvedTheme || mapThemeRef.current === resolvedTheme) return;

    mapThemeRef.current = resolvedTheme;
    map.setStyle(MAP_STYLES[resolvedTheme]);
  }, [resolvedTheme]);

  return (
    <div className="relative w-full h-[calc(100dvh-4rem)] z-40 overflow-hidden">
      <div ref={mapContainer} className="relative w-full h-full" />

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
    </div>
  );
});

WorldMap.displayName = "WorldMap";

export default WorldMap;