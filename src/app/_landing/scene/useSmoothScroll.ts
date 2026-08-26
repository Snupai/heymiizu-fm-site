"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, type RefObject } from "react";

import { sceneProgress, sceneScrollY } from "./scene-scroll";
import {
  crossedPauseStop,
  pauseHoldTick,
  pauseKey,
  shouldSkipPauseStops,
} from "./scroll-pauses";
import { SCROLL_PAUSE_RELEASE, SCROLL_PAUSE_STOPS } from "./scroll-timeline";
import type { ScrollPauseStop } from "./scroll-timeline";

function isScrollbarPointer(event: PointerEvent) {
  if (event.pointerType !== "mouse" && event.pointerType !== "pen")
    return false;
  if (event.button !== 0) return false;
  return event.clientX >= document.documentElement.clientWidth;
}

function preventHoldScroll(event: Event) {
  event.preventDefault();
  event.stopPropagation();
}

export function useSmoothScroll(
  enabled: boolean,
  sceneRef: RefObject<HTMLElement | null>,
  onPauseStop?: (stop: ScrollPauseStop) => void,
) {
  const consumed = useRef(new Set<string>());
  const lastProgress = useRef(0);
  const pauseUntil = useRef(0);
  const holdTimer = useRef(0);
  const draggingScrollbar = useRef(false);
  const applyingHold = useRef(false);
  const holdLocked = useRef(false);
  const previousTouchAction = useRef("");
  const onPauseStopRef = useRef(onPauseStop);
  const lenis = useLenis();

  useEffect(() => {
    onPauseStopRef.current = onPauseStop;
  });

  const releaseHoldLock = () => {
    if (!holdLocked.current) return;
    holdLocked.current = false;
    document.documentElement.style.touchAction = previousTouchAction.current;
    window.removeEventListener("touchmove", preventHoldScroll, true);
    window.removeEventListener("touchend", preventHoldScroll, true);
    window.removeEventListener("wheel", preventHoldScroll, true);
  };

  const applyHoldLock = () => {
    if (holdLocked.current) return;
    holdLocked.current = true;
    previousTouchAction.current = document.documentElement.style.touchAction;
    document.documentElement.style.touchAction = "none";
    window.addEventListener("touchmove", preventHoldScroll, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchend", preventHoldScroll, {
      capture: true,
      passive: false,
    });
    window.addEventListener("wheel", preventHoldScroll, {
      capture: true,
      passive: false,
    });
  };

  const clearHold = () => {
    window.clearTimeout(holdTimer.current);
    holdTimer.current = 0;
    pauseUntil.current = 0;
    releaseHoldLock();
  };

  useEffect(() => {
    if (enabled) return;

    clearHold();
    draggingScrollbar.current = false;
    lenis?.start();
  }, [enabled, lenis]);

  useEffect(() => {
    return () => {
      clearHold();
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!isScrollbarPointer(event)) return;
      draggingScrollbar.current = true;
      clearHold();
    };

    const onPointerUp = () => {
      if (!draggingScrollbar.current) return;
      draggingScrollbar.current = false;
      lenis?.start();
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointerup", onPointerUp, true);
    window.addEventListener("pointercancel", onPointerUp, true);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("pointercancel", onPointerUp, true);
    };
  }, [enabled, lenis]);

  useLenis(
    (instance) => {
      if (!enabled || applyingHold.current) return;

      const scene = sceneRef.current;
      if (!scene) return;

      const progress = sceneProgress(scene, instance.scroll);
      const skipPauses = shouldSkipPauseStops({
        draggingScrollbar: draggingScrollbar.current,
        holding: window.performance.now() < pauseUntil.current,
        isScrolling: instance.isScrolling,
        skipPausesUserData: instance.userData.skipPauses === true,
      });

      if (skipPauses) {
        if (pauseUntil.current !== 0) {
          clearHold();
          instance.start();
        }
        lastProgress.current = progress;
        return;
      }

      const hold = pauseHoldTick({
        now: window.performance.now(),
        pauseUntil: pauseUntil.current,
        progress,
        heldProgress: lastProgress.current,
      });

      if (hold === "pin") {
        applyingHold.current = true;
        instance.scrollTo(sceneScrollY(scene, lastProgress.current), {
          force: true,
          immediate: true,
        });
        if (!instance.isStopped) instance.stop();
        applyHoldLock();
        applyingHold.current = false;
        return;
      }

      if (hold === "hold") return;

      for (const stop of SCROLL_PAUSE_STOPS) {
        if (Math.abs(progress - stop.at) > SCROLL_PAUSE_RELEASE) {
          consumed.current.delete(pauseKey(stop));
        }
      }

      const pauseAt = crossedPauseStop(
        lastProgress.current,
        progress,
        consumed.current,
      );

      lastProgress.current = progress;

      if (pauseAt === null) return;

      const now = window.performance.now();
      consumed.current.add(pauseKey(pauseAt));
      lastProgress.current = pauseAt.at;
      pauseUntil.current = now + pauseAt.holdMs;

      applyingHold.current = true;
      instance.scrollTo(sceneScrollY(scene, pauseAt.at), {
        force: true,
        immediate: true,
      });
      instance.stop();
      applyHoldLock();
      applyingHold.current = false;
      onPauseStopRef.current?.(pauseAt);

      window.clearTimeout(holdTimer.current);
      holdTimer.current = window.setTimeout(() => {
        holdTimer.current = 0;
        pauseUntil.current = 0;
        releaseHoldLock();
        instance.start();
      }, pauseAt.holdMs);
    },
    [enabled],
  );
}
