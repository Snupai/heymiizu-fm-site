"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  getIntroCardSlideDurationS,
  getIntroRevealDelayMs,
  hasIntroPlaybackReachedReveal,
  INTRO_CARD_UNLOCK_LEAD_MS,
  INTRO_SCROLL_UNLOCK_LEAD_MS,
} from "./scroll-timeline";

export type IntroPhase = "video" | "revealing" | "complete";

export function useIntroSequence(
  reduceMotion: boolean | null,
  compact: boolean | null,
) {
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
  const textIntro = compact === true;

  useEffect(() => {
    if (reduceMotion) {
      setIntroPhase("complete");
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (introPhase !== "video" || reduceMotion || compact === null) return;

    if (textIntro) {
      const timer = window.setTimeout(() => {
        setIntroCanComplete(true);
        setIntroPhase("revealing");
      }, getIntroRevealDelayMs(true));

      return () => window.clearTimeout(timer);
    }

    const video = introVideoRef.current;
    if (!video) return;

    const revealDelayMs = getIntroRevealDelayMs(false);
    let revealed = false;

    const maybeReveal = () => {
      if (revealed) return;
      if (!hasIntroPlaybackReachedReveal(video.currentTime, revealDelayMs)) {
        return;
      }
      revealed = true;
      setIntroPhase("revealing");
    };

    video.addEventListener("playing", maybeReveal);
    video.addEventListener("seeked", maybeReveal);
    video.addEventListener("timeupdate", maybeReveal);
    maybeReveal();

    return () => {
      video.removeEventListener("playing", maybeReveal);
      video.removeEventListener("seeked", maybeReveal);
      video.removeEventListener("timeupdate", maybeReveal);
    };
  }, [compact, introPhase, reduceMotion, textIntro]);

  useEffect(() => {
    if (introPhase !== "revealing") return;

    setIntroCardIn(false);
    setIntroCardSettled(false);

    const slideMs = getIntroCardSlideDurationS(textIntro) * 1_000;
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
  }, [introPhase, textIntro]);

  useEffect(() => {
    if (introPhase !== "revealing" || !introCardSettled || !introCanComplete) {
      return;
    }
    setIntroPhase("complete");
  }, [introPhase, introCardSettled, introCanComplete]);

  useEffect(() => {
    if (introPhase === "complete" || reduceMotion || compact !== false) return;
    void introVideoRef.current?.play().catch(() => undefined);
  }, [compact, introPhase, reduceMotion]);

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
    if (introPhase === "complete" || reduceMotion || compact !== false) return;

    const video = introVideoRef.current;
    if (!video) return;

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
  }, [compact, introPhase, reduceMotion]);

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
