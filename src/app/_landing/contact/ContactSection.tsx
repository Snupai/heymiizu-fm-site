"use client";

import { motion, type MotionValue } from "framer-motion";
// import { ArrowUpRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { CONTACT_HEADLINES } from "./content";
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
  const [region, setRegion] = useState<ContactRegion>(initialRegion);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    setHeadlineIndex(Math.floor(Math.random() * CONTACT_HEADLINES.length));
  }, []);

  const headline = CONTACT_HEADLINES[headlineIndex];
  // const bookingUrl =
  //   process.env.NEXT_PUBLIC_BOOKING_URL ??
  //   "mailto:hey@miizumelon.com?subject=Let%27s%20book%20a%20call";

  return (
    <motion.div
      className={styles.contactWipe}
      id="contact"
      style={compact ? undefined : { x: wipeX }}
    >
      <div className={styles.contactSection}>
        <div className={styles.contactPitch}>
          <div>
            <h2>{headline}</h2>
            <RegionToggle onChange={setRegion} region={region} />
          </div>

          <div className={styles.directContact}>
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
          </div>
        </div>

        <div className={styles.formPanel}>
          <ContactForm compact={compact} region={region} />
        </div>
      </div>
    </motion.div>
  );
}
