"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getDeviceType } from "../utils/deviceType";
import HomeSimple from "./HomeSimple";

// Removed unused MobileFallback import

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
  const [deviceType, setDeviceType] = useState<null | "mobile" | "small" | "desktop">(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const macY = useTransform(scrollYProgress, [0, 1], [0, -700]);
  const macScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    setDeviceType(getDeviceType());
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (deviceType === null) return null;
  {/*if (deviceType === "mobile") return <MobileFallback />;*/}
  if (deviceType === "small" || deviceType === "mobile") {
    return <HomeSimple />;
  }

  return (
    <motion.main 
      ref={containerRef}
      className="relative min-h-[200vh] w-full bg-white overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
    >
      {/* Main Content Section */}
      <div className="sticky top-0 min-h-screen">
        {/* Background Mac */}
        <motion.div
          className="absolute inset-0 opacity-90 flex items-center z-100 justify-center"
          style={{
            y: macY,
            scale: macScale,
          }}
          variants={fadeIn}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative w-[88%] aspect-[16/10] translate-y-[54vh]">
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
          className="relative flex flex-col items-center justify-start min-h-screen max-w-7xl mx-auto pt-54"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.h1 
            className="text-8xl font-bold mb-4 text-center z-150 relative"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {"Hey, I'm Miizu"}
          </motion.h1>
          <motion.p 
            className="text-xl mb-8 text-center z-150 relative"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Wanna see something cool?
          </motion.p>
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link 
              href="/projects"
              className="bg-[#0095FF] text-white px-8 py-3 rounded-full text-lg hover:bg-[#0077CC] transition-colors z-150 relative"
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

              const fileName = bubble.src.split('/').pop() ?? '';
              const pattern = patterns[fileName] ?? { y: [0, -1, 0], x: [-1, 1, -1], duration: 14 };

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
                  <div className="w-[1000px] h-[440px] relative">
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

      {/* New Section with Cards */}
      <div className="w-full bg-[#fff5f7] min-h-screen flex items-center justify-center py-20 pt-80">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Animations Card */}
            <motion.div 
              className="bg-[#ffffff] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-8">
                <div className="relative h-64 w-full">
                  <Image
                    src="/mac.png"
                    alt="Animations"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-3">Animations</h3>
                  <p className="text-gray-600 mb-6">
                    Animations made with After Effects, Premiere Pro and Photoshop
                  </p>
                  <Link 
                    href="/projects?category=after-effects"
                    className="inline-block bg-[#0095FF] text-white px-6 py-2 rounded-full text-sm hover:bg-[#0077CC] transition-colors"
                  >
                    See
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Photography Card */}
            <motion.div 
              className="bg-[#ffffff] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-8">
                <div className="relative h-64 w-full">
                  <Image
                    src="/fx3.png"
                    alt="Photography"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-3">Photography</h3>
                  <p className="text-gray-600 mb-6">
                    Photos I made
                  </p>
                  <Link 
                    href="/projects?category=photography"
                    className="inline-block bg-[#0095FF] text-white px-6 py-2 rounded-full text-sm hover:bg-[#0077CC] transition-colors"
                  >
                    See
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* See Everything Button */}
          <motion.div 
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              href="/projects?category=everything"
              className="bg-[#0095FF] text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-[#0077CC] transition-colors shadow-lg hover:shadow-xl"
            >
              Projects
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
