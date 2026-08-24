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
  enterProgress,
  exitProgress,
  reduceMotion,
  variant,
}: {
  children: string;
  index: number;
  enterProgress: MotionValue<number>;
  exitProgress: MotionValue<number>;
  reduceMotion: boolean | null;
  variant: WorkLineVariant;
}) {
  const start = index * 0.09;
  const end = Math.min(1, start + 0.28);
  const x = useTransform<number, string>(
    [enterProgress, exitProgress],
    ([enter = 0, exit = 0]) => {
      if (reduceMotion) return "0%";
      const span = Math.max(0.001, end - start);
      const enterT = Math.min(1, Math.max(0, (enter - start) / span));
      const enterX = -52 * (1 - enterT);
      const exitX = 28 * exit;
      return `${enterX + exitX}%`;
    },
  );
  const y = useTransform<number, number>(
    [enterProgress, exitProgress],
    ([enter = 0, exit = 0]) => {
      if (reduceMotion) return 0;
      const span = Math.max(0.001, end - start);
      const enterT = Math.min(1, Math.max(0, (enter - start) / span));
      return 22 * (1 - enterT) + 16 * exit;
    },
  );
  const opacity = useTransform<number, number>(
    [enterProgress, exitProgress],
    ([enter = 0, exit = 0]) => {
      if (reduceMotion) return 1;
      const span = Math.max(0.001, end - start);
      const enterT = Math.min(1, Math.max(0, (enter - start) / span));
      return enterT * (1 - exit);
    },
  );

  return (
    <p className={workLineClassName(variant)}>
      <motion.span className={styles.workLineMotion} style={{ opacity, x, y }}>
        {children}
      </motion.span>
    </p>
  );
}

export function MobileWork() {
  const reduceMotion = useReducedMotion();
  const workRef = useRef<HTMLElement>(null);
  const { scrollYProgress: enterProgress } = useScroll({
    offset: ["start 0.94", "start 0.2"],
    target: workRef,
  });
  const { scrollYProgress: exitProgress } = useScroll({
    offset: ["end 0.92", "end 0.18"],
    target: workRef,
  });
  const shadeX = useTransform(
    enterProgress,
    [0, 0.32],
    reduceMotion ? ["0%", "0%"] : ["-46%", "0%"],
  );
  const shadeScaleX = useTransform<number, number>(
    [enterProgress, exitProgress],
    ([enter = 0, exit = 0]) => {
      if (reduceMotion) return 1;
      return 0.72 + 0.28 * enter + 0.42 * exit;
    },
  );
  const clientsY = useTransform<number, number>(
    [enterProgress, exitProgress],
    ([enter = 0, exit = 0]) => {
      if (reduceMotion) return 0;
      const inT = Math.min(1, Math.max(0, (enter - 0.52) / 0.48));
      return 48 * (1 - inT) - 28 * exit;
    },
  );
  const clientsOpacity = useTransform<number, number>(
    [enterProgress, exitProgress],
    ([enter = 0, exit = 0]) => {
      if (reduceMotion) return 1;
      const inT = Math.min(1, Math.max(0, (enter - 0.52) / 0.48));
      return inT * (1 - 0.85 * exit);
    },
  );
  const clientsScaleX = useTransform(exitProgress, (exit) =>
    reduceMotion ? 1 : 1 + exit * 0.08,
  );
  const coverOpacity = useTransform(
    exitProgress,
    [0.15, 1],
    reduceMotion ? [0, 0] : [0, 0.55],
  );

  return (
    <section className={styles.mobileWork} id="work" ref={workRef}>
      <motion.div
        aria-hidden="true"
        className={styles.mobileWorkShade}
        style={{ scaleX: shadeScaleX, x: shadeX }}
      />
      <div className={styles.mobileWorkList}>
        {WORK_LINES.map((line, index) => (
          <MobileWorkLine
            enterProgress={enterProgress}
            exitProgress={exitProgress}
            index={index}
            key={line.id}
            reduceMotion={reduceMotion}
            variant={line.variant}
          >
            {line.text}
          </MobileWorkLine>
        ))}
      </div>

      <motion.div
        style={{
          opacity: clientsOpacity,
          scaleX: clientsScaleX,
          y: clientsY,
        }}
      >
        <ClientsMarquee embedded reduceMotion={reduceMotion} />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className={styles.mobileWorkCover}
        style={{ opacity: coverOpacity }}
      />
    </section>
  );
}
