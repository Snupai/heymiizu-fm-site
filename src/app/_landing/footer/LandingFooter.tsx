"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PointerEvent } from "react";

import styles from "../../miizu-landing.module.css";
import { COMPACT_LAYOUT_QUERY } from "../scene/scroll-timeline";
import { anchorRepresentedBy, measureNvaInk } from "./nva-measurement";

const NUVIA_TOOLTIP_HOVER_DELAY_MS = 2_000;
const NUVIA_POST_TOUCH_SUPPRESSION_MS = 900;

function supportsFineHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function LandingFooter() {
  const nuviaWordmarkRef = useRef<HTMLDivElement>(null);
  const representedByRef = useRef<HTMLSpanElement>(null);
  const nuviaTooltipReady = useRef(false);
  const nuviaTooltipHoverTimer = useRef<number | null>(null);
  const lastNuviaTouchAt = useRef(-Infinity);
  const nuviaTooltipX = useMotionValue(0);
  const nuviaTooltipY = useMotionValue(0);
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

    const fitWordmark = () => {
      const words = [
        ...wordmark.querySelectorAll<HTMLElement>(`.${styles.nuviaWord}`),
      ];
      const word =
        words.find((el) => window.getComputedStyle(el).display !== "none") ??
        words[0];

      if (!word) return;

      if (compactQuery.matches) {
        footer?.style.removeProperty("--nva-size");
      } else if (footer && footer.clientWidth > 0) {
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

      const label = representedByRef.current;
      if (label) anchorRepresentedBy(word, label);
    };

    const resizeObserver = new ResizeObserver(fitWordmark);
    if (footer) resizeObserver.observe(footer);
    compactQuery.addEventListener("change", fitWordmark);
    window.addEventListener("resize", fitWordmark);
    void document.fonts.ready.then(fitWordmark);
    fitWordmark();
    let layoutFrame = window.requestAnimationFrame(() => {
      layoutFrame = window.requestAnimationFrame(fitWordmark);
    });

    return () => {
      window.cancelAnimationFrame(layoutFrame);
      resizeObserver.disconnect();
      compactQuery.removeEventListener("change", fitWordmark);
      window.removeEventListener("resize", fitWordmark);
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
      event.pointerType !== "touch" &&
      supportsFineHover() &&
      window.performance.now() - lastNuviaTouchAt.current >=
        NUVIA_POST_TOUCH_SUPPRESSION_MS
    )
      placeNuviaTooltip(event);
  };

  const leaveNuviaTooltip = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType !== "touch" &&
      supportsFineHover() &&
      window.performance.now() - lastNuviaTouchAt.current >=
        NUVIA_POST_TOUCH_SUPPRESSION_MS
    )
      hideNuviaTooltip();
  };

  const toggleNuviaTouchTooltip = (event: PointerEvent<HTMLElement>) => {
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

    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      window.removeEventListener("scroll", dismissTouchTooltip);
    };
  }, [nuviaTooltipTouch, nuviaTooltipVisible]);

  return (
    <>
      <footer className={styles.footer} id="footer">
        <div
          className={styles.nuviaPanel}
          onPointerDown={toggleNuviaTouchTooltip}
          onPointerEnter={showNuviaTooltip}
          onPointerLeave={leaveNuviaTooltip}
          onPointerMove={moveNuviaTooltip}
        >
          <span className={styles.representedBy} ref={representedByRef}>
            represented by
          </span>
          <div
            aria-label="NVA, represented by Nuvia"
            className={styles.nuviaWordmark}
            onBlur={hideNuviaTooltip}
            onFocus={() => {
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
            tabIndex={0}
          >
            <span
              aria-hidden="true"
              className={`${styles.nuviaWord} ${styles.nuviaWordDark}`}
            >
              {"NVA"}
            </span>
            <span
              aria-hidden="true"
              className={`${styles.nuviaWord} ${styles.nuviaWordLight}`}
            >
              {"NVA"}
            </span>
          </div>
        </div>
        <nav className={styles.footerLinks} aria-label="Legal and about links">
          <Link href="/imprint">Imprint</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="#hero">who is miizu?</Link>
        </nav>
      </footer>
      {nuviaTooltipMounted
        ? createPortal(
            <motion.span
              aria-hidden="true"
              className={`${styles.nuviaTooltip}${nuviaTooltipVisible ? ` ${styles.nuviaTooltipVisible}` : ""}${nuviaTooltipTouch ? ` ${styles.nuviaTooltipTouch}` : ""}`}
              style={{
                x: nuviaTooltipTouch ? nuviaTooltipX : nuviaTooltipFollowX,
                y: nuviaTooltipTouch ? nuviaTooltipY : nuviaTooltipFollowY,
              }}
              transformTemplate={({ x, y }) =>
                nuviaTooltipTouch
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
