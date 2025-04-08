/**
 * Smooth scroll utility function
 * @param target - The target element or position to scroll to
 * @param duration - Duration of the scroll animation in milliseconds
 * @param easing - Optional easing function to use for the animation
 */
export const smoothScroll = (
  target: HTMLElement | number,
  duration: number = 1500,
  easing?: (t: number) => number
): void => {
  // If target is a number, treat it as a position
  const targetPosition = typeof target === 'number' 
    ? target 
    : target.getBoundingClientRect().top + window.pageYOffset;
  
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;
  
  // Default easing function if none provided
  const defaultEasing = (t: number): number => {
    // Enhanced easing function for even smoother acceleration and deceleration
    return t < 0.5
      ? 16 * t * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 5) / 2;
  };
  
  // Use provided easing function or default
  const easeFunction = easing || defaultEasing;
  
  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    window.scrollTo(0, startPosition + distance * easeFunction(progress));
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
};

/**
 * Initialize smooth scrolling for all anchor links
 */
export const initSmoothScroll = (): void => {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          smoothScroll(targetElement as HTMLElement);
        }
      });
    });
  });
}; 