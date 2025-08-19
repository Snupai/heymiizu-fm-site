"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  // Disable page scrolling while this page is mounted
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyHeight = body.style.height;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.height = "100%";
    body.style.height = "100%";
    body.classList.add("hide-chrome");

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.height = prevHtmlHeight;
      body.style.height = prevBodyHeight;
      body.classList.remove("hide-chrome");
    };
  }, []);

  return (
    <motion.main
      className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-surface via-surface-light to-brand-light"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 404 marker for layout to detect and hide header/footer */}
      <span id="__404_marker__" className="sr-only">404</span>
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-100"
        src="/not-found/Universal_Hey_only_optimized_optimized.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onEnded={(e) => {
          e.currentTarget.currentTime = 0;
          void e.currentTarget.play();
        }}
        aria-label="Cute animated background"
      />

      
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40 pointer-events-none" />
      
      {/* Foreground content */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center text-center p-6 translate-x-[3.5vw] sm:translate-x-[6.5vw] md:translate-x-[11vw] lg:translate-x-[15vw] xl:translate-x-[19vw] 2xl:translate-x-[23vw]">
        <motion.h1
          className="text-7xl md:text-8xl font-extrabold mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] text-white"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          404
        </motion.h1>
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-3 text-white/90 drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Page Not Found
        </motion.h2>
        <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
          Oops! The page you are looking for does not exist.
          <br className="hidden md:block" /> It might have been moved or deleted.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-full text-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          Go Home
        </Link>
      </div>
    </motion.main>
  );
}
