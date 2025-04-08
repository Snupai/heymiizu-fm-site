"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../components/Logo";

const messageBubbles = [
  { src: "/message_bubbles/Hello.png", position: { x: -42, y: 0 }, side: "left", rotate: -6, scale: 0.8 },
  { src: "/message_bubbles/nice_work.png", position: { x: -48, y: 33 }, side: "left", rotate: -8, scale: 0.9 },
  { src: "/message_bubbles/heart.png", position: { x: -37, y: 65 }, side: "left", rotate: -11, scale: 1 },
  
  { src: "/message_bubbles/Yo.png", position: { x: 55, y: -19 }, side: "right", rotate: -3, scale: 0.7 },
  { src: "/message_bubbles/Ahoy.png", position: { x: 75, y: 0 }, side: "right", rotate: 3, scale: 0.9 },
  { src: "/message_bubbles/Hey.png", position: { x: 62, y: 42 }, side: "right", rotate: 9, scale: 0.9 },
  { src: "/message_bubbles/the_climb.png", position: { x: 58, y: 80 }, side: "right", rotate: 7, scale: 0.8 },
];

// Animation variants for staggered fade-in
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPage, setNextPage] = useState("");
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const macY = useTransform(scrollYProgress, [0, 1], [0, -700]);
  const macScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  // Reset transition state when pathname changes
  useEffect(() => {
    setIsTransitioning(false);
  }, [pathname]);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // Disable transition animation for navigation
    // No need to set isTransitioning or nextPage
  };

  return (
    <motion.main 
      ref={containerRef}
      className="relative min-h-[200vh] w-full bg-white overflow-hidden px-4"
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
                {nextPage}
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo */}
      <motion.div 
        className="fixed top-8 left-[20%] z-30"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Logo />
      </motion.div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-20"
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
                  <span className={`relative z-10 ${pathname === "/" ? "text-[#fc87f0]" : ""}`}>Home</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#319aef]"
                    initial={{ width: "0%" }}
                    variants={{
                      hover: { width: "100%" }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        background: `linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
                        boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                        backdropFilter: "blur(2px)",
                      }}
                      variants={{
                        initial: {
                          opacity: 0,
                          scale: 0,
                          x: 0,
                          y: 0,
                        },
                        hover: {
                          opacity: [0, 1, 1, 1, 0],
                          scale: [0, 1, 1, 1, 0],
                          x: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.cos(angle) * 40;
                          }),
                          y: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.sin(angle) * 40;
                          }),
                          transition: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.1, 0.5, 0.9, 1]
                          }
                        }
                      }}
                    />
                  ))}
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
                  <span className={`relative z-10 ${pathname === "/projects" ? "text-[#fc87f0]" : ""}`}>Projects</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#319aef]"
                    initial={{ width: "0%" }}
                    variants={{
                      hover: { width: "100%" }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        background: `linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
                        boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                        backdropFilter: "blur(2px)",
                      }}
                      variants={{
                        initial: {
                          opacity: 0,
                          scale: 0,
                          x: 0,
                          y: 0,
                        },
                        hover: {
                          opacity: [0, 1, 1, 1, 0],
                          scale: [0, 1, 1, 1, 0],
                          x: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.cos(angle) * 40;
                          }),
                          y: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.sin(angle) * 40;
                          }),
                          transition: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.1, 0.5, 0.9, 1]
                          }
                        }
                      }}
                    />
                  ))}
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
                  <span className={`relative z-10 ${pathname === "/contact" ? "text-[#fc87f0]" : ""}`}>Contact Me</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#319aef]"
                    initial={{ width: "0%" }}
                    variants={{
                      hover: { width: "100%" }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        background: `linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
                        boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                        backdropFilter: "blur(2px)",
                      }}
                      variants={{
                        initial: {
                          opacity: 0,
                          scale: 0,
                          x: 0,
                          y: 0,
                        },
                        hover: {
                          opacity: [0, 1, 1, 1, 0],
                          scale: [0, 1, 1, 1, 0],
                          x: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.cos(angle) * 40;
                          }),
                          y: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.sin(angle) * 40;
                          }),
                          transition: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.1, 0.5, 0.9, 1]
                          }
                        }
                      }}
                    />
                  ))}
                </Link>
              </motion.div>
            </li>
          </ul>
        </div>
      </motion.nav>

      {/* Main Content Section */}
      <div className="sticky top-0 min-h-screen">
        {/* Background Mac */}
        <motion.div
          className="absolute inset-0 opacity-90 flex items-center justify-center"
          style={{
            y: macY,
            scale: macScale,
          }}
          variants={fadeIn}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative w-[69%] aspect-[16/10] translate-y-[45vh]">
            <Image
              src="/mac.png"
              alt="Mac Display"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="relative flex flex-col items-center justify-start min-h-screen max-w-7xl mx-auto pt-32"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.h1 
            className="text-8xl font-bold mb-4 text-center z-50 relative"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Hey, Im Miizu
          </motion.h1>
          <motion.p 
            className="text-xl mb-8 text-center z-50 relative"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Wanna see something cool?
          </motion.p>
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link 
              href="/projects"
              className="bg-[#0095FF] text-white px-8 py-3 rounded-full text-lg hover:bg-[#0077CC] transition-colors z-50 relative"
            >
              Projects
            </Link>
          </motion.div>

          {/* Floating Message Bubbles */}
          <div className="absolute inset-0 overflow-visible pointer-events-none">
            {messageBubbles.map((bubble, index) => {
              // Custom animation patterns for each bubble
              const patterns: Record<string, { y: number[]; x: number[]; duration: number }> = {
                "Hello.png": {
                  y: [-1.8, 0.5, -1.8],
                  x: [-0.3, 1.2, -0.3],
                  duration: 13.7
                },
                "nice_work.png": {
                  y: [0.7, -1.5, 0.7],
                  x: [-1.2, 0.4, -1.2],
                  duration: 15.2
                },
                "heart.png": {
                  y: [-0.5, 1.8, -0.5],
                  x: [1.5, -0.2, 1.5],
                  duration: 12.8
                },
                "Yo.png": {
                  y: [1.2, -0.8, 1.2],
                  x: [-1.5, 0.7, -1.5],
                  duration: 14.3
                },
                "Ahoy.png": {
                  y: [-1.5, 0.3, -1.5],
                  x: [0.8, -1.3, 0.8],
                  duration: 16.1
                },
                "Hey.png": {
                  y: [0.4, -1.7, 0.4],
                  x: [-0.5, 1.4, -0.5],
                  duration: 13.9
                },
                "the_climb.png": {
                  y: [-1.2, 0.8, -1.2],
                  x: [1.3, -0.6, 1.3],
                  duration: 15.6
                }
              };

              const fileName = bubble.src.split('/').pop() || '';
              const pattern = patterns[fileName] || { y: [0, -1, 0], x: [-1, 1, -1], duration: 14 };

              return (
                <motion.div
                  key={bubble.src}
                  className="absolute z-20 select-none"
                  initial={{
                    x: `${bubble.position.x}%`,
                    y: `${bubble.position.y}%`,
                    rotate: bubble.rotate,
                    scale: bubble.scale,
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1,
                    y: pattern.y.map((y: number) => `${bubble.position.y + y}%`),
                    x: pattern.x.map((x: number) => `${bubble.position.x + x}%`),
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.9 + (index * 0.1) },
                    y: { duration: pattern.duration, repeat: Infinity, ease: "easeInOut" },
                    x: { duration: pattern.duration, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{
                    left: 0,
                    top: 0,
                    transformOrigin: "center",
                  }}
                >
                  <div className="w-[1000px] h-[400px] relative">
                    <Image
                      src={bubble.src}
                      alt="Message Bubble"
                      fill
                      className="object-contain pointer-events-none"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
