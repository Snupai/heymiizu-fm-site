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

    // Prevent video from starting if we're already fading out
    if (isFadingOut || finishedRef.current) {
      // Don't start a new video, but let the current one continue playing
      return;
    }

    video.loop = true;
    void video.play().catch(() => undefined);
  }, [visible, isProjectsPage, isFadingOut]);

  // Handle finish request - fade out during video playback (only on projects page)
  // Start fade-out so it ends exactly when video ends
  useEffect(() => {
    if (!visible || !finishRequested || !isProjectsPage) return;
    if (finishedRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    const fadeDuration = 690; // milliseconds (0.69 seconds)
    const fadeDurationSeconds = fadeDuration / 1000;

    // Wait for video duration to be available
    const waitForDuration = () => {
      if (
        video.duration &&
        !isNaN(video.duration) &&
        isFinite(video.duration) &&
        video.duration > 0
      ) {
        return true;
      }
      return false;
    };

    // Check if video has already played enough
    const checkAndStartFade = () => {
      if (finishedRef.current) return null;
      if (!waitForDuration()) return null;

      // Calculate when to start fade-out: video duration - fade duration
      // This ensures fade-out ends exactly when the loop cycle completes
      const fadeStartTime = video.duration - fadeDurationSeconds;
      const minPlayTime = 1.6; // Minimum play time before fade-out can start

      // Calculate the actual start time (either at minPlayTime or at fadeStartTime, whichever is later)
      const actualStartTime = Math.max(minPlayTime, fadeStartTime);

      // For looping video, we check if we're in the window before loop end
      // Use a small buffer (0.1s) to account for timing precision
      if (
        video.currentTime >= actualStartTime - 0.1 &&
        video.currentTime < video.duration
      ) {
        // Start fading out
        setIsFadingOut(true);
        finishedRef.current = true;

        // After fade-out transition completes, call onFinished
        const timer = setTimeout(() => {
          onFinished();
        }, fadeDuration);
        return timer;
      }
      return null;
    };

    // Wait for duration metadata if not available yet
    if (!waitForDuration()) {
      const onLoadedMetadata = () => {
        if (finishedRef.current) return;
        const timer = checkAndStartFade();
        if (timer) {
          video.removeEventListener("loadedmetadata", onLoadedMetadata);
          video.removeEventListener("timeupdate", onTimeUpdate);
          return () => clearTimeout(timer);
        }
      };

      const onTimeUpdate = () => {
        if (finishedRef.current) return;
        const timer = checkAndStartFade();
        if (timer) {
          video.removeEventListener("loadedmetadata", onLoadedMetadata);
          video.removeEventListener("timeupdate", onTimeUpdate);
        }
      };

      video.addEventListener("loadedmetadata", onLoadedMetadata);
      video.addEventListener("timeupdate", onTimeUpdate);

      return () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.removeEventListener("timeupdate", onTimeUpdate);
      };
    }

    // Check immediately if duration is available
    let timer = checkAndStartFade();
    if (timer) {
      return () => clearTimeout(timer!);
    }

    // If not ready yet, wait for timeupdate events
    const onTimeUpdate = () => {
      if (finishedRef.current) return;
      const newTimer = checkAndStartFade();
      if (newTimer) {
        video.removeEventListener("timeupdate", onTimeUpdate);
        timer = newTimer;
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      if (timer) clearTimeout(timer);
    };
  }, [visible, finishRequested, onFinished, isProjectsPage]);

  // Don't render on non-projects pages
  if (!visible || !isProjectsPage) return null;

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-white transition-opacity"
      style={{
        // No fade-in: show immediately at opacity 1. Only fade out when finishing.
        opacity: isFadingOut ? 0 : 1,
        transitionDuration: "250ms",
        transitionTimingFunction: "linear",
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
        className="h-full w-full object-contain"
      >
        <source src="/Heartloading_Looping.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
