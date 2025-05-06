/**
 * Utilitários de performance para otimizar animações e renderização
 */

// Limitar a frequência de execução de funções (para scroll, resize, etc.)
export const throttle = (func, limit = 100) => {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return func.apply(this, args);
    }
  };
};

// Atrasar a execução até que eventos parem de ser disparados
export const debounce = (func, delay = 100) => {
  let timeoutId;
  return function(...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
};

// Detectar capacidades do dispositivo para ajustar efeitos
export const detectDeviceCapability = () => {
  // Verificar se está no navegador
  const isBrowser = typeof window !== 'undefined';
  
  // Dispositivos de baixa performance
  let isLowEndDevice = false;
  let prefersReducedMotion = false;
  
  if (isBrowser) {
    // Detectar memória do dispositivo (quando disponível)
    isLowEndDevice = 
      (navigator.deviceMemory && navigator.deviceMemory < 4) || 
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
    
    // Verificar preferência por movimento reduzido
    prefersReducedMotion = 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
    // Verificar se é modo de economia de bateria (alguns navegadores)
    const batterySaving = navigator.getBattery ? 
      navigator.getBattery().then(battery => battery.charging === false && battery.level < 0.15) : 
      Promise.resolve(false);
  }
  
  return {
    isLowEndDevice,
    prefersReducedMotion,
    isMobile: isBrowser && /Mobi|Android/i.test(navigator.userAgent),
    shouldUseReducedEffects: isLowEndDevice || prefersReducedMotion,
    // Se não estiver no navegador, utilizar valores seguros por padrão
    reducedMotion: prefersReducedMotion
  };
};

// Configurar eventos passivos para melhorar performance de scroll
export const setupPassiveListeners = () => {
  const wheelOpt = { passive: true };
  const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
  
  // Adicionar listeners passivos para eventos comuns de touch/scroll
  document.addEventListener(wheelEvent, () => {}, wheelOpt);
  document.addEventListener('touchstart', () => {}, wheelOpt);
  document.addEventListener('touchmove', () => {}, wheelOpt);
  
  // Detectar scroll para pausar animações durante rolagem
  let scrollTimer;
  const handleScroll = () => {
    document.body.classList.add('is-scrolling');
    
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      document.body.classList.remove('is-scrolling');
    }, 100);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    document.removeEventListener(wheelEvent, () => {}, wheelOpt);
    document.removeEventListener('touchstart', () => {}, wheelOpt);
    document.removeEventListener('touchmove', () => {}, wheelOpt);
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(scrollTimer);
  };
};

// Aplicar otimizações de hardware para animações
export const applyHardwareAcceleration = (elements = []) => {
  if (!elements || !elements.length) return;
  
  elements.forEach(element => {
    if (element) {
      // Aplicar transform3d para forçar GPU
      element.style.transform = 'translateZ(0)';
      element.style.backfaceVisibility = 'hidden';
      
      // Aplicar will-change apenas durante animação
      element.style.willChange = 'transform, opacity';
      
      // Remover will-change após animação para liberar recursos
      setTimeout(() => {
        if (element) element.style.willChange = 'auto';
      }, 1000);
    }
  });
};

// Criar observador de interseção otimizado
export const createOptimizedObserver = (callback, options = {}) => {
  // Valores padrão eficientes para carregamento de conteúdo
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px 200px 0px' // Pré-carregar 200px antes de entrar na viewport
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Retornar null se IntersectionObserver não estiver disponível
  if (typeof IntersectionObserver === 'undefined') {
    return null;
  }
  
  return new IntersectionObserver(callback, mergedOptions);
};