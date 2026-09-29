"use client";
import React from "react";
import { getVisibility } from "../lib/visibility";

const VisibilityBadge = ({ visibility }) => {
  const config = getVisibility(visibility);

  return (
    <div className="group relative flex items-center justify-center">
      <span
    tabIndex={0}
    className="group relative inline-flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    title={config.tooltip}
    aria-label={config.tooltip}
  >
    <span
      className="block h-5 w-5"
      style={{
        backgroundColor: config.color,
        WebkitMaskImage: "url('/icons/flag.png')",
        maskImage: "url('/icons/flag.png')",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />

    <span className="pointer-events-none absolute right-7 top-1/2 z-10 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white shadow-lg group-hover:block group-focus:block">
      {config.tooltip}
    </span>
  </span>
    </div>
  );
};

export default VisibilityBadge;