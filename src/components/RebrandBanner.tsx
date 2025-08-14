"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "rebrand_banner_dismissed";
const BANNER_HEIGHT_PX = 44; // keep in sync with py-2 and text size

export default function RebrandBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true";
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setVisible(false);
  };

  // Prevent overlap with bottom links by reserving space while visible
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (visible) {
      const prev = document.body.style.paddingBottom;
      document.body.style.paddingBottom = `${BANNER_HEIGHT_PX}px`;
      return () => {
        document.body.style.paddingBottom = prev;
      };
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] w-full border-t border-amber-200 bg-amber-50 text-amber-900 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <p className="text-sl">
          We are currently undergoing a rebrand. Some visuals and names may change. Thanks for your patience!
        </p>
        <button
          type="button"
          aria-label="Dismiss rebranding notice"
          onClick={dismiss}
          className="rounded-md border border-amber-300 px-2 py-1 text-xm font-medium text-amber-900 hover:bg-amber-100"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
