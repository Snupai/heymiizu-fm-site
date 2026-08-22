"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, type RefObject } from "react";

import { SCROLL_PAUSE_RELEASE, SCROLL_PAUSE_STOPS } from "./scroll-timeline";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function sceneTravel(scene: HTMLElement) {
  return Math.max(0, scene.offsetHeight - window.innerHeight);
}

function sceneProgress(scene: HTMLElement, scrollY: number) {
  const travel = Math.max(1, sceneTravel(scene));
  return clamp((scrollY - scene.offsetTop) / travel, 0, 1);
}

function sceneScrollY(scene: HTMLElement, progress: number) {
  return scene.offsetTop + sceneTravel(scene) * progress;
}

function crossedPauseStop(from: number, to: number, consumed: Set<number>) {
  if (to <= from) return null;

  for (const stop of SCROLL_PAUSE_STOPS) {
    if (consumed.has(stop.at)) continue;
    if (from < stop.at && stop.at <= to) return stop;
  }

  return null;
}

export function useSmoothScroll(
  enabled: boolean,
  sceneRef: RefObject<HTMLElement | null>,
) {
  const consumed = useRef(new Set<number>());
  const lastProgress = useRef(0);
  const pauseUntil = useRef(0);
  const holdTimer = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    if (enabled) return;

    window.clearTimeout(holdTimer.current);
    holdTimer.current = 0;
    pauseUntil.current = 0;
    lenis?.start();
  }, [enabled, lenis]);

  useEffect(() => {
    return () => {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = 0;
    };
  }, []);

  useLenis((instance) => {
    if (!enabled) return;

    const scene = sceneRef.current;
    if (!scene) return;

    const progress = sceneProgress(scene, instance.scroll);

    if (instance.userData.skipPauses === true) {
      lastProgress.current = progress;
      return;
    }

    if (window.performance.now() < pauseUntil.current) return;

    for (const stop of SCROLL_PAUSE_STOPS) {
      if (Math.abs(progress - stop.at) > SCROLL_PAUSE_RELEASE) {
        consumed.current.delete(stop.at);
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
    consumed.current.add(pauseAt.at);
    lastProgress.current = pauseAt.at;
    pauseUntil.current = now + pauseAt.holdMs;

    instance.scrollTo(sceneScrollY(scene, pauseAt.at), {
      force: true,
      immediate: true,
    });
    instance.stop();

    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = 0;
      instance.start();
    }, pauseAt.holdMs);
  }, [enabled]);
}
