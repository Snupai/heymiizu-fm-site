"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const EVENTS = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export default function AutoLogout() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    if (user) {
      await signOut();
      router.push("/login");
    }
  }, [user, signOut, router]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (user) {
      timerRef.current = setTimeout(() => {
        void handleLogout();
      }, TIMEOUT_MS);
    }
  }, [user, handleLogout]);

  useEffect(() => {
    if (!user) return;

    // Set initial timer
    resetTimer();

    // Add event listeners
    EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      EVENTS.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, resetTimer]);

  return null;
}
