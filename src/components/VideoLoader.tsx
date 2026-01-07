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
  const [fadeDurationMs, setFadeDurationMs] = useState(690); // Default, will be calculated dynamically
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishedRef = useRef(false);

  // Only show video loader on projects page
  const isProjectsPage = pathname === "/projects";

  // Reset flags whenever overlay becomes hidden or we leave projects page
  useEffect(() => {
    if (!visible || !isProjectsPage) {
      setIsFadingOut(false);
      setFadeDurationMs(690); // Reset to default
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
  // Calculate fade duration dynamically so it ends exactly when video loop completes
  useEffect(() => {
    if (!visible || !finishRequested || !isProjectsPage) return;
    if (finishedRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    // Wait for video duration to be available
    const waitForDuration = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration) && video.duration > 0) {
        return true;
      }
      return false;
    };

    // Check if video has already played enough and start fade
    const checkAndStartFade = () => {
      if (finishedRef.current) return null;
      if (!waitForDuration()) return null;
      
      const minPlayTime = 1.6; // Minimum play time before fade-out can start
      
      // Only start fade if we've played at least the minimum time
      if (video.currentTime < minPlayTime) {
        return null;
      }
      
      // Calculate remaining time until video loop ends
      const remainingTime = video.duration - video.currentTime;
      
      // Only start if there's meaningful time remaining (at least 100ms)
      if (remainingTime > 0.2 && remainingTime <= video.duration) {
        // Calculate fade duration in milliseconds
        const calculatedFadeDurationMs = Math.max(100, remainingTime * 1000); // Minimum 100ms
        
        // Set the fade duration for CSS transition
        setFadeDurationMs(calculatedFadeDurationMs);
        
        // Start fading out
        setIsFadingOut(true);
        finishedRef.current = true;

        // After fade-out transition completes, call onFinished
        const timer = setTimeout(() => {
          onFinished();
        }, calculatedFadeDurationMs);
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
        transitionDuration: `${fadeDurationMs}ms`,
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
