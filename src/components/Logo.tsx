"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="block">
      <div className="w-10 h-10 relative">
        <Image
          src="/Sentimental_Icon.svg"
          alt="Sentimental Icon"
          fill
          className="object-contain"
          draggable={false}
        />
      </div>
    </Link>
  );
}