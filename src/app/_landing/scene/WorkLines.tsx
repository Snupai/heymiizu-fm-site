"use client";

import { motion, type MotionValue } from "framer-motion";

import { WORK_LINES, type WorkLineVariant } from "./content";
import {
  INTRO_SLIDE_EASE,
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
  sequenceStarted,
  variant,
  workExitX,
}: {
  children: string;
  index: number;
  reduceMotion: boolean;
  sequenceStarted: boolean;
  variant: WorkLineVariant;
  workExitX: MotionValue<string>;
}) {
  const entryX = sequenceStarted ? "0vw" : "-55vw";
  const transition = reduceMotion
    ? { duration: 0 }
    : sequenceStarted
      ? {
          delay: WORK_LINE_ENTRY_LEAD_S + index * WORK_LINE_STAGGER_S,
          duration: WORK_LINE_ENTRY_DURATION_S,
          ease: INTRO_SLIDE_EASE,
        }
      : { duration: 0 };

  return (
    <motion.p className={workLineClassName(variant)} style={{ x: workExitX }}>
      <motion.span
        animate={{ x: entryX }}
        className={styles.workLineMotion}
        initial={{ x: "-55vw" }}
        transition={transition}
      >
        {children}
      </motion.span>
    </motion.p>
  );
}

export function WorkLines({
  reduceMotion,
  sequenceRun,
  sequenceStarted,
  workExitX,
}: {
  reduceMotion: boolean;
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
