"use client";
import React from "react";

const IconButton = ({
  icon: Icon,
  label,
  size = 24,
  className = "",
  ...rest
}) => (
  <button
    type="button"
    aria-label={label}
    className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md text-foreground-secondary hover:text-brand ${className}`}
    {...rest}
  >
    <Icon size={size} />
  </button>
);

export default IconButton;
