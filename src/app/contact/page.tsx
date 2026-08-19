"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getDeviceType } from "../../utils/deviceType";
import ContactSimple from "./ContactSimple";
import ContactForm from "./ContactForm";

// Removed unused MobileFallback import

// Create more natural, random-looking patterns
const createRandomPattern = () => {
  const baseAmplitude = 0.8;
  const randomRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  return {
    y: randomRange(-baseAmplitude, baseAmplitude),
    x: randomRange(-0.4, 0.4),
    rotate: randomRange(-2, 2),
    duration: randomRange(4, 6),
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
    pattern: createRandomPattern(),
  },
  {
    src: "/contact/ContactRIGHT.png",
    position: { x: 200, y: 25 },
    side: "right",
    rotate: 3,
    scale: 1,
    pattern: createRandomPattern(),
  },
];

export default function ContactPage() {
  const [deviceType, setDeviceType] = useState<
    null | "mobile" | "small" | "desktop"
  >(null);
  // Overlay flow state: hidden -> fading -> video -> buttons
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayPhase, setOverlayPhase] = useState<
    "fade" | "video" | "buttons" | null
  >(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setDeviceType(getDeviceType());
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (deviceType === null) return null;
  {
    /*if (deviceType === "mobile") return <MobileFallback />;*/
  }
  if (deviceType === "small" || deviceType === "mobile") {
    return <ContactSimple />;
  }

  return (
    <motion.main
      className="relative flex w-full flex-col overflow-hidden bg-white px-[10vw]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      }}
    >
      {/* lets add some spacing above the form and anything else we will add */}
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        {messageBubbles.map((bubble, idx) => (
          <motion.div
            key={idx}
            style={{
              position: "absolute",
              left:
                bubble.side === "right"
                  ? `calc(50% - ${bubble.position.x}px)`
                  : `${bubble.position.x}px`,
              top: `${bubble.position.y}px`,
              zIndex: 10,
              pointerEvents: "none",
            }}
            animate={{
              y: [0, -3.8, 2.5, -4.5, 1.2, -5.2, 1.8, -3.5, 0.9, -4.8, 0],
              x: [0, 3.5, -2.2, 1.8, -3.1, 2.5, -1.5, 3.2, -1.1, 2.8, -0.8, 0],
              rotate: [
                bubble.rotate,
                bubble.rotate + 0.2,
                bubble.rotate - 0.1,
                bubble.rotate + 0.3,
                bubble.rotate - 0.15,
                bubble.rotate + 0.25,
                bubble.rotate - 0.08,
                bubble.rotate + 0.18,
                bubble.rotate - 0.05,
                bubble.rotate + 0.12,
                bubble.rotate,
              ],
              scale: bubble.scale,
            }}
            transition={{
              y: {
                duration: bubble.pattern.duration * 3,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.15, 0.25, 0.4, 0.55, 0.7, 0.85, 0.95, 1],
              },
              x: {
                duration: bubble.pattern.duration * 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 0.98, 1],
              },
              rotate: {
                duration: bubble.pattern.duration * 4,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.12, 0.25, 0.4, 0.6, 0.75, 0.85, 0.95, 1],
              },
              scale: {
                duration: 0,
              },
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
      <motion.div
        className="h-[20vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      ></motion.div>
      <motion.div
        className="mt-42 mx-auto w-full max-w-5xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
      >
        <h1
          className="mb-8 text-6xl font-black leading-tight"
          style={{ transform: "rotate(-3deg)" }}
        >
          Right here!
        </h1>
        <div className="-mt-4 mb-4 text-3xl font-medium text-black">
          Request a Project
        </div>
      </motion.div>
      <motion.div
        className="mb-8 mt-8 flex h-[10vh] items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
      >
        <Image
          src="/contact/Pfeil_unten.png"
          alt="Arrow"
          width={100}
          height={100}
          style={{ marginLeft: "42px" }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
      >
        <ContactForm
          onSuccess={() => {
            // Start overlay fade sequence
            setOverlayVisible(true);
            setOverlayPhase("fade");
            // After fade completes, start video
            setTimeout(() => {
              setOverlayPhase("video");
              // give the DOM a tick to render the video before trying to play
              setTimeout(() => {
                const v = videoRef.current;
                if (v) {
                  // Ensure autoplay works across browsers
                  v.muted = true;
                  // Intentionally ignore the Promise result to satisfy lint rules
                  void v.play().catch(() => {
                    // As a fallback, attempt to play again shortly
                    setTimeout(() => {
                      // Ignore the Promise again; add comment to avoid no-empty-function
                      void v.play().catch(() => {
                        /* ignore autoplay rejection retry */
                      });
                    }, 200);
                  });
                }
              }, 50);
            }, 600); // match fade duration below
          }}
        />
      </motion.div>
      {overlayVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ backgroundColor: "#ffffff" }}
        >
          {overlayPhase === "video" && (
            <motion.div
              className="flex h-full w-full items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <video
                ref={videoRef}
                src="/contact/time.mp4"
                className="h-full w-full object-contain"
                playsInline
                muted
                autoPlay
                onEnded={() => setOverlayPhase("buttons")}
              />
            </motion.div>
          )}
          {overlayPhase === "buttons" && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/"
                className="rounded-xl bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                Return to home
              </Link>
              <Link
                href="/projects?category=commissions"
                className="rounded-xl border-2 border-brand px-6 py-3 font-bold text-brand transition-colors hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                See commissioned projects
              </Link>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.main>
  );
}
