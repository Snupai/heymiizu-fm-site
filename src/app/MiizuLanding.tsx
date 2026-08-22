"use client";

import type { ContactRegion } from "./_landing/contact/contact-form-model";
import { LandingFooter } from "./_landing/footer/LandingFooter";
import { HeroWorkScene } from "./_landing/scene/HeroWorkScene";
import { SmoothScroll } from "./_landing/scene/SmoothScroll";

import styles from "./miizu-landing.module.css";

export default function MiizuLanding({
  initialRegion,
}: {
  initialRegion: ContactRegion;
}) {
  return (
    <SmoothScroll>
      <main className={styles.site}>
        <HeroWorkScene initialRegion={initialRegion} />
        <LandingFooter />
      </main>
    </SmoothScroll>
  );
}
