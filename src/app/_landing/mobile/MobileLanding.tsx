"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BookCallSoon } from "../contact/BookCallSoon";
import { ContactForm } from "../contact/ContactForm";
import type { ContactRegion } from "../contact/contact-form-model";
import { RegionToggle } from "../contact/RegionToggle";
import styles from "../../miizu-landing.module.css";

export function MobileLanding({
  initialRegion,
}: {
  initialRegion: ContactRegion;
}) {
  const reduceMotion = useReducedMotion();
  const [region, setRegion] = useState<ContactRegion>(initialRegion);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return (
    <main className={`${styles.site} ${styles.mobileContactPage}`}>
      <header className={styles.mobileContactHeader}>
        <span>miizumelon</span>
        <a
          aria-label="Email hey@miizumelon.com"
          className={styles.mobileContactMail}
          href="mailto:hey@miizumelon.com"
        >
          <Mail aria-hidden="true" />
        </a>
      </header>

      <section className={styles.mobileContactIntro}>
        <motion.h1
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.mobileContactLead}>Got something</span>
          <span>BIIIG?</span>
        </motion.h1>
        <p>Tell me what you&rsquo;re launching.</p>
        <RegionToggle onChange={setRegion} region={region} />
        <BookCallSoon />
      </section>

      <div className={styles.mobileContactForm}>
        <ContactForm compact region={region} />
        <a
          className={styles.mobileContactEmail}
          href="mailto:hey@miizumelon.com"
        >
          or email hey@
          <span className={styles.emailDomain}>miizumelon.com</span>
        </a>
        <nav aria-label="Legal" className={styles.mobileContactLegal}>
          <Link href="/imprint">Imprint</Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </main>
  );
}
