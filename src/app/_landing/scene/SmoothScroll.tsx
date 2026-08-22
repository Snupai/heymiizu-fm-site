"use client";

import { cancelFrame, frame } from "framer-motion";
import type { LenisOptions } from "lenis";
import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";

import "lenis/dist/lenis.css";

const LENIS_OPTIONS: LenisOptions = {
  allowNestedScroll: true,
  anchors: true,
  autoRaf: false,
  stopInertiaOnNavigate: true,
  virtualScroll: () => document.documentElement.dataset.introLock === undefined,
};

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
