"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getDeviceType } from "../../utils/deviceType";
import ContactSimple from "./ContactSimple";
import ContactForm from "./ContactForm";

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
    src: "/contact/ContactHEY.png", 
    position: { x: 0, y: -69 }, 
    side: "right", 
    rotate: 5, 
    scale: 1,
    pattern: createRandomPattern()
  },
  { 
    src: "/contact/ContactRIGHT.png", 
    position: { x: 200, y: 25 }, 
    side: "right", 
    rotate: 3, 
    scale: 1,
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
    <main className="relative w-full bg-white overflow-hidden px-[10vw] flex flex-col">
      {/* lets add some spacing above the form and anything else we will add */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
      {messageBubbles.map((bubble, idx) => (
        <motion.div
          key={idx}
          style={{
            position: "absolute",
            left: bubble.side === "right" ? `calc(50% - ${bubble.position.x}px)` : `${bubble.position.x}px`,
            top: `${bubble.position.y}px`,
            zIndex: 10,
            pointerEvents: "none",
          }}
          animate={{
            y: [
              0,
              -0.3,
              0.5,
              -0.8,
              0.2,
              -1.1,
              0
            ],
            x: [
              0,
              0.8,
              -0.4,
              0.2,
              -0.9,
              0.5,
              -0.3,
              0
            ],
            rotate: [
              bubble.rotate,
              bubble.rotate + 0.2,
              bubble.rotate - 0.1,
              bubble.rotate + 0.15,
              bubble.rotate - 0.05,
              bubble.rotate + 0.1,
              bubble.rotate - 0.08,
              bubble.rotate
            ],
            scale: bubble.scale,
          }}
          transition={{
            y: { 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.2, 0.3, 0.45, 0.6, 0.75, 0.9, 1]
            },
            x: { 
              duration: 9 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.15, 0.35, 0.5, 0.65, 0.8, 0.9, 1]
            },
            rotate: { 
              duration: 10 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.1, 0.25, 0.4, 0.6, 0.8, 0.9, 1]
            },
            scale: {
              duration: 0
            }
          }}
        >
          <Image
            src={bubble.src}
            alt="Message Bubble"
            width={800}
            height={800}
            style={{
              width: "800px",
              height: "auto",
              display: "block",
              userSelect: "none",
            }}
            draggable={false}
          />
        </motion.div>
      ))}
      </div>
      <div className="h-[10vh]"></div>
      <div className="w-full max-w-5xl mx-auto mt-42">
        <h1 className="text-6xl font-black leading-tight mb-8" style={{ transform: "rotate(-3deg)" }}>Right here!</h1>
        <div className="text-3xl font-medium text-black -mt-4 mb-4">Request a Project</div>
      </div>
      <div className="mt-8 mb-8 h-[10vh] flex justify-center items-center">
        <Image
          src="/contact/Pfeil_unten.png"
          alt="Arrow"
          width={100}
          height={100}
          style={{ marginLeft: '42px' }}
        />
      </div>
      <ContactForm />
    </main>
  );
} 