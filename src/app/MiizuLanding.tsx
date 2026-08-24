"use client";

import type { ContactRegion } from "./_landing/contact/contact-form-model";
import { LandingFooter } from "./_landing/footer/LandingFooter";
import { MobileLanding } from "./_landing/mobile/MobileLanding";
import { HeroWorkScene } from "./_landing/scene/HeroWorkScene";
import { SmoothScroll } from "./_landing/scene/SmoothScroll";
import { useIntroLayout } from "./_landing/scene/useIntroLayout";

import styles from "./miizu-landing.module.css";

export default function MiizuLanding({
  initialRegion,
}: {
  initialRegion: ContactRegion;
}) {
  const layout = useIntroLayout();

  return (
    <SmoothScroll>
      {layout === null ? (
        <main aria-busy="true" className={styles.site} />
      ) : layout === "compact" ? (
        <MobileLanding initialRegion={initialRegion} />
      ) : (
        <main className={styles.site}>
          <HeroWorkScene initialRegion={initialRegion} />
          <LandingFooter />
        </main>
      )}
    </SmoothScroll>
  );
}
