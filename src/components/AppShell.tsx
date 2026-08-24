"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React from "react";

import ChromeGate from "./ChromeGate";

const NavbarContent = dynamic(() => import("./Navbar"));
const FooterContent = dynamic(() => import("./Footer"));
const AutoLogout = dynamic(() => import("./AutoLogout"));
const Toaster = dynamic(() =>
  import("@/components/ui/sonner").then((module) => module.Toaster),
);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Landing and legal pages render their own minimal chrome.
  const usesBareShell =
    pathname === "/" || pathname === "/imprint" || pathname === "/privacy";

  if (usesBareShell) return <>{children}</>;

  return (
    <>
      <ChromeGate>
        <NavbarContent />
      </ChromeGate>
      <AutoLogout />
      <div className="flex flex-1 flex-col">{children}</div>
      <ChromeGate>
        <FooterContent />
      </ChromeGate>
      <Toaster />
    </>
  );
}
