import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';

function Services() {
  // Dados dos serviços em sueco, usando os nomes baseados nos arquivos
  const services = [
    {
      title: "Marknadsundersökning",
      description: "Förstå marknadstrender och konkurrenslandskapet för att informera dina produktbeslut",
      accent: "rgba(255, 107, 107, 1)",
      slug: "market-research",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M18 12l-3-3-4 4-3-3" />
          <path d="M18 8v4h-4" />
          <circle cx="8.5" cy="8.5" r="1" />
          <circle cx="15.5" cy="15.5" r="1" />
          <circle cx="12.5" cy="12.5" r="1" />
        </svg>
      )
    },
    {
      title: "Användarundersökning",
      description: "Upptäck användarbehov, beteenden och smärtpunkter för att skapa bättre användarupplevelser",
      accent: "rgba(78, 205, 196, 1)",
      slug: "user-research",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <path d="M13 16l-2 3 3 2" />
        </svg>
      )
    },
    {
      title: "MVP & Prototyping",
      description: "Skapa interaktiva prototyper för att testa koncept och minimera produktrisker",
      accent: "rgba(255, 190, 11, 1)",
      slug: "mvp-prototyping",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <path d="M6 8h.01" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M17 8l-3 3-3-3" />
        </svg>
      )
    },
    {
      title: "Designvalidering",
      description: "Testa designer och iterera baserat på användarfeedback för att säkerställa produktsuccess",
      accent: "rgba(131, 56, 236, 1)",
      slug: "design-validation",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
          <path d="M9 17l-2-2-4 4" />
          <rect x="13" y="2" width="6" height="6" rx="1" />
          <path d="M14 9v3a2 2 0 0 0 2 2h3" />
        </svg>
      )
    }
  ];

  // Refs e estados
  const containerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const [isInView, setIsInView] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Detectar quando a seção está visível no viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  // Detectar se é um dispositivo touch
  useEffect(() => {
    const checkTouch = () => {
      const isTouch = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        navigator.msMaxTouchPoints > 0;
      
      setIsTouchDevice(isTouch);
      
      if (isTouch) {
        document.body.classList.add('touch-device');
      } else {
        document.body.classList.remove('touch-device');
      }
    };
    
    checkTouch();
    window.addEventListener('resize', checkTouch);
    
    return () => {
      window.removeEventListener('resize', checkTouch);
    };
  }, []);
  
  // Configurar efeitos de card quando estiver visível
  useEffect(() => {
    if (!isInView || isTouchDevice) return;
    
    const handleMouseMove = (e) => {
      // Efeito de movimento 3D suave para toda a seção
      const cards = cardRefs.current;
      
      cards.forEach((card, index) => {
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Aplicar variáveis CSS para posição do mouse
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calcular o deslocamento do cursor em relação ao centro
        const offsetX = (x - centerX) / centerX;
        const offsetY = (y - centerY) / centerY;
        
        // Verificar se o card está ativo
        if (activeCard === index) {
          // Aplicar transformação 3D ao card ativo quando o mouse move
          card.style.transform = `
            perspective(1000px) 
            rotateY(${offsetX * 5}deg) 
            rotateX(${offsetY * -5}deg) 
            translateZ(10px)
          `;
          
          // Atualizar posição do mouse para efeitos dinâmicos
          setMousePosition({ x, y });
        }
      });
    };
    
    const handleMouseLeave = () => {
      // Resetar transformações quando o mouse sai da área
      cardRefs.current.forEach(card => {
        if (!card) return;
        card.style.transform = '';
      });
      
      setActiveCard(null);
    };
    
    // Adicionar listeners aos cards
    const cardsContainer = cardsContainerRef.current;
    if (cardsContainer) {
      cardsContainer.addEventListener('mousemove', handleMouseMove);
      cardsContainer.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (cardsContainer) {
        cardsContainer.removeEventListener('mousemove', handleMouseMove);
        cardsContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isInView, isTouchDevice, activeCard]);
  
  // Iniciar refs para os cards
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, services.length);
  }, [services]);
  
  // Função para lidar com hover no card
  const handleCardHover = (index) => {
    if (isTouchDevice) return;
    setActiveCard(index);
  };
  
  // Função para lidar com o fim do hover
  const handleCardLeave = () => {
    if (isTouchDevice) return;
    setActiveCard(null);
  };
  
  // Função para acessibilidade com teclado
  const handleKeyDown = (e, index) => {
    // Ativar card com Enter ou Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveCard(index);
    }
  };

  return (
    <section 
      id="services" 
      className={`${styles.container} ${isInView ? styles.inView : ''}`}
      ref={containerRef}
      aria-label="UX-designtjänster"
    >
      {/* Elementos de background */}
      <div className={styles.bgEffect} aria-hidden="true"></div>
      <div className={styles.bgTexture} aria-hidden="true"></div>
      
      {/* Círculos animados */}
      <div className={`${styles.bgCircle} ${styles.circle1}`} aria-hidden="true"></div>
      <div className={`${styles.bgCircle} ${styles.circle2}`} aria-hidden="true"></div>
      <div className={`${styles.bgCircle} ${styles.circle3}`} aria-hidden="true"></div>
      <div className={`${styles.bgCircle} ${styles.circle4}`} aria-hidden="true"></div>
      
      <div className={styles.header}>
        <h2 className={styles.title}>UX-designtjänster</h2>
        <p className={styles.subtitle}>Användarcentrerad design för slagkraftiga digitala produkter</p>
      </div>

      <div className={styles.cardsContainer} ref={cardsContainerRef}>
        {services.map((service, index) => (
          <div 
            key={index} 
            className={`${styles.cardWrapper} ${isInView ? styles.visible : ''}`}
            style={{ 
              '--delay': `${index * 0.1}s`, 
              '--accent-color': service.accent,
              '--accent-color-rgb': service.accent.match(/[\d.]+/g).join(',')
            }}
            onMouseEnter={() => handleCardHover(index)}
            onMouseLeave={handleCardLeave}
            tabIndex="0"
            role="button"
            aria-label={`Tjänst: ${service.title}`}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <div 
              ref={el => cardRefs.current[index] = el}
              className={`${styles.card} ${activeCard === index ? styles.active : ''} ${isTouchDevice ? styles.touchDevice : ''}`}
              style={
                activeCard === index 
                  ? { 
                      '--mouse-x': `${mousePosition.x}px`, 
                      '--mouse-y': `${mousePosition.y}px` 
                    } 
                  : {}
              }
            >
              {/* Efeito de brilho interno */}
              <div className={styles.cardGlow}></div>
              
              <div className={styles.cardContent}>
                <div className={styles.cardIcon} style={{ color: service.accent }}>
                  {service.icon}
                </div>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDescription}>{service.description}</p>
                
                <div className={styles.cardFooter}>
                  <Link 
                    to={`/services/${service.slug}`} 
                    className={styles.learnMoreBtn}
                    aria-label={`Läs mer om ${service.title}`}
                  >
                    <span>Läs mer</span>
                    <svg className={styles.arrowIcon} width="16" height="16" viewBox="0 0 20 20">
                      <path d="M10 3L16 10L10 17L8.6 15.6L12.2 12H4V8H12.2L8.6 4.4L10 3Z" fill="currentColor" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Efeito de brilho que segue o cursor */}
              <div className={`${styles.cardShine} ${activeCard === index ? styles.activeShine : ''}`}
                style={{
                  '--x-pos': activeCard === index ? `${(mousePosition.x / cardRefs.current[index]?.offsetWidth) * 100}%` : '50%',
                  '--y-pos': activeCard === index ? `${(mousePosition.y / cardRefs.current[index]?.offsetHeight) * 100}%` : '50%'
                }}
              ></div>
              
              {/* Borda com gradiente */}
              <div className={styles.cardBorder}></div>
            </div>
            
            {/* Efeito de reflexo */}
            <div className={styles.cardReflection} style={{ '--accent-color': service.accent }}></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;