import { useState, useEffect, useRef } from 'react';

// Hook para detectar quando um elemento está visível no viewport
function useInView(ref, options = {}) {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const callback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
          
          // Se for configurado para não observar mais depois de ficar visível
          if (options.once !== false) {
            observer.unobserve(entry.target);
          }
        } else if (options.once === false) {
          setIsInView(false);
        }
      });
    };
    
    // Criar um novo IntersectionObserver
    observerRef.current = new IntersectionObserver(callback, {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0
    });
    
    // Começar a observar o elemento
    observerRef.current.observe(ref.current);
    
    // Limpar ao desmontar
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref, options.root, options.rootMargin, options.threshold, options.once]);
  
  return isInView;
}

export default useInView;