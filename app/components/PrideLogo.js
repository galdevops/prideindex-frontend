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
        src="/logo/prideatlasio.png"
        alt="PrideAtlas"
        width={400}
        height={100}
        priority
        className="h-16 w-auto"
        />
    </Link>
  );
};

export default PrideAtlasLogo;