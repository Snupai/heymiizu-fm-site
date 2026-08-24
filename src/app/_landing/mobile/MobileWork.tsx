"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

import { ClientsMarquee } from "../scene/ClientsMarquee";
import { WORK_LINES, type WorkLineVariant } from "../scene/content";
import { workLineClassName } from "../scene/WorkLines";
import styles from "../../miizu-landing.module.css";

function MobileWorkLine({
  children,
  index,
  progress,
  reduceMotion,
  variant,
}: {
  children: string;
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
  variant: WorkLineVariant;
}) {
  const start = index * 0.08;
  const end = Math.min(1, start + 0.26);
  const x = useTransform(
    progress,
    [start, end],
    reduceMotion ? ["0%", "0%"] : ["-48%", "0%"],
  );
  const opacity = useTransform(
    progress,
    [start, end],
    reduceMotion ? [1, 1] : [0, 1],
  );

  return (
    <p className={workLineClassName(variant)}>
      <motion.span className={styles.workLineMotion} style={{ opacity, x }}>
        {children}
      </motion.span>
    </p>
  );
}

export function MobileWork() {
  const reduceMotion = useReducedMotion();
  const workRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start 0.92", "start 0.22"],
    target: workRef,
  });
  const shadeX = useTransform(
    scrollYProgress,
    [0, 0.28],
    reduceMotion ? ["0%", "0%"] : ["-42%", "0%"],
  );
  const clientsY = useTransform(
    scrollYProgress,
    [0.58, 1],
    reduceMotion ? [0, 0] : [42, 0],
  );
  const clientsOpacity = useTransform(
    scrollYProgress,
    [0.58, 1],
    reduceMotion ? [1, 1] : [0, 1],
  );

  return (
    <section className={styles.mobileWork} id="work" ref={workRef}>
      <motion.div
        aria-hidden="true"
        className={styles.mobileWorkShade}
        style={{ x: shadeX }}
      />
      <div className={styles.mobileWorkList}>
        {WORK_LINES.map((line, index) => (
          <MobileWorkLine
            index={index}
            key={line.id}
            progress={scrollYProgress}
            reduceMotion={reduceMotion}
            variant={line.variant}
          >
            {line.text}
          </MobileWorkLine>
        ))}
      </div>

      <motion.div style={{ opacity: clientsOpacity, y: clientsY }}>
        <ClientsMarquee embedded reduceMotion={reduceMotion} />
      </motion.div>
    </section>
  );
}
