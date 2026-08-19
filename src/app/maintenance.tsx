"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Maintenance() {
  return (
    <motion.main
      className="flex flex-1 flex-col items-center justify-center bg-white text-center"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="mb-4 text-7xl font-extrabold text-brand drop-shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Maintenance
      </motion.h1>
      <motion.h2
        className="mb-2 text-3xl font-bold text-ink"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Site Under Maintenance
      </motion.h2>
      <p className="mb-8 text-lg text-gray-700">
        We are currently performing scheduled maintenance.
        <br />
        Please check back soon!
      </p>
      <Link
        href="/"
        className="rounded-full bg-brand px-8 py-3 text-lg font-medium text-white shadow-lg transition-colors hover:bg-brand-dark hover:shadow-xl"
      >
        Go Home
      </Link>
    </motion.main>
  );
}
