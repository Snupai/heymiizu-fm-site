"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import Logo from "./Logo";

function NavbarContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent));
    }
  }, []);

  if (isMobile) {
    return (
      <nav className="w-full bg-white shadow-md flex flex-col items-center justify-between px-4 py-3" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div className="flex w-full items-center justify-between">
          <div />
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>
          <button
            aria-label="Open menu"
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', padding: 0 }}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span style={{ fontSize: 28, color: '#a95fa8' }}>
              &#9776;
            </span>
          </button>
        </div>
        {menuOpen && (
          <div className="w-full bg-white border-t border-gray-200 mt-2 flex flex-col items-center animate-fade-in" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <Link href="/" className="block py-2 text-lg w-full text-center" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/projects" className="block py-2 text-lg w-full text-center" onClick={() => setMenuOpen(false)}>Projects</Link>
            <Link href="/contact" className="block py-2 text-lg w-full text-center" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </nav>
    );
  }

  // Desktop navbar as before
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const handleLinkClick = (_e: React.MouseEvent, _href: string) => {
    // Intentionally left blank for future navigation logic
  };

  return (
    <motion.main 
      ref={containerRef}
      className="relative w-full bg-white overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
    >
      {/* Page Transition Overlay */}
      <AnimatePresence>
        {false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div 
              className="relative w-full h-full flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                className="absolute inset-0 bg-white"
                initial={{ scale: 0, borderRadius: "50%" }}
                animate={{ scale: 1, borderRadius: "0%" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.h1 
                className="text-9xl font-bold text-black z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Loading...
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Logo */}
      <motion.div 
        className="fixed top-8 left-[20%] z-60"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Logo />
      </motion.div>
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Base layer: Full height, no blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-white/60" />
        {/* Middle blur layer: Overlapping gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/50 to-white/70" style={{
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          maskImage: 'linear-gradient(to top, transparent, white 50%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent, white 50%)'
        }} />
        {/* Top blur layer: Maximum blur with fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/60 to-white/80" style={{
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          maskImage: 'linear-gradient(to top, transparent 30%, white)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 30%, white)'
        }} />
        <div className="container mx-auto px-12 py-8 relative">
          <ul className="flex gap-8 text-lg justify-end">
            <li className="inline-flex flex-col items-center">
              <motion.div
                initial="initial"
                whileHover="hover"
                animate="initial"
                className="relative group"
              >
                <Link href="/" className="relative block group" onClick={(e) => handleLinkClick(e, "/")}>  
                  <span className={`relative z-10 transition-colors duration-200 ${pathname === "/" ? "text-[#a95fa8]" : ""}`}
                        style={{ transformOrigin: 'center' }}>
                    Home
                    <motion.span
                      className="block h-[2px] bg-[#319aef] absolute left-0 bottom-0"
                      style={{ width: '100%' }}
                      initial={{ scaleX: 0, originX: 0 }}
                      variants={{
                        hover: { scaleX: 1, originX: 0 }
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                </Link>
              </motion.div>
            </li>
            <li className="inline-flex flex-col items-center">
              <motion.div
                initial="initial"
                whileHover="hover"
                animate="initial"
                className="relative group"
              >
                <Link href="/projects" className="relative block group" onClick={(e) => handleLinkClick(e, "/projects")}>  
                  <span className={`relative z-10 transition-colors duration-200 ${pathname === "/projects" ? "text-[#a95fa8]" : ""}`}
                        style={{ transformOrigin: 'center' }}>
                    Projects
                    <motion.span
                      className="block h-[2px] bg-[#319aef] absolute left-0 bottom-0"
                      style={{ width: '100%' }}
                      initial={{ scaleX: 0, originX: 0 }}
                      variants={{
                        hover: { scaleX: 1, originX: 0 }
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                </Link>
              </motion.div>
            </li>
            <li className="inline-flex flex-col items-center">
              <motion.div
                initial="initial"
                whileHover="hover"
                animate="initial"
                className="relative group"
              >
                <Link href="/contact" className="relative block group" onClick={(e) => handleLinkClick(e, "/contact")}>  
                  <span className={`relative z-10 transition-colors duration-200 ${pathname === "/contact" ? "text-[#a95fa8]" : ""}`}
                        style={{ transformOrigin: 'center' }}>
                    Contact Me
                    <motion.span
                      className="block h-[2px] bg-[#319aef] absolute left-0 bottom-0"
                      style={{ width: '100%' }}
                      initial={{ scaleX: 0, originX: 0 }}
                      variants={{
                        hover: { scaleX: 1, originX: 0 }
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                </Link>
              </motion.div>
            </li>
          </ul>
        </div>
      </motion.nav>
    </motion.main>
  );
}

export default NavbarContent;