"use client";

import { animate, motion, type MotionValue, useMotionValue } from "framer-motion";
import { useEffect } from "react";

import { WORK_LINES, type WorkLineVariant } from "./content";
import {
  INTRO_SLIDE_EASE,
  SCROLL_WORK_EXIT_START,
  WORK_LINE_ENTRY_DURATION_S,
  WORK_LINE_ENTRY_LEAD_S,
  WORK_LINE_STAGGER_S,
} from "./scroll-timeline";
import styles from "../../miizu-landing.module.css";

function workLineClassName(variant: WorkLineVariant) {
  switch (variant) {
    case "lead":
      return `${styles.workLine} ${styles.workLineLead}`;
    case "item":
      return `${styles.workLine} ${styles.workLineItem}`;
    case "itemEnd":
      return `${styles.workLine} ${styles.workLineItem} ${styles.workLineItemEnd}`;
    case "close":
      return `${styles.workLine} ${styles.workLineClose}`;
    default: {
      const exhaustive: never = variant;
      return exhaustive;
    }
  }
}

function WorkLine({
  children,
  index,
  reduceMotion,
  scrollYProgress,
  sequenceStarted,
  variant,
  workExitX,
}: {
  children: string;
  index: number;
  reduceMotion: boolean;
  scrollYProgress: MotionValue<number>;
  sequenceStarted: boolean;
  variant: WorkLineVariant;
  workExitX: MotionValue<string>;
}) {
  const entryX = useMotionValue("-55vw");

  useEffect(() => {
    if (!sequenceStarted) {
      entryX.jump("-55vw");
      return;
    }

    if (reduceMotion || scrollYProgress.get() >= SCROLL_WORK_EXIT_START) {
      entryX.jump("0vw");
      return;
    }

    const controls = animate(entryX, "0vw", {
      delay: WORK_LINE_ENTRY_LEAD_S + index * WORK_LINE_STAGGER_S,
      duration: WORK_LINE_ENTRY_DURATION_S,
      ease: INTRO_SLIDE_EASE,
    });

    const unsub = scrollYProgress.on("change", (progress) => {
      if (progress < SCROLL_WORK_EXIT_START) return;

      controls.stop();
      entryX.jump("0vw");
      unsub();
    });

    return () => {
      controls.stop();
      unsub();
    };
  }, [entryX, index, reduceMotion, scrollYProgress, sequenceStarted]);

  return (
    <motion.p className={workLineClassName(variant)} style={{ x: workExitX }}>
      <motion.span className={styles.workLineMotion} style={{ x: entryX }}>
        {children}
      </motion.span>
    </motion.p>
  );
}

export function WorkLines({
  reduceMotion,
  scrollYProgress,
  sequenceRun,
  sequenceStarted,
  workExitX,
}: {
  reduceMotion: boolean;
  scrollYProgress: MotionValue<number>;
  sequenceRun: number;
  sequenceStarted: boolean;
  workExitX: MotionValue<string>;
}) {
  return (
    <motion.div className={styles.workContent}>
      <div className={styles.workList}>
        {WORK_LINES.map((line, index) => (
          <WorkLine
            index={index}
            key={`${sequenceRun}-${line.id}`}
            reduceMotion={reduceMotion}
            scrollYProgress={scrollYProgress}
            sequenceStarted={sequenceStarted}
            variant={line.variant}
            workExitX={workExitX}
          >
            {line.text}
          </WorkLine>
        ))}
      </div>
    </motion.div>
  );
}
