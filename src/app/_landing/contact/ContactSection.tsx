"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
// import { ArrowUpRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { CONTACT_HEADLINES } from "./content";
import { INTRO_SLIDE_EASE } from "../scene/scroll-timeline";
import styles from "../../miizu-landing.module.css";
import { ContactForm } from "./ContactForm";
import type { ContactRegion } from "./contact-form-model";

const REGION_PILL_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 28,
  mass: 0.6,
} as const;

function RegionToggle({
  region,
  onChange,
}: {
  region: ContactRegion;
  onChange: (region: ContactRegion) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLButtonElement>(null);
  const internationalRef = useRef<HTMLButtonElement>(null);
  const [pill, setPill] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const updatePill = useCallback(() => {
    const root = rootRef.current;
    const active =
      region === "local" ? localRef.current : internationalRef.current;
    if (!root || !active) return;

    const rootBox = root.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    setPill({
      x: activeBox.left - rootBox.left,
      y: activeBox.top - rootBox.top,
      width: activeBox.width,
      height: activeBox.height,
    });
  }, [region]);

  useLayoutEffect(() => {
    updatePill();
    const root = rootRef.current;
    if (!root) return;

    const observer = new ResizeObserver(updatePill);
    observer.observe(root);
    return () => observer.disconnect();
  }, [updatePill]);

  return (
    <div
      className={styles.regionToggle}
      ref={rootRef}
      role="group"
      aria-label="Project location"
    >
      <motion.span
        aria-hidden="true"
        className={styles.regionPill}
        initial={false}
        animate={pill}
        transition={REGION_PILL_SPRING}
      />
      <button
        aria-pressed={region === "local"}
        className={region === "local" ? styles.regionActive : ""}
        onClick={() => onChange("local")}
        ref={localRef}
        type="button"
      >
        <span className={styles.regionToggleLabel}>
          Local <small>(Germany)</small>
        </span>
      </button>
      <button
        aria-pressed={region === "international"}
        className={region === "international" ? styles.regionActive : ""}
        onClick={() => onChange("international")}
        ref={internationalRef}
        type="button"
      >
        <span className={styles.regionToggleLabel}>International</span>
      </button>
    </div>
  );
}

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
  const compactY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [88, 0],
  );
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
  const pitchOpacity = useTransform(
    scrollYProgress,
    [0, 0.55],
    reduceMotion ? [1, 1] : [0.28, 1],
  );
  const pitchY = useTransform(
    scrollYProgress,
    [0, 0.62],
    reduceMotion ? [0, 0] : [36, 0],
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
      style={
        compactMotion ? { y: compactY } : compact ? undefined : { x: wipeX }
      }
    >
      <div className={styles.contactSection}>
        <motion.div
          className={styles.contactPitch}
          style={
            compactMotion ? { opacity: pitchOpacity, y: pitchY } : undefined
          }
        >
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
            {/* Restore book-a-call: uncomment the <a>, ArrowUpRight import, and bookingUrl. Comment out the coming-soon <div>. */}
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
            <div
              aria-label="Book a call, coming soon"
              className={`${styles.bookCall} ${styles.bookCallSoon}`}
            >
              <span className={styles.bookCallText}>book a call</span>
              <span className={styles.comingSoon}>coming soon</span>
            </div>
            <p>or just say hello</p>
            <a className={styles.emailLink} href="mailto:hey@miizumelon.com">
              hey@<span className={styles.emailDomain}>miizumelon.com</span>
            </a>
          </motion.div>
        </motion.div>

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
