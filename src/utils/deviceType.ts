// Utility to differentiate between mobile phones, small screens, and desktop
export function getDeviceType(): "mobile" | "small" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua);
  const width = window.innerWidth;

  if (isMobile) return "mobile";
  if (width < 1435) return "small";
  return "desktop";
}
