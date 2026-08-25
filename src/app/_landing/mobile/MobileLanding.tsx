"use client";

import { useMotionValue } from "framer-motion";
import { useEffect } from "react";

import { ContactSection } from "../contact/ContactSection";
import type { ContactRegion } from "../contact/contact-form-model";
import { LandingFooter } from "../footer/LandingFooter";
import styles from "../../miizu-landing.module.css";
import { MobileHero } from "./MobileHero";
import { MobileClients, MobileWork } from "./MobileWork";

export function MobileLanding({
  initialRegion,
}: {
  initialRegion: ContactRegion;
}) {
  const wipeX = useMotionValue("0vw");

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return (
    <main className={`${styles.site} ${styles.mobileSite}`}>
      <MobileHero />
      <MobileWork />
      <MobileClients />
      <ContactSection compact initialRegion={initialRegion} wipeX={wipeX} />
      <LandingFooter />
    </main>
  );
}
