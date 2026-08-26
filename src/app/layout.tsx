import { Rethink_Sans } from "next/font/google";
import "../styles/globals.css";
import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import React from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import AppShell from "../components/AppShell";

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-rethink-sans",
});

const CANONICAL_TITLE = "Miizu - Motion Direction";

const TAB_TITLES = [
  "miizumelon.com",
  "miiiiiiiiizu",
  "Miizu - Motion Design",
  "Your new motion designer ;)",
] as const;

const EASTER_EGG_CHANCE = 0.25;

function randomTabTitle(): string {
  const defaultTitle = TAB_TITLES[0];
  if (Math.random() >= EASTER_EGG_CHANCE) {
    return defaultTitle;
  }

  const eggIndex = 1 + Math.floor(Math.random() * (TAB_TITLES.length - 1));
  return TAB_TITLES[eggIndex] ?? defaultTitle;
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(max-width: 760px)", color: "#000000" },
    { media: "(min-width: 761px)", color: "#fbfbfe" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const title = randomTabTitle();

  return {
    metadataBase: new URL(
      "https://heymiizu-fm-site-git-main-snupai.vercel.app",
    ),
    title,
    description:
      "Launches, trailers, keynotes and placements directed by Miizu for brands and creators.",
    icons: {
      icon: [
        {
          media: "(prefers-color-scheme: light)",
          url: "/Sentimental_Icon.png",
          type: "image/png",
        },
        {
          media: "(prefers-color-scheme: dark)",
          url: "/Sentimental_Icon_white.png",
          type: "image/png",
        },
      ],
    },
    openGraph: {
      title: CANONICAL_TITLE,
      description:
        "Launches, trailers, keynotes and placements directed by Miizu for brands and creators.",
      images: [
        {
          url: "/dd8ushtKAafNiPreGQQfuOm10U.jpg",
          width: 1200,
          height: 630,
          alt: "Miizu motion direction portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: CANONICAL_TITLE,
      description:
        "Launches, trailers, keynotes and placements directed by Miizu for brands and creators.",
      images: ["/dd8ushtKAafNiPreGQQfuOm10U.jpg"],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={rethinkSans.variable} lang="en">
      <body className="flex min-h-screen flex-col font-sans font-semibold">
        <AppShell>{children}</AppShell>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
      <Analytics />
    </html>
  );
}
