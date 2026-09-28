"use client";
import React from "react";

const SIZE_CLASSES = {
  10: "w-10 h-10 text-base font-semibold",
  16: "w-16 h-16 text-2xl font-semibold",
};

const Avatar = ({ src, alt, initials, size = 10 }) => (
  <div
    className={`shrink-0 rounded-full overflow-hidden bg-brand flex items-center justify-center text-foreground-inverse ${
      SIZE_CLASSES[size] || SIZE_CLASSES[10]
    }`}
  >
    {src ? (
      <img
        src={src}
        alt={alt}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "";
        }}
        className="w-full h-full object-cover"
      />
    ) : (
      initials
    )}
  </div>
);

export default Avatar;
