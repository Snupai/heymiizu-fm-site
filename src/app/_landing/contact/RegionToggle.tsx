"use client";

import { motion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import styles from "../../miizu-landing.module.css";
import type { ContactRegion } from "./contact-form-model";

const REGION_PILL_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 28,
  mass: 0.6,
} as const;

export function RegionToggle({
  region,
  onChange,
}: {
  region: ContactRegion;
  onChange: (region: ContactRegion) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLButtonElement>(null);
  const internationalRef = useRef<HTMLButtonElement>(null);
  const [pill, setPill] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const updatePill = useCallback(() => {
    const root = rootRef.current;
    const active =
      region === "local" ? localRef.current : internationalRef.current;
    if (!root || !active) return;

    const rootBox = root.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    setPill({
      x: activeBox.left - rootBox.left,
      y: activeBox.top - rootBox.top,
      width: activeBox.width,
      height: activeBox.height,
    });
  }, [region]);

  useLayoutEffect(() => {
    updatePill();
    const root = rootRef.current;
    if (!root) return;

    const observer = new ResizeObserver(updatePill);
    observer.observe(root);
    return () => observer.disconnect();
  }, [updatePill]);

  return (
    <div
      className={styles.regionToggle}
      ref={rootRef}
      role="group"
      aria-label="Project location"
    >
      <motion.span
        aria-hidden="true"
        className={styles.regionPill}
        initial={false}
        animate={pill}
        transition={REGION_PILL_SPRING}
      />
      <button
        aria-pressed={region === "local"}
        className={region === "local" ? styles.regionActive : ""}
        onClick={() => onChange("local")}
        ref={localRef}
        type="button"
      >
        <span className={styles.regionToggleLabel}>
          Local <small>(Germany)</small>
        </span>
      </button>
      <button
        aria-pressed={region === "international"}
        className={region === "international" ? styles.regionActive : ""}
        onClick={() => onChange("international")}
        ref={internationalRef}
        type="button"
      >
        <span className={styles.regionToggleLabel}>International</span>
      </button>
    </div>
  );
}
