"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Unauthorized() {
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
        className="mb-4 text-7xl font-extrabold drop-shadow-lg"
        style={{ color: "#ffb300" }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        401
      </motion.h1>
      <motion.h2
        className="mb-2 text-3xl font-bold"
        style={{ color: "#222" }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Unauthorized
      </motion.h2>
      <p className="mb-8 text-lg text-gray-700">
        You need to be logged in to view this page.
        <br />
        Please log in and try again.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[#0095FF] px-8 py-3 text-lg font-medium text-white shadow-lg transition-colors hover:bg-[#0077CC] hover:shadow-xl"
      >
        Go Home
      </Link>
    </motion.main>
  );
}
