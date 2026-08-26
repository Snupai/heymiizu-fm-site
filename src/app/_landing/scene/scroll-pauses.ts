import { SCROLL_PAUSE_STOPS, type ScrollPauseStop } from "./scroll-timeline";

export function pauseKey(stop: ScrollPauseStop) {
  return `${stop.dir}:${stop.at}`;
}

export function crossedPauseStop(
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

export function shouldSkipPauseStops({
  draggingScrollbar,
  holding,
  isScrolling,
  skipPausesUserData,
}: {
  draggingScrollbar: boolean;
  holding: boolean;
  isScrolling: boolean | "native" | "smooth";
  skipPausesUserData: boolean;
}) {
  if (draggingScrollbar || skipPausesUserData) return true;
  // Overlay scrollbar drags are "native". Skip those before a hold starts so
  // the thumb does not hitch, but never abort an active pause for them —
  // mobile touch also reports leftover native events while Lenis is stopped.
  if (isScrolling === "native" && !holding) return true;
  return false;
}

export type PauseHoldTick = "expired" | "hold" | "pin";

export function pauseHoldTick({
  now,
  pauseUntil,
  progress,
  heldProgress,
}: {
  now: number;
  pauseUntil: number;
  progress: number;
  heldProgress: number;
}): PauseHoldTick {
  if (pauseUntil === 0 || now >= pauseUntil) return "expired";
  if (Math.abs(progress - heldProgress) > 1e-4) return "pin";
  return "hold";
}
