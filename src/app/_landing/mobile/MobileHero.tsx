"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getIntroCardSlideTransition,
  getIntroHeaderSlideDurationS,
  INTRO_SLIDE_EASE,
} from "../scene/scroll-timeline";
import { useIntroSequence } from "../scene/useIntroSequence";
import styles from "../../miizu-landing.module.css";

const HEADER_TONE_OFFSET_PX = 52;

export function MobileHero() {
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const [onDark, setOnDark] = useState(false);
  const {
    handleIntroCardSlideComplete,
    introActive,
    introPhase,
    introScrollLocked,
    showreelVideoRef,
  } = useIntroSequence(reduceMotion, true);

  useEffect(() => {
    const updateTone = () => {
      const overDark = ["work", "contact"].some((id) => {
        const section = document.getElementById(id);
        if (!section) return false;
        const box = section.getBoundingClientRect();
        return (
          box.top <= HEADER_TONE_OFFSET_PX && box.bottom > HEADER_TONE_OFFSET_PX
        );
      });
      setOnDark(overDark);
    };

    updateTone();
    window.addEventListener("scroll", updateTone, { passive: true });
    return () => window.removeEventListener("scroll", updateTone);
  }, []);

  const scrollToId = (id: string) => {
    if (introScrollLocked) return;
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: id === "hero" ? 0 : -52 });
      return;
    }
    target.scrollIntoView({ behavior: "smooth" });
  };

  const introComplete = introPhase === "complete";

  return (
    <>
      <motion.header
        animate={
          introActive ? { y: introPhase === "video" ? "-120%" : "0%" } : false
        }
        className={`${styles.header} ${styles.mobileHeader}`}
        data-on-dark={onDark ? "" : undefined}
        initial={introComplete ? false : { y: "-120%" }}
        transition={{
          duration:
            introPhase === "video" ? 0 : getIntroHeaderSlideDurationS(true),
          ease: INTRO_SLIDE_EASE,
        }}
      >
        <button onClick={() => scrollToId("work")} type="button">
          look at me
        </button>
        <Link
          href="#hero"
          aria-label="Back to the top"
          onClick={(event) => {
            event.preventDefault();
            scrollToId("hero");
          }}
        >
          miizumelon
        </Link>
        <button onClick={() => scrollToId("contact-form")} type="button">
          Contact
        </button>
      </motion.header>

      <section
        className={styles.mobileHero}
        data-intro-lock={introScrollLocked ? "" : undefined}
        data-intro-phase={introActive ? introPhase : undefined}
        id="hero"
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={`${styles.heroCopy} ${styles.mobileHeroCopy}`}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          transition={{ duration: 0.55, ease: INTRO_SLIDE_EASE }}
        >
          <h1>
            <span className={styles.printHey}>
              Hey
              <span aria-hidden="true" className={styles.handwrittenHey}>
                Hey!
              </span>
            </span>
            <span>I&rsquo;m Miizu</span>
          </h1>
        </motion.div>

        <motion.button
          animate={{
            opacity: introPhase === "video" ? 0 : 1,
            pointerEvents: introPhase === "video" ? "none" : "auto",
            y: 0,
          }}
          className={styles.mobileWorkWithMe}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          onClick={() => scrollToId("contact-form")}
          transition={{ delay: 0.18, duration: 0.45, ease: INTRO_SLIDE_EASE }}
          type="button"
        >
          work with me
        </motion.button>

        <motion.div
          animate={
            introActive
              ? introPhase === "video"
                ? { x: "100vw" }
                : { x: "0vw" }
              : { x: "0vw" }
          }
          aria-label="Showreel"
          className={styles.mobileShowreel}
          initial={introActive ? { x: "100vw" } : false}
          onAnimationComplete={handleIntroCardSlideComplete}
          transition={
            introPhase === "revealing"
              ? getIntroCardSlideTransition(true)
              : { duration: 0 }
          }
        >
          <div className={styles.mobileShowreelFrame}>
            <video
              ref={showreelVideoRef}
              autoPlay
              className={styles.mobileShowreelVideo}
              disablePictureInPicture
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/showreel_2026.mp4" type="video/mp4" />
            </video>
          </div>
        </motion.div>

        <motion.button
          animate={{
            opacity: introComplete ? 1 : 0,
            pointerEvents: introComplete ? "auto" : "none",
          }}
          aria-label="Open the work section"
          className={styles.mobileScrollHint}
          initial={false}
          onClick={() => scrollToId("work")}
          transition={{ duration: 0.4, ease: INTRO_SLIDE_EASE }}
          type="button"
        >
          scroll
        </motion.button>
      </section>
    </>
  );
}
