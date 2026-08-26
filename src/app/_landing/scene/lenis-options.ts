import type { LenisOptions } from "lenis";

export const LENIS_OPTIONS: LenisOptions = {
  allowNestedScroll: true,
  anchors: true,
  autoRaf: false,
  stopInertiaOnNavigate: true,
  syncTouch: true,
  virtualScroll: () => document.documentElement.dataset.introLock === undefined,
};
