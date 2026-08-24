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

const LINE_EASE = INTRO_SLIDE_EASE;

export function MobileWork() {
  const reduceMotion = useReducedMotion();

  return (
    <section className={styles.mobileWork} id="work">
      <div className={styles.mobileWorkList}>
        {WORK_LINES.map((line, index) => (
          <motion.p
            className={workLineClassName(line.variant)}
            initial={reduceMotion ? false : { opacity: 0, x: "-42vw" }}
            key={line.id}
            transition={{
              delay: reduceMotion ? 0 : index * WORK_LINE_STAGGER_S,
              duration: reduceMotion ? 0 : 0.9,
              ease: LINE_EASE,
            }}
            viewport={{ amount: 0.55, once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <span className={styles.workLineMotion}>{line.text}</span>
          </motion.p>
        ))}
      </div>

      <ClientsMarquee embedded reduceMotion={reduceMotion} />
    </section>
  );
}
