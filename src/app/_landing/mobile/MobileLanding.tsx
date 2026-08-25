"use client";

import { useEffect } from "react";

import { ContactSection } from "../contact/ContactSection";
import type { ContactRegion } from "../contact/contact-form-model";
import { LandingFooter } from "../footer/LandingFooter";
import styles from "../../miizu-landing.module.css";
import { MobileIdentity } from "./MobileIdentity";

export function MobileLanding({
  initialRegion,
}: {
  initialRegion: ContactRegion;
}) {
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
      <MobileIdentity />
      <ContactSection compact formFirst initialRegion={initialRegion} />
      <LandingFooter />
    </main>
  );
}
