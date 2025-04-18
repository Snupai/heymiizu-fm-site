"use client";

import { AnimatePresence, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import Logo from "./Logo";

function NavbarContent() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end start"]
    });

    // Animation variants for staggered fade-in
    const fadeInUp = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    const fadeIn = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    };

      // Handle link click for navigation
    const handleLinkClick = (_e: React.MouseEvent, _href: string) => {
      // Disable transition animation for navigation
      // No need to set isTransitioning or nextPage
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
        {isTransitioning && (
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
          <ul className="flex gap-12 text-lg justify-end">
            <li>
              <motion.div
                initial="initial"
                whileHover="hover"
                animate="initial"
                className="relative group hover:scale-105"
              >
                <Link href="/" className="relative block" onClick={(e) => handleLinkClick(e, "/")}>
                  <span className={`relative z-10 ${pathname === "/" ? "text-[#fc87f0]" : ""}`}>
                    <span className="hover:scale-110 inline-block">H</span>ome
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#319aef]"
                    initial={{ width: "0%" }}
                    variants={{
                      hover: { width: "100%" }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            </li>
            <li>
              <motion.div
                initial="initial"
                whileHover="hover"
                animate="initial"
                className="relative group hover:scale-105"
              >
                <Link href="/projects" className="relative block" onClick={(e) => handleLinkClick(e, "/projects")}>
                  <span className={`relative z-10 ${pathname === "/projects" ? "text-[#fc87f0]" : ""}`}>
                    <span className="hover:scale-110 inline-block">P</span>rojects
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#319aef]"
                    initial={{ width: "0%" }}
                    variants={{
                      hover: { width: "100%" }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            </li>
            <li>
              <motion.div
                initial="initial"
                whileHover="hover"
                animate="initial"
                className="relative group hover:scale-105"
              >
                <Link href="/contact" className="relative block" onClick={(e) => handleLinkClick(e, "/contact")}>
                  <span className={`relative z-10 ${pathname === "/contact" ? "text-[#fc87f0]" : ""}`}>
                    <span className="hover:scale-110 inline-block">C</span>ontact <span className="hover:scale-110 inline-block">M</span>e
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#319aef]"
                    initial={{ width: "0%" }}
                    variants={{
                      hover: { width: "100%" }
                    }}
                    transition={{ duration: 0.3 }}
                  />
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