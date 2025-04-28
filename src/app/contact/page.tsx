"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getDeviceType } from "../../utils/deviceType";
import ContactSimple from "./ContactSimple";

// Removed unused MobileFallback import

// Create more natural, random-looking patterns
const createRandomPattern = () => {
  const baseAmplitude = 0.8;
  const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;
  
  return {
    y: randomRange(-baseAmplitude, baseAmplitude),
    x: randomRange(-0.4, 0.4),
    rotate: randomRange(-2, 2),
    duration: randomRange(4, 6)
  };
};

interface MessageBubble {
  src: string;
  position: { x: number; y: number };
  side: "left" | "right";
  rotate: number;
  scale: number;
  pattern: {
    y: number;
    x: number;
    rotate: number;
    duration: number;
  };
}

const messageBubbles: MessageBubble[] = [
  { 
    src: "/message_bubbles/ContactHEY.png", 
    position: { x: 20, y: -40 }, 
    side: "right", 
    rotate: 5, 
    scale: 1.2,
    pattern: createRandomPattern()
  },
  { 
    src: "/message_bubbles/ContactRIGHT.png", 
    position: { x: 0, y: -15 }, 
    side: "right", 
    rotate: 3, 
    scale: 1.1,
    pattern: createRandomPattern()
  },
];

export default function ContactPage() {
  const [deviceType, setDeviceType] = useState<null | "mobile" | "small" | "desktop">(null);

  useEffect(() => {
    setDeviceType(getDeviceType());
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (deviceType === null) return null;
  {/*if (deviceType === "mobile") return <MobileFallback />;*/}
  if (deviceType === "small" || deviceType === "mobile") {
    return <ContactSimple />;
  }

  return (
    <main className="relative w-full bg-white overflow-hidden px-4 flex flex-col">
      {/* --- Removed Logo (now part of Navbar) --- */}
      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-start max-w-7xl mx-auto pt-32 pb-4">
        <div className="flex flex-col items-center justify-center w-full relative">
          {/* Message Bubbles */}
          <div className="absolute inset-0 overflow-visible pointer-events-none">
            {messageBubbles.map((bubble, index) => (
              <motion.div
                key={bubble.src}
                className="absolute z-20 select-none"
                initial={{
                  x: `${bubble.position.x}%`,
                  y: `${bubble.position.y}%`,
                  rotate: bubble.rotate,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  opacity: 1,
                  scale: bubble.scale,
                  y: [
                    `${bubble.position.y}%`,
                    `${bubble.position.y - 1.2}%`,
                    `${bubble.position.y + 0.3}%`,
                    `${bubble.position.y - 0.5}%`,
                    `${bubble.position.y + 0.8}%`,
                    `${bubble.position.y - 0.2}%`,
                    `${bubble.position.y + 1.1}%`,
                    `${bubble.position.y}%`
                  ],
                  x: [
                    `${bubble.position.x}%`,
                    `${bubble.position.x + 0.8}%`,
                    `${bubble.position.x - 0.4}%`,
                    `${bubble.position.x + 0.2}%`,
                    `${bubble.position.x - 0.9}%`,
                    `${bubble.position.x + 0.5}%`,
                    `${bubble.position.x - 0.3}%`,
                    `${bubble.position.x}%`
                  ],
                  rotate: [
                    bubble.rotate,
                    bubble.rotate + 1.5,
                    bubble.rotate - 0.5,
                    bubble.rotate + 0.8,
                    bubble.rotate - 1.2,
                    bubble.rotate + 0.3,
                    bubble.rotate - 0.8,
                    bubble.rotate
                  ],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.2 + (index * 0.1) },
                  scale: { 
                    duration: 0.5,
                    delay: 0.2 + (index * 0.1),
                    ease: "easeOut"
                  },
                  y: { 
                    duration: 30 + Math.random() * 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.3, 0.45, 0.6, 0.75, 0.9, 1]
                  },
                  x: { 
                    duration: 35 + Math.random() * 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.15, 0.35, 0.5, 0.65, 0.8, 0.9, 1]
                  },
                  rotate: { 
                    duration: 40 + Math.random() * 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.1, 0.25, 0.4, 0.6, 0.8, 0.9, 1]
                  }
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
                    priority
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Response Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-left mb-8 mt-[250px] ml-[20%]"
          >
            <div className="-rotate-2">
              <h1 className="text-8xl font-bold mb-4 whitespace-nowrap">On Instagram!</h1>
            </div>
            <p className="text-4xl mb-8">Simply DM me :D</p>
            <div className="flex flex-col md:flex-row gap-4 justify-start w-[800px] ml-[10%] mb-16">
              <a 
                href="https://www.instagram.com/miizumelon/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#0095FF] hover:bg-[#007acc] text-white text-3xl font-semibold px-16 py-4 rounded-full transition-colors duration-300 transform hover:scale-105"
              >
                Write Me
              </a>
            </div>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute right-[-25%] mt-[600px]"
          >
            <div className="bg-white border-4 border-[#0095FF] rounded-full px-8 py-4">
              <div className="flex items-center justify-center gap-6">
                <a href="https://x.com/heymiizu" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0095FF] transition-colors duration-300">
                  <FaXTwitter className="w-8 h-8" />
                </a>
                <a href="https://www.instagram.com/miizumelon/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0095FF] transition-colors duration-300">
                  <FaInstagram className="w-8 h-8" />
                </a>
                <a href="https://www.youtube.com/@Miizumelon" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0095FF] transition-colors duration-300">
                  <FaYoutube className="w-8 h-8" />
                </a>
                <a href="https://www.tiktok.com/@miizumelon" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0095FF] transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-8 h-8 fill-current">
                    <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/>
                  </svg>
                </a>
                <a href="https://www.twitch.tv/miizumelon" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0095FF] transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-8 h-8 fill-current">
                    <path d="M391.2 103.5H352.5v109.7h38.6zM285 103H246.4V212.8H285zM120.8 0 24.3 91.4v329.2h115.8V512l96.5-91.4h77.3L487.7 256V0zM449.1 237.8l-77.2 73.1H294.6l-67.6 64v-64H120.8V36.6H449.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Minimalist contact info below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-left -ml-[65%]"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl">Have a question</h2>
              <h2 className="text-3xl">or want to work together?</h2>
              <p className="text-3xl">Feel free to reach out via <a href='mailto:hey@miizumelon.de' className='underline text-[#0095FF] hover:text-[#007acc] transition-colors'>email</a>.</p>
              <p className="text-3xl">or through social media.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 