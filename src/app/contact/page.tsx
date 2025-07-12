"use client";

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
    position: { x: -222, y: -69 }, 
    side: "right", 
    rotate: 5, 
    scale: 2.4,
    pattern: createRandomPattern()
  },
  { 
    src: "/contact/ContactRIGHT.png", 
    position: { x: 0, y: 25 }, 
    side: "right", 
    rotate: 4, 
    scale: 2.8,
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
      <div className="h-[10vh]"></div>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
      {messageBubbles.map((bubble, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: bubble.side === "right" ? `calc(50% - ${bubble.position.x}px)` : `${bubble.position.x}px`,
            top: `${bubble.position.y}px`,
            transform: `rotate(${bubble.rotate}deg) scale(${bubble.scale})`,
            zIndex: 10,
            pointerEvents: "none",
            transition: "transform 2s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <Image
            src={bubble.src}
            alt="Message Bubble"
            width={300}
            height={300}
            style={{
              width: "300px",
              height: "auto",
              display: "block",
              userSelect: "none",
            }}
            draggable={false}
          />
        </div>
      ))}
      </div>
      <div className="w-full max-w-5xl mx-auto mt-42">
        <h1 className="text-6xl font-black leading-tight mb-8" style={{ transform: "rotate(-4deg)" }}>Right here!</h1>
        <div className="text-2xl font-medium text-black mt-0 mb-4">Request a Project</div>
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