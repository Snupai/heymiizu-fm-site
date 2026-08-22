"use client";

import { useMotionValue, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef } from "react";

import {
  getClientsOverlayOffset,
  getContactWipeOffset,
  getWorkShadeOffset,
  SCROLL_CONTACT_SET,
  SCROLL_HERO_FADE_END,
  SCROLL_PANEL_EXPANDED,
  SCROLL_PANEL_HOLD,
  SCROLL_SURFACE_INSET_MID,
  SCROLL_WORK_TEXT_HOLD_END,
  SHOWREEL_RADIUS_REM,
} from "./scroll-timeline";

export function useHeroWorkTimeline(compact: boolean) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const viewportWidthMV = useMotionValue(0);

  useLayoutEffect(() => {
    const syncViewport = () => viewportWidthMV.set(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, [viewportWidthMV]);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
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
  const workShadeX = useTransform(
    [scrollYProgress, viewportWidthMV],
    ([progress, width]) => {
      if (!width) return -10000;
      return getWorkShadeOffset(progress as number, width as number, compact);
    },
  );
  const clientsOverlayX = useTransform(
    [scrollYProgress, viewportWidthMV],
    ([progress, width]) => {
      if (!width) return -10000;
      return getClientsOverlayOffset(progress as number, width as number);
    },
  );
  const clientsOverlayOpacity = useTransform(
    scrollYProgress,
    [0, SCROLL_WORK_TEXT_HOLD_END, SCROLL_WORK_TEXT_HOLD_END + 0.001],
    [0, 0, 1],
  );
  const contactWipeX = useTransform(
    [scrollYProgress, viewportWidthMV],
    ([progress, width]) => {
      if (!width) return -10000;
      return getContactWipeOffset(progress as number, width as number);
    },
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
    scrollToProgress(SCROLL_PANEL_EXPANDED + 0.14);
  };

  const openContact = () => {
    scrollToProgress(SCROLL_CONTACT_SET);
  };

  return {
    cardScaleX,
    cardScaleY,
    clientsOverlayOpacity,
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
    viewportWidthMV,
    workShadeX,
  };
}
