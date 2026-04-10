"use client";
import Link from "next/link";
import Image from "next/image";

const PrideAtlasLogo = ({ className = "" }) => {
  return (
    <Link
      href="/"
      aria-label="PrideAtlas home"
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src="/logo/oie_transparent.png"
        alt="PrideAtlas"
        width={320}
        height={80}
        priority
        className="h-8 md:h-10 w-auto"
        />
    </Link>
  );
};

export default PrideAtlasLogo;