"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

function FooterContent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(
        /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          window.navigator.userAgent,
        ),
      );
    }
  }, []);

  if (isMobile) {
    return (
      <footer className="w-full border-t border-gray-200 bg-white py-4">
        <div className="flex flex-col items-center gap-1">
          <div className="mb-1 flex items-center justify-center gap-8">
            <a
              href="https://x.com/heymiizu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-2xl text-ink transition-colors hover:text-brand"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/miizumelon/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-2xl text-ink transition-colors hover:text-brand"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com/@Miizumelon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-2xl text-ink transition-colors hover:text-brand"
            >
              <FaYoutube />
            </a>
          </div>
          <div className="flex gap-3">
            <Link
              href="/imprint"
              className="text-xs text-ink underline opacity-80 transition-colors duration-300 hover:text-brand hover:opacity-100"
            >
              Imprint
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-ink underline opacity-80 transition-colors duration-300 hover:text-brand hover:opacity-100"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <div className="relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-screen border-t border-gray-200 bg-white">
      <div className="py-4">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col">
            {/* Main Footer Content */}
            <div className="mb-4 flex items-center justify-between">
              {/* Left Side: Logo and Email */}
              <div className="flex items-center space-x-6">
                <Link href="/" className="relative h-12 w-12">
                  <Image
                    src="/Sentimental_Icon.png"
                    alt="Miizu Logo"
                    fill
                    className="object-contain"
                  />
                </Link>
                <a
                  href="mailto:hey@miizumelon.de"
                  className="text-base text-ink transition-colors duration-300 hover:text-brand"
                >
                  hey@miizumelon.de
                </a>
              </div>

              {/* Right Side: Social Links */}
              <div className="flex space-x-6">
                <a
                  href="https://x.com/FromNuvia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-ink transition-colors duration-300 hover:text-brand"
                >
                  Twitter
                </a>
                <a
                  href="https://www.instagram.com/fromnuvia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-ink transition-colors duration-300 hover:text-brand"
                >
                  Instagram
                </a>
                <a
                  href="https://www.youtube.com/@Miizumelon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-ink transition-colors duration-300 hover:text-brand"
                >
                  YouTube
                </a>
              </div>
            </div>

            {/* Made with Heart - Centered at Bottom */}
            <div className="flex flex-col items-center border-t border-black/5 pt-3">
              <div className="flex items-center space-x-1 text-xs text-ink opacity-70">
                <p>
                  Made with{" "}
                  <span className="inline-block animate-pulse text-[#8839ef]">
                    ❤
                  </span>{" "}
                  by
                </p>
                <a
                  href="https://snupai.me"
                  target="_blank"
                  className="transition-colors duration-300 hover:text-ink"
                >
                  Snupai
                </a>
              </div>
              <div className="mt-2 flex gap-3">
                <Link
                  href="/imprint"
                  className="text-sm text-ink underline opacity-80 transition-colors duration-300 hover:text-brand hover:opacity-100"
                >
                  Imprint
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-ink underline opacity-80 transition-colors duration-300 hover:text-brand hover:opacity-100"
                >
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterContent;
