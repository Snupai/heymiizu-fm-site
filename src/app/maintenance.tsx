"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Maintenance() {
  return (
    <motion.main
      className="flex flex-col items-center justify-center text-center bg-white flex-1"
      style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-7xl font-extrabold mb-4 drop-shadow-lg"
        style={{ color: '#0189ff' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Maintenance
      </motion.h1>
      <motion.h2
        className="text-3xl font-bold mb-2"
        style={{ color: '#222' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Site Under Maintenance
      </motion.h2>
      <p className="text-lg text-gray-700 mb-8">
        We are currently performing scheduled maintenance.<br />
        Please check back soon!
      </p>
      <Link
        href="/"
        className="bg-[#0095FF] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#0077CC] transition-colors shadow-lg hover:shadow-xl"
      >
        Go Home
      </Link>
    </motion.main>
  );
}
