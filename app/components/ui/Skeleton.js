"use client";
import React from "react";

// Placeholder block that matches the layout it stands in for. Decorative:
// the loading meaning is carried by the parent's role/aria-label.
const Skeleton = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={`bg-border animate-pulse motion-reduce:animate-none ${className}`}
  />
);

export default Skeleton;
