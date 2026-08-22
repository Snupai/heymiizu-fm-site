"use client";

import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

import {
  getClientsContactFadeOpacity,
  getClientsContactFadeScaleX,
  getMarqueeHandoffProgress,
  getWorkShadeOpacity,
  SCROLL_CONTACT_SET,
  SCROLL_CONTACT_START,
  SCROLL_HERO_FADE_END,
  SCROLL_PANEL_EXPANDED,
  SCROLL_PANEL_HOLD,
  SCROLL_SURFACE_INSET_MID,
  SCROLL_WORK_RESET,
  SCROLL_WORK_REVEAL,
  SHOWREEL_RADIUS_REM,
} from "./scroll-timeline";

export function useHeroWorkTimeline(compact: boolean) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const workSequenceTriggered = useRef(false);
  const [workSequenceRun, setWorkSequenceRun] = useState(0);
  const [workSequenceStarted, setWorkSequenceStarted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (progress >= SCROLL_WORK_REVEAL && !workSequenceTriggered.current) {
      workSequenceTriggered.current = true;
      setWorkSequenceRun((run) => run + 1);
      setWorkSequenceStarted(true);
      return;
    }

    if (progress < SCROLL_WORK_RESET && workSequenceTriggered.current) {
      workSequenceTriggered.current = false;
      setWorkSequenceStarted(false);
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
  const workExitX = useTransform(
    scrollYProgress,
    (progress) => `${getMarqueeHandoffProgress(progress) * 100}vw`,
  );
  const workShadeOpacity = useTransform(scrollYProgress, getWorkShadeOpacity);
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
    window.scrollTo({
      top: scene.offsetTop + travel * progress,
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
    workExitX,
    workSequenceRun,
    workSequenceStarted,
    workShadeOpacity,
  };
}
