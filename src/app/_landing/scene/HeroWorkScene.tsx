"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { ContactRegion } from "../contact/contact-form-model";
import { ContactSection } from "../contact/ContactSection";
import {
  getIntroPanelRest,
  getWorkShadeEntryX,
  INTRO_CARD_SLIDE_DURATION_S,
  INTRO_CARD_SLIDE_EASE,
  INTRO_HEADER_SLIDE_DURATION_S,
  INTRO_SLIDE_EASE,
  SCROLL_WORK_EXIT_START,
  WORK_SEQUENCE_DURATION_S,
} from "./scroll-timeline";
import styles from "../../miizu-landing.module.css";
import { ClientsMarquee } from "./ClientsMarquee";
import { useHeroWorkTimeline } from "./useHeroWorkTimeline";
import { useIntroSequence } from "./useIntroSequence";
import { useSmoothScroll } from "./useSmoothScroll";
import { WorkLines } from "./WorkLines";

export function HeroWorkScene({
  initialRegion,
}: {
  initialRegion: ContactRegion;
}) {
  const reduceMotion = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const scrollHudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const resetScroll = () => window.scrollTo(0, 0);
    resetScroll();
    const layoutFrame = window.requestAnimationFrame(resetScroll);
    window.addEventListener("pageshow", resetScroll);

    return () => {
      window.cancelAnimationFrame(layoutFrame);
      window.removeEventListener("pageshow", resetScroll);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const {
    handleIntroSlideComplete,
    handleIntroVideoEnded,
    introActive,
    introPhase,
    introVideoRef,
    showreelVideoRef,
  } = useIntroSequence(reduceMotion);
  const {
    cardScaleX,
    cardScaleY,
    clientsContactFadeOpacity,
    clientsContactFadeScaleX,
    clientsOverlayX,
    contactWipeX,
    heroExitY,
    heroOpacity,
    openContact,
    openWork,
    panelRadius,
    panelScaleX,
    panelScaleY,
    panelX,
    panelY,
    sceneRef,
    scrollYProgress,
    surfaceInset,
    handlePauseStop,
    workExitX,
    workSequenceStarted,
  } = useHeroWorkTimeline(compact);

  useSmoothScroll(reduceMotion !== true, sceneRef, handlePauseStop);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const hud = scrollHudRef.current;
    if (hud) hud.textContent = `${(progress * 100).toFixed(1)}%`;
  });

  const panelRest = getIntroPanelRest(compact);
  const introPanelOffscreen = {
    x: "100vw",
    y: panelRest.y,
    scaleX: panelRest.scaleX,
    scaleY: panelRest.scaleY,
  };
  const introPanelResting = {
    x: panelRest.x,
    y: panelRest.y,
    scaleX: panelRest.scaleX,
    scaleY: panelRest.scaleY,
  };
  const scrollHintOpacity = introActive ? 0 : heroOpacity;
  const workSequenceTime = useMotionValue(0);
  const workShadeEntryX = useTransform(workSequenceTime, getWorkShadeEntryX);

  useEffect(() => {
    const target = workSequenceStarted ? WORK_SEQUENCE_DURATION_S : 0;

    if (reduceMotion) {
      workSequenceTime.jump(target);
      return;
    }

    if (workSequenceStarted && scrollYProgress.get() >= SCROLL_WORK_EXIT_START) {
      workSequenceTime.jump(WORK_SEQUENCE_DURATION_S);
      return;
    }

    const current = workSequenceTime.get();
    const delta = Math.abs(target - current);
    if (delta < 0.001) {
      workSequenceTime.jump(target);
      return;
    }

    const controls = animate(workSequenceTime, target, {
      duration: delta,
      ease: "linear",
    });

    if (!workSequenceStarted) {
      return () => {
        controls.stop();
      };
    }

    const unsub = scrollYProgress.on("change", (progress) => {
      if (progress < SCROLL_WORK_EXIT_START) return;

      controls.stop();
      workSequenceTime.jump(WORK_SEQUENCE_DURATION_S);
      unsub();
    });

    return () => {
      controls.stop();
      unsub();
    };
  }, [reduceMotion, scrollYProgress, workSequenceStarted, workSequenceTime]);

  return (
    <div
      className={styles.heroWorkScene}
      data-intro-lock={introActive ? "" : undefined}
      data-intro-phase={introActive ? introPhase : undefined}
      id="hero"
      ref={sceneRef}
    >
      <div className={styles.stickyStage}>
        <div
          aria-hidden="true"
          className={styles.scrollProgressHud}
          ref={scrollHudRef}
        >
          0.0%
        </div>
        {!reduceMotion ? (
          <motion.video
            ref={introVideoRef}
            aria-hidden="true"
            autoPlay
            className={`${styles.heroIntroVideo} ${
              introPhase === "video"
                ? styles.heroIntroVideoOverlay
                : introPhase === "revealing"
                  ? styles.heroIntroVideoRevealing
                  : ""
            }`}
            disablePictureInPicture
            muted
            onEnded={handleIntroVideoEnded}
            onError={handleIntroVideoEnded}
            playsInline
            preload="auto"
            style={{ y: introPhase === "complete" ? heroExitY : undefined }}
          >
            <source src="/preload_v2.mp4" type="video/mp4" />
          </motion.video>
        ) : null}

        <motion.header
          animate={
            introActive ? { y: introPhase === "video" ? "-120%" : "0%" } : false
          }
          className={styles.header}
          initial={introPhase === "complete" ? false : { y: "-120%" }}
          onAnimationComplete={handleIntroSlideComplete}
          style={
            introPhase === "complete"
              ? { opacity: heroOpacity, y: heroExitY }
              : { opacity: 1 }
          }
          transition={{
            duration:
              introPhase === "video" ? 0 : INTRO_HEADER_SLIDE_DURATION_S,
            ease: INTRO_SLIDE_EASE,
          }}
        >
          <button onClick={openWork} type="button">
            look at me
          </button>
          <Link href="#hero" aria-label="Back to the top">
            miizumelon
          </Link>
          <button onClick={openContact} type="button">
            Contact
          </button>
        </motion.header>

        <motion.button
          aria-label="Open the work section"
          className={styles.scrollHint}
          onClick={openWork}
          style={{ opacity: scrollHintOpacity }}
          type="button"
        >
          scroll
        </motion.button>

        <motion.section
          animate={
            introActive
              ? introPhase === "video"
                ? introPanelOffscreen
                : introPanelResting
              : false
          }
          aria-label="Showreel and selected work"
          className={styles.showreelPanel}
          id="work"
          initial={introActive ? introPanelOffscreen : false}
          onAnimationComplete={handleIntroSlideComplete}
          style={
            introActive
              ? undefined
              : {
                  scaleX: panelScaleX,
                  scaleY: panelScaleY,
                  x: panelX,
                  y: panelY,
                }
          }
          transition={
            introPhase === "revealing"
              ? {
                  duration: INTRO_CARD_SLIDE_DURATION_S,
                  ease: INTRO_CARD_SLIDE_EASE,
                }
              : { duration: 0 }
          }
        >
          <motion.div
            className={styles.showreelSurface}
            style={{
              borderRadius: panelRadius,
              inset: surfaceInset,
            }}
          >
            <motion.div
              aria-hidden="true"
              className={styles.showreelVideoFrame}
              style={{
                scaleX: cardScaleX,
                scaleY: cardScaleY,
              }}
            >
              <video
                ref={showreelVideoRef}
                autoPlay
                className={styles.showreelVideo}
                disablePictureInPicture
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src="/showreel_2026.mp4" type="video/mp4" />
              </video>
            </motion.div>

            <ClientsMarquee reduceMotion={reduceMotion} x={clientsOverlayX} />

            <motion.div
              aria-hidden="true"
              className={styles.workShade}
              style={{ x: workExitX }}
            >
              <motion.div
                className={styles.workShadeMotion}
                style={{ x: workShadeEntryX }}
              >
                <div className={styles.workShadeCopy} />
                <div className={styles.workShadeEdge} />
              </motion.div>
            </motion.div>

            <WorkLines
              workExitX={workExitX}
              workSequenceTime={workSequenceTime}
            />
          </motion.div>
        </motion.section>

        <motion.div
          aria-hidden="true"
          className={styles.marqueeContactFadeCarrier}
          style={{ x: contactWipeX }}
        >
          <motion.div
            className={styles.marqueeContactFade}
            style={{
              opacity: clientsContactFadeOpacity,
              scaleX: clientsContactFadeScaleX,
            }}
          />
        </motion.div>

        <ContactSection
          compact={compact}
          initialRegion={initialRegion}
          wipeX={contactWipeX}
        />
      </div>
    </div>
  );
}
