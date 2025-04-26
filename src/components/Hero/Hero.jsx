import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { throttle, detectDeviceCapability } from '../../utils/performance';
import BackgroundVideo from '../common/BackgroundVideo';
 
import styles from './Hero.module.css';

function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  const scrollDownRef = useRef(null);
  
  // Detectar dispositivos de baixa performance
  const deviceCaps = detectDeviceCapability();
  const ProfileImage = new URL('../common/Image/profile.jpeg', import.meta.url).href;
  
  // Função para verificar se deve mostrar o botão de scroll
  const checkScrollButtonVisibility = () => {
    // Esconder botão em dispositivos móveis de tamanho pequeno a médio
    const isMobileView = window.innerWidth <= 480;
    
    // Sempre mostramos em telas grandes
    if (!isMobileView) {
      setShowScrollButton(true);
      return;
    }

    // Em telas pequenas, verificamos a altura da tela
    const isExtraTall = window.innerHeight > 800;
    
    // Só mostramos em telas específicas e após verificar que não há sobreposição
    setShowScrollButton(isExtraTall && window.scrollY < 50);
  };
  
  // Efeito para monitorar scroll e ocultar o botão quando necessário
  useEffect(() => {
    // Verificar inicialmente
    checkScrollButtonVisibility();
    
    // Throttled scroll handler
    const handleScroll = throttle(() => {
      if (window.scrollY > 50) {
        setShowScrollButton(false);
      } else {
        checkScrollButtonVisibility();
      }
    }, 100);
    
    // Resize handler para reconferir quando o tamanho da tela mudar
    const handleResize = throttle(() => {
      checkScrollButtonVisibility();
    }, 200);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    // Otimização 1: Aplicar will-change apenas quando necessário
    const applyHardwareAcceleration = () => {
      const elementsToOptimize = [
        headingRef.current,
        descriptionRef.current,
        buttonRef.current,
        imageRef.current
      ].filter(Boolean);
      
      elementsToOptimize.forEach(element => {
        element.style.willChange = 'transform, opacity';
        element.style.transform = 'translateZ(0)';
        element.style.backfaceVisibility = 'hidden';
      });
    };
    
    // Otimização 2: Usar IntersectionObserver em vez de eventos de scroll
    if ('IntersectionObserver' in window && heroRef.current) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            // Só executar as animações quando o elemento estiver visível
            requestAnimationFrame(() => {
              setIsVisible(true);
              applyHardwareAcceleration();
            });
            observer.unobserve(heroRef.current);
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(heroRef.current);
      return () => observer.disconnect();
    } else {
      // Fallback para browsers sem suporte
      setIsVisible(true);
      applyHardwareAcceleration();
    }
  }, []);
  
  // Otimização 3: Throttle para efeito parallax
  useEffect(() => {
    if (deviceCaps.shouldUseReducedEffects || !heroRef.current) return;
    
    const handleMouseMove = throttle((e) => {
      requestAnimationFrame(() => {
        if (!contentRef.current || !imageRef.current) return;
        
        const { clientX, clientY } = e;
        const moveX = (clientX / window.innerWidth - 0.5) * 20;
        const moveY = (clientY / window.innerHeight - 0.5) * 20;
        
        contentRef.current.style.transform = `translate3d(${moveX * -0.5}px, ${moveY * -0.5}px, 0)`;
        imageRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    }, 30);
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [deviceCaps.shouldUseReducedEffects]);
  
  return (
    <section 
      id="home" 
      className={`${styles.hero} ${isVisible ? styles.visible : ''} ${deviceCaps.shouldUseReducedEffects ? styles.reducedMotion : ''}`} 
      ref={heroRef}
    >
      {/* Substituindo o background estático pelo vídeo */}
      {!deviceCaps.shouldUseReducedEffects ? (
        <BackgroundVideo>
          {/* O conteúdo dentro do BackgroundVideo é gerenciado pelo overlay do componente */}
          <div className={styles.blurOverlay}></div>
        </BackgroundVideo>
      ) : (
        <div className={styles.heroBackground}>
          {/* Fallback para dispositivos de baixa performance */}
          <div className={styles.backgroundGradient}></div>
          <div className={styles.particleOverlay}></div>
        </div>
      )}
      
      <div className={styles.heroContent}>
        <div className={styles.heroTextContainer} ref={contentRef}>
          <h1 className={styles.heroTitle} ref={headingRef}>
            <span className={styles.greeting}>Hello, I am</span>
            <span className={styles.name}>Rai Gomes</span>
            <span className={styles.role}>UI/UX Designer & Frontend Developer</span>
          </h1>
          
          <p className={styles.heroDescription} ref={descriptionRef}>
          I develop intuitive and efficient interfaces that provide high-performance and user-focused web experiences.
          </p>
          
          <div className={styles.heroCta} ref={buttonRef}>
            <Link to="/contact" className={styles.primaryBtn}>
            Get in touch
            </Link>
            <Link to="/work" className={styles.secondaryBtn}>
            View Projects
            </Link>
          </div>
        </div>
        
        <div className={styles.heroImageContainer}>
          <div className={styles.imageWrapper} ref={imageRef}>
            {/* Use imagens WebP com fallback */}
            <picture>
              <img 
                src={ProfileImage} 
                alt="Rai Gomes" 
                className={styles.heroImage}
                width="450"
                height="450"
                loading="eager" 
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>
      
      {/* Renderização condicional do botão de scroll */}
      {showScrollButton && (
        <div 
          className={styles.scrollDown} 
          ref={scrollDownRef} 
          style={{ 
            display: showScrollButton ? 'block' : 'none',
            zIndex: 1 // Menor que os botões CTA
          }}
        >
          <a href="#about" aria-label="Scroll to the about section">
            <span className={styles.scrollIcon}></span>
            <span className={styles.scrollText}>Scroll down</span>
          </a>
        </div>
      )}
    </section>
  );
}

export default Hero;