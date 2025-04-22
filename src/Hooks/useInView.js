import { useState, useEffect } from 'react';

/**
 * A custom hook that determines if an element is in the viewport
 * @param {React.RefObject} ref - The reference to the element to observe
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - How much of the element needs to be visible (0-1)
 * @param {string} options.rootMargin - Margin around the root
 * @returns {boolean} - Whether the element is in view or not
 */
const useInView = (ref, { threshold = 0.1, rootMargin = '0px' } = {}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin]);

  return isInView;
};

export default useInView;