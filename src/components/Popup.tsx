"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import Image from "next/image";

type AnchorRect = { top: number; left: number; width: number; height: number };

type PopupProps = {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  anchor?: AnchorRect; // viewport coordinates of trigger (from getBoundingClientRect)
  offsetY?: number; // distance above the anchor
};

export default function Popup({
  onClose,
  children,
  className = "",
  anchor,
  offsetY = 16,
}: PopupProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const cardStyle: React.CSSProperties | undefined = anchor
    ? {
        position: "fixed",
        // Vertically center over the anchor element and allow small offset
        top:
          Math.max(12, anchor.top + anchor.height / 2 + (offsetY ?? 0)) + "px",
        // Horizontally center to viewport
        left: "50%",
        transform: "translate(-50%, -50%)",
      }
    : undefined;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  } as const;

  const overlay = (
    <motion.div
      className="fixed inset-0 z-[9999]"
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Backdrop with slight blue tint and darkening */}
      <motion.button
        aria-label="Close popup"
        className="absolute inset-0"
        onClick={onClose}
        variants={backdropVariants}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.68), rgba(0,0,0,0.68)), rgba(10,132,255,0.22)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Centered fallback if no anchor provided */}
      {!anchor && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            className={`pointer-events-auto relative w-[min(80vw,520px)] rounded-[28px] bg-[#0A84FF] px-8 py-6 leading-relaxed text-white shadow-2xl ${className}`}
            role="dialog"
            aria-modal="true"
            variants={cardVariants}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-6 top-6 flex items-center justify-center transition-transform hover:scale-105"
            >
              <Image
                src="/close_circle_icon.svg"
                alt=""
                aria-hidden
                width={32}
                height={32}
                className="h-8 w-8 invert"
              />
            </button>
            {children}
          </motion.div>
        </div>
      )}

      {/* Anchored card */}
      {anchor && (
        <div role="dialog" aria-modal="true" style={cardStyle}>
          <motion.div
            className={`relative w-[min(80vw,520px)] rounded-[28px] bg-[#0A84FF] px-8 py-6 leading-relaxed text-white shadow-2xl ${className}`}
            variants={cardVariants}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-6 top-6 flex items-center justify-center transition-transform hover:scale-105"
            >
              <Image
                src="/close_circle_icon.svg"
                alt=""
                aria-hidden
                width={32}
                height={32}
                className="h-8 w-8 invert"
              />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </motion.div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(overlay, document.body);
}
