"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLoadingOverlay } from "./LoadingOverlayContext";

export default function RouteReadySignal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resetForNewRoute, markRouteReady } = useLoadingOverlay();
  const isFirstMount = useRef(true);

  // When the URL changes (not on first mount), reset for new route.
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      // On first mount, just mark ready immediately
      markRouteReady();
      return;
    }
    // On subsequent navigations, reset first
    resetForNewRoute();
    // Then mark ready after a tick so reset has time to take effect
    const timer = setTimeout(() => {
      markRouteReady();
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname, resetForNewRoute, markRouteReady]);

  return <>{children}</>;
}

