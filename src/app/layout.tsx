"use client";

import { Public_Sans } from "next/font/google";
import "../styles/globals.css";
import type { Metadata } from 'next'

const publicSans = Public_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-public-sans"
});

export const metadata: Metadata = {
  title: 'Hey Miizu!',
  description: "Hey Miizu, i was wondering if you could show me some of your projects you've been making recently.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
