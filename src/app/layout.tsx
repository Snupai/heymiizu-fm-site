"use client";

import { Public_Sans } from "next/font/google";
import "../styles/globals.css";

const publicSans = Public_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-public-sans"
});

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
