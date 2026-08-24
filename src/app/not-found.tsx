"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.body.classList.add("hide-chrome");
    return () => document.body.classList.remove("hide-chrome");
  }, []);

  return (
    <motion.main
      animate={{ opacity: 1 }}
      className="from-surface via-surface-light relative min-h-[100svh] w-full overflow-y-auto overflow-x-hidden bg-gradient-to-b to-brand-light"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span id="__404_marker__" className="sr-only">
        404
      </span>

      <video
        aria-label="Cute animated background"
        autoPlay
        className="absolute inset-0 h-full min-h-[100svh] w-full object-cover opacity-100"
        loop
        muted
        onEnded={(event) => {
          event.currentTarget.currentTime = 0;
          void event.currentTarget.play();
        }}
        playsInline
        preload="auto"
        src="/not-found/Universal_Hey_only_optimized_optimized.mp4"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />

      <div className="relative z-10 flex min-h-[100svh] w-full items-center px-4 py-12 sm:px-6">
        <div className="w-full text-center md:ml-auto md:w-[78%] lg:w-[70%] xl:w-[54%]">
          <div className="mx-auto w-full max-w-xl">
            <motion.h1
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4 text-7xl font-extrabold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] md:text-8xl"
              initial={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              404
            </motion.h1>
            <motion.h2
              animate={{ y: 0, opacity: 1 }}
              className="mb-3 text-2xl font-bold text-white/90 drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)] md:text-3xl"
              initial={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Page Not Found
            </motion.h2>
            <p className="mb-8 text-base text-white/80 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] md:text-lg">
              Oops! The page you are looking for does not exist.
              <br className="hidden md:block" /> It might have been moved or
              deleted.
            </p>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-8 py-3 text-lg font-medium text-white shadow-lg transition-colors hover:bg-brand-dark hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
              href="/"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
