"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React from "react";

import ChromeGate from "./ChromeGate";
import { LoadingOverlayProvider } from "./loading/LoadingOverlayContext";

const NavbarContent = dynamic(() => import("./Navbar"));
const FooterContent = dynamic(() => import("./Footer"));
const AutoLogout = dynamic(() => import("./AutoLogout"));
const VideoLoader = dynamic(() => import("./VideoLoader"));
const RouteReadySignal = dynamic(() => import("./loading/RouteReadySignal"));
const NavigationStartListener = dynamic(
  () => import("./loading/NavigationStartListener"),
);
const Toaster = dynamic(() =>
  import("@/components/ui/sonner").then((module) => module.Toaster),
);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const usesEditorialShell = pathname === "/";

  if (usesEditorialShell) return <>{children}</>;

  return (
    <LoadingOverlayProvider
      renderOverlay={({ visible, finishRequested, onFinished }) => (
        <VideoLoader
          visible={visible}
          finishRequested={finishRequested}
          onFinished={onFinished}
        />
      )}
    >
      <NavigationStartListener />
      <ChromeGate>
        <NavbarContent />
      </ChromeGate>
      <AutoLogout />
      <div className="flex flex-1 flex-col">
        <RouteReadySignal>{children}</RouteReadySignal>
      </div>
      <ChromeGate>
        <FooterContent />
      </ChromeGate>
      <Toaster />
    </LoadingOverlayProvider>
  );
}
