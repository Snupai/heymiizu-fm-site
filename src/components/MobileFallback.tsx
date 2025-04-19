import React, { useEffect } from 'react';

const isMobile = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;

  // iPad Pro/Air detection (user agent always includes 'iPad')
  const isIPad = ua.includes('iPad');

  // Surface Pro detection: Windows + Touch + small width
  const isSurfacePro = ua.includes('Windows') && 'ontouchstart' in window && window.innerWidth <= 1366;

  // General mobile/tablet detection
  const isMobileOrTablet = /Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua);

  // Large tablets (iPad Pro, Surface Pro, etc.) or any device with width <= 1366
  const isLargeTablet = isIPad || isSurfacePro || window.innerWidth <= 1366;

  return isMobileOrTablet || isLargeTablet;
};

const MobileFallback: React.FC = () => {
  useEffect(() => {
    if (isMobile()) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, []);

  // Responsive styles: only apply flex/overflow hacks on mobile
  const mobileStyles: React.CSSProperties = isMobile()
    ? {
        flex: '1 0 auto',
        minHeight: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f8f8',
        textAlign: 'center',
        boxSizing: 'border-box',
        overflow: 'auto',
        padding: 0,
        margin: 0,
      }
    : {
        width: '100%',
        background: '#f8f8f8',
        textAlign: 'center',
        boxSizing: 'border-box',
        padding: 0,
        margin: 0,
      };

  return (
    <div style={mobileStyles}>
      <main style={{ width: '100%', padding: 0, margin: 0 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: 0 }}>Mobile Experience Coming Soon</h1>
        <p style={{ fontSize: '1rem', color: '#666', margin: 0 }}>
          Our mobile site is under construction.<br />
          Please visit us from a desktop device for the full experience.
        </p>
      </main>
    </div>
  );
};

export default MobileFallback;
