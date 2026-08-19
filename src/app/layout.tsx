import { Public_Sans } from "next/font/google";
import "../styles/globals.css";
import "../styles/special-gradient-outline.css";
import type { Metadata } from "next";
import React from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import AppShell from "../components/AppShell";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-public-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(
      "https://heymiizu-fm-site-git-main-snupai.vercel.app",
    ),
    title: "Miizu - Motion Direction",
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
      title: "Miizu - Motion Direction",
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
      title: "Miizu - Motion Direction",
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
    <html lang="en">
      <head></head>
      <body
        className={`${publicSans.variable} flex min-h-screen flex-col font-sans`}
      >
        <AppShell>{children}</AppShell>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
      <Analytics />
    </html>
  );
}
