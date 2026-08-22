"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

import { WORK_LINES, type WorkLineVariant } from "./content";
import { getWorkLineOffset } from "./scroll-timeline";
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
  scrollYProgress,
  variant,
  viewportWidthMV,
}: {
  children: string;
  index: number;
  scrollYProgress: MotionValue<number>;
  variant: WorkLineVariant;
  viewportWidthMV: MotionValue<number>;
}) {
  const x = useTransform(
    [scrollYProgress, viewportWidthMV],
    ([progress, width]) => {
      if (!width) return 0;
      return getWorkLineOffset(progress as number, width as number, index);
    },
  );

  return (
    <motion.p className={workLineClassName(variant)} style={{ x }}>
      {children}
    </motion.p>
  );
}

export function WorkLines({
  scrollYProgress,
  viewportWidthMV,
}: {
  scrollYProgress: MotionValue<number>;
  viewportWidthMV: MotionValue<number>;
}) {
  return (
    <motion.div className={styles.workContent}>
      <div className={styles.workList}>
        {WORK_LINES.map((line, index) => (
          <WorkLine
            index={index}
            key={line.id}
            scrollYProgress={scrollYProgress}
            variant={line.variant}
            viewportWidthMV={viewportWidthMV}
          >
            {line.text}
          </WorkLine>
        ))}
      </div>
    </motion.div>
  );
}
