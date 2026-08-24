"use client";

import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

type SocialAction = {
  compactHref: string;
  icon: IconType;
  label: string;
  wideHref: string;
};

const socialActions: SocialAction[] = [
  {
    compactHref: "https://x.com/heymiizu",
    icon: FaTwitter,
    label: "Twitter",
    wideHref: "https://x.com/FromNuvia",
  },
  {
    compactHref: "https://www.instagram.com/miizumelon/",
    icon: FaInstagram,
    label: "Instagram",
    wideHref: "https://www.instagram.com/fromnuvia/",
  },
  {
    compactHref: "https://www.youtube.com/@Miizumelon",
    icon: FaYoutube,
    label: "YouTube",
    wideHref: "https://www.youtube.com/@Miizumelon",
  },
];

function FooterContent() {
  return (
    <>
      <footer className="w-full border-t border-gray-200 bg-white py-3 md:hidden">
        <div className="flex flex-col items-center gap-1 px-4">
          <a
            className="flex min-h-11 items-center justify-center px-3 text-sm text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            href="mailto:hey@miizumelon.de"
          >
            hey@miizumelon.de
          </a>
          <div className="flex items-center justify-center gap-4">
            {socialActions.map(({ compactHref, icon: Icon, label }) => (
              <a
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full text-2xl text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                href={compactHref}
                key={label}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
          <Link
            className="flex min-h-11 items-center justify-center px-4 text-xs text-ink underline opacity-80 transition-colors duration-300 hover:text-brand hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            href="/imprint"
          >
            Imprint
          </Link>
        </div>
      </footer>

      <footer className="relative hidden w-full border-t border-gray-200 bg-white md:block">
        <div className="py-4">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Link
                    className="relative h-12 w-12"
                    data-touch-target="square"
                    href="/"
                  >
                    <Image
                      alt="Miizu Logo"
                      className="object-contain"
                      fill
                      src="/Sentimental_Icon.png"
                    />
                  </Link>
                  <a
                    className="inline-flex items-center justify-center text-base text-ink transition-colors duration-300 hover:text-brand"
                    data-touch-target="square"
                    href="mailto:hey@miizumelon.de"
                  >
                    hey@miizumelon.de
                  </a>
                </div>

                <div className="flex space-x-6">
                  {socialActions.map(({ label, wideHref }) => (
                    <a
                      className="inline-flex items-center justify-center text-base text-ink transition-colors duration-300 hover:text-brand"
                      data-touch-target="square"
                      href={wideHref}
                      key={label}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

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
                    className="inline-flex items-center justify-center transition-colors duration-300 hover:text-ink"
                    data-touch-target="square"
                    href="https://snupai.me"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Snupai
                  </a>
                </div>
                <Link
                  className="mt-2 inline-flex items-center justify-center text-sm text-ink underline opacity-80 transition-colors duration-300 hover:text-brand hover:opacity-100"
                  data-touch-target="square"
                  href="/imprint"
                >
                  Imprint
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default FooterContent;
