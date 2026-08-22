"use client";

import { LayoutGroup, motion, type MotionValue } from "framer-motion";
// import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { CONTACT_HEADLINES } from "./content";
import styles from "../../miizu-landing.module.css";
import { ContactForm } from "./ContactForm";
import type { ContactRegion } from "./contact-form-model";

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
      style={{ x: wipeX }}
    >
      <div className={styles.contactSection}>
        <div className={styles.contactPitch}>
          <div>
            <h2>{headline}</h2>
            <LayoutGroup id="region-toggle">
              <div
                className={styles.regionToggle}
                role="group"
                aria-label="Project location"
              >
                <button
                  aria-pressed={region === "local"}
                  className={region === "local" ? styles.regionActive : ""}
                  onClick={() => setRegion("local")}
                  type="button"
                >
                  {region === "local" ? (
                    <motion.span
                      aria-hidden="true"
                      className={styles.regionPill}
                      layoutId="region-pill"
                      transition={{
                        type: "spring",
                        stiffness: 520,
                        damping: 28,
                        mass: 0.6,
                      }}
                    />
                  ) : null}
                  <span className={styles.regionToggleLabel}>
                    Local <small>(Germany)</small>
                  </span>
                </button>
                <button
                  aria-pressed={region === "international"}
                  className={
                    region === "international" ? styles.regionActive : ""
                  }
                  onClick={() => setRegion("international")}
                  type="button"
                >
                  {region === "international" ? (
                    <motion.span
                      aria-hidden="true"
                      className={styles.regionPill}
                      layoutId="region-pill"
                      transition={{
                        type: "spring",
                        stiffness: 520,
                        damping: 28,
                        mass: 0.6,
                      }}
                    />
                  ) : null}
                  <span className={styles.regionToggleLabel}>
                    International
                  </span>
                </button>
              </div>
            </LayoutGroup>
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
              hey@miizumelon.com
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
