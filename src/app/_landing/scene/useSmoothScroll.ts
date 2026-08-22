"use client";

import { useEffect } from "react";

import {
  SCROLL_MAX_SPEED_VH_PER_S,
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

export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let current = window.scrollY;
    let velocity = 0;
    let lastWheelAt = 0;
    let lastFrameAt = 0;
    let frame = 0;

    const apply = (y: number) => {
      window.scrollTo(window.scrollX, y);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.048, (now - lastFrameAt) / 1000 || 1 / 60);
      lastFrameAt = now;

      const maxY = maxScrollY();
      const maxSpeed = SCROLL_MAX_SPEED_VH_PER_S * window.innerHeight;
      const idle = now - lastWheelAt > 90;

      if (idle) {
        const fast = clamp(Math.abs(velocity) / (maxSpeed * 0.22), 0, 1);
        const tau =
          SCROLL_SMOOTH_COAST_S * (1 - fast) + SCROLL_SMOOTH_BRAKE_S * fast;
        velocity *= Math.exp(-dt / tau);
        if (Math.abs(velocity) < 22) velocity = 0;
      }

      velocity = clamp(velocity, -maxSpeed, maxSpeed);
      current = clamp(current + velocity * dt, 0, maxY);

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

      const now = window.performance.now();
      const eventDt = lastWheelAt
        ? clamp((now - lastWheelAt) / 1000, 1 / 120, 1 / 20)
        : 1 / 60;
      lastWheelAt = now;

      const maxSpeed = SCROLL_MAX_SPEED_VH_PER_S * window.innerHeight;
      const impulse = clamp(dy / eventDt, -maxSpeed, maxSpeed);
      const follow = 1 - Math.exp(-eventDt / SCROLL_SMOOTH_FOLLOW_S);
      velocity += (impulse - velocity) * Math.min(1, follow + 0.22);

      start();
    };

    const onScroll = () => {
      if (frame) return;
      current = window.scrollY;
      velocity = 0;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);
}
