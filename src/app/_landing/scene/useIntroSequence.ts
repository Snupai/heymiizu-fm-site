"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  INTRO_CARD_SLIDE_DURATION_S,
  INTRO_CARD_UNLOCK_LEAD_MS,
  INTRO_REVEAL_DELAY_MS,
  INTRO_SCROLL_UNLOCK_LEAD_MS,
} from "./scroll-timeline";

export type IntroPhase = "video" | "revealing" | "complete";

export function useIntroSequence(reduceMotion: boolean | null) {
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const showreelVideoRef = useRef<HTMLVideoElement>(null);
  const [introPhase, setIntroPhase] = useState<IntroPhase>(
    reduceMotion ? "complete" : "video",
  );
  const [introCardIn, setIntroCardIn] = useState(false);
  const [introCardSettled, setIntroCardSettled] = useState(false);
  const [introCanComplete, setIntroCanComplete] = useState(false);
  const revealStartedAtRef = useRef(0);

  const introActive = introPhase !== "complete";
  const introScrollLocked = introActive && !(introCardIn && introCanComplete);

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

    setIntroCardIn(false);
    setIntroCardSettled(false);

    const slideMs = INTRO_CARD_SLIDE_DURATION_S * 1_000;
    revealStartedAtRef.current = performance.now();
    const unlockTimer = window.setTimeout(
      () => setIntroCardIn(true),
      Math.max(0, slideMs - INTRO_CARD_UNLOCK_LEAD_MS),
    );
    const settleTimer = window.setTimeout(
      () => setIntroCardSettled(true),
      slideMs + 80,
    );

    return () => {
      window.clearTimeout(unlockTimer);
      window.clearTimeout(settleTimer);
    };
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "revealing" || !introCardSettled || !introCanComplete) {
      return;
    }
    setIntroPhase("complete");
  }, [introPhase, introCardSettled, introCanComplete]);

  useEffect(() => {
    if (introPhase === "complete" || reduceMotion) return;
    void introVideoRef.current?.play().catch(() => undefined);
  }, [introPhase, reduceMotion]);

  useEffect(() => {
    if (introPhase === "video") return;
    void showreelVideoRef.current?.play().catch(() => undefined);
  }, [introPhase]);

  useLayoutEffect(() => {
    if (!introScrollLocked) return;

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
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyTouchAction: body.style.touchAction,
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

    html.dataset.introLock = "";
    html.style.overscrollBehavior = "none";
    html.style.touchAction = "none";
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
      delete html.dataset.introLock;
      html.style.overscrollBehavior = previousStyles.htmlOverscrollBehavior;
      html.style.touchAction = previousStyles.htmlTouchAction;
      body.style.overscrollBehavior = previousStyles.bodyOverscrollBehavior;
      body.style.touchAction = previousStyles.bodyTouchAction;
    };
  }, [introScrollLocked]);

  useEffect(() => {
    if (introPhase === "complete" || reduceMotion) return;

    const video = introVideoRef.current;
    if (!video) return;

    if (video.networkState === video.NETWORK_NO_SOURCE) {
      setIntroCanComplete(true);
      setIntroPhase((phase) => (phase === "video" ? "revealing" : phase));
      return;
    }

    let timer: number | undefined;

    const markReady = () => setIntroCanComplete(true);
    const scheduleUnlock = () => {
      if (timer !== undefined) return;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      const remainingMs =
        (video.duration - video.currentTime) * 1000 -
        INTRO_SCROLL_UNLOCK_LEAD_MS;
      timer = window.setTimeout(markReady, Math.max(0, remainingMs));
    };

    if (video.readyState >= 1) scheduleUnlock();
    video.addEventListener("loadedmetadata", scheduleUnlock);
    video.addEventListener("playing", scheduleUnlock);
    video.addEventListener("ended", markReady);

    return () => {
      video.removeEventListener("loadedmetadata", scheduleUnlock);
      video.removeEventListener("playing", scheduleUnlock);
      video.removeEventListener("ended", markReady);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [introPhase, reduceMotion]);

  const handleIntroCardSlideComplete = () => {
    if (introPhase !== "revealing") return;
    if (performance.now() - revealStartedAtRef.current < 250) return;
    setIntroCardIn(true);
    setIntroCardSettled(true);
  };

  const finishIntroVideo = () => {
    setIntroCanComplete(true);
    setIntroPhase((phase) => (phase === "video" ? "revealing" : phase));
  };

  const handleIntroVideoEnded = () => {
    finishIntroVideo();

    const video = introVideoRef.current;
    if (!video) return;

    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = Math.max(0, video.duration - 0.04);
    }
    video.pause();
  };

  const handleIntroVideoError = () => {
    finishIntroVideo();
    introVideoRef.current?.pause();
  };

  return {
    handleIntroCardSlideComplete,
    handleIntroVideoEnded,
    handleIntroVideoError,
    introActive,
    introPhase,
    introScrollLocked,
    introVideoRef,
    showreelVideoRef,
  };
}
