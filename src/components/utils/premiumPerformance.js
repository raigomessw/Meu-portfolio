/**
 * Utilitários de desempenho para otimizar a experiência premium
 * Este arquivo contém funções para melhorar o desempenho enquanto mantém efeitos visuais avançados
 */

// Detecta se o dispositivo é de baixo desempenho para adaptação de efeitos
export const detectDevicePerformance = () => {
  const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const hasLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
  
  // Detecta processadores de baixo desempenho baseado em hardware concurrency
  const hasLowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;

  return {
    shouldReduceEffects: hasReducedMotion || (isMobile && (hasLowMemory || hasLowCPU)),
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isLowEndDevice: hasLowMemory || hasLowCPU,
    prefersReducedMotion: hasReducedMotion,
    isMobile
  };
};

// Função para throttle de efeitos que dependem de mouse movement
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Carregador de imagens otimizado para experiência premium
export const loadOptimizedImage = (src, quality = 'high') => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Opções baseadas na qualidade desejada
    const qualitySettings = {
      low: '?q=60&w=800',
      medium: '?q=80&w=1200',
      high: '?q=90&w=1600'
    };

    // Adiciona timestamp para evitar cache durante desenvolvimento
    const isDevMode = process.env.NODE_ENV === 'development';
    const cacheBuster = isDevMode ? `&t=${new Date().getTime()}` : '';
    
    // Configura URL com parâmetros de qualidade
    let imgUrl = src;
    if (src.includes('://')) {
      // URL externa - adiciona parâmetros se for uma URL compatível (Cloudinary, Imgix, etc)
      if (src.includes('cloudinary.com') || src.includes('imgix.net')) {
        imgUrl = `${src}${qualitySettings[quality]}${cacheBuster}`;
      }
    } else {
      // URL interna - usada sem otimização de servidor
      imgUrl = src;
    }
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha ao carregar imagem: ${src}`));
    img.src = imgUrl;
  });
};

// Sistema de carregamento lazy premium para elementos visuais pesados
export const setupPremiumLazyLoading = () => {
  // Detecta suporte nativo para intersection observer
  if ('IntersectionObserver' in window) {
    const premiumObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          // Ativa classes para elementos que precisam de animações
          if (target.classList.contains('premium-lazy')) {
            target.classList.add('premium-visible');
            
            // Carrega imagens de fundo se especificado
            if (target.dataset.backgroundSrc) {
              target.style.backgroundImage = `url(${target.dataset.backgroundSrc})`;
            }
            
            // Ativa efeitos de animação
            if (target.dataset.premiumEffect) {
              target.classList.add(`premium-effect-${target.dataset.premiumEffect}`);
            }

            // Stop observando após visibilidade
            premiumObserver.unobserve(target);
          }
        }
      });
    }, {
      rootMargin: '0px 0px 50px 0px',
      threshold: 0.15
    });
    
    // Encontra todos elementos marcados para lazy loading premium
    document.querySelectorAll('.premium-lazy').forEach(element => {
      premiumObserver.observe(element);
    });
    
    return premiumObserver;
  }
  
  // Fallback para navegadores sem suporte a IntersectionObserver
  document.querySelectorAll('.premium-lazy').forEach(element => {
    element.classList.add('premium-visible');
    
    if (element.dataset.backgroundSrc) {
      element.style.backgroundImage = `url(${element.dataset.backgroundSrc})`;
    }
    
    if (element.dataset.premiumEffect) {
      element.classList.add(`premium-effect-${element.dataset.premiumEffect}`);
    }
  });
  
  return null;
};

// Tracking de mouse otimizado para efeitos que seguem o cursor
export const setupMouseTracking = (element, options = {}) => {
  if (!element) return null;
  
  const {
    throttleLimit = 50, // Limite de throttle em milissegundos
    effectIntensity = 1, // Intensidade do efeito (1 = normal)
    updateProps = ['--mouse-x', '--mouse-y'], // Propriedades CSS a serem atualizadas
    perspective = false // Se deve aplicar efeito de perspectiva 3D
  } = options;
  
  // Detecta suporte a touch
  const deviceInfo = detectDevicePerformance();
  
  // Em dispositivos touch, não aplica o efeito
  if (deviceInfo.isTouchDevice) {
    element.classList.add('touch-device');
    return null;
  }
  
  // Função para atualizar as variáveis CSS
  const updateMousePosition = throttle((e) => {
    const rect = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    // Aplica as variáveis CSS para posição do mouse
    if (updateProps.includes('--mouse-x')) {
      element.style.setProperty('--mouse-x', x);
    }
    
    if (updateProps.includes('--mouse-y')) {
      element.style.setProperty('--mouse-y', y);
    }
    
    // Efeito 3D se especificado
    if (perspective && !deviceInfo.shouldReduceEffects) {
      const rotateY = (x - 0.5) * 5 * effectIntensity; // -2.5 a 2.5 graus
      const rotateX = (y - 0.5) * -5 * effectIntensity; // -2.5 a 2.5 graus
      
      element.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    }
  }, throttleLimit);
  
  // Setup dos event listeners
  const mouseEnter = () => {
    if (perspective) {
      element.style.transition = 'transform 0.2s ease-out';
    }
  };
  
  const mouseLeave = () => {
    if (perspective) {
      element.style.transition = 'transform 0.5s ease-out';
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
    
    // Reset das variáveis CSS
    if (updateProps.includes('--mouse-x')) {
      element.style.setProperty('--mouse-x', '0.5');
    }
    
    if (updateProps.includes('--mouse-y')) {
      element.style.setProperty('--mouse-y', '0.5');
    }
  };
  
  // Adiciona os event listeners
  element.addEventListener('mousemove', updateMousePosition);
  element.addEventListener('mouseenter', mouseEnter);
  element.addEventListener('mouseleave', mouseLeave);
  
  // Retorna função para limpeza
  return () => {
    element.removeEventListener('mousemove', updateMousePosition);
    element.removeEventListener('mouseenter', mouseEnter);
    element.removeEventListener('mouseleave', mouseLeave);
  };
};

// Otimizador de scrolling para efeitos de parallax
export const setupParallaxEffect = (elements, options = {}) => {
  if (!elements || elements.length === 0) return null;
  
  const {
    throttleLimit = 50, // Limite de throttle em milissegundos
    maxOffset = 100, // Deslocamento máximo em pixels
    smoothingFactor = 0.1 // Fator de suavização (0-1)
  } = options;
  
  const deviceInfo = detectDevicePerformance();
  
  // Se preferir movimento reduzido, não aplica o parallax
  if (deviceInfo.prefersReducedMotion) return null;
  
  // Mantém o estado atual da posição
  const state = {
    targetPositions: Array(elements.length).fill().map(() => ({ x: 0, y: 0 })),
    currentPositions: Array(elements.length).fill().map(() => ({ x: 0, y: 0 })),
    enabled: true,
    frameId: null
  };
  
  // Função de animação suave
  const animate = () => {
    if (!state.enabled) return;
    
    let needsUpdate = false;
    
    elements.forEach((el, index) => {
      const target = state.targetPositions[index];
      const current = state.currentPositions[index];
      
      // Aplica interpolação para movimento suave
      current.x += (target.x - current.x) * smoothingFactor;
      current.y += (target.y - current.y) * smoothingFactor;
      
      // Verifica se ainda há movimento significativo
      if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
        needsUpdate = true;
      }
      
      // Aplica a transformação
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
    });
    
    // Continua animando se houver movimento significativo
    if (needsUpdate) {
      state.frameId = requestAnimationFrame(animate);
    }
  };
  
  // Atualiza as posições-alvo com base na posição de scroll
  const updateTargets = throttle(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    elements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const centerX = rect.left + rect.width / 2;
      
      // Calcula o fator de deslocamento baseado na posição vertical relativa
      const verticalFactor = (centerY - windowHeight / 2) / (windowHeight / 2);
      const horizontalFactor = (centerX - window.innerWidth / 2) / (window.innerWidth / 2);
      
      // Velocidade de parallax do elemento (pode ser customizada por elemento)
      const speedY = parseFloat(el.dataset.parallaxSpeed || '1');
      const speedX = parseFloat(el.dataset.parallaxSpeedX || '0.5');
      
      // Atualiza a posição alvo
      state.targetPositions[index] = {
        x: -horizontalFactor * maxOffset * speedX,
        y: -verticalFactor * maxOffset * speedY
      };
    });
    
    // Inicia a animação se não estiver rodando
    if (state.frameId === null) {
      state.frameId = requestAnimationFrame(animate);
    }
  }, throttleLimit);
  
  // Adiciona event listeners
  window.addEventListener('scroll', updateTargets);
  window.addEventListener('resize', updateTargets);
  
  // Executa uma primeira atualização
  updateTargets();
  
  // Retorna função para limpeza
  return () => {
    state.enabled = false;
    if (state.frameId !== null) {
      cancelAnimationFrame(state.frameId);
    }
    window.removeEventListener('scroll', updateTargets);
    window.removeEventListener('resize', updateTargets);
  };
};

// Gerencia carregamento otimizado de vídeos de fundo premium
export const setupOptimizedBackgroundVideo = (videoElement, options = {}) => {
  if (!videoElement) return null;
  
  const {
    mobileFallbackImage, // Imagem de fallback para mobile
    lowBatteryFallback = true, // Usar fallback quando bateria < 15%
    autoplayWithMeta = true, // Tentar iniciar playback com metadata carregada vs carregar todo o vídeo
    unloadOutOfView = true // Descarregar vídeo quando fora da visualização
  } = options;
  
  const deviceInfo = detectDevicePerformance();
  
  // Verifica se deve usar fallback
  const useFallback = () => {
    // Verifica bateria se disponível
    if (lowBatteryFallback && 'getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        if (battery.level < 0.15 && !battery.charging) {
          enableFallback();
        }
      });
    }
    
    // Em dispositivos móveis ou de baixo desempenho
    if (deviceInfo.isMobile && mobileFallbackImage) {
      enableFallback();
      return true;
    }
    
    return false;
  };
  
  // Função para ativar fallback
  const enableFallback = () => {
    if (mobileFallbackImage && videoElement.parentNode) {
      videoElement.style.display = 'none';
      
      const img = document.createElement('img');
      img.src = mobileFallbackImage;
      img.className = videoElement.className;
      img.alt = "Background";
      img.style.objectFit = "cover";
      img.style.width = "100%";
      img.style.height = "100%";
      
      videoElement.parentNode.insertBefore(img, videoElement);
    }
  };
  
  // Se device tem baixo desempenho, usa fallback
  if (deviceInfo.shouldReduceEffects) {
    enableFallback();
    return null;
  }
  
  // Se fallback já foi ativado, não continua
  if (useFallback()) return null;
  
  // Optimiza o carregamento do vídeo
  const optimizeVideoLoading = () => {
    // Configura o vídeo para iniciar rápido
    videoElement.preload = "metadata";
    videoElement.playbackRate = 1.0;
    
    // Remove o atributo autoplay e controle via JS
    videoElement.removeAttribute('autoplay');
    videoElement.muted = true;
    videoElement.playsInline = true;
    
    // Inicia playback quando os metadados estiverem prontos
    if (autoplayWithMeta) {
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play().catch(() => {
          console.log('Autoplay prevented by browser');
        });
      });
    }
  };
  
  // Se necessário, configura observador para detectar quando o vídeo fica fora da visualização
  if (unloadOutOfView && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Quando visível, tenta reproduzir o vídeo
          if (videoElement.paused) {
            videoElement.play().catch(() => {});
          }
        } else {
          // Quando invisível, pausa o vídeo para economizar recursos
          if (!videoElement.paused) {
            videoElement.pause();
          }
        }
      });
    }, {
      rootMargin: '0px',
      threshold: 0.1
    });
    
    videoObserver.observe(videoElement);
  }
  
  // Chama a otimização
  optimizeVideoLoading();
  
  // Retorna função para limpeza
  return () => {
    if (unloadOutOfView && 'IntersectionObserver' in window) {
      videoElement.pause();
      // Cleanup do observer seria aqui
    }
  };
};

// Otimiza imagens de fundo premium
export const setupOptimizedBgImages = () => {
  // Configura lazy loading para imagens de fundo premium
  const bgElements = document.querySelectorAll('.premium-bg-image');
  
  if ('IntersectionObserver' in window) {
    const bgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          if (target.dataset.premiumBg) {
            // Carrega imagem de fundo quando elemento é visível
            target.style.backgroundImage = `url(${target.dataset.premiumBg})`;
            
            // Adiciona classe para efeito de fade-in
            requestAnimationFrame(() => {
              target.classList.add('premium-bg-loaded');
            });
            
            // Para de observar após carregar
            bgObserver.unobserve(target);
          }
        }
      });
    }, {
      rootMargin: '200px 0px', // Carrega um pouco antes de entrar na viewport
      threshold: 0.01
    });
    
    bgElements.forEach(element => {
      bgObserver.observe(element);
    });
  } else {
    // Fallback para navegadores sem suporte a IntersectionObserver
    bgElements.forEach(element => {
      if (element.dataset.premiumBg) {
        element.style.backgroundImage = `url(${element.dataset.premiumBg})`;
        element.classList.add('premium-bg-loaded');
      }
    });
  }
};

// Exporta todas as funções
export default {
  detectDevicePerformance,
  throttle,
  loadOptimizedImage,
  setupPremiumLazyLoading,
  setupMouseTracking,
  setupParallaxEffect,
  setupOptimizedBackgroundVideo,
  setupOptimizedBgImages
};