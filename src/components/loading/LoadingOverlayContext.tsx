"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type LoadingOverlayApi = {
  start: () => void;
  done: () => void;
  markRouteReady: () => void;
  resetForNewRoute: () => void;
};

type LoadingOverlayState = {
  visible: boolean;
  finishRequested: boolean;
};

const LoadingOverlayContext = createContext<(LoadingOverlayApi & LoadingOverlayState) | null>(null);

export function useLoadingOverlay() {
  const ctx = useContext(LoadingOverlayContext);
  if (!ctx) throw new Error("useLoadingOverlay must be used within LoadingOverlayProvider");
  return ctx;
}

export function LoadingOverlayProvider({
  children,
  renderOverlay,
}: {
  children: React.ReactNode;
  renderOverlay: (state: LoadingOverlayState & { onFinished: () => void }) => React.ReactNode;
}) {
  const [pendingCount, setPendingCount] = useState(0);
  const [routeReady, setRouteReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [finishRequested, setFinishRequested] = useState(false);

  // Use refs to track latest values for async checks
  const pendingCountRef = useRef(pendingCount);
  const routeReadyRef = useRef(routeReady);
  const visibleRef = useRef(visible);

  useEffect(() => { pendingCountRef.current = pendingCount; }, [pendingCount]);
  useEffect(() => { routeReadyRef.current = routeReady; }, [routeReady]);
  useEffect(() => { visibleRef.current = visible; }, [visible]);

  const start = useCallback(() => {
    setPendingCount((c) => c + 1);
    setVisible(true);
    setFinishRequested(false);
  }, []);

  const done = useCallback(() => {
    setPendingCount((c) => Math.max(0, c - 1));
  }, []);

  const resetForNewRoute = useCallback(() => {
    setRouteReady(false);
    setVisible(true);
    setFinishRequested(false);
  }, []);

  const markRouteReady = useCallback(() => {
    setRouteReady(true);
  }, []);

  // When route is ready AND there are no pending tasks, request finishing after a short delay.
  useEffect(() => {
    if (!visible) return;
    if (!routeReady) return;
    if (pendingCount > 0) return;

    // Wait a short moment, then request finish (let page render first).
    const timer = setTimeout(() => {
      // Double-check refs in case something changed
      if (!visibleRef.current) return;
      if (!routeReadyRef.current) return;
      if (pendingCountRef.current > 0) return;

      setFinishRequested(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [routeReady, pendingCount, visible]);

  const onFinished = useCallback(() => {
    setVisible(false);
    setFinishRequested(false);
  }, []);

  const value = useMemo(
    () => ({
      start,
      done,
      markRouteReady,
      resetForNewRoute,
      visible,
      finishRequested,
    }),
    [start, done, markRouteReady, resetForNewRoute, visible, finishRequested],
  );

  return (
    <LoadingOverlayContext.Provider value={value}>
      {children}
      {renderOverlay({ visible, finishRequested, onFinished })}
    </LoadingOverlayContext.Provider>
  );
}

