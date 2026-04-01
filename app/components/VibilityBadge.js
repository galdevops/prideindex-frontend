"use client";
import React from "react";

const visibilityConfig = {
  Local: { color: "#f87171", tooltip: "Local" },
  National: { color: "#facc15", tooltip: "National" },
  Regional: { color: "#22d3ee", tooltip: "Regional" },
  Global: { color: "#4ade80", tooltip: "Global" },
  International: { color: "#4ade80", tooltip: "Global" },
};
const VisibilityBadge = ({ visibility }) => {
  const config = visibilityConfig[visibility] || {
    color: "#9ca3af",
    tooltip: "Visibility unknown",
  };

  return (
    <div className="group relative flex items-center justify-center">
      <span
    className="group relative inline-flex items-center"
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

    <span className="pointer-events-none absolute right-7 top-1/2 z-10 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white shadow-lg group-hover:block">
      {config.tooltip}
    </span>
  </span>
    </div>
  );
};

export default VisibilityBadge;