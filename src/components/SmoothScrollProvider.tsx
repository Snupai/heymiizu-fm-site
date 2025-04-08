"use client";

import React, { useEffect } from 'react';
import { Events, scrollSpy } from 'react-scroll';
import { scrollConfig } from '../utils/scrollConfig';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * A component that initializes smooth scrolling behavior using react-scroll
 * Add this to your layout or app component
 */
const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize scrollSpy with our configuration
    scrollSpy.update();

    // Register scroll events for debugging
    Events.scrollEvent.register('begin', () => {
      console.log('Scroll begin');
    });

    Events.scrollEvent.register('end', () => {
      console.log('Scroll end');
    });

    // Set document scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Cleanup function
    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScrollProvider; 