"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

import { ClientsMarquee } from "../scene/ClientsMarquee";
import { WORK_LINES, type WorkLineVariant } from "../scene/content";
import {
  getWorkLineEntryX,
  getWorkShadeEntryX,
  WORK_SEQUENCE_DURATION_S,
} from "../scene/scroll-timeline";
import { workLineClassName } from "../scene/WorkLines";
import styles from "../../miizu-landing.module.css";

function isWorkInView(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  return (
    rect.top < window.innerHeight * 0.82 &&
    rect.bottom > window.innerHeight * 0.08
  );
}

function MobileWorkLine({
  children,
  index,
  variant,
  workSequenceTime,
}: {
  children: string;
  index: number;
  variant: WorkLineVariant;
  workSequenceTime: MotionValue<number>;
}) {
  const entryX = useTransform(workSequenceTime, (time) =>
    getWorkLineEntryX(time, index),
  );

  return (
    <p className={workLineClassName(variant)}>
      <motion.span className={styles.workLineMotion} style={{ x: entryX }}>
        {children}
      </motion.span>
    </p>
  );
}

export function MobileWork() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const startMsRef = useRef<number | null>(null);
  const workSequenceTime = useMotionValue(0);
  const workShadeEntryX = useTransform(workSequenceTime, getWorkShadeEntryX);

  const advanceRef = useRef<() => void>(() => {});
  advanceRef.current = () => {
    if (reduceMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    if (startMsRef.current == null) {
      if (!isWorkInView(section)) return;
      startMsRef.current = performance.now();
    }

    if (workSequenceTime.get() >= WORK_SEQUENCE_DURATION_S) return;

    const elapsed = (performance.now() - startMsRef.current) / 1000;
    workSequenceTime.set(Math.min(elapsed, WORK_SEQUENCE_DURATION_S));
  };

  useLenis(() => {
    advanceRef.current();
  });

  useEffect(() => {
    if (reduceMotion) {
      startMsRef.current = 0;
      workSequenceTime.jump(WORK_SEQUENCE_DURATION_S);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const advance = () => advanceRef.current();
    advance();

    const observer = new IntersectionObserver(advance, {
      root: null,
      rootMargin: "0px 0px -18% 0px",
      threshold: [0.08, 0.2, 0.4],
    });
    observer.observe(section);

    window.addEventListener("scroll", advance, { passive: true });
    const interval = window.setInterval(advance, 32);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", advance);
      window.clearInterval(interval);
    };
  }, [reduceMotion, workSequenceTime]);

  return (
    <section className={styles.mobileWork} id="work" ref={sectionRef}>
      <motion.div
        aria-hidden="true"
        className={styles.mobileWorkShade}
        style={{ x: workShadeEntryX }}
      />
      <div className={styles.mobileWorkList}>
        {WORK_LINES.map((line, index) => (
          <MobileWorkLine
            index={index}
            key={line.id}
            variant={line.variant}
            workSequenceTime={workSequenceTime}
          >
            {line.text}
          </MobileWorkLine>
        ))}
      </div>
    </section>
  );
}

export function MobileClients() {
  const reduceMotion = useReducedMotion();

  return <ClientsMarquee embedded reduceMotion={reduceMotion} />;
}
