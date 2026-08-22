"use client";

import { LandingFooter } from "./_landing/footer/LandingFooter";
import { HeroWorkScene } from "./_landing/scene/HeroWorkScene";

import styles from "./miizu-landing.module.css";

export default function MiizuLanding() {
  return (
    <main className={styles.site}>
      <HeroWorkScene />
      <LandingFooter />
    </main>
  );
}
