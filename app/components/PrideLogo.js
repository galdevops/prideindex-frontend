"use client";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";

const LOGO_SRC = {
  light: "/logo/light_prideatlas_logo.png",
  dark: "/logo/dark_prideatlas_logo.png",
};

const PrideAtlasLogo = ({ className = "" }) => {
  // resolvedTheme is null until ThemeProvider reads the saved choice; default
  // to light for that first render, same fallback ThemeProvider itself uses.
  const { resolvedTheme } = useTheme();
  const src = LOGO_SRC[resolvedTheme] || LOGO_SRC.light;

  return (
    <Link
      href="/"
      aria-label="PrideAtlas home"
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src={src}
        alt="PrideAtlas"
        width={320}
        height={107}
        priority
        className="h-8 md:h-10 w-auto"
        />
    </Link>
  );
};

export default PrideAtlasLogo;