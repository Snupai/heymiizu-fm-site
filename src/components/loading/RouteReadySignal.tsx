"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLoadingOverlay } from "./LoadingOverlayContext";

export default function RouteReadySignal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resetForNewRoute, markRouteReady } = useLoadingOverlay();
  const isFirstMount = useRef(true);
  const isProjectsPage = pathname === "/projects";

  // When the URL changes (not on first mount), reset for new route.
  // Only trigger overlay logic for projects page
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      // On first mount, only mark ready if on projects page
      if (isProjectsPage) {
        markRouteReady();
      }
      return;
    }
    
    // Only trigger overlay for projects page
    if (!isProjectsPage) {
      return;
    }
    
    // On subsequent navigations to projects page, reset first
    resetForNewRoute();
    // Then mark ready after a tick so reset has time to take effect
    const timer = setTimeout(() => {
      markRouteReady();
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname, resetForNewRoute, markRouteReady, isProjectsPage]);

  return <>{children}</>;
}

