import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';

function Services() {
  const services = [
    {
      title: "Market Research",
      description: "Understand market trends and competitor landscape",
      accent: "rgba(255, 107, 107, 1)",
      slug: "market-research",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="1em" height="1em">
          <path d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"/>
        </svg>
      )
    },
    {
      title: "User Research",
      description: "Discover user needs, behaviors and pain points",
      accent: "rgba(78, 205, 196, 1)",
      slug: "user-research",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" width="1em" height="1em">
          <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352h117.4C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"/>
        </svg>
      )
    },
    {
      title: "MVP & Prototyping",
      description: "Create interactive prototypes to test concepts",
      accent: "rgba(255, 190, 11, 1)",
      slug: "mvp-prototyping",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em">
          <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
        </svg>
      )
    },
    {
      title: "Design Validation",
      description: "Test designs and iterate based on user feedback",
      accent: "rgba(131, 56, 236, 1)",
      slug: "design-validation",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
        </svg>
      )
    }
  ];

  const containerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeCard, setActiveCard] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Observer para detectar quando a seção entra na viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.25 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    // Detecta se estamos em um dispositivo touch
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouch();
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Efeito para rastreamento de mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (activeCard !== null && cardRefs.current[activeCard]) {
        const card = cardRefs.current[activeCard];
        const rect = card.getBoundingClientRect();
        
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeCard]);

  // Funções de manipulação de interação
  const handleCardHover = (index) => {
    setActiveCard(index);
  };

  const handleCardLeave = () => {
    setActiveCard(null);
  };

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
      aria-label="UX Design Services"
    >
      <div className={styles.bgEffect}></div>
      
      <div className={styles.header}>
        <h2 className={styles.title}>UX Design Services</h2>
        <p className={styles.subtitle}>User-centered design for impactful digital products</p>
      </div>

      <div className={styles.cardsContainer} ref={cardsContainerRef}>
        {services.map((service, index) => (
          <div 
            key={index} 
            className={`${styles.cardWrapper} ${isInView ? styles.visible : ''}`}
            style={{ 
              '--delay': `${index * 0.1}s`, 
              '--accent-color': service.accent 
            }}
            onMouseEnter={() => handleCardHover(index)}
            onMouseLeave={handleCardLeave}
            tabIndex="0"
            role="button"
            aria-label={`Service: ${service.title}`}
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
                    aria-label={`Learn more about ${service.title}`}
                  >
                    Learn more
                    <svg className={styles.arrowIcon} width="20" height="20" viewBox="0 0 20 20">
                      <path d="M10 3L16 10L10 17L8.6 15.6L12.2 12H4V8H12.2L8.6 4.4L10 3Z" fill="currentColor" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Brilho que segue o cursor */}
              <div className={styles.cardShine}></div>
              
              {/* Bordas com glow */}
              <div className={styles.cardBorder}></div>
            </div>
            
            {/* Efeito de reflexo atualizado */}
            <div className={styles.cardReflection} style={{ '--accent-color': service.accent }}></div>
          </div>
        ))}
      </div>
      
      {/* Círculos de fundo animados */}
      <div className={`${styles.bgCircle} ${styles.circle1}`}></div>
      <div className={`${styles.bgCircle} ${styles.circle2}`}></div>
      <div className={`${styles.bgCircle} ${styles.circle3}`}></div>
    </section>
  );
}

export default Services;