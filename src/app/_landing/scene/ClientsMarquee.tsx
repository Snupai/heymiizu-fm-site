"use client";

import { motion, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

import { CLIENT_MARQUEE_ROWS, CLIENTS } from "./content";
import styles from "../../miizu-landing.module.css";

export function ClientsMarquee({
  reduceMotion,
  x,
}: {
  reduceMotion: boolean | null;
  x: MotionValue<string>;
}) {
  const clientMarqueesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tracks = clientMarqueesRef.current;

    if (!tracks || reduceMotion) return;

    let animations: Animation[] = [];
    let lastScrollY = window.scrollY;
    let lastScrollAt = window.performance.now();
    let decelerationFrame = 0;
    let idleTimer = 0;

    const getAnimations = () => {
      if (animations.length === 0) {
        animations = tracks.getAnimations({ subtree: true });
      }

      return animations;
    };

    const updateRate = (rate: number) => {
      for (const animation of getAnimations()) {
        animation.updatePlaybackRate(rate);
      }
    };

    const decelerate = () => {
      const currentAnimations = getAnimations();

      if (currentAnimations.length === 0) return;

      const currentRate = Math.max(
        ...currentAnimations.map((animation) => animation.playbackRate),
      );
      const nextRate = 1 + (currentRate - 1) * 0.82;

      if (nextRate - 1 < 0.02) {
        updateRate(1);
        decelerationFrame = 0;
        return;
      }

      updateRate(nextRate);
      decelerationFrame = window.requestAnimationFrame(decelerate);
    };

    const accelerateMarquee = () => {
      const currentAnimations = getAnimations();

      if (currentAnimations.length === 0) return;

      const now = window.performance.now();
      const distance = Math.abs(window.scrollY - lastScrollY);
      const elapsed = Math.max(16, Math.min(64, now - lastScrollAt));
      const velocity = distance / elapsed;
      const boostedRate = Math.min(6, 1 + velocity * 1.4);

      lastScrollY = window.scrollY;
      lastScrollAt = now;

      window.cancelAnimationFrame(decelerationFrame);
      window.clearTimeout(idleTimer);
      updateRate(
        Math.max(
          boostedRate,
          ...currentAnimations.map((animation) => animation.playbackRate),
        ),
      );

      idleTimer = window.setTimeout(() => {
        decelerationFrame = window.requestAnimationFrame(decelerate);
      }, 90);
    };

    window.addEventListener("scroll", accelerateMarquee, { passive: true });

    return () => {
      window.removeEventListener("scroll", accelerateMarquee);
      window.cancelAnimationFrame(decelerationFrame);
      window.clearTimeout(idleTimer);
      for (const animation of animations) {
        animation.updatePlaybackRate(1);
      }
    };
  }, [reduceMotion]);

  return (
    <motion.div
      aria-label="Selected clients"
      className={styles.clientsOverlay}
      id="clients"
      style={{ x }}
    >
      <div className={styles.clientsRail}>
        <span className={styles.clientsLabel}>selected clients</span>
        <div className={styles.clientMarquees} ref={clientMarqueesRef}>
          {Array.from({ length: CLIENT_MARQUEE_ROWS }, (_, row) => (
            <div
              aria-hidden={row > 0}
              className={styles.clientMarquee}
              key={row}
            >
              <div className={styles.clientNames}>
                {[0, 1].map((copy) => (
                  <div
                    aria-hidden={copy === 1}
                    className={styles.clientGroup}
                    key={`${row}-${copy}`}
                  >
                    {CLIENTS.map((client) => (
                      <span key={`${row}-${copy}-${client}`}>{client}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
