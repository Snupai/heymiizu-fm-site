"use client";

import { cancelFrame, frame } from "framer-motion";
import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";

import { LENIS_OPTIONS } from "./lenis-options";

import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const update = ({ timestamp }: { timestamp: number }) => {
      lenisRef.current?.lenis?.raf(timestamp);
    };

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis autoRaf={false} options={LENIS_OPTIONS} ref={lenisRef} root>
      {children}
    </ReactLenis>
  );
}
