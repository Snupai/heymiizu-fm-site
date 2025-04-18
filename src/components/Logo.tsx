"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="block">
      <div className="w-10 h-10 relative">
        <img
          src="/Sentimental_Icon.svg"
          alt="Sentimental Icon"
          className="w-full h-full object-contain"
          draggable="false"
        />
      </div>
    </Link>
  );
}