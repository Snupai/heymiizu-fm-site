"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PointerEvent } from "react";

import styles from "../../miizu-landing.module.css";
import { COMPACT_LAYOUT_QUERY } from "../scene/scroll-timeline";
import { useIntroLayout } from "../scene/useIntroLayout";
import {
  fitMobileNvaInk,
  measureNvaInk,
  mobileNvaViewportWidth,
  representedByWordmarkPin,
} from "./nva-measurement";

const NUVIA_TOOLTIP_HOVER_DELAY_MS = 2_000;
const NUVIA_POST_TOUCH_SUPPRESSION_MS = 900;

function supportsFineHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function LandingFooter() {
  const layout = useIntroLayout();
  const reduceMotion = useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const nuviaWordmarkRef = useRef<HTMLDivElement>(null);
  const representedByRef = useRef<HTMLSpanElement>(null);
  const nuviaTooltipReady = useRef(false);
  const nuviaTooltipHoverTimer = useRef<number | null>(null);
  const lastNuviaTouchAt = useRef(-Infinity);
  const nuviaTooltipX = useMotionValue(0);
  const nuviaTooltipY = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    offset: ["start end", "start 0.62"],
    target: footerRef,
  });
  const compact = layout === "compact";
  const compactMotion = compact && reduceMotion !== true;
  const linksOpacity = useTransform(
    scrollYProgress,
    [0.12, 1],
    compactMotion ? [0, 1] : [1, 1],
  );
  const representedOpacity = useTransform(
    scrollYProgress,
    [0, 0.72],
    compactMotion ? [0, 1] : [1, 1],
  );
  const nuviaTooltipFollowX = useSpring(nuviaTooltipX, {
    stiffness: 420,
    damping: 32,
    mass: 0.35,
  });
  const nuviaTooltipFollowY = useSpring(nuviaTooltipY, {
    stiffness: 420,
    damping: 32,
    mass: 0.35,
  });
  const [nuviaTooltipVisible, setNuviaTooltipVisible] = useState(false);
  const [nuviaTooltipTouch, setNuviaTooltipTouch] = useState(false);
  const [nuviaTooltipMounted, setNuviaTooltipMounted] = useState(false);

  useEffect(() => {
    setNuviaTooltipMounted(true);

    return () => {
      if (nuviaTooltipHoverTimer.current !== null) {
        window.clearTimeout(nuviaTooltipHoverTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const wordmark = nuviaWordmarkRef.current;

    if (!wordmark) return;

    const footer = wordmark.closest("footer");
    const compactQuery = window.matchMedia(COMPACT_LAYOUT_QUERY);

    const pinRepresentedBy = () => {
      const label = representedByRef.current;
      const panel = wordmark.parentElement;
      if (!label || !panel) return;

      const pin = representedByWordmarkPin(
        wordmark.getBoundingClientRect(),
        panel.getBoundingClientRect(),
      );
      if (!pin) return;

      label.style.setProperty("--n-x", `${pin.xPct}%`);
      label.style.setProperty("--n-y", `${pin.yPct}%`);
    };

    const fitWordmark = () => {
      const words = [
        ...wordmark.querySelectorAll<HTMLElement>(`.${styles.nuviaWord}`),
      ];
      const word =
        words.find((el) => window.getComputedStyle(el).display !== "none") ??
        words[0];

      if (!word) return;

      if (compactQuery.matches) {
          const target = mobileNvaViewportWidth(
            window.innerWidth,
            window.visualViewport?.width,
          );
          if (!footer || target <= 0) return;

          const computed = window.getComputedStyle(word);
          const fontSize = Number.parseFloat(computed.fontSize);
          if (!Number.isFinite(fontSize) || fontSize <= 0) return;

          const ink = measureNvaInk(computed, fontSize);
          if (!ink) return;

          const fit = fitMobileNvaInk(ink, target);
          if (!fit) return;

          const nextSize = Math.round(fontSize * fit.scale);
          if (
            Number.isFinite(nextSize) &&
            nextSize > 0 &&
            Math.abs(nextSize - fontSize) > 1
          ) {
            footer.style.setProperty("--nva-size", `${nextSize}px`);
          }

          wordmark.style.width = `${fit.width}px`;
          wordmark.style.setProperty("--nva-shift", `${fit.shift}px`);
          wordmark.style.setProperty("--nva-scale", "1");
          pinRepresentedBy();
          return;
        }

        footer?.style.removeProperty("--nva-scale");

        if (footer && footer.clientWidth > 0) {
          const current = window.getComputedStyle(word);
          const currentSize = Number.parseFloat(current.fontSize);

          if (Number.isFinite(currentSize) && currentSize > 0) {
            const currentInk = measureNvaInk(current, currentSize);

            if (currentInk) {
              const linksReserve = Math.min(
                Math.max(footer.clientWidth * 0.2, 240),
                480,
              );
              const nextSize = Math.round(
                currentSize *
                  ((footer.clientWidth - linksReserve) / currentInk.inkWidth),
              );

              if (
                Number.isFinite(nextSize) &&
                nextSize > 0 &&
                Math.abs(nextSize - currentSize) > 1
              ) {
                footer.style.setProperty("--nva-size", `${nextSize}px`);
              }
            }
          }
        }

        const computed = window.getComputedStyle(word);
        const fontSize = Number.parseFloat(computed.fontSize);

        if (!Number.isFinite(fontSize) || fontSize <= 0) return;

        const ink = measureNvaInk(computed, fontSize);
        if (!ink) return;

        const bleed = 1;
        const shift = -ink.inkLeft - bleed;
        wordmark.style.width = `${Math.ceil(ink.inkWidth)}px`;
        wordmark.style.setProperty("--nva-shift", `${shift}px`);
        wordmark.style.setProperty("--nva-scale", "1");
        pinRepresentedBy();
    };

    let fitFrame = 0;
    const scheduleFit = () => {
      if (fitFrame !== 0) return;
      fitFrame = window.requestAnimationFrame(() => {
        fitFrame = 0;
        fitWordmark();
      });
    };

    const resizeObserver = new ResizeObserver(scheduleFit);
    if (footer) resizeObserver.observe(footer);
    resizeObserver.observe(wordmark);
    const panel = wordmark.parentElement;
    if (panel) resizeObserver.observe(panel);
    compactQuery.addEventListener("change", scheduleFit);
    window.addEventListener("resize", scheduleFit);
    window.visualViewport?.addEventListener("resize", scheduleFit);
    void document.fonts.ready.then(fitWordmark);
    fitWordmark();
    let layoutFrame = window.requestAnimationFrame(() => {
      layoutFrame = window.requestAnimationFrame(fitWordmark);
    });

    return () => {
      window.cancelAnimationFrame(fitFrame);
      window.cancelAnimationFrame(layoutFrame);
      resizeObserver.disconnect();
      compactQuery.removeEventListener("change", scheduleFit);
      window.removeEventListener("resize", scheduleFit);
      window.visualViewport?.removeEventListener("resize", scheduleFit);
    };
  }, []);

  const placeNuviaTooltip = (
    event: PointerEvent<HTMLElement>,
    instant = false,
  ) => {
    const x = event.clientX;
    const y = event.clientY;

    if (instant || !nuviaTooltipReady.current) {
      nuviaTooltipX.jump(x);
      nuviaTooltipY.jump(y);
      nuviaTooltipReady.current = true;
      return;
    }

    nuviaTooltipX.set(x);
    nuviaTooltipY.set(y);
  };

  const showNuviaTooltip = (event: PointerEvent<HTMLElement>) => {
    if (
      compact ||
      event.pointerType === "touch" ||
      !supportsFineHover() ||
      window.performance.now() - lastNuviaTouchAt.current <
        NUVIA_POST_TOUCH_SUPPRESSION_MS
    )
      return;

    if (nuviaTooltipHoverTimer.current !== null) {
      window.clearTimeout(nuviaTooltipHoverTimer.current);
    }

    setNuviaTooltipTouch(false);
    placeNuviaTooltip(event, true);
    nuviaTooltipHoverTimer.current = window.setTimeout(() => {
      nuviaTooltipHoverTimer.current = null;
      setNuviaTooltipVisible(true);
    }, NUVIA_TOOLTIP_HOVER_DELAY_MS);
  };

  const hideNuviaTooltip = () => {
    if (nuviaTooltipHoverTimer.current !== null) {
      window.clearTimeout(nuviaTooltipHoverTimer.current);
      nuviaTooltipHoverTimer.current = null;
    }

    nuviaTooltipReady.current = false;
    setNuviaTooltipTouch(false);
    setNuviaTooltipVisible(false);
  };

  const moveNuviaTooltip = (event: PointerEvent<HTMLElement>) => {
    if (
      !compact &&
      event.pointerType !== "touch" &&
      supportsFineHover() &&
      window.performance.now() - lastNuviaTouchAt.current >=
        NUVIA_POST_TOUCH_SUPPRESSION_MS
    )
      placeNuviaTooltip(event);
  };

  const leaveNuviaTooltip = (event: PointerEvent<HTMLElement>) => {
    if (
      !compact &&
      event.pointerType !== "touch" &&
      supportsFineHover() &&
      window.performance.now() - lastNuviaTouchAt.current >=
        NUVIA_POST_TOUCH_SUPPRESSION_MS
    )
      hideNuviaTooltip();
  };

  const showCompactNuviaTooltip = (panel: HTMLElement) => {
    const rect = panel.getBoundingClientRect();

    lastNuviaTouchAt.current = window.performance.now();
    nuviaTooltipX.jump(rect.left + rect.width / 2);
    nuviaTooltipY.jump(rect.top + rect.height / 2);
    nuviaTooltipReady.current = true;
    setNuviaTooltipTouch(true);
    setNuviaTooltipVisible(true);
  };

  const toggleCompactNuviaTooltip = () => {
    const panel = nuviaWordmarkRef.current?.parentElement;
    if (!panel) return;

    if (nuviaTooltipTouch && nuviaTooltipVisible) {
      hideNuviaTooltip();
      return;
    }

    showCompactNuviaTooltip(panel);
  };

  const toggleNuviaTouchTooltip = (event: PointerEvent<HTMLElement>) => {
    if (compact) {
      event.preventDefault();
      toggleCompactNuviaTooltip();
      return;
    }

    if (event.pointerType !== "touch") return;

    if (nuviaTooltipHoverTimer.current !== null) {
      window.clearTimeout(nuviaTooltipHoverTimer.current);
      nuviaTooltipHoverTimer.current = null;
    }

    lastNuviaTouchAt.current = window.performance.now();
    event.preventDefault();

    if (nuviaTooltipTouch && nuviaTooltipVisible) {
      hideNuviaTooltip();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const centerY = Math.min(
      window.innerHeight - 48,
      Math.max(48, rect.top + rect.height / 2),
    );

    nuviaTooltipX.jump(window.innerWidth / 2);
    nuviaTooltipY.jump(centerY);
    nuviaTooltipReady.current = true;
    setNuviaTooltipTouch(true);
    setNuviaTooltipVisible(true);
  };

  useEffect(() => {
    if (!nuviaTooltipTouch || !nuviaTooltipVisible) return;

    const dismissTouchTooltip = () => {
      nuviaTooltipReady.current = false;
      setNuviaTooltipTouch(false);
      setNuviaTooltipVisible(false);
    };
    const dismissOutside = (event: globalThis.PointerEvent) => {
      const panel = nuviaWordmarkRef.current?.parentElement;
      if (panel?.contains(event.target as Node)) return;
      dismissTouchTooltip();
    };

    document.addEventListener("pointerdown", dismissOutside);
    window.addEventListener("scroll", dismissTouchTooltip, { passive: true });
    const autoHide = window.setTimeout(dismissTouchTooltip, 3_200);

    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      window.removeEventListener("scroll", dismissTouchTooltip);
      window.clearTimeout(autoHide);
    };
  }, [nuviaTooltipTouch, nuviaTooltipVisible]);

  return (
    <>
      <footer className={styles.footer} id="footer" ref={footerRef}>
        <div
          aria-expanded={compact ? nuviaTooltipVisible && nuviaTooltipTouch : undefined}
          aria-label={compact ? "NVA, represented by Nuvia" : undefined}
          className={styles.nuviaPanel}
          data-nuvia-open={
            compact && nuviaTooltipVisible && nuviaTooltipTouch ? "" : undefined
          }
          onKeyDown={
            compact
              ? (event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  toggleCompactNuviaTooltip();
                }
              : undefined
          }
          onPointerDown={toggleNuviaTouchTooltip}
          onPointerEnter={compact ? undefined : showNuviaTooltip}
          onPointerLeave={compact ? undefined : leaveNuviaTooltip}
          onPointerMove={compact ? undefined : moveNuviaTooltip}
          role={compact ? "button" : undefined}
          tabIndex={compact ? 0 : undefined}
        >
          <div
            aria-label="NVA, represented by Nuvia"
            className={styles.nuviaWordmark}
            onBlur={compact ? undefined : hideNuviaTooltip}
            onFocus={() => {
              if (compact) return;

              if (
                window.performance.now() - lastNuviaTouchAt.current <
                NUVIA_POST_TOUCH_SUPPRESSION_MS
              )
                return;

              if (nuviaTooltipHoverTimer.current !== null) {
                window.clearTimeout(nuviaTooltipHoverTimer.current);
                nuviaTooltipHoverTimer.current = null;
              }

              setNuviaTooltipTouch(false);
              const panel = nuviaWordmarkRef.current?.parentElement;
              if (panel) {
                const rect = panel.getBoundingClientRect();
                nuviaTooltipX.jump(rect.left + rect.width * 0.2);
                nuviaTooltipY.jump(rect.top + rect.height * 0.42);
                nuviaTooltipReady.current = true;
              }
              setNuviaTooltipVisible(true);
            }}
            ref={nuviaWordmarkRef}
            tabIndex={compact ? -1 : 0}
          >
            <span
              aria-hidden="true"
              className={`${styles.nuviaWord} ${styles.nuviaWordDark}`}
            >
              {"NVA"}
            </span>
          </div>
          <motion.span
            className={styles.representedBy}
            ref={representedByRef}
            style={
              compactMotion
                ? { opacity: representedOpacity, position: "absolute", zIndex: 2 }
                : { position: "absolute", zIndex: 2 }
            }
          >
            represented by
          </motion.span>
        </div>
        <motion.nav
          className={styles.footerLinks}
          aria-label="Legal and about links"
          style={compactMotion ? { opacity: linksOpacity } : undefined}
        >
          <Link href="/imprint">Imprint</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="#hero">who is miizu?</Link>
        </motion.nav>
      </footer>
      {nuviaTooltipMounted
        ? createPortal(
            <motion.span
              aria-hidden="true"
              className={`${styles.nuviaTooltip}${nuviaTooltipVisible ? ` ${styles.nuviaTooltipVisible}` : ""}${nuviaTooltipTouch || compact ? ` ${styles.nuviaTooltipTouch}` : ""}`}
              style={{
                x: nuviaTooltipTouch || compact ? nuviaTooltipX : nuviaTooltipFollowX,
                y: nuviaTooltipTouch || compact ? nuviaTooltipY : nuviaTooltipFollowY,
              }}
              transformTemplate={({ x, y }) =>
                nuviaTooltipTouch || compact
                  ? `translate(${x}, ${y}) translate(-50%, -50%)`
                  : `translate(${x}, ${y}) translate(14px, -50%)`
              }
            >
              Nuvia is literally my Brand
            </motion.span>,
            document.body,
          )
        : null}
    </>
  );
}
