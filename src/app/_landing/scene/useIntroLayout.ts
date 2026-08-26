"use client";

import { useLayoutEffect, useState } from "react";

import { getIntroLayout, type IntroLayout } from "./scroll-timeline";

export function useIntroLayout() {
  const [layout, setLayout] = useState<IntroLayout | null>(null);

  useLayoutEffect(() => {
    const sync = () => setLayout(getIntroLayout(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return layout;
}
