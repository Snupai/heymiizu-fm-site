import { Public_Sans } from "next/font/google";
import "../styles/globals.css";
import "../styles/special-gradient-outline.css";
import type { Metadata } from 'next'
import NavbarContent from "../components/Navbar";
import FooterContent from "../components/Footer";
import Spinner from "../components/Spinner";
import React, { Suspense } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
const publicSans = Public_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-public-sans"
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://heymiizu-fm-site-git-main-snupai.vercel.app'),
    title: 'Hey Miizu!',
    description: "Hey Miizu, i was wondering if you could show me some of your projects you've been making recently.",
    icons: {
      icon: [
        {
          media: '(prefers-color-scheme: light)',
          url: '/Sentimental_Icon.png',
          type: 'image/png',
        },
        {
          media: '(prefers-color-scheme: dark)',
          url: '/Sentimental_Icon_white.png',
          type: 'image/png',
        }
      ]
    },
    openGraph: {
      title: 'Hey Miizu!',
      description: "Hey Miizu, i was wondering if you could show me some of your projects you've been making recently.",
      images: [
        {
          url: '/dd8ushtKAafNiPreGQQfuOm10U.jpg',
          width: 1200,
          height: 630,
          alt: 'Hey Miizu!'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Hey Miizu!',
      description: "Hey Miizu, i was wondering if you could show me some of your projects you've been making recently.",
      images: ['/dd8ushtKAafNiPreGQQfuOm10U.jpg'],
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${publicSans.variable} font-sans min-h-screen flex flex-col`}>
        <NavbarContent />
        <div className="flex-1 flex flex-col">
          <Suspense fallback={<Spinner />}>
            {children}
          </Suspense>
        </div>
        <FooterContent />
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js"  />
      <Analytics />
    </html>
  );
}