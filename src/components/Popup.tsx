"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type AnchorRect = { top: number; left: number; width: number; height: number };

type PopupProps = {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  anchor?: AnchorRect; // viewport coordinates of trigger (from getBoundingClientRect)
  offsetY?: number; // distance above the anchor
};

export default function Popup({ onClose, children, className = "", anchor, offsetY = 16 }: PopupProps) {
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
        top: Math.max(12, anchor.top + anchor.height / 2 + (offsetY ?? 0)) + "px",
        left: anchor.left + anchor.width / 2 + "px",
        transform: "translateX(-50%) translateY(-50%)",
      }
    : undefined;

  const overlay = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop with slight blue tint and darkening */}
      <button
        aria-label="Close popup"
        className="absolute inset-0"
        onClick={onClose}
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.68), rgba(0,0,0,0.68)), rgba(10,132,255,0.22)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Centered fallback if no anchor provided */}
      {!anchor && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`relative bg-[#0A84FF] text-white shadow-2xl rounded-[28px] px-8 py-6 w-[min(80vw,520px)] leading-relaxed ${className}`}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-6 right-6 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Image src="/close_circle_icon.svg" alt="" aria-hidden width={32} height={32} className="h-8 w-8 invert" />
            </button>
            {children}
          </div>
        </div>
      )}

      {/* Anchored card */}
      {anchor && (
        <div
          className={`relative bg-[#0A84FF] text-white shadow-2xl rounded-[28px] px-8 py-6 w-[min(80vw,520px)] leading-relaxed ${className}`}
          role="dialog"
          aria-modal="true"
          style={cardStyle}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-6 right-6 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Image src="/close_circle_icon.svg" alt="" aria-hidden width={32} height={32} className="h-8 w-8 invert" />
          </button>
          {children}
        </div>
      )}
    </div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(overlay, document.body);
}
