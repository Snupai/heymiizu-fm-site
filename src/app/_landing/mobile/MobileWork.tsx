"use client";

import { motion, useReducedMotion } from "framer-motion";

import { ClientsMarquee } from "../scene/ClientsMarquee";
import { WORK_LINES } from "../scene/content";
import {
  INTRO_SLIDE_EASE,
  WORK_LINE_STAGGER_S,
} from "../scene/scroll-timeline";
import { workLineClassName } from "../scene/WorkLines";
import styles from "../../miizu-landing.module.css";

export function MobileWork() {
  const reduceMotion = useReducedMotion();

  return (
    <section className={styles.mobileWork} id="work">
      <div className={styles.mobileWorkList}>
        {WORK_LINES.map((line, index) => (
          <p className={workLineClassName(line.variant)} key={line.id}>
            <motion.span
              className={styles.workLineMotion}
              initial={reduceMotion ? false : { opacity: 0, x: "-42%" }}
              transition={{
                delay: reduceMotion ? 0 : index * WORK_LINE_STAGGER_S,
                duration: reduceMotion ? 0 : 0.85,
                ease: INTRO_SLIDE_EASE,
              }}
              viewport={{ amount: 0.35, once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              {line.text}
            </motion.span>
          </p>
        ))}
      </div>

      <ClientsMarquee embedded reduceMotion={reduceMotion} />
    </section>
  );
}
