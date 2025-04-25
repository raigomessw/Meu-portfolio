import { useState, useEffect } from 'react';

/**
 * Hook para detectar se o usuário prefere animações reduzidas
 * @returns {boolean} True se o usuário preferir animações reduzidas
 */
export function useReducedMotion() {
  // Valor inicial: verificar se o navegador suporta a consulta de mídia e se está ativa
  const [reducedMotion, setReducedMotion] = useState(() => {
    // Se estiver no servidor ou o navegador não suportar, assumir false
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    // Se o navegador não suportar matchMedia, não fazer nada
    if (!window.matchMedia) return;

    // Criar o matcher de consulta de mídia
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Função para atualizar o estado
    const handleChange = () => {
      setReducedMotion(mediaQuery.matches);
    };

    // Adicionar o listener (com compatibilidade para browsers mais antigos)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    // Remover o listener na limpeza
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return reducedMotion;
}