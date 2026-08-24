"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="block">
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
