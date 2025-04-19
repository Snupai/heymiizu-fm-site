// Utility to robustly detect mobile and tablet devices, including iPad Pro/Air and Surface Pro 7
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIPad = ua.includes('iPad');
  const isSurfacePro = ua.includes('Windows') && 'ontouchstart' in window && window.innerWidth <= 1366;
  const isMobileOrTablet = /Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua);
  const isLargeTablet = isIPad || isSurfacePro || window.innerWidth <= 1366;
  return isMobileOrTablet || isLargeTablet;
}
