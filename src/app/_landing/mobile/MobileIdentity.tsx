"use client";

import { useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CLIENTS, WORK_PROOF_ITEMS } from "../scene/content";
import styles from "../../miizu-landing.module.css";

const HEADER_TONE_OFFSET_PX = 52;

export function MobileIdentity() {
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const [onDark, setOnDark] = useState(false);
  const [copyEntered, setCopyEntered] = useState(reduceMotion === true);

  useEffect(() => {
    if (reduceMotion === true) {
      setCopyEntered(true);
      return;
    }

    const frame = window.requestAnimationFrame(() => setCopyEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);

  useEffect(() => {
    const updateTone = () => {
      const contact = document.getElementById("contact");
      if (!contact) {
        setOnDark(false);
        return;
      }

      const box = contact.getBoundingClientRect();
      setOnDark(
        box.top <= HEADER_TONE_OFFSET_PX && box.bottom > HEADER_TONE_OFFSET_PX,
      );
    };

    updateTone();
    window.addEventListener("scroll", updateTone, { passive: true });
    return () => window.removeEventListener("scroll", updateTone);
  }, []);

  const scrollToHero = () => {
    const target = document.getElementById("hero");
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: 0 });
      return;
    }
    target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`${styles.header} ${styles.mobileHeader} ${styles.mobileHeaderSolo}`}
        data-on-dark={onDark ? "" : undefined}
      >
        <Link
          href="#hero"
          aria-label="Back to the top"
          onClick={(event) => {
            event.preventDefault();
            scrollToHero();
          }}
        >
          miizumelon
        </Link>
      </header>

      <section className={styles.mobileHero} id="hero">
        <div
          className={`${styles.heroCopy} ${styles.mobileHeroCopy}`}
          data-entered={copyEntered ? "" : undefined}
        >
          <h1>
            <span className={styles.printHey}>
              Hey
              <span aria-hidden="true" className={styles.handwrittenHey}>
                Hey!
              </span>
            </span>
            <span>I&rsquo;m Miizu</span>
          </h1>
        </div>

        <div aria-label="Showreel" className={styles.mobileShowreel}>
          <div className={styles.mobileShowreelFrame}>
            <video
              autoPlay
              className={styles.mobileShowreelVideo}
              disablePictureInPicture
              loop
              muted
              playsInline
              preload="metadata"
            >
              <source src="/showreel_2026.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <ul className={styles.mobileProof}>
          {WORK_PROOF_ITEMS.map((item) => (
            <li className={styles.mobileProofChip} key={item.id}>
              {item.text}
            </li>
          ))}
        </ul>

        <p className={styles.mobileClientsLine}>{CLIENTS.join(" · ")}</p>
      </section>
    </>
  );
}
