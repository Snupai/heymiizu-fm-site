"use client";

import React, { useEffect, useState } from "react";

/**
 * ChromeGate hides its children when rendered on the 404 page.
 * Detection strategy:
 *  - Looks for an element with id "__404_marker__" added by not-found.tsx
 *  - Also checks for body class "hide-chrome" as a fallback
 */
export default function ChromeGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const check = () => {
      const hasMarker = !!document.getElementById("__404_marker__");
      const hasBodyClass = document.body.classList.contains("hide-chrome");
      setHide(hasMarker || hasBodyClass);
    };

    check();

    // Observe DOM changes in case the 404 marker mounts after hydration
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  if (hide) return null;
  return <>{children}</>;
}
