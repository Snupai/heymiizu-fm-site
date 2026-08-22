"use client";

import { useEffect, type RefObject } from "react";

import {
  SCROLL_MAX_SPEED_VH_PER_S,
  SCROLL_PAUSE_RELEASE,
  SCROLL_PAUSE_STOPS,
  SCROLL_SMOOTH_ACCEL_S,
  SCROLL_SMOOTH_BRAKE_S,
  SCROLL_SMOOTH_COAST_S,
  SCROLL_SMOOTH_FOLLOW_S,
} from "./scroll-timeline";

function normalizeWheelDelta(event: WheelEvent) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }
  return event.deltaY;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function maxScrollY() {
  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
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

function canNestedScroll(target: EventTarget | null, deltaY: number) {
  if (!(target instanceof Element)) return false;

  let node: Element | null = target;

  while (node && node !== document.body && node !== document.documentElement) {
    if (node instanceof HTMLElement) {
      const { overflowY } = window.getComputedStyle(node);
      const canScrollY =
        overflowY === "auto" ||
        overflowY === "scroll" ||
        overflowY === "overlay";

      if (canScrollY && node.scrollHeight > node.clientHeight + 1) {
        const remaining =
          node.scrollHeight - node.clientHeight - node.scrollTop;
        if (
          (deltaY < 0 && node.scrollTop > 0) ||
          (deltaY > 0 && remaining > 1)
        ) {
          return true;
        }
      }
    }

    node = node.parentElement;
  }

  return false;
}

export function useSmoothScroll(
  enabled: boolean,
  sceneRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!enabled) return;

    let current = window.scrollY;
    let velocity = 0;
    let intent = 0;
    let lastWheelAt = 0;
    let lastFrameAt = 0;
    let lastProgress = sceneRef.current
      ? sceneProgress(sceneRef.current, current)
      : 0;
    let pauseUntil = 0;
    let frame = 0;
    const consumed = new Set<number>();

    const apply = (y: number) => {
      window.scrollTo(window.scrollX, y);
    };

    const tick = (now: number) => {
      const dt =
        lastFrameAt === 0
          ? 1 / 60
          : Math.min(0.048, (now - lastFrameAt) / 1000);
      lastFrameAt = now;

      const maxY = maxScrollY();
      const scene = sceneRef.current;
      const holding = now < pauseUntil;

      if (holding) {
        velocity = 0;
        intent = 0;
        apply(current);
        frame = window.requestAnimationFrame(tick);
        return;
      }

      const maxSpeed = SCROLL_MAX_SPEED_VH_PER_S * window.innerHeight;
      const idle = now - lastWheelAt > 90;

      if (idle) {
        intent = 0;
        const fast = clamp(Math.abs(velocity) / (maxSpeed * 0.22), 0, 1);
        const tau =
          SCROLL_SMOOTH_COAST_S * (1 - fast) + SCROLL_SMOOTH_BRAKE_S * fast;
        velocity *= Math.exp(-dt / tau);
        if (Math.abs(velocity) < 22) velocity = 0;
      } else {
        const fromRest = Math.abs(velocity) < maxSpeed * 0.22;
        const catchingUp = Math.abs(intent) > Math.abs(velocity);
        const tau =
          fromRest && catchingUp
            ? SCROLL_SMOOTH_ACCEL_S
            : SCROLL_SMOOTH_FOLLOW_S;
        velocity += (intent - velocity) * (1 - Math.exp(-dt / tau));
      }

      velocity = clamp(velocity, -maxSpeed, maxSpeed);
      current = clamp(current + velocity * dt, 0, maxY);

      if (scene) {
        const progress = sceneProgress(scene, current);

        for (const stop of SCROLL_PAUSE_STOPS) {
          if (Math.abs(progress - stop.at) > SCROLL_PAUSE_RELEASE) {
            consumed.delete(stop.at);
          }
        }

        const pauseAt = crossedPauseStop(lastProgress, progress, consumed);
        if (pauseAt !== null) {
          current = clamp(sceneScrollY(scene, pauseAt.at), 0, maxY);
          velocity = 0;
          pauseUntil = now + pauseAt.holdMs;
          consumed.add(pauseAt.at);
          lastProgress = pauseAt.at;
          apply(current);
          frame = window.requestAnimationFrame(tick);
          return;
        }

        lastProgress = progress;
      }

      if (current === 0 || current === maxY) velocity = 0;

      apply(current);

      if (idle && velocity === 0) {
        frame = 0;
        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame) return;
      lastFrameAt = 0;
      frame = window.requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      if (document.documentElement.dataset.introLock !== undefined) return;
      if (event.defaultPrevented || event.ctrlKey || event.metaKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const dy = normalizeWheelDelta(event);
      if (dy === 0 || canNestedScroll(event.target, dy)) return;

      event.preventDefault();

      if (window.performance.now() < pauseUntil) return;

      const now = window.performance.now();
      const eventDt = lastWheelAt
        ? clamp((now - lastWheelAt) / 1000, 1 / 120, 1 / 20)
        : 1 / 60;
      lastWheelAt = now;

      const maxSpeed = SCROLL_MAX_SPEED_VH_PER_S * window.innerHeight;
      intent = clamp(dy / eventDt, -maxSpeed, maxSpeed);

      start();
    };

    const onScroll = () => {
      if (frame) return;
      current = window.scrollY;
      velocity = 0;
      intent = 0;
      if (sceneRef.current) {
        lastProgress = sceneProgress(sceneRef.current, current);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled, sceneRef]);
}
