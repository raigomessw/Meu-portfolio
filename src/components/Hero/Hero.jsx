import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import styles from './Hero.module.css';
import profileImage from '../common/Image/profile.jpeg';

// Constantes para otimização
const PARTICLE_COUNT = {
  desktop: 15,
  mobile: 8
};

const STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  LIMITED: 'limited'
};

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const heroRef = useRef(null);
  const { theme } = useTheme();
  
  // Detectar largura da tela para determinar quantidade de partículas
  const isSmallScreen = useMemo(() => {
    return window.innerWidth <= 768;
  }, []);
  
  // Determina estados baseados em métricas
  const currentStatus = STATUS.AVAILABLE;
  const experienceYears = new Date().getFullYear() - 2022;
  
  // Gera partículas com propriedades aleatórias
  const particles = useMemo(() => {
    const particleCount = isSmallScreen ? PARTICLE_COUNT.mobile : PARTICLE_COUNT.desktop;
    
    return Array.from({ length: particleCount }).map((_, index) => {
      const size = Math.floor(Math.random() * 40) + 10; // 10px a 50px
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const duration = Math.floor(Math.random() * 15) + 15; // 15s a 30s
      const delay = Math.random() * 5; // 0s a 5s
      
      return { id: index, size, top, left, duration, delay };
    });
  }, [isSmallScreen]);
  
  // Define as tecnologias com cores correspondentes
  const technologies = useMemo(() => [
    { name: 'React', color: '#61DAFB', icon: '⚛️' },
    { name: 'JavaScript',  color: '#F7DF1E', icon: '🟨' },
    { name: 'UI/UX',  color: '#FF7EB6', icon: '🎨' },
    { name: 'Node.js', color: '#68A063', icon: '🟩' },
    { name: 'CSS', color: '#264DE4', icon: '🎨' },
    { name: 'HTML', color: '#E34F26', icon: '📄' },
    { name: 'Git', color: '#F05032', icon: '🗂️' },
    { name: 'Figma', color: '#F24E1E', icon: '🎨' },
    { name: 'Web Accessibility', color: '#000000', icon: '♿' },
  ], []);
  
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
    { number: '6+', label: 'Slutförda projekt' },
  ], [experienceYears]);
  
  // Efeito de animação de entrada com IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Efeito de digitação de texto
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    // Verificar se o usuário prefere menos movimento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
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
  }, [typedText, currentPhraseIndex, isDeleting, phrases]);
  
  // Efeito para definir quando a animação de digitação termina
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTypingComplete(true);
    }, 6000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Função otimizada para scroll suave
  const scrollToWork = useCallback((e) => {
    e.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Ajuste aqui para o ID correto da sua seção de serviços ou projetos
    const targetSection = document.getElementById('services') || document.querySelector('.services');
    
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: rolar para uma posição aproximada se não encontrar a seção
      window.scrollTo({
        top: window.innerHeight,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }
  }, []);

  return (
    <section 
      ref={heroRef} 
      className={`${styles.hero} ${visible ? styles.visible : ''}`}
      id="hero"
      aria-label="Huvudsektion"
    >
      {/* Background com gradiente animado */}
      <div 
        className={styles.heroBackground} 
        aria-hidden="true"
      ></div>
      
      {/* Partículas decorativas */}
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
              '--duration': `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Badge de disponibilidade  */}
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
          {/* Badge de experiência - Traduzido */}
          <div className={styles.experienceBadge} aria-label={`${experienceYears}+ års erfarenhet av webbutveckling`}>
            <span className={styles.badgeIcon} aria-hidden="true">⭐</span>
            <span>{experienceYears}+ års erfarenhet</span>
          </div>
          
          {/* Título principal - Traduzido */}
          <h1 className={styles.heroTitle}>
            <span className={styles.greeting}>Hej, jag är Rai</span>
            <span className={styles.profession}>
              En <span className={styles.highlight}>utvecklare</span> Web Developer & UI/UX-designer
            </span>
          </h1>
          
          {/* Subtítulo com efeito de digitação - Traduzido */}
          <p className={styles.heroSubtitle}>
            Specialiserad på {typedText}
            <span 
              className={styles.cursor} 
              aria-hidden="true"
              style={{ opacity: isDeleting ? 0.7 : 1 }}
            ></span>
          </p>
          
          {/* Tech Stack */}
          <div className={styles.techStack} aria-label="Mina huvudteknologier">
            {technologies.map((tech, index) => (
              <div 
                key={index}
                className={styles.techBadge}
                style={{ '--tech-color': tech.color }}
                title={`${tech.name}: ${tech.years} års erfarenhet`}
              >
                <span className={styles.techIcon} aria-hidden="true">{tech.icon}</span>
                <div className={styles.techDetails}>
                  <span className={styles.techName}>{tech.name}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Botões de ação - Traduzidos */}
          <div className={styles.heroActions}>
            <Link to="/contact" className={styles.primaryButton}>
              <span>Kontakta mig</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/work" className={styles.secondaryButton}>
              <span>Se projekt</span>
            </Link>
          </div>
          
          {/* Estatísticas */}
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
        
        {/* Imagem do Hero */}
        <div className={styles.heroImageContainer}>
          <div className={styles.imageWrapper}>
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
        </div>
      </div>
      
      {/* Botão de rolagem para baixo */}
<a 
  href="#services" // Altere para o ID correto da sua seção
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