import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import styles from './Hero.module.css';
import profileImage from '../common/Image/profile.jpeg';
// Importando as funções de premiumPerformance
import { 
  detectDevicePerformance, 
  throttle,
  setupMouseTracking,
  setupParallaxEffect
} from '../utils/premiumPerformance';
import TECH_ICONS from './Icons'; // Importando os ícones de tecnologia

// Constantes para otimização
const PARTICLE_COUNT = {
  desktop: 20,
  mobile: 10
};

const STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  LIMITED: 'limited'
};


const Hero = () => {
  const [visible, setVisible] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTech, setActiveTech] = useState(null);
  const heroRef = useRef(null);
  const parallaxRef = useRef(null);
  const { theme } = useTheme();

  // Determina estados baseados em métricas
  const currentStatus = STATUS.AVAILABLE;
  const experienceYears = new Date().getFullYear() - 2021;
  
  // Usando a detecção avançada de dispositivo do premiumPerformance
  const deviceInfo = useMemo(() => {
    // Só executa no client-side
    if (typeof window !== 'undefined') {
      return detectDevicePerformance();
    }
    return {
      shouldReduceEffects: false,
      isTouchDevice: false,
      isLowEndDevice: false,
      prefersReducedMotion: false,
      isMobile: false
    };
  }, []);
  
  // Detectar largura da tela para determinar quantidade de partículas
  const isSmallScreen = useMemo(() => {
    return window.innerWidth <= 768 || deviceInfo.isMobile;
  }, [deviceInfo.isMobile]);
  
  // Efeito paralaxe 3D usando funções premium
  useEffect(() => {
    if (deviceInfo.prefersReducedMotion || deviceInfo.shouldReduceEffects) return;
    
    // Configuração de mouse tracking para efeitos de parallax
    const cleanupMouseTracking = setupMouseTracking(parallaxRef.current, {
      throttleLimit: 50,
      effectIntensity: 0.8,
      updateProps: ['--mouse-x', '--mouse-y'],
      perspective: true
    });
    
    return () => {
      if (cleanupMouseTracking) cleanupMouseTracking();
    };
  }, [deviceInfo.prefersReducedMotion, deviceInfo.shouldReduceEffects]);
  
  // Gera partículas com propriedades aleatórias
  const particles = useMemo(() => {
    // Reduz o número de partículas em dispositivos de baixo desempenho
    const particleCount = deviceInfo.shouldReduceEffects ? 
      PARTICLE_COUNT.mobile / 2 : 
      isSmallScreen ? PARTICLE_COUNT.mobile : PARTICLE_COUNT.desktop;
    
    return Array.from({ length: particleCount }).map((_, index) => {
      const size = Math.floor(Math.random() * 40) + 10; // 10px a 50px
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const duration = Math.floor(Math.random() * 15) + 15; // 15s a 30s
      const delay = Math.random() * 5; // 0s a 5s
      const opacity = Math.random() * 0.5 + 0.3; // Entre 0.3 e 0.8
      const blur = Math.floor(Math.random() * 2) + 1;
      
      return { id: index, size, top, left, duration, delay, opacity, blur };
    });
  }, [isSmallScreen, deviceInfo.shouldReduceEffects]);
  
  // Define as tecnologias com cores correspondentes e componentes de ícones
  const technologies = useMemo(() => [
    { name: 'React', color: '#61DAFB', icon: <TECH_ICONS.REACT className={styles.techSvgIcon} alt="React" /> },
    { name: 'JavaScript', color: '#F7DF1E', icon: <TECH_ICONS.JS className={styles.techSvgIcon} alt="JavaScript" /> },
    { name: 'UI/UX', color: '#FF7EB6', icon: <TECH_ICONS.UI className={styles.techSvgIcon} alt="UI/UX" /> },
    { name: 'Node.js', color: '#68A063', icon: <TECH_ICONS.NODE className={styles.techSvgIcon} alt="Node.js" /> },
    { name: 'CSS', color: '#264DE4', icon: <TECH_ICONS.CSS className={styles.techSvgIcon} alt="CSS" /> },
    { name: 'HTML', color: '#E34F26', icon: <TECH_ICONS.HTML className={styles.techSvgIcon} alt="HTML" /> },
    { name: 'Git', color: '#F05032', icon: <TECH_ICONS.GIT className={styles.techSvgIcon} alt="Git" /> },
    { name: 'Figma', color: '#F24E1E', icon: <TECH_ICONS.FIGMA className={styles.techSvgIcon} alt="Figma" /> },
    { name: 'Tillgänglighet', color: '#0D96F2', icon: <TECH_ICONS.ACCESS className={styles.techSvgIcon} alt="Tillgänglighet" /> },
    { name: 'AI i allmänhet', color: '#8C52FF', icon: <TECH_ICONS.AI className={styles.techSvgIcon} alt="AI i allmänhet" /> },
    { name: 'Applikationsutveckling', color: '#8C52FF', icon: <TECH_ICONS.APP_DEV className={styles.techSvgIcon} alt="Aplikationsutveckling" /> },

  ], []);
  
  // Lista de frases para efeito de digitação - Traduzidas para sueco
  const phrases = useMemo(() => [
    'bygger intuitiva gränssnitt',
    'skapar minnesvärda upplevelser',
    'omvandlar idéer till kod',
    'utvecklar kreativa lösningar'
  ], []);
  
  // Efeito de animação de entrada com IntersectionObserver otimizado
  useEffect(() => {
    // Não usa IntersectionObserver se o usuário preferir movimento reduzido
    if (deviceInfo.prefersReducedMotion) {
      setVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px 50px 0px' }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [deviceInfo.prefersReducedMotion]);
  
  // Efeito de digitação de texto com otimização para preferência de movimento reduzido
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    // Verificar se o usuário prefere menos movimento usando o deviceInfo
    if (deviceInfo.prefersReducedMotion) {
      // Se preferir menos movimento, mostra o texto completo imediatamente
      setTypedText(phrases[0]);
      setIsTypingComplete(true);
      return;
    }
    
    const currentPhrase = phrases[currentPhraseIndex];
    
    // Velocidade variável para digitação/exclusão
    const typingSpeed = isDeleting ? 30 : 100;
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentPhrase.substring(0, typedText.length + 1));
        
        // Se completou a digitação
        if (typedText.length === currentPhrase.length) {
          // Pausa antes de começar a apagar
          setTimeout(() => {
            setIsDeleting(true);
          }, 1500);
        }
      } else {
        setTypedText(currentPhrase.substring(0, typedText.length - 1));
        
        // Se terminou de apagar
        if (typedText.length === 1) {
          setIsDeleting(false);
          // Avança para a próxima frase
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);
    
    return () => clearTimeout(timer);
  }, [typedText, currentPhraseIndex, isDeleting, phrases, deviceInfo.prefersReducedMotion]);

  useEffect(() => {
    const handleIPadProDetection = () => {
      // Selecionar os elementos principais
      const heroElement = document.querySelector(`.${styles.hero}`);
      const heroContent = document.querySelector(`.${styles.heroContent}`);
      const imageWrapper = document.querySelector(`.${styles.imageWrapper}`);
      
      // Verificar se é um iPad Pro com resolução de 1024px
      const isIPadPro = window.innerWidth >= 1020 && window.innerWidth <= 1030;
      
      if (isIPadPro) {
        console.log('iPad Pro 1024px detected in Hero component');
        
        // Aplicar classes específicas
        if (heroElement) {
          heroElement.classList.add(styles.iPadProHero);
        }
        
        if (heroContent) {
          heroContent.classList.add(styles.iPadProContent);
        }
        
        if (imageWrapper) {
          imageWrapper.classList.add(styles.iPadProImage);
        }
        
        // Ajustar algumas propriedades via CSS vars para maior flexibilidade
        document.documentElement.style.setProperty('--hero-max-width', '960px');
        document.documentElement.style.setProperty('--hero-padding-side', '32px');
      } else {
        // Remover classes se não for iPad Pro
        if (heroElement) {
          heroElement.classList.remove(styles.iPadProHero);
        }
        
        if (heroContent) {
          heroContent.classList.remove(styles.iPadProContent);
        }
        
        if (imageWrapper) {
          imageWrapper.classList.remove(styles.iPadProImage);
        }
        
        // Restaurar propriedades padrão
        document.documentElement.style.removeProperty('--hero-max-width');
        document.documentElement.style.removeProperty('--hero-padding-side');
      }
    };
    
    // Executar no carregamento e em cada resize
    handleIPadProDetection();
    window.addEventListener('resize', handleIPadProDetection);
    
    return () => {
      window.removeEventListener('resize', handleIPadProDetection);
    };
  }, [styles]);
  
  // Efeito para elementos decorativos parallax
  useEffect(() => {
    if (deviceInfo.prefersReducedMotion || deviceInfo.shouldReduceEffects) return;
    
    // Elementos decorativos que terão efeito de parallax
    const decorElements = document.querySelectorAll(`.${styles.decorElement}`);
    if (decorElements.length === 0) return;
    
    // Setup do efeito parallax usando a função premium
    const cleanupParallax = setupParallaxEffect(Array.from(decorElements), {
      throttleLimit: 50,
      maxOffset: deviceInfo.isMobile ? 30 : 60,
      smoothingFactor: 0.15
    });
    
    return () => {
      if (cleanupParallax) cleanupParallax();
    };
  }, [deviceInfo.prefersReducedMotion, deviceInfo.shouldReduceEffects, deviceInfo.isMobile]);
  
  // Efeito para definir quando a animação de digitação termina
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTypingComplete(true);
    }, 6000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Função para gerenciar o tech hover (otimizada com throttle)
  const handleTechHover = useCallback(throttle((index) => {
    setActiveTech(index);
  }, 50), []);
  
  // Função otimizada para scroll suave
  const scrollToWork = useCallback((e) => {
    e.preventDefault();
    
    // Usa a detecção de preferência de movimento do premium performance
    const noSmoothScroll = deviceInfo.prefersReducedMotion;
    
    // Adiciona um console.log para debug
    console.log('Botão clicado - tentando rolar para a seção de serviços');
    
    // Tenta encontrar a seção várias vezes em caso de renderização condicional
    const findAndScrollToSection = () => {
      // Busca pelo ID services em qualquer elemento
      const targetSection = document.getElementById('services');
      
      if (targetSection) {
        console.log('Seção de serviços encontrada, realizando rolagem');
        targetSection.scrollIntoView({
          behavior: noSmoothScroll ? 'auto' : 'smooth',
          block: 'start'
        });
        return true;
      } else {
        console.log('Seção de serviços não encontrada ainda');
        return false;
      }
    };
    
    // Tenta imediatamente
    if (findAndScrollToSection()) return;
    
    // Se não encontrou, tenta novamente após um pequeno atraso (para dar tempo ao React)
    setTimeout(() => {
      if (findAndScrollToSection()) return;
      
      // Se ainda não encontrou, tenta uma última vez com um atraso maior
      setTimeout(() => {
        if (findAndScrollToSection()) return;
        
        // Último recurso: simplesmente role para baixo
        console.log('Não foi possível encontrar a seção, usando fallback');
        window.scrollTo({
          top: window.innerHeight,
          behavior: noSmoothScroll ? 'auto' : 'smooth'
        });
      }, 500);
    }, 100);
  }, [deviceInfo.prefersReducedMotion]);

  return (
    <section 
      ref={heroRef} 
      className={`${styles.hero} ${visible ? styles.visible : ''}`}
      id="hero"
      aria-label="Huvudsektion"
    >
      {/* Background com gradiente animado avançado */}
      <div 
        className={styles.heroBackground} 
        ref={parallaxRef}
        aria-hidden="true"
      >
        {/* Nova layer de gradiente com blobs */}
        <div className={styles.gradientLayer}></div>
        <div className={styles.noiseLayer}></div>
        <div className={styles.gridLayer}></div>
      </div>
      
      {/* Partículas decorativas melhoradas - com condicionais para reduzir efeitos */}
      {!deviceInfo.shouldReduceEffects && (
        <div className={styles.heroParticles} aria-hidden="true">
          {particles.map(particle => (
            <div 
              key={particle.id}
              className={styles.particle}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                top: particle.top,
                left: particle.left,
                opacity: particle.opacity,
                '--duration': `${particle.duration}s`,
                '--blur': `${particle.blur}px`,
                animationDelay: `${particle.delay}s`
              }}
            ></div>
          ))}
        </div>
      )}
      
      {/* Brilhos (glows) para efeito visual avançado - condicional */}
      {!deviceInfo.isLowEndDevice && (
        <>
          <div className={`${styles.glowEffect} ${styles.glow1}`} aria-hidden="true"></div>
          <div className={`${styles.glowEffect} ${styles.glow2}`} aria-hidden="true"></div>
        </>
      )}
      
      {/* Badge de disponibilidade - Traduzido para sueco */}
      <div className={styles.availabilityBadge}>
        <span 
          className={`${styles.statusDot} ${styles[currentStatus]}`}
          aria-hidden="true"
        ></span>
        <span className={styles.statusText}>
          {currentStatus === STATUS.AVAILABLE ? 'Tillgänglig för projekt' : 
           currentStatus === STATUS.LIMITED ? 'Begränsad tillgänglighet' : 
           'Upptagen till Juni/2025'}
        </span>
      </div>
      
      {/* Conteúdo principal - REORGANIZADO para imagem à direita e texto à esquerda */}
      <div className={styles.heroContent}>
        {/* Texto do Hero (LADO ESQUERDO) */}
        <div className={styles.heroTextContainer}>
          {/* Badge de experiência - Traduzido para sueco */}
          <div className={styles.experienceBadge} aria-label={`${experienceYears}+ års erfarenhet av webbutveckling`}>
            <span className={styles.badgeIcon} aria-hidden="true">⭐</span>
            <span>{experienceYears}+ års erfarenhet</span>
          </div>
          
          {/* Título principal - Traduzido para sueco */}
          <h1 className={styles.heroTitle}>
            <span className={styles.greeting}>Hej, jag heter Rai</span>
            <span className={styles.profession}>
              En <span className={styles.highlight}>kreativ</span> webbutvecklare & UX/UI-designer
            </span>
          </h1>
          
          {/* Subtítulo com efeito de digitação */}
          <p className={styles.heroSubtitle}>
            Specialiserad på <span className={styles.typedTextContainer}>{typedText}
            <span 
              className={styles.cursor} 
              aria-hidden="true"
              style={{ opacity: isDeleting ? 0.7 : 1 }}
            ></span></span>
          </p>
          
          {/* Tech Stack aprimorada */}
          <div className={styles.techStack} aria-label="Mina huvudteknologier">
            {technologies.map((tech, index) => (
              <div 
                key={index}
                className={`${styles.techBadge} ${activeTech === index ? styles.activeTech : ''}`}
                style={{ '--tech-color': tech.color }}
                title={`${tech.name}`}
                onMouseEnter={() => handleTechHover(index)}
                onMouseLeave={() => handleTechHover(null)}
              >
                <div className={styles.techIcon}>{tech.icon}</div>
                <div className={styles.techDetails}>
                  <span className={styles.techName}>{tech.name}</span>
                </div>
                <div className={styles.techGlow} style={{ backgroundColor: tech.color }}></div>
              </div>
            ))}
          </div>
          
          {/* Botões de ação - Traduzidos para sueco */}
          <div className={styles.heroActions}>
            <Link to="/contact" className={styles.primaryButton}>
              <span>Kontakta mig</span>
              <div className={styles.buttonShine}></div>
              <span className={styles.buttonIcon} aria-hidden="true">→</span>
            </Link>
            <Link to="/work" className={styles.secondaryButton}>
              <span>Se projekt</span>
              <span className={styles.buttonIcon} aria-hidden="true">🔍</span>
            </Link>
          </div>
        </div>
        
        {/* Imagem do Hero com efeitos 3D - LADO DIREITO */}
        <div className={styles.heroImageContainer}>
          <div 
            className={styles.imageWrapper}
            style={{
              transform: `perspective(1000px) 
                          rotateY(${(mousePosition.x - 0.5) * 5}deg) 
                          rotateX(${(mousePosition.y - 0.5) * -5}deg)`
            }}
          >
            <img 
              src={profileImage}
              alt="Foto av Rai Gomes" 
              className={styles.heroImage}
              loading="eager"
              width="380" 
              height="380"
            />
            <div className={styles.imageGlow} aria-hidden="true"></div>
            <div className={styles.imageBorder} aria-hidden="true"></div>
          </div>
          
          {/* Elementos decorativos ao redor da imagem */}
          <div className={`${styles.decorElement} ${styles.decor1}`}></div>
          <div className={`${styles.decorElement} ${styles.decor2}`}></div>
          <div className={`${styles.decorElement} ${styles.decor3}`}></div>
        </div>
      </div>
      
      {/* Botão de rolagem para baixo - Centralizado no fundo da seção */}
      <div className={styles.heroScrollContainer}>
        <a 
          href="#services" 
          className={styles.heroScroll}
          onClick={scrollToWork}
          aria-label="Rulla till projektsektionen"
        >
          <div className={styles.scrollIcon} aria-hidden="true">
            <div className={styles.scrollDot}></div>
          </div>
          <span>Utförska</span>
        </a>
      </div>
    </section>
  );
};

export default React.memo(Hero); // Usando memo para evitar renderizações desnecessárias