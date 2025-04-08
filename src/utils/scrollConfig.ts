import { scroller } from 'react-scroll';

/**
 * Centralized configuration for react-scroll settings
 * This file contains all the default settings used throughout the application
 */

export const scrollConfig = {
  // Enable smooth scrolling
  smooth: true,
  
  // Enable scroll spy functionality
  spy: true,
  
  // Offset from the top when scrolling to elements (in pixels)
  offset: -64, // Adjust this value based on your navbar height
  
  // Duration of the smooth scroll animation (in milliseconds)
  duration: 500,
  
  // Delay before scroll spy updates (in milliseconds)
  delay: 0,
  
  // Whether to hash the URL when scrolling to elements
  hashSpy: false,
  
  // Whether to update the URL hash when scrolling to elements
  updateHash: true,
  
  // Whether to scroll to the top of the page when clicking on a link
  scrollToTop: true,
  
  // Whether to prevent default behavior of links
  preventDefault: true,
  
  // Whether to use smooth scrolling for the entire page
  smoothBehavior: true,
};

/**
 * Scroll to a specific element
 * @param elementName - The name of the element to scroll to
 * @param options - Optional scroll options
 */
export const scrollToElement = (
  elementName: string,
  options: Partial<typeof scrollConfig> = {}
) => {
  scroller.scrollTo(elementName, {
    ...scrollConfig,
    ...options,
  });
};

/**
 * Scroll to the top of the page
 * @param options - Optional scroll options
 */
export const scrollToTop = (options: Partial<typeof scrollConfig> = {}) => {
  scroller.scrollTo('top', {
    ...scrollConfig,
    ...options,
  });
};

/**
 * Scroll to the bottom of the page
 * @param options - Optional scroll options
 */
export const scrollToBottom = (options: Partial<typeof scrollConfig> = {}) => {
  scroller.scrollTo('bottom', {
    ...scrollConfig,
    ...options,
  });
}; 