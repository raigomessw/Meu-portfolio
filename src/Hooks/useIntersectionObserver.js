import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that observes an element and detects when it enters or leaves the viewport
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Percentage of element visible to trigger (0-1)
 * @param {string} options.rootMargin - Margin around the root element
 * @param {Element} options.root - The element that is used as the viewport
 * @return {[React.RefObject, boolean]} - Ref to attach to element and boolean indicating if in view
 */
function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  root = null
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, rootMargin, root }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [threshold, rootMargin, root]);

  return [elementRef, isIntersecting];
}

export default useIntersectionObserver;