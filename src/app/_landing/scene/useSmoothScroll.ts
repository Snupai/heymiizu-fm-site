"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, type RefObject } from "react";

import { sceneProgress, sceneScrollY } from "./scene-scroll";
import {
  SCROLL_PAUSE_RELEASE,
  SCROLL_PAUSE_STOPS,
  type ScrollPauseStop,
} from "./scroll-timeline";

function pauseKey(stop: ScrollPauseStop) {
  return `${stop.dir}:${stop.at}`;
}

function crossedPauseStop(
  from: number,
  to: number,
  consumed: Set<string>,
): ScrollPauseStop | null {
  if (to === from) return null;

  const dir = to > from ? "down" : "up";

  for (const stop of SCROLL_PAUSE_STOPS) {
    if (stop.dir !== dir || consumed.has(pauseKey(stop))) continue;

    if (dir === "down" && from < stop.at && stop.at <= to) return stop;
    if (dir === "up" && to <= stop.at && stop.at < from) return stop;
  }

  return null;
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
  const onPauseStopRef = useRef(onPauseStop);
  const lenis = useLenis();
  onPauseStopRef.current = onPauseStop;

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

  useLenis(
    (instance) => {
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
