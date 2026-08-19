"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import {
  formatPauseUntilDate,
  type ContactFormStatus,
} from "@/lib/contact-settings";

import styles from "./miizu-landing.module.css";

const CONTACT_HEADLINES = [
  <>
    You&rsquo;re launching&hellip;
    <br />
    <span>without me?</span>
  </>,
  <>
    Got a fresh product&hellip;
    <br />
    <span>and you need to make it MOVE</span>
  </>,
  <>
    Building something wild
    <br />
    <span>and need visuals to match?</span>
  </>,
  <>
    Got a CRAZY idea
    <br />
    <span>and need people to see it?</span>
  </>,
  <>
    Got something BIIIG
    <br />
    <span>and you just need to advertise it?</span>
  </>,
];

const CLIENTS = [
  "Duolingo",
  "Finanzguru",
  "Revolut",
  "Anyfin",
  "Shoop",
  "Carvertical",
  "Adobe",
  "Formelskin",
  "HOLY",
  "Airalo",
];

const SERVICES = [
  "Launch campaign",
  "Trailer",
  "Keynote visuals",
  "Brand placement",
  "Social media content",
  "Something else",
];

const BUDGETS = ["5 - 10k", "10 - 25k", "25 - 50k", "50 - 100k", "100k+"];

type ContactData = {
  name: string;
  email: string;
  telephone: string;
  referral: string;
  service: string;
  budget: string;
  deadline: string;
  description: string;
};

const INITIAL_CONTACT_DATA: ContactData = {
  name: "",
  email: "",
  telephone: "",
  referral: "",
  service: "",
  budget: "",
  deadline: "",
  description: "",
};

function scrollToId(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ContactForm({ region }: { region: "local" | "international" }) {
  const [data, setData] = useState<ContactData>(INITIAL_CONTACT_DATA);
  const [status, setStatus] = useState<ContactFormStatus>({
    paused: false,
    pauseUntil: null,
  });
  const [statusLoading, setStatusLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStatus() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes("example.supabase.co")) {
        setStatusLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/contact", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        setStatus((await response.json()) as ContactFormStatus);
      } catch {
        // Submission still checks the server-side pause state.
      } finally {
        if (!controller.signal.aborted) setStatusLoading(false);
      }
    }

    void loadStatus();
    return () => controller.abort();
  }, []);

  const updateField = (field: keyof ContactData, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    setResult(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || status.paused || statusLoading) return;

    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          telephone: data.telephone,
          company: data.referral
            ? `Found via: ${data.referral}`
            : "Not specified",
          projectType: data.service,
          sequenceLength: data.budget,
          deadline: data.deadline,
          assets: "To be discussed",
          cooperation: region === "local" ? "Local (Germany)" : "International",
          description: data.description,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        paused?: boolean;
        pauseUntil?: string | null;
      };

      if (!response.ok) {
        if (payload.paused) {
          setStatus({ paused: true, pauseUntil: payload.pauseUntil ?? null });
        }
        throw new Error(payload.error ?? "Your request could not be sent.");
      }

      setData(INITIAL_CONTACT_DATA);
      setResult({
        type: "success",
        message: "Request sent. I’ll be in touch soon.",
      });
    } catch (error) {
      setResult({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your request could not be sent.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = status.paused || statusLoading || submitting;

  return (
    <div className={styles.formShell} id="contact-form">
      {status.paused && (
        <div className={styles.pausedNotice} role="status">
          <span>Commissions paused</span>
          <strong>I&rsquo;m currently booked out.</strong>
          <p>
            New requests will reopen
            {status.pauseUntil
              ? ` on ${formatPauseUntilDate(status.pauseUntil)}`
              : " soon"}
            .
          </p>
        </div>
      )}

      <form
        className={`${styles.contactForm} ${status.paused ? styles.formPaused : ""}`}
        onSubmit={handleSubmit}
      >
        <fieldset disabled={disabled}>
          <label>
            <span>what should i call you?</span>
            <input
              autoComplete="name"
              maxLength={60}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Type your Name"
              required
              value={data.name}
            />
          </label>

          <label>
            <span>where do i reach you?</span>
            <input
              autoComplete="email"
              maxLength={120}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Type your Email"
              required
              type="email"
              value={data.email}
            />
          </label>

          <label>
            <span>what&rsquo;s the best number to reach you?</span>
            <input
              autoComplete="tel"
              maxLength={30}
              onChange={(event) => updateField("telephone", event.target.value)}
              placeholder="Type your phone number (optional)"
              type="tel"
              value={data.telephone}
            />
          </label>

          <label>
            <span>how did you find me?</span>
            <input
              maxLength={80}
              onChange={(event) => updateField("referral", event.target.value)}
              placeholder="Instagram, LinkedIn, X ..."
              value={data.referral}
            />
          </label>

          <label>
            <span>what service do you need?</span>
            <select
              onChange={(event) => updateField("service", event.target.value)}
              required
              value={data.service}
            >
              <option value="">Choose a service</option>
              {SERVICES.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
          </label>

          <label>
            <span>what&rsquo;s your budget?</span>
            <select
              onChange={(event) => updateField("budget", event.target.value)}
              required
              value={data.budget}
            >
              <option value="">Choose a range</option>
              {BUDGETS.map((budget) => (
                <option key={budget}>{budget}</option>
              ))}
            </select>
          </label>

          <label>
            <span>project delivery date</span>
            <input
              min={new Date().toISOString().slice(0, 10)}
              onChange={(event) => updateField("deadline", event.target.value)}
              required
              type="date"
              value={data.deadline}
            />
          </label>

          <label>
            <span>what are you up to?</span>
            <textarea
              maxLength={1600}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="What are you launching?"
              required
              rows={3}
              value={data.description}
            />
          </label>

          <button
            className={styles.submitButton}
            disabled={disabled}
            type="submit"
          >
            {submitting ? "Sending…" : "Send Request"}
          </button>
        </fieldset>

        {result && (
          <p
            className={
              result.type === "success" ? styles.formSuccess : styles.formError
            }
            role="status"
          >
            {result.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default function MiizuLanding() {
  const reduceMotion = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLElement>(null);
  const nuviaWordmarkRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [region, setRegion] = useState<"local" | "international">(
    "international",
  );
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const resetScroll = () => window.scrollTo(0, 0);
    resetScroll();
    const layoutFrame = window.requestAnimationFrame(resetScroll);
    window.addEventListener("pageshow", resetScroll);

    return () => {
      window.cancelAnimationFrame(layoutFrame);
      window.removeEventListener("pageshow", resetScroll);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setHeadlineIndex(Math.floor(Math.random() * CONTACT_HEADLINES.length));
  }, []);

  useEffect(() => {
    const wordmark = nuviaWordmarkRef.current;
    const word = wordmark?.querySelector<HTMLElement>(`.${styles.nuviaWord}`);

    if (!wordmark || !word) return;

    const fitWordmark = () => {
      const computed = window.getComputedStyle(word);
      const fontSize = Number.parseFloat(computed.fontSize);
      const letterSpacing = Number.parseFloat(computed.letterSpacing) || 0;
      const canvas = document.createElement("canvas");
      const sampleScale = Math.min(window.devicePixelRatio || 1, 2);
      const measurementContext = canvas.getContext("2d");

      if (!measurementContext || !Number.isFinite(fontSize)) return;

      const setFont = (context: CanvasRenderingContext2D) => {
        context.font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
        context.fontKerning = "normal";
        context.textBaseline = "alphabetic";
      };

      setFont(measurementContext);

      const text = "NVA";
      const metrics = measurementContext.measureText(text);
      const padding = Math.ceil(fontSize * 0.5);
      const ascent = Math.ceil(
        metrics.actualBoundingBoxAscent || fontSize * 0.9,
      );
      const descent = Math.ceil(
        metrics.actualBoundingBoxDescent || fontSize * 0.25,
      );
      const canvasWidth = Math.ceil(
        metrics.width + Math.abs(letterSpacing) * text.length + padding * 2,
      );
      const canvasHeight = ascent + descent + padding * 2;

      canvas.width = Math.ceil(canvasWidth * sampleScale);
      canvas.height = Math.ceil(canvasHeight * sampleScale);

      const context = canvas.getContext("2d");
      if (!context) return;

      context.scale(sampleScale, sampleScale);
      setFont(context);
      context.fillStyle = "#000";

      for (let index = 0; index < text.length; index += 1) {
        const character = text[index];
        if (!character) continue;

        const prefix = text.slice(0, index + 1);
        const characterWidth = context.measureText(character).width;
        const characterX =
          padding +
          context.measureText(prefix).width -
          characterWidth +
          letterSpacing * index;

        context.fillText(character, characterX, padding + ascent);
      }

      const pixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      let firstInkPixel = canvas.width;
      let lastInkPixel = -1;

      for (let index = 3; index < pixels.length; index += 4) {
        if (pixels[index] === 0) continue;
        const pixelX = ((index - 3) / 4) % canvas.width;
        firstInkPixel = Math.min(firstInkPixel, pixelX);
        lastInkPixel = Math.max(lastInkPixel, pixelX);
      }

      if (lastInkPixel < firstInkPixel) return;

      const inkLeft = firstInkPixel / sampleScale - padding;
      const inkRight = (lastInkPixel + 1) / sampleScale - padding;
      const inkWidth = inkRight - inkLeft;

      if (!Number.isFinite(inkWidth) || inkWidth <= 0) return;

      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const sideInset = mobile
        ? 0
        : Math.max(24, Math.min(64, wordmark.clientWidth * 0.05));
      const targetWidth = Math.max(1, wordmark.clientWidth - sideInset * 2 - 1);
      const scale = targetWidth / inkWidth;
      const shift = sideInset - inkLeft * scale;
      wordmark.style.setProperty("--nva-scale", scale.toString());
      wordmark.style.setProperty("--nva-shift", `${shift}px`);
    };

    const resizeObserver = new ResizeObserver(fitWordmark);
    resizeObserver.observe(wordmark);
    window.addEventListener("resize", fitWordmark);
    void document.fonts.ready.then(fitWordmark);
    fitWordmark();
    let layoutFrame = window.requestAnimationFrame(() => {
      layoutFrame = window.requestAnimationFrame(fitWordmark);
    });

    return () => {
      window.cancelAnimationFrame(layoutFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", fitWordmark);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setIntroVisible(false);
      return;
    }

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      setIntroVisible(false);
      document.documentElement.style.overflow = previousOverflow;
    }, 1650);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [reduceMotion]);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: clientsProgress } = useScroll({
    target: clientsRef,
    offset: ["start end", "end start"],
  });

  const panelX = useTransform(
    scrollYProgress,
    [0, 0.48, 0.72, 1],
    compact ? ["-5vw", "-5vw", "0vw", "0vw"] : ["-3vw", "-3vw", "0vw", "0vw"],
  );
  const panelY = useTransform(
    scrollYProgress,
    [0, 0.48, 0.72, 1],
    compact
      ? ["43svh", "43svh", "0svh", "0svh"]
      : ["9svh", "9svh", "0svh", "0svh"],
  );
  const panelScaleX = useTransform(
    scrollYProgress,
    [0, 0.48, 0.72, 1],
    compact ? [0.9, 0.9, 1, 1] : [0.31, 0.31, 1, 1],
  );
  const panelScaleY = useTransform(
    scrollYProgress,
    [0, 0.48, 0.72, 1],
    compact ? [0.51, 0.51, 1, 1] : [0.82, 0.82, 1, 1],
  );
  const cardScaleX = useTransform(panelScaleX, (value) => 1 / value);
  const cardScaleY = useTransform(panelScaleY, (value) => 1 / value);
  const panelRadius = useTransform(
    scrollYProgress,
    [0, 0.55, 0.72],
    ["2.6rem", "2.6rem", "0rem"],
  );
  const heroOpacity = useTransform(scrollYProgress, [0, 0.38, 0.58], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.56], ["0vh", "-6vh"]);
  const cardLabelOpacity = useTransform(
    scrollYProgress,
    [0, 0.43, 0.58],
    [1, 1, 0],
  );
  const workOpacity = useTransform(scrollYProgress, [0.7, 0.82], [0, 1]);
  const workY = useTransform(scrollYProgress, [0.7, 0.82], [42, 0]);
  const workShadeOpacity = useTransform(scrollYProgress, [0.58, 0.78], [0, 1]);
  const railX = useTransform(
    clientsProgress,
    [0, 0.28, 0.62, 1],
    ["-28vw", "-20vw", "0vw", "0vw"],
  );
  const railOpacity = useTransform(
    clientsProgress,
    [0, 0.22, 0.62, 1],
    [0, 0.08, 1, 1],
  );

  const headline = CONTACT_HEADLINES[headlineIndex];
  const bookingUrl =
    process.env.NEXT_PUBLIC_BOOKING_URL ??
    "mailto:hey@miizumelon.com?subject=Let%27s%20book%20a%20call";

  const openWork = () => {
    const sceneTop = sceneRef.current?.offsetTop ?? 0;
    window.scrollTo({
      top: sceneTop + window.innerHeight * 1.05,
      behavior: "smooth",
    });
  };

  return (
    <main className={styles.site}>
      <AnimatePresence>
        {introVisible && (
          <motion.div
            className={styles.intro}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <motion.span
              animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -8] }}
              transition={{ duration: 1.05, times: [0, 0.2, 0.72, 1] }}
            >
              miizumelon
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.heroWorkScene} id="hero" ref={sceneRef}>
        <div className={styles.stickyStage}>
          <motion.header
            className={styles.header}
            style={{ opacity: heroOpacity }}
          >
            <button onClick={openWork} type="button">
              look at me
            </button>
            <Link href="#hero" aria-label="Back to the top">
              miizumelon
            </Link>
            <button onClick={() => scrollToId("contact")} type="button">
              Contact
            </button>
          </motion.header>

          <motion.div
            className={styles.heroCopy}
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <h1>
              <span className={styles.printHey}>Hey</span>
              <span>I&rsquo;m Miizu</span>
            </h1>
            <span aria-hidden="true" className={styles.handwrittenHey}>
              Hey
            </span>
          </motion.div>

          <motion.button
            aria-label="Open the work section"
            className={styles.scrollHint}
            onClick={openWork}
            style={{ opacity: heroOpacity }}
            type="button"
          >
            scroll
          </motion.button>

          <motion.section
            aria-label="Showreel and selected work"
            className={styles.showreelPanel}
            id="work"
            style={{
              borderRadius: panelRadius,
              scaleX: panelScaleX,
              scaleY: panelScaleY,
              x: panelX,
              y: panelY,
            }}
          >
            <motion.div
              aria-hidden="true"
              className={styles.workShade}
              style={{ opacity: workShadeOpacity }}
            />

            <motion.button
              className={styles.cardLabel}
              onClick={openWork}
              style={{
                opacity: cardLabelOpacity,
                scaleX: cardScaleX,
                scaleY: cardScaleY,
              }}
              type="button"
            >
              Showreel video
            </motion.button>

            <motion.div
              className={styles.workContent}
              style={{ opacity: workOpacity, y: workY }}
            >
              <div className={styles.workList}>
                <p>I&rsquo;ve directed</p>
                <strong>
                  Launches
                  <br />
                  Trailers
                  <br />
                  Keynotes
                  <br />
                  Placements
                </strong>
                <p>
                  for brands
                  <br />
                  and creators
                </p>
              </div>
              <h2>
                Showreel video
                <br />
                <span>(customized for web)</span>
              </h2>
            </motion.div>
          </motion.section>
        </div>
      </div>

      <section
        className={styles.clientsBridge}
        id="clients"
        ref={clientsRef}
        aria-label="Selected clients"
      >
        <motion.div
          className={styles.clientsRail}
          style={{ opacity: railOpacity, x: railX }}
        >
          <span className={styles.clientsLabel}>selected clients</span>
          <div className={styles.clientMarquee}>
            <div className={styles.clientNames}>
              {[0, 1].map((copy) => (
                <div
                  aria-hidden={copy === 1}
                  className={styles.clientGroup}
                  key={copy}
                >
                  {CLIENTS.map((client) => (
                    <span key={`${copy}-${client}`}>{client}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className={styles.contactSection} id="contact">
        <div className={styles.contactPitch}>
          <div>
            <h2>{headline}</h2>
            <div
              className={styles.regionToggle}
              role="group"
              aria-label="Project location"
            >
              <button
                aria-pressed={region === "local"}
                className={region === "local" ? styles.regionActive : ""}
                onClick={() => setRegion("local")}
                type="button"
              >
                Local <small>(Germany)</small>
              </button>
              <button
                aria-pressed={region === "international"}
                className={
                  region === "international" ? styles.regionActive : ""
                }
                onClick={() => setRegion("international")}
                type="button"
              >
                International
              </button>
            </div>
          </div>

          <div className={styles.directContact}>
            <a
              className={styles.bookCall}
              href={bookingUrl}
              rel={bookingUrl.startsWith("http") ? "noreferrer" : undefined}
              target={bookingUrl.startsWith("http") ? "_blank" : undefined}
            >
              <span className={styles.bookCallText}>book a call</span>
              <span aria-hidden="true" className={styles.callIcon}>
                <ArrowUpRight />
              </span>
            </a>
            <p>or just say hello</p>
            <a className={styles.emailLink} href="mailto:hey@miizumelon.com">
              hey@miizumelon.com
            </a>
          </div>
        </div>

        <div className={styles.formPanel}>
          <ContactForm region={region} />
        </div>
      </section>

      <footer className={styles.footer} id="footer">
        <div className={styles.nuviaPanel}>
          <span className={styles.representedBy}>represented by</span>
          <div
            aria-label="NVA, represented by Nuvia"
            className={styles.nuviaWordmark}
            ref={nuviaWordmarkRef}
            tabIndex={0}
          >
            <span
              aria-hidden="true"
              className={`${styles.nuviaWord} ${styles.nuviaWordDark}`}
            >
              NVA
            </span>
            <span
              aria-hidden="true"
              className={`${styles.nuviaWord} ${styles.nuviaWordLight}`}
            >
              NVA
            </span>
            <span aria-hidden="true" className={styles.nuviaTooltip}>
              Nuvia is literally my Brand
            </span>
          </div>
        </div>
        <nav className={styles.footerLinks} aria-label="Legal and about links">
          <Link href="/imprint">Imprint</Link>
          <Link href="/imprint">Privacy</Link>
          <Link href="#hero">who is miizu?</Link>
        </nav>
      </footer>
    </main>
  );
}
