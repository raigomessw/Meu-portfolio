import React, { useEffect, useRef } from 'react';
import premiumPerformance from '../utils/premiumPerformance';

/**
 * Componente que gerencia efeitos premium do site
 * Aplica automaticamente otimizações e efeitos visuais
 */
const PremiumEffects = () => {
  // Referências para cleanup
  const cleanupFunctions = useRef([]);

  useEffect(() => {
    // Detecta capacidades do dispositivo para ajustar efeitos
    const deviceInfo = premiumPerformance.detectDevicePerformance();
    const documentRoot = document.documentElement;

    // Aplica classe para dispositivos touch
    if (deviceInfo.isTouchDevice) {
      documentRoot.classList.add('touch-device');
    }

    // Aplica classe para dispositivos de baixo desempenho
    if (deviceInfo.isLowEndDevice) {
      documentRoot.classList.add('low-end-device');
    }

    // Configura detectores de mouse e paralaxe apenas para dispositivos não-touch
    if (!deviceInfo.isTouchDevice && !deviceInfo.prefersReducedMotion) {
      // Tracking de mouse para o documento inteiro (efeitos globais)
      const documentMouseTracking = premiumPerformance.setupMouseTracking(document.body, {
        throttleLimit: 50,
      });
      if (documentMouseTracking) {
        cleanupFunctions.current.push(documentMouseTracking);
      }

      // Efeito de paralaxe para elementos específicos
      const parallaxElements = document.querySelectorAll('.premium-parallax');
      if (parallaxElements.length > 0) {
        const parallaxEffect = premiumPerformance.setupParallaxEffect(parallaxElements, {
          maxOffset: 80,
          smoothingFactor: 0.12,
        });
        if (parallaxEffect) {
          cleanupFunctions.current.push(parallaxEffect);
        }
      }

      // Efeitos 3D para cards de projeto
      const projectCards = document.querySelectorAll('.card');
      projectCards.forEach(card => {
        const cardEffect = premiumPerformance.setupMouseTracking(card, {
          throttleLimit: 25,
          perspective: true,
          effectIntensity: 0.6,
        });
        if (cardEffect) {
          cleanupFunctions.current.push(cardEffect);
        }
      });
    }

    // Configura carregamento lazy premium para imagens e elementos
    const premiumLazyLoader = premiumPerformance.setupPremiumLazyLoading();
    
    // Otimizações para vídeos em background (se existirem)
    const bgVideos = document.querySelectorAll('.background-video');
    bgVideos.forEach(videoElement => {
      const videoOptimizer = premiumPerformance.setupOptimizedBackgroundVideo(videoElement, {
        mobileFallbackImage: videoElement.dataset.fallbackImage,
      });
      if (videoOptimizer) {
        cleanupFunctions.current.push(videoOptimizer);
      }
    });

    // Otimização para imagens de fundo
    premiumPerformance.setupOptimizedBgImages();

    // Cleanup quando componente for desmontado
    return () => {
      cleanupFunctions.current.forEach(cleanup => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
      
      // Limpar outros recursos se necessário
      if (premiumLazyLoader && premiumLazyLoader.disconnect) {
        premiumLazyLoader.disconnect();
      }
    };
  }, []);

  // Esse componente não renderiza nada visualmente
  return null;
};

export default PremiumEffects;