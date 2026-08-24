"use client";

import { motion, type MotionValue } from "framer-motion";
import { useLenis } from "lenis/react";
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
import { SCROLL_CONTACT_SET } from "../scene/scroll-timeline";
import { ContactForm } from "./ContactForm";
import type { ContactRegion } from "./contact-form-model";

const CONTACT_HANDOFF_LERP = 0.1;
const REGION_PILL_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 28,
  mass: 0.6,
} as const;

function nestedContactScrollerCanConsume(
  target: EventTarget | null,
  root: HTMLElement,
  deltaY: number,
) {
  let element = target instanceof HTMLElement ? target : null;

  while (element) {
    const { overflowY } = window.getComputedStyle(element);
    const scrollable =
      (overflowY === "auto" ||
        overflowY === "overlay" ||
        overflowY === "scroll") &&
      element.scrollHeight > element.clientHeight + 1;

    if (scrollable) {
      const maxScrollTop = element.scrollHeight - element.clientHeight;
      if (deltaY > 0 && element.scrollTop < maxScrollTop - 1) return true;
      if (deltaY < 0 && element.scrollTop > 1) return true;
    }

    if (element === root) break;
    element = element.parentElement;
  }

  return false;
}

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
  narrow,
  initialRegion,
  wipeX,
}: {
  narrow: boolean;
  initialRegion: ContactRegion;
  wipeX: MotionValue<string>;
}) {
  const [region, setRegion] = useState<ContactRegion>(initialRegion);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const contactWipeRef = useRef<HTMLDivElement>(null);
  const lastTouchY = useRef<number | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    setHeadlineIndex(Math.floor(Math.random() * CONTACT_HEADLINES.length));
  }, []);

  const headline = CONTACT_HEADLINES[headlineIndex];
  // const bookingUrl =
  //   process.env.NEXT_PUBLIC_BOOKING_URL ??
  //   "mailto:hey@miizumelon.com?subject=Let%27s%20book%20a%20call";

  useEffect(() => {
    const contactWipe = contactWipeRef.current;
    if (!contactWipe) return;

    const handOffToTimeline = (deltaY: number) => {
      if (!lenis || deltaY === 0) return false;

      const contactSettled =
        Math.abs(contactWipe.getBoundingClientRect().left) < 2;
      lenis.scrollTo(lenis.targetScroll + deltaY, {
        lerp: CONTACT_HANDOFF_LERP,
        programmatic: false,
        userData: contactSettled
          ? { skipPause: { at: SCROLL_CONTACT_SET, dir: "down" } }
          : undefined,
      });
      return true;
    };

    const handleWheel = (event: globalThis.WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (
        nestedContactScrollerCanConsume(event.target, contactWipe, event.deltaY)
      ) {
        return;
      }

      const deltaScale =
        event.deltaMode === globalThis.WheelEvent.DOM_DELTA_LINE
          ? 16.666666666666668
          : event.deltaMode === globalThis.WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1;
      if (!handOffToTimeline(event.deltaY * deltaScale)) return;

      event.preventDefault();
      event.stopPropagation();
    };

    const handleTouchStart = (event: globalThis.TouchEvent) => {
      lastTouchY.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: globalThis.TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      const previousY = lastTouchY.current;
      if (currentY === undefined || previousY === null) return;

      lastTouchY.current = currentY;
      const deltaY = previousY - currentY;
      if (Math.abs(deltaY) < 0.5) return;
      if (nestedContactScrollerCanConsume(event.target, contactWipe, deltaY)) {
        return;
      }
      if (!handOffToTimeline(deltaY)) return;

      event.preventDefault();
      event.stopPropagation();
    };

    const resetTouchTracking = () => {
      lastTouchY.current = null;
    };

    contactWipe.addEventListener("wheel", handleWheel, {
      capture: true,
      passive: false,
    });
    contactWipe.addEventListener("touchstart", handleTouchStart, {
      capture: true,
      passive: true,
    });
    contactWipe.addEventListener("touchmove", handleTouchMove, {
      capture: true,
      passive: false,
    });
    contactWipe.addEventListener("touchend", resetTouchTracking, true);
    contactWipe.addEventListener("touchcancel", resetTouchTracking, true);

    return () => {
      contactWipe.removeEventListener("wheel", handleWheel, true);
      contactWipe.removeEventListener("touchstart", handleTouchStart, true);
      contactWipe.removeEventListener("touchmove", handleTouchMove, true);
      contactWipe.removeEventListener("touchend", resetTouchTracking, true);
      contactWipe.removeEventListener("touchcancel", resetTouchTracking, true);
    };
  }, [lenis]);

  return (
    <motion.div
      className={styles.contactWipe}
      data-contact-scroll-container
      id="contact"
      ref={contactWipeRef}
      style={{ x: wipeX }}
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
              hey@miizumelon.com
            </a>
          </div>
        </div>

        <div className={styles.formPanel} data-contact-scroll-container>
          <ContactForm narrow={narrow} region={region} />
        </div>
      </div>
    </motion.div>
  );
}
