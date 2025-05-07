import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that observes an element and detects when it enters or leaves the viewport
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Percentage of element visible to trigger (0-1)
 * @param {string} options.rootMargin - Margin around the root element
 * @param {Element} options.root - The element that is used as the viewport
 * @return {[React.RefObject, boolean]} - Ref to attach to element and boolean indicating if in view
 */
function useIntersectionObserverSingle({
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

/**
 * Custom hook that observes multiple elements and tracks their intersection state
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Percentage of element visible to trigger (0-1)
 * @param {string} options.rootMargin - Margin around the root element
 * @param {Element} options.root - The element that is used as the viewport
 * @return {Object} - Object with observedElements state and setObservedElements function
 */
export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  root = null
} = {}) {
  // Use uma ref para armazenar o estado para evitar referências circulares no useEffect
  const elementsStateRef = useRef({});
  const [observedElements, setObservedElements] = useState({});
  const [elementsToObserve, setElementsToObserve] = useState([]);
  const observerRef = useRef(null);

  // Função de callback para atualizar o estado dos elementos observados
  const updateElementState = useCallback((id, isIntersecting) => {
    // Atualiza a referência
    elementsStateRef.current = {
      ...elementsStateRef.current,
      [id]: isIntersecting
    };
    
    // Atualiza o estado React
    setObservedElements(elementsStateRef.current);
  }, []);

  // Setup observer
  useEffect(() => {
    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Processar cada entrada separadamente
        entries.forEach(entry => {
          const id = entry.target.id || entry.target.getAttribute('data-section-id');
          if (id) {
            updateElementState(id, entry.isIntersecting);
          }
        });
      },
      { 
        threshold, 
        rootMargin, 
        root 
      }
    );

    // Observe all current elements
    elementsToObserve.forEach(item => {
      if (item.ref.current) {
        // Certifique-se de que o elemento tenha um ID
        if (item.id) {
          // Defina o data-section-id se ainda não estiver definido
          if (!item.ref.current.getAttribute('data-section-id')) {
            item.ref.current.setAttribute('data-section-id', item.id);
          }
          
          // Observe o elemento
          observerRef.current.observe(item.ref.current);
        }
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [elementsToObserve, rootMargin, threshold, root, updateElementState]);

  // Function to register elements for observation
  const setObservedElementsCallback = useCallback((elements) => {
    // Atualiza a lista de elementos a serem observados
    setElementsToObserve(elements);
    
    // Inicializa o estado com todos os elementos definidos como não visíveis
    const initialState = { ...elementsStateRef.current };
    elements.forEach(item => {
      if (item.id) {
        // Mantenha o estado anterior se existir, caso contrário, defina como false
        initialState[item.id] = initialState[item.id] || false;
      }
    });
    
    // Atualiza a ref e o estado
    elementsStateRef.current = initialState;
    setObservedElements(initialState);
  }, []);

  return {
    observedElements,
    setObservedElements: setObservedElementsCallback
  };
}

// Export both hooks
export default useIntersectionObserverSingle;