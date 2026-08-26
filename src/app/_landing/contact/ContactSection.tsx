"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
// import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CONTACT_HEADLINES } from "./content";
import { INTRO_SLIDE_EASE } from "../scene/scroll-timeline";
import styles from "../../miizu-landing.module.css";
import { BookCallSoon } from "./BookCallSoon";
import { ContactForm } from "./ContactForm";
import type { ContactRegion } from "./contact-form-model";
import { RegionToggle } from "./RegionToggle";

export function ContactSection({
  compact,
  initialRegion,
  wipeX,
}: {
  compact: boolean;
  initialRegion: ContactRegion;
  wipeX: MotionValue<string>;
}) {
  const reduceMotion = useReducedMotion();
  const contactRef = useRef<HTMLDivElement>(null);
  const [region, setRegion] = useState<ContactRegion>(initialRegion);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    offset: ["start end", "start 0.42"],
    target: contactRef,
  });
  const formY = useTransform(
    scrollYProgress,
    [0.28, 1],
    reduceMotion ? [0, 0] : [64, 0],
  );
  const formScale = useTransform(
    scrollYProgress,
    [0.28, 1],
    reduceMotion ? [1, 1] : [0.94, 1],
  );
  const formOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.78],
    reduceMotion ? [1, 1] : [0.28, 1],
  );
  const washX = useTransform(
    scrollYProgress,
    [0, 0.48],
    reduceMotion ? ["0%", "0%"] : ["-38%", "0%"],
  );

  useEffect(() => {
    setHeadlineIndex(Math.floor(Math.random() * CONTACT_HEADLINES.length));
  }, []);

  const headline = CONTACT_HEADLINES[headlineIndex];
  // const bookingUrl =
  //   process.env.NEXT_PUBLIC_BOOKING_URL ??
  //   "mailto:hey@miizumelon.com?subject=Let%27s%20book%20a%20call";
  const compactMotion = compact && reduceMotion !== true;

  return (
    <motion.div
      className={styles.contactWipe}
      id="contact"
      ref={contactRef}
      style={compact ? undefined : { x: wipeX }}
    >
      <div className={styles.contactSection}>
        <div className={styles.contactPitch}>
          {compact ? (
            <motion.div
              aria-hidden="true"
              className={styles.mobileContactWash}
              style={compactMotion ? { x: washX } : undefined}
            />
          ) : null}
          <motion.div
            initial={compactMotion ? { opacity: 0, y: 28 } : false}
            transition={{ duration: 0.7, ease: INTRO_SLIDE_EASE }}
            viewport={{ amount: 0.45, once: true }}
            whileInView={compactMotion ? { opacity: 1, y: 0 } : undefined}
          >
            <h2>{headline}</h2>
            <RegionToggle onChange={setRegion} region={region} />
          </motion.div>

          <motion.div
            className={styles.directContact}
            initial={compactMotion ? { opacity: 0, y: 24 } : false}
            transition={{ delay: 0.08, duration: 0.7, ease: INTRO_SLIDE_EASE }}
            viewport={{ amount: 0.4, once: true }}
            whileInView={compactMotion ? { opacity: 1, y: 0 } : undefined}
          >
            {/* Restore book-a-call: uncomment the <a>, ArrowUpRight import, and bookingUrl. Comment out <BookCallSoon />. */}
            {/*
            <a
              className={styles.bookCall}
              href={bookingUrl}
              rel={bookingUrl.startsWith("http") ? "noreferrer" : undefined}
              target={bookingUrl.startsWith("http") ? "_blank" : undefined}
            >
              <span className={styles.bookCallText}>book a call</span>
              <span aria-hidden="true" className={styles.callIcon}>
                <ArrowUpRight />
              </span>
            </a>
            */}
            <BookCallSoon />
            <p>or just say hello</p>
            <a className={styles.emailLink} href="mailto:hey@miizumelon.com">
              hey@<span className={styles.emailDomain}>miizumelon.com</span>
            </a>
          </motion.div>
        </div>

        <motion.div
          className={styles.formPanel}
          style={
            compactMotion
              ? {
                  opacity: formOpacity,
                  scale: formScale,
                  transformOrigin: "50% 0%",
                  y: formY,
                }
              : undefined
          }
        >
          <ContactForm compact={compact} region={region} />
        </motion.div>
      </div>
    </motion.div>
  );
}
