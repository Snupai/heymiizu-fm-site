"use client";

import { init } from "@plausible-analytics/tracker";
import { useEffect } from "react";

const SITE_HOSTS = new Set([
  "miizumelon.com",
  "www.miizumelon.com",
  "miizumelon.de",
  "www.miizumelon.de",
]);

let initialized = false;

export default function PlausibleAnalytics() {
  useEffect(() => {
    if (
      initialized ||
      process.env.NODE_ENV !== "production" ||
      !SITE_HOSTS.has(window.location.hostname)
    ) {
      return;
    }

    init({
      domain: "miizumelon.com",
      endpoint: "https://visits.snupai.dev/api/event",
      autoCapturePageviews: true,
      bindToWindow: true,
    });
    initialized = true;
  }, []);

  return null;
}
