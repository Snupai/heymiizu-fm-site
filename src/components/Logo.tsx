"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Miizu home"
      className="flex h-11 w-11 items-center justify-center md:h-10 md:w-10"
      data-touch-target="square"
    >
      <div className="relative h-10 w-10">
        <Image
          src="/Sentimental_Icon.png"
          alt="Sentimental Icon"
          fill
          className="object-contain"
          draggable={false}
        />
      </div>
    </Link>
  );
}
