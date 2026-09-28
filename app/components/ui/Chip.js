"use client";
import React from "react";

const Chip = ({ children }) => (
  <span className="bg-surface-muted border border-border text-brand text-xs px-2 py-1 rounded-full">
    {children}
  </span>
);

export default Chip;
