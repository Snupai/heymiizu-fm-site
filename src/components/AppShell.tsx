"use client";

import React from "react";
import NavbarContent from "./Navbar";
import FooterContent from "./Footer";
import ChromeGate from "./ChromeGate";
import AutoLogout from "./AutoLogout";
import { Toaster } from "@/components/ui/sonner";
import VideoLoader from "./VideoLoader";
import { LoadingOverlayProvider } from "./loading/LoadingOverlayContext";
import RouteReadySignal from "./loading/RouteReadySignal";
import NavigationStartListener from "./loading/NavigationStartListener";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LoadingOverlayProvider
      renderOverlay={({ visible, finishRequested, onFinished }) => (
        <VideoLoader visible={visible} finishRequested={finishRequested} onFinished={onFinished} />
      )}
    >
      <NavigationStartListener />
      <ChromeGate>
        <NavbarContent />
      </ChromeGate>
      <AutoLogout />
      <div className="flex-1 flex flex-col">
        <RouteReadySignal>{children}</RouteReadySignal>
      </div>
      <ChromeGate>
        <FooterContent />
      </ChromeGate>
      <Toaster />
    </LoadingOverlayProvider>
  );
}

