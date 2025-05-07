import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';
import { MarketResearchIcon, UserResearchIcon, MVPPrototypingIcon, DesignValidationIcon } from './ServiceIcons';

function Services() {
  // Dados dos serviços em sueco, usando os nomes baseados nos arquivos
  const services = [
    {
      title: "Marknadsundersökning",
      description: "Förstå marknadstrender och konkurrenslandskapet för att informera dina produktbeslut",
      accent: "rgba(255, 107, 107, 1)",
      slug: "market-research",
      icon: <MarketResearchIcon />
    },
    {
      title: "Användarundersökning",
      description: "Upptäck användarbehov, beteenden och smärtpunkter för att skapa bättre användarupplevelser",
      accent: "rgba(78, 205, 196, 1)",
      slug: "user-research",
      icon: <UserResearchIcon />
    },
    {
      title: "MVP & Prototyping",
      description: "Skapa interaktiva prototyper för att testa koncept och minimera produktrisker",
      accent: "rgba(255, 190, 11, 1)",
      slug: "mvp-prototyping",
      icon: <MVPPrototypingIcon />
    },
    {
      title: "Designvalidering",
      description: "Testa designer och iterera baserat på användarfeedback för att säkerställa produktsuccess",
      accent: "rgba(131, 56, 236, 1)",
      slug: "design-validation",
      icon: <DesignValidationIcon />
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