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

// Novos ícones SVG para tech stack
const TECH_ICONS = {
  REACT: (
    <svg viewBox="0 0 24 24" className={styles.techSvgIcon}>
      <path fill="currentColor" d="M12,10.11C13.03,10.11 13.87,10.95 13.87,12C13.87,13 13.03,13.85 12,13.85C10.97,13.85 10.13,13 10.13,12C10.13,10.95 10.97,10.11 12,10.11M7.37,20C8,20.38 9.38,19.8 10.97,18.3C10.45,17.71 9.94,17.07 9.46,16.4C8.64,16.32 7.83,16.2 7.06,16.04C6.55,18.18 6.74,19.65 7.37,20M8.08,14.26L7.79,13.75C7.68,14.04 7.57,14.33 7.5,14.61C7.77,14.67 8.07,14.72 8.38,14.77C8.28,14.6 8.18,14.43 8.08,14.26M14.62,13.5L15.43,12L14.62,10.5C14.32,9.97 14,9.5 13.71,9.03C13.17,9 12.6,9 12,9C11.4,9 10.83,9 10.29,9.03C10,9.5 9.68,9.97 9.38,10.5L8.57,12L9.38,13.5C9.68,14.03 10,14.5 10.29,14.97C10.83,15 11.4,15 12,15C12.6,15 13.17,15 13.71,14.97C14,14.5 14.32,14.03 14.62,13.5M12,6.78C11.81,7 11.61,7.23 11.41,7.5C11.61,7.5 11.8,7.5 12,7.5C12.2,7.5 12.39,7.5 12.59,7.5C12.39,7.23 12.19,7 12,6.78M12,17.22C12.19,17 12.39,16.77 12.59,16.5C12.39,16.5 12.2,16.5 12,16.5C11.8,16.5 11.61,16.5 11.41,16.5C11.61,16.77 11.81,17 12,17.22M16.62,4C16,3.62 14.62,4.2 13.03,5.7C13.55,6.29 14.06,6.93 14.54,7.6C15.36,7.68 16.17,7.8 16.94,7.96C17.45,5.82 17.26,4.35 16.62,4M15.92,9.74L16.21,10.25C16.32,9.96 16.43,9.67 16.5,9.39C16.23,9.33 15.93,9.28 15.62,9.23C15.72,9.4 15.82,9.57 15.92,9.74M17.37,2.69C18.84,3.53 19,5.74 18.38,8.32C20.92,9.07 22.75,10.31 22.75,12C22.75,13.69 20.92,14.93 18.38,15.68C19,18.26 18.84,20.47 17.37,21.31C15.91,22.15 13.92,21.19 12,19.36C10.08,21.19 8.09,22.15 6.62,21.31C5.16,20.47 5,18.26 5.62,15.68C3.08,14.93 1.25,13.69 1.25,12C1.25,10.31 3.08,9.07 5.62,8.32C5,5.74 5.16,3.53 6.62,2.69C8.09,1.85 10.08,2.81 12,4.64C13.92,2.81 15.91,1.85 17.37,2.69M17.08,12C17.42,12.75 17.72,13.5 17.97,14.26C20.07,13.63 21.25,12.73 21.25,12C21.25,11.27 20.07,10.37 17.97,9.74C17.72,10.5 17.42,11.25 17.08,12M6.92,12C6.58,11.25 6.28,10.5 6.03,9.74C3.93,10.37 2.75,11.27 2.75,12C2.75,12.73 3.93,13.63 6.03,14.26C6.28,13.5 6.58,12.75 6.92,12M15.92,14.26C15.82,14.43 15.72,14.6 15.62,14.77C15.93,14.72 16.23,14.67 16.5,14.61C16.43,14.33 16.32,14.04 16.21,13.75L15.92,14.26M13.03,18.3C14.62,19.8 16,20.38 16.62,20C17.26,19.65 17.45,18.18 16.94,16.04C16.17,16.2 15.36,16.32 14.54,16.4C14.06,17.07 13.55,17.71 13.03,18.3M8.08,9.74C8.18,9.57 8.28,9.4 8.38,9.23C8.07,9.28 7.77,9.33 7.5,9.39C7.57,9.67 7.68,9.96 7.79,10.25L8.08,9.74M10.97,5.7C9.38,4.2 8,3.62 7.37,4C6.74,4.35 6.55,5.82 7.06,7.96C7.83,7.8 8.64,7.68 9.46,7.6C9.94,6.93 10.45,6.29 10.97,5.7Z" />
    </svg>
  ),
  JS: (
    <svg viewBox="0 0 24 24" className={styles.techSvgIcon}>
      <path fill="currentColor" d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z" />
    </svg>
  ),
  UI: (
    <svg viewBox="0 0 24 24" className={styles.techSvgIcon}>
      <path fill="currentColor" d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19Z" />
    </svg>
  ),
  NODE: (
    <svg viewBox="0 0 24 24" className={styles.techSvgIcon}>
      <path fill="currentColor" d="M12,1.85C11.73,1.85 11.45,1.92 11.22,2.05L3.78,6.35C3.3,6.63 3,7.15 3,7.71V16.29C3,16.85 3.3,17.37 3.78,17.65L5.73,18.77C6.68,19.23 7,19.24 7.44,19.24C8.84,19.24 9.65,18.39 9.65,16.91V8.44C9.65,8.32 9.55,8.22 9.43,8.22H8.5C8.37,8.22 8.27,8.32 8.27,8.44V16.91C8.27,17.57 7.59,18.22 6.5,17.67L4.45,16.5C4.38,16.45 4.34,16.37 4.34,16.29V7.71C4.34,7.62 4.38,7.54 4.45,7.5L11.89,3.21C11.95,3.17 12.05,3.17 12.11,3.21L19.55,7.5C19.62,7.54 19.66,7.62 19.66,7.71V16.29C19.66,16.37 19.62,16.45 19.55,16.5L12.11,20.79C12.05,20.83 11.95,20.83 11.88,20.79L10,19.65C9.92,19.62 9.84,19.61 9.79,19.64C9.26,19.94 9.16,20 8.67,20.15C8.55,20.19 8.36,20.26 8.74,20.47L11.22,21.94C11.46,22.08 11.72,22.15 12,22.15C12.28,22.15 12.54,22.08 12.78,21.94L20.22,17.65C20.7,17.37 21,16.85 21,16.29V7.71C21,7.15 20.7,6.63 20.22,6.35L12.78,2.05C12.55,1.92 12.28,1.85 12,1.85M14,8C11.88,8 10.61,8.89 10.61,10.39C10.61,12 11.87,12.47 13.91,12.67C16.34,12.91 16.53,13.27 16.53,13.75C16.53,14.58 15.86,14.93 14.3,14.93C12.32,14.93 11.9,14.44 11.75,13.46C11.73,13.36 11.64,13.28 11.53,13.28H10.57C10.45,13.28 10.36,13.37 10.36,13.5C10.36,14.74 11.04,16.24 14.3,16.24C16.65,16.24 18,15.31 18,13.69C18,12.08 16.92,11.66 14.63,11.35C12.32,11.05 12.09,10.89 12.09,10.35C12.09,9.9 12.29,9.3 14,9.3C15.5,9.3 16.09,9.63 16.32,10.66C16.34,10.76 16.43,10.83 16.53,10.83H17.5C17.55,10.83 17.61,10.81 17.65,10.76C17.69,10.72 17.72,10.66 17.7,10.6C17.56,8.82 16.38,8 14,8Z" />
    </svg>
  ),
  CSS: (
    <svg viewBox="0 0 24 24" className={styles.techSvgIcon}>
      <path fill="currentColor" d="M5,3L4.35,6.34H17.94L17.5,8.5H3.92L3.26,11.83H16.85L16.09,15.64L10.61,17.45L5.86,15.64L6.19,14H2.85L2.06,18L9.91,21L18.96,18L20.16,11.97L20.4,10.76L21.94,3H5Z" />
    </svg>
  ),
  HTML: (
    <svg viewBox="0 0 24 24" className={styles.techSvgIcon}>
      <path fill="currentColor" d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z" />
    </svg>
  ),
  GIT: (
    <svg viewBox="0 0 24 24" className={styles.techSvgIcon}>
      <path fill="currentColor" d="M2.6,10.59L8.38,4.8L10.07,6.5C9.83,7.35 10.22,8.28 11,8.73V14.27C10.4,14.61 10,15.26 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16C14,15.26 13.6,14.61 13,14.27V9.41L15.07,11.5C15,11.65 15,11.82 15,12A2,2 0 0,0 17,14A2,2 0 0,0 19,12A2,2 0 0,0 17,10C16.82,10 16.65,10 16.5,10.07L13.93,7.5C14.19,6.57 13.71,5.55 12.78,5.16C12.35,5 11.9,4.96 11.5,5.07L9.8,3.38L10.59,2.6C11.37,1.81 12.63,1.81 13.41,2.6L21.4,10.59C22.19,11.37 22.19,12.63 21.4,13.41L13.41,21.4C12.63,22.19 11.37,22.19 10.59,21.4L2.6,13.41C1.81,12.63 1.81,11.37 2.6,10.59Z" />
    </svg>
  ),
  FIGMA: (
    <svg viewBox="0 0 24 24" className={styles.techSvgIcon}>
      <path fill="currentColor" d="M15.5,12C15.5,10.619 16.619,9.5 18,9.5C19.381,9.5 20.5,10.619 20.5,12C20.5,13.381 19.381,14.5 18,14.5C16.619,14.5 15.5,13.381 15.5,12Z" />
      <path fill="currentColor" d="M8.5,6C8.5,7.381 9.619,8.5 11,8.5H12.5V3.5H11C9.619,3.5 8.5,4.619 8.5,6Z" />
      <path fill="currentColor" d="M12.5,14.5H11C9.619,14.5 8.5,15.619 8.5,17C8.5,18.381 9.619,19.5 11,19.5C12.381,19.5 13.5,18.381 13.5,17V14.5H12.5Z" />
      <path fill="currentColor" d="M8.5,12C8.5,13.381 9.619,14.5 11,14.5H12.5V9.5H11C9.619,9.5 8.5,10.619 8.5,12Z" />
      <path fill="currentColor" d="M17.5,6C17.5,7.381 16.381,8.5 15,8.5H14.5V3.5H15C16.381,3.5 17.5,4.619 17.5,6Z" />
    </svg>
  ),
  ACCESS: (
    <svg viewBox="0 0 24 24" className={styles.techSvgIcon}>
      <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M13,8H11V16H13V8M16,7V5H9L7,7V9H9V7H14V9H16V7Z" />
    </svg>
  )
};

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTech, setActiveTech] = useState(null);
  const heroRef = useRef(null);
  const parallaxRef = useRef(null);
  const { theme } = useTheme();
  
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
  
  // Determina estados baseados em métricas
  const currentStatus = STATUS.AVAILABLE;
  const experienceYears = new Date().getFullYear() - 2021;

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
  
  // Define as tecnologias com cores correspondentes
  const technologies = useMemo(() => [
    { name: 'React', color: '#61DAFB', icon: TECH_ICONS.REACT,  },
    { name: 'JavaScript', color: '#F7DF1E', icon: TECH_ICONS.JS, },
    { name: 'UI/UX', color: '#FF7EB6', icon: TECH_ICONS.UI,  },
    { name: 'Node.js', color: '#68A063', icon: TECH_ICONS.NODE,  },
    { name: 'CSS', color: '#264DE4', icon: TECH_ICONS.CSS,  },
    { name: 'HTML', color: '#E34F26', icon: TECH_ICONS.HTML,  },
    { name: 'Git', color: '#F05032', icon: TECH_ICONS.GIT, },
    { name: 'Figma', color: '#F24E1E', icon: TECH_ICONS.FIGMA,  },
    { name: 'Tillgänglighet', color: '#0D96F2', icon: TECH_ICONS.ACCESS,  },
  ], [experienceYears]);
  
  // Lista de frases para efeito de digitação - Traduzidas para sueco
  const phrases = useMemo(() => [
    'bygger intuitiva gränssnitt',
    'skapar minnesvärda upplevelser',
    'omvandlar idéer till kod',
    'utvecklar kreativa lösningar'
  ], []);
  
  // Dados de estatísticas - Traduzidos para sueco
  const stats = useMemo(() => [
    { number: `${experienceYears}+`, label: 'Års erfarenhet' },
    { number: '8+', label: 'Slutförda projekt' },
   
  ], [experienceYears]);
  
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
    
    // Ajuste aqui para o ID correto da sua seção de serviços ou projetos
    const targetSection = document.getElementById('services') || document.querySelector('.services');
    
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: noSmoothScroll ? 'auto' : 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: rolar para uma posição aproximada se não encontrar a seção
      window.scrollTo({
        top: window.innerHeight,
        behavior: noSmoothScroll ? 'auto' : 'smooth'
      });
    }
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
      
      {/* Conteúdo principal */}
      <div className={styles.heroContent}>
        {/* Texto do Hero */}
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
          
          {/* Subtítulo com efeito de digitação - Traduzido para sueco */}
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
                title={`${tech.name}: ${tech.years} års erfarenhet`}
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
          
          {/* Estatísticas - Traduzidas para sueco */}
          <div className={styles.statsContainer} aria-label="Karriärstatistik">
            {stats.map((stat, index) => (
              <React.Fragment key={index}>
                {index > 0 && <div className={styles.statDivider} aria-hidden="true"></div>}
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>{stat.number}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Imagem do Hero com efeitos 3D */}
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
      
      {/* Botão de rolagem para baixo - Traduzido para sueco */}
      <a 
        href="#services" 
        className={styles.heroScroll}
        onClick={scrollToWork}
        aria-label="Rulla till projektsektionen"
      >
        <div className={styles.scrollIcon} aria-hidden="true">
          <div className={styles.scrollDot}></div>
        </div>
        <span>Utforska</span>
      </a>
    </section>
  );
};

export default React.memo(Hero); // Usando memo para evitar renderizações desnecessárias