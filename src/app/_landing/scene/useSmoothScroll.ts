"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, type RefObject } from "react";

import { sceneProgress, sceneScrollY } from "./scene-scroll";
import {
  SCROLL_PAUSE_RELEASE,
  SCROLL_PAUSE_STOPS,
  type ScrollPauseStop,
} from "./scroll-timeline";

type PauseIdentity = Pick<ScrollPauseStop, "at" | "dir">;

function pauseKey(stop: PauseIdentity) {
  return `${stop.dir}:${stop.at}`;
}

function crossedPauseStop(
  from: number,
  to: number,
  consumed: Set<string>,
  skippedPause?: PauseIdentity,
): ScrollPauseStop | null {
  if (to === from) return null;

  const dir = to > from ? "down" : "up";

  for (const stop of SCROLL_PAUSE_STOPS) {
    if (
      stop.dir !== dir ||
      consumed.has(pauseKey(stop)) ||
      (skippedPause && pauseKey(stop) === pauseKey(skippedPause))
    ) {
      continue;
    }

    if (dir === "down" && from < stop.at && stop.at <= to) return stop;
    if (dir === "up" && to <= stop.at && stop.at < from) return stop;
  }

  return null;
}

function isScrollbarPointer(event: PointerEvent) {
  if (event.pointerType !== "mouse" && event.pointerType !== "pen")
    return false;
  if (event.button !== 0) return false;
  return event.clientX >= document.documentElement.clientWidth;
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
  const onPauseStopRef = useRef(onPauseStop);
  const lenis = useLenis();

  useEffect(() => {
    onPauseStopRef.current = onPauseStop;
  }, [onPauseStop]);

  const clearHold = () => {
    window.clearTimeout(holdTimer.current);
    holdTimer.current = 0;
    pauseUntil.current = 0;
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
      if (!enabled) return;

      const scene = sceneRef.current;
      if (!scene) return;

      const progress = sceneProgress(scene, instance.scroll);
      const skipAllPauses =
        draggingScrollbar.current ||
        instance.isScrolling === "native" ||
        instance.userData.skipPauses === true;
      const skippedPause = instance.userData.skipPause as
        | PauseIdentity
        | undefined;

      if (skipAllPauses) {
        if (pauseUntil.current !== 0) {
          clearHold();
          instance.start();
        }
        lastProgress.current = progress;
        return;
      }

      if (window.performance.now() < pauseUntil.current) {
        if (Math.abs(progress - lastProgress.current) > 1e-4) {
          clearHold();
          instance.start();
          lastProgress.current = progress;
        }
        return;
      }

      for (const stop of SCROLL_PAUSE_STOPS) {
        if (Math.abs(progress - stop.at) > SCROLL_PAUSE_RELEASE) {
          consumed.current.delete(pauseKey(stop));
        }
      }

      const pauseAt = crossedPauseStop(
        lastProgress.current,
        progress,
        consumed.current,
        skippedPause,
      );

      lastProgress.current = progress;

      if (pauseAt === null) return;

      const now = window.performance.now();
      consumed.current.add(pauseKey(pauseAt));
      lastProgress.current = pauseAt.at;
      pauseUntil.current = now + pauseAt.holdMs;

      instance.scrollTo(sceneScrollY(scene, pauseAt.at), {
        force: true,
        immediate: true,
      });
      instance.stop();
      onPauseStopRef.current?.(pauseAt);

      window.clearTimeout(holdTimer.current);
      holdTimer.current = window.setTimeout(() => {
        holdTimer.current = 0;
        instance.start();
      }, pauseAt.holdMs);
    },
    [enabled],
  );
}
