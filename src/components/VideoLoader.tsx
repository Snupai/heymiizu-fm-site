"use client";

import React, { useEffect, useRef, useState } from "react";

export default function VideoLoader({
  visible,
  finishRequested,
  onFinished,
}: {
  visible: boolean;
  finishRequested: boolean;
  onFinished: () => void;
}) {
  const [isFadedIn, setIsFadedIn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishedRef = useRef(false);

  // Fade in when visible
  useEffect(() => {
    if (!visible) {
      setIsFadedIn(false);
      finishedRef.current = false;
      return;
    }
    const timer = setTimeout(() => setIsFadedIn(true), 50);
    return () => clearTimeout(timer);
  }, [visible]);

  // Handle video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visible) return;

    video.loop = true;
    void video.play().catch(() => {});
  }, [visible]);

  // Handle finish request - wait for loop to complete
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visible || !finishRequested) return;
    if (finishedRef.current) return;

    // Use 'seeking' event which fires when the video loops (seeks back to 0)
    const onSeeking = () => {
      // Video is seeking back to start (looping)
      if (video.currentTime < 0.1) {
        finishedRef.current = true;
        onFinished();
      }
    };

    // Also use timeupdate as backup to detect when we're near the end
    let lastTime = video.currentTime;
    const onTimeUpdate = () => {
      if (finishedRef.current) return;
      const currentTime = video.currentTime;
      // Detect wrap-around (time went backwards significantly)
      if (currentTime < lastTime - 0.5) {
        finishedRef.current = true;
        onFinished();
      }
      lastTime = currentTime;
    };

    video.addEventListener("seeking", onSeeking);
    video.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [visible, finishRequested, onFinished]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-white transition-opacity duration-300"
      style={{ opacity: isFadedIn ? 1 : 0 }}
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
