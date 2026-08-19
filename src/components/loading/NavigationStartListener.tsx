"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoadingOverlay } from "./LoadingOverlayContext";

function isModifiedEvent(e: MouseEvent) {
  return e.metaKey || e.altKey || e.ctrlKey || e.shiftKey;
}

function findAnchor(el: EventTarget | null): HTMLAnchorElement | null {
  let node = el as HTMLElement | null;
  while (node) {
    if (node instanceof HTMLAnchorElement) return node;
    node = node.parentElement;
  }
  return null;
}

export default function NavigationStartListener() {
  const pathname = usePathname();
  const { resetForNewRoute } = useLoadingOverlay();

  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return; // left click only
      if (isModifiedEvent(e)) return;

      const a = findAnchor(e.target);
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#")) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;

      // Only handle same-origin navigations (internal links).
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        // If it’s the same exact URL, don't flash the loader.
        if (url.href === window.location.href) return;

        // Only trigger overlay for navigation to/from projects page
        const isNavigatingToProjects = url.pathname === "/projects";
        const isNavigatingFromProjects = pathname === "/projects";

        if (!isNavigatingToProjects && !isNavigatingFromProjects) {
          return; // Don't trigger overlay for other pages
        }
      } catch {
        return;
      }

      resetForNewRoute();
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [resetForNewRoute, pathname]);

  return null;
}
