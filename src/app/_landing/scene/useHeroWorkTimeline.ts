"use client";

import { useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { useCallback, useRef, useState } from "react";

import { sceneProgress } from "./scene-scroll";
import {
  getClientsContactFadeOpacity,
  getClientsContactFadeScaleX,
  getMarqueeHandoffProgress,
  SCROLL_CONTACT_SET,
  SCROLL_CONTACT_START,
  SCROLL_HERO_FADE_END,
  SCROLL_PANEL_EXPANDED,
  SCROLL_PANEL_HOLD,
  SCROLL_SURFACE_INSET_MID,
  SCROLL_WORK_PAUSE,
  SCROLL_WORK_UP_PAUSE,
  SCROLL_WORK_RESET,
  SCROLL_WORK_REVEAL,
  SHOWREEL_RADIUS_REM,
  type ScrollPauseStop,
} from "./scroll-timeline";

type WorkSequencePhase = "idle" | "in" | "out";
type ScrollDir = "up" | "down";

export function useHeroWorkTimeline(compact: boolean) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const workSequencePhase = useRef<WorkSequencePhase>("idle");
  const lastWorkProgress = useRef(0);
  const lastScrollDir = useRef<ScrollDir>("down");
  const [workSequenceStarted, setWorkSequenceStarted] = useState(false);
  const lenis = useLenis();

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const reverseWorkSequence = useCallback(() => {
    if (workSequencePhase.current !== "in") return;
    workSequencePhase.current = "out";
    setWorkSequenceStarted(false);
  }, []);

  const playWorkSequence = useCallback(() => {
    workSequencePhase.current = "in";
    setWorkSequenceStarted(true);
  }, []);

  const handlePauseStop = useCallback(
    (stop: ScrollPauseStop) => {
      switch (stop.dir) {
        case "down":
          if (stop.at === SCROLL_WORK_PAUSE) playWorkSequence();
          return;
        case "up":
          if (stop.at === SCROLL_WORK_UP_PAUSE) reverseWorkSequence();
          return;
        default: {
          const exhaustive: never = stop;
          return exhaustive;
        }
      }
    },
    [playWorkSequence, reverseWorkSequence],
  );

  useLenis((instance) => {
    const scene = sceneRef.current;
    if (!scene) return;

    const progress = sceneProgress(scene, instance.scroll);
    const last = lastWorkProgress.current;

    if (progress < last - 1e-6) lastScrollDir.current = "up";
    else if (progress > last + 1e-6) lastScrollDir.current = "down";

    lastWorkProgress.current = progress;

    const phase = workSequencePhase.current;
    const goingDown = lastScrollDir.current === "down";

    if (phase === "idle" && goingDown && progress >= SCROLL_WORK_REVEAL) {
      playWorkSequence();
      return;
    }

    if (phase === "in" && progress < SCROLL_WORK_RESET) {
      reverseWorkSequence();
      return;
    }

    if (phase === "out" && progress < SCROLL_WORK_RESET) {
      workSequencePhase.current = "idle";
      return;
    }

    if (phase === "out" && goingDown && progress >= SCROLL_WORK_REVEAL) {
      playWorkSequence();
    }
  });

  const panelX = useTransform(
    scrollYProgress,
    [0, SCROLL_PANEL_HOLD, SCROLL_PANEL_EXPANDED, 1],
    compact ? ["-5vw", "-5vw", "0vw", "0vw"] : ["-3vw", "-3vw", "0vw", "0vw"],
  );
  const panelY = useTransform(
    scrollYProgress,
    [0, SCROLL_PANEL_HOLD, SCROLL_PANEL_EXPANDED, 1],
    compact
      ? ["43svh", "43svh", "0svh", "0svh"]
      : ["9svh", "9svh", "0svh", "0svh"],
  );
  const panelScaleX = useTransform(
    scrollYProgress,
    [0, SCROLL_PANEL_HOLD, SCROLL_PANEL_EXPANDED, 1],
    compact ? [0.9, 0.9, 1, 1] : [0.31, 0.31, 1, 1],
  );
  const panelScaleY = useTransform(
    scrollYProgress,
    [0, SCROLL_PANEL_HOLD, SCROLL_PANEL_EXPANDED, 1],
    compact ? [0.51, 0.51, 1, 1] : [0.82, 0.82, 1, 1],
  );
  const cardScaleX = useTransform(panelScaleX, (value) => 1 / value);
  const cardScaleY = useTransform(panelScaleY, (value) => 1 / value);
  const surfaceInset = useTransform(
    scrollYProgress,
    [0, SCROLL_SURFACE_INSET_MID, SCROLL_PANEL_EXPANDED],
    ["0rem", "0rem", `-${SHOWREEL_RADIUS_REM}rem`],
  );
  const panelRadius = useTransform(() => {
    const scaleX = Math.max(panelScaleX.get(), 0.001);
    const scaleY = Math.max(panelScaleY.get(), 0.001);
    return `${SHOWREEL_RADIUS_REM / scaleX}rem / ${SHOWREEL_RADIUS_REM / scaleY}rem`;
  });
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, SCROLL_PANEL_HOLD, SCROLL_HERO_FADE_END],
    [1, 1, 0],
  );
  const heroExitY = useTransform(
    scrollYProgress,
    [0, SCROLL_PANEL_HOLD, SCROLL_PANEL_EXPANDED],
    ["0%", "0%", "-100%"],
  );
  const workExitX = useTransform(scrollYProgress, (progress) => {
    const handoff = getMarqueeHandoffProgress(progress);
    return `calc(${handoff * 100}vw + ${handoff}px)`;
  });
  const clientsOverlayX = useTransform(
    scrollYProgress,
    (progress) => `${(getMarqueeHandoffProgress(progress) - 1) * 100}%`,
  );
  const contactWipeX = useTransform(
    scrollYProgress,
    [0, SCROLL_CONTACT_START, SCROLL_CONTACT_SET, 1],
    ["-100vw", "-100vw", "0vw", "0vw"],
  );
  const clientsContactFadeOpacity = useTransform(
    scrollYProgress,
    getClientsContactFadeOpacity,
  );
  const clientsContactFadeScaleX = useTransform(
    scrollYProgress,
    getClientsContactFadeScaleX,
  );

  const scrollToProgress = (progress: number) => {
    const scene = sceneRef.current;
    if (!scene) return;

    const travel = Math.max(0, scene.offsetHeight - window.innerHeight);
    const top = scene.offsetTop + travel * progress;

    if (lenis) {
      lenis.scrollTo(top, { userData: { skipPauses: true } });
      return;
    }

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  const openWork = () => {
    scrollToProgress(SCROLL_WORK_REVEAL + 0.01);
  };

  const openContact = () => {
    scrollToProgress(SCROLL_CONTACT_SET);
  };

  return {
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
  };
}
