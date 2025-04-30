import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que volta o scroll para o topo quando há mudança de rota
 * Utiliza o hook useLocation para detectar mudanças na navegação
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Verifica se há preferência por movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Comportamento de scroll: smooth se não houver preferência por movimento reduzido, auto se houver
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
    
    // Rola para o topo com comportamento apropriado
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: scrollBehavior
    });
  }, [pathname]);

  // Este componente não renderiza nada visualmente
  return null;
};

export default ScrollToTop;