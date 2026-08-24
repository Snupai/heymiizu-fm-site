"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";

import { WORK_LINES, type WorkLineVariant } from "./content";
import { getWorkLineEntryX } from "./scroll-timeline";
import styles from "../../miizu-landing.module.css";

export function workLineClassName(variant: WorkLineVariant) {
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
  variant,
  workExitX,
  workSequenceTime,
}: {
  children: string;
  index: number;
  variant: WorkLineVariant;
  workExitX: MotionValue<string>;
  workSequenceTime: MotionValue<number>;
}) {
  const entryX = useTransform(workSequenceTime, (time) =>
    getWorkLineEntryX(time, index),
  );

  return (
    <motion.p className={workLineClassName(variant)} style={{ x: workExitX }}>
      <motion.span className={styles.workLineMotion} style={{ x: entryX }}>
        {children}
      </motion.span>
    </motion.p>
  );
}

export function WorkLines({
  workExitX,
  workSequenceTime,
}: {
  workExitX: MotionValue<string>;
  workSequenceTime: MotionValue<number>;
}) {
  return (
    <motion.div className={styles.workContent}>
      <div className={styles.workList}>
        {WORK_LINES.map((line, index) => (
          <WorkLine
            index={index}
            key={line.id}
            variant={line.variant}
            workExitX={workExitX}
            workSequenceTime={workSequenceTime}
          >
            {line.text}
          </WorkLine>
        ))}
      </div>
    </motion.div>
  );
}
