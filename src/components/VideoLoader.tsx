"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function VideoLoader({
  visible,
  finishRequested,
  onFinished,
}: {
  visible: boolean;
  finishRequested: boolean;
  onFinished: () => void;
}) {
  const pathname = usePathname();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishedRef = useRef(false);

  // Only show video loader on projects page
  const isProjectsPage = pathname === "/projects";

  // Reset flags whenever overlay becomes hidden or we leave projects page
  useEffect(() => {
    if (!visible || !isProjectsPage) {
      setIsFadingOut(false);
      finishedRef.current = false;
    }
  }, [visible, isProjectsPage]);

  // Handle video playback (only on projects page)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visible || !isProjectsPage) return;

    video.loop = true;
    void video.play().catch(() => {});
  }, [visible, isProjectsPage]);

  // Handle finish request - fade out during video playback (only on projects page)
  useEffect(() => {
    if (!visible || !finishRequested || !isProjectsPage) return;
    if (finishedRef.current) return;

    // Start fading out immediately when finish is requested
    setIsFadingOut(true);
    finishedRef.current = true;

    // After fade-out transition completes, call onFinished
    const fadeDuration = 1200; // Smoother, longer fade-out
    const timer = setTimeout(() => {
      onFinished();
    }, fadeDuration);

    return () => clearTimeout(timer);
  }, [visible, finishRequested, onFinished, isProjectsPage]);

  // Don't render on non-projects pages
  if (!visible || !isProjectsPage) return null;

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-white transition-opacity"
      style={{ 
        // No fade-in: show immediately at opacity 1. Only fade out when finishing.
        opacity: isFadingOut ? 0 : 1,
        transitionDuration: '1200ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-contain"
      >
        <source src="/Heartloading_Looping.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
