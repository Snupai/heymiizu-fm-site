"use client";

import { useEffect, useRef, useState } from "react";

import { INTRO_REVEAL_DELAY_MS } from "./scroll-timeline";

export type IntroPhase = "video" | "revealing" | "complete";

export function useIntroSequence(reduceMotion: boolean | null) {
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const showreelVideoRef = useRef<HTMLVideoElement>(null);
  const introSlideCompletions = useRef(0);
  const [introPhase, setIntroPhase] = useState<IntroPhase>(
    reduceMotion ? "complete" : "video",
  );
  const [introSlidesDone, setIntroSlidesDone] = useState(false);
  const [introVideoEnded, setIntroVideoEnded] = useState(false);

  const introActive = introPhase !== "complete";

  useEffect(() => {
    if (reduceMotion) {
      setIntroPhase("complete");
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (introPhase !== "video" || reduceMotion) return;

    const video = introVideoRef.current;
    if (!video) return;

    let timer: number | undefined;

    const startRevealTimer = () => {
      if (timer !== undefined) return;

      const remainingMs = Math.max(
        0,
        INTRO_REVEAL_DELAY_MS - video.currentTime * 1000,
      );
      timer = window.setTimeout(() => {
        setIntroPhase("revealing");
      }, remainingMs);
    };

    if (!video.paused) startRevealTimer();
    video.addEventListener("playing", startRevealTimer);

    return () => {
      video.removeEventListener("playing", startRevealTimer);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [introPhase, reduceMotion]);

  useEffect(() => {
    if (introPhase !== "revealing") return;

    introSlideCompletions.current = 0;
    setIntroSlidesDone(false);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "revealing" || !introSlidesDone || !introVideoEnded)
      return;
    setIntroPhase("complete");
  }, [introPhase, introSlidesDone, introVideoEnded]);

  useEffect(() => {
    if (introPhase === "complete" || reduceMotion) return;
    void introVideoRef.current?.play().catch(() => undefined);
  }, [introPhase, reduceMotion]);

  useEffect(() => {
    if (introPhase === "video") return;
    void showreelVideoRef.current?.play().catch(() => undefined);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase === "complete") return;

    const html = document.documentElement;
    const body = document.body;
    const lockedScrollX = window.scrollX;
    const lockedScrollY = window.scrollY;
    const scrollKeys = new Set([
      " ",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "End",
      "Home",
      "PageDown",
      "PageUp",
      "Spacebar",
    ]);
    const previousStyles = {
      bodyOverflow: body.style.overflow,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyTouchAction: body.style.touchAction,
      htmlOverflow: html.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      htmlTouchAction: html.style.touchAction,
    };
    const preventScroll = (event: Event) => event.preventDefault();
    const preventScrollKeys = (event: KeyboardEvent) => {
      if (scrollKeys.has(event.key)) event.preventDefault();
    };
    const keepScrollPosition = () => {
      window.scrollTo(lockedScrollX, lockedScrollY);
    };

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    html.style.touchAction = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.touchAction = "none";
    window.addEventListener("keydown", preventScrollKeys);
    window.addEventListener("scroll", keepScrollPosition);
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("keydown", preventScrollKeys);
      window.removeEventListener("scroll", keepScrollPosition);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("wheel", preventScroll);
      html.style.overflow = previousStyles.htmlOverflow;
      html.style.overscrollBehavior = previousStyles.htmlOverscrollBehavior;
      html.style.touchAction = previousStyles.htmlTouchAction;
      body.style.overflow = previousStyles.bodyOverflow;
      body.style.overscrollBehavior = previousStyles.bodyOverscrollBehavior;
      body.style.touchAction = previousStyles.bodyTouchAction;
    };
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "complete") return;

    const video = introVideoRef.current;
    if (!video) return;

    const freezeLastFrame = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.max(0, video.duration - 0.04);
      }
      video.pause();
    };

    if (video.readyState >= 1) {
      freezeLastFrame();
      return;
    }

    video.addEventListener("loadedmetadata", freezeLastFrame, { once: true });
    return () => video.removeEventListener("loadedmetadata", freezeLastFrame);
  }, [introPhase]);

  const handleIntroSlideComplete = () => {
    if (introPhase !== "revealing") return;

    introSlideCompletions.current += 1;
    if (introSlideCompletions.current >= 2) {
      setIntroSlidesDone(true);
    }
  };

  const handleIntroVideoEnded = () => {
    setIntroVideoEnded(true);
    introVideoRef.current?.pause();
  };

  return {
    handleIntroSlideComplete,
    handleIntroVideoEnded,
    introActive,
    introPhase,
    introVideoRef,
    showreelVideoRef,
  };
}
