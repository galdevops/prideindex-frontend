"use client";
import { useCallback, useEffect, useState } from "react";
import { PRIDE_INDEX_URL } from "./api";

// Loads the country GeoJSON (geometry + pride_index per country) once from the
// API. The app has no local copy, so status "error" means nothing can render.
export default function useCountriesData() {
  const [state, setState] = useState({ status: "loading", data: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading", data: null });

    (async () => {
      try {
        const response = await fetch(PRIDE_INDEX_URL, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);

        const data = await response.json();
        if (!Array.isArray(data?.features) || data.features.length === 0) {
          throw new Error("Empty country dataset");
        }

        setState({ status: "ready", data });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error fetching country dataset:", error);
        setState({ status: "error", data: null });
      }
    })();

    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
