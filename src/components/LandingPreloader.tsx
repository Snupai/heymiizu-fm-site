"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function LandingPreloader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isActive, setIsActive] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const finishPreloader = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const html = document.documentElement;
    const body = document.body;
    const lockedScrollX = window.scrollX;
    const lockedScrollY = window.scrollY;
    const scrollKeys = new Set([
      " ",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "End",
      "Home",
      "PageDown",
      "PageUp",
      "Spacebar",
    ]);
    const previousStyles = {
      bodyOverflow: body.style.overflow,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyTouchAction: body.style.touchAction,
      htmlOverflow: html.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      htmlTouchAction: html.style.touchAction,
    };
    const preventScroll = (event: Event) => event.preventDefault();
    const preventScrollKeys = (event: KeyboardEvent) => {
      if (scrollKeys.has(event.key)) event.preventDefault();
    };
    const keepScrollPosition = () => {
      window.scrollTo(lockedScrollX, lockedScrollY);
    };

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    html.style.touchAction = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.touchAction = "none";
    window.addEventListener("keydown", preventScrollKeys);
    window.addEventListener("scroll", keepScrollPosition);
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("keydown", preventScrollKeys);
      window.removeEventListener("scroll", keepScrollPosition);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("wheel", preventScroll);
      html.style.overflow = previousStyles.htmlOverflow;
      html.style.overscrollBehavior = previousStyles.htmlOverscrollBehavior;
      html.style.touchAction = previousStyles.htmlTouchAction;
      body.style.overflow = previousStyles.bodyOverflow;
      body.style.overscrollBehavior = previousStyles.bodyOverscrollBehavior;
      body.style.touchAction = previousStyles.bodyTouchAction;
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    void videoRef.current?.play().catch(() => undefined);
  }, [isActive]);

  return (
    <>
      <div
        aria-hidden={isActive || undefined}
        className="contents"
        inert={isActive}
      >
        {children}
      </div>

      {isActive && (
        <div
          aria-label="Intro video"
          aria-modal="true"
          className="fixed inset-0 z-[2147483647] flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-[#fbfbfe]"
          role="dialog"
        >
          <video
            ref={videoRef}
            aria-hidden="true"
            autoPlay
            className="h-full w-full object-cover"
            disablePictureInPicture
            muted
            onEnded={finishPreloader}
            onError={finishPreloader}
            playsInline
            preload="auto"
          >
            <source src="/preload_v2.mp4" type="video/mp4" />
          </video>
        </div>
      )}
    </>
  );
}
