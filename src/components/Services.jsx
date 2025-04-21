import React, { useRef, useEffect, useState } from 'react';
import styles from './Services.module.css';

function Services() {
  const services = [
    {
      title: "Digital Strategy",
      description: "Data-driven approaches to maximize your digital presence",
      accent: "rgba(255, 107, 107, 1)"
    },
    {
      title: "Experience Design",
      description: "Immersive interfaces that captivate and convert",
      accent: "rgba(78, 205, 196, 1)"
    },
    {
      title: "Brand Evolution",
      description: "Transform your visual identity for the digital age",
      accent: "rgba(255, 190, 11, 1)"
    },
    {
      title: "Tech Innovation",
      description: "Cutting-edge solutions for tomorrow's challenges",
      accent: "rgba(131, 56, 236, 1)"
    }
  ];

  // Refs para elementos DOM
  const containerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeCard, setActiveCard] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Observer para detectar quando a seção entra na viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Efeito de movimento de fundo com mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      setMousePosition({ x, y });
      
      // Movimento sutil do fundo
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', x.toFixed(2));
        containerRef.current.style.setProperty('--mouse-y', y.toFixed(2));
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Efeito de card flutuante e rotação 3D
  useEffect(() => {
    const handleCardMovement = (e) => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        const distanceX = (e.clientX - cardCenterX) / rect.width;
        const distanceY = (e.clientY - cardCenterY) / rect.height;
        
        // Calcula a distância do mouse até o centro do card
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Se o mouse estiver próximo o suficiente, aplica o efeito 3D
        if (distance < 0.6) {
          const rotateY = distanceX * 10; // Rotação no eixo Y (esquerda/direita)
          const rotateX = -distanceY * 10; // Rotação no eixo X (cima/baixo)
          
          card.style.transform = `
            perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(10px)
            scale(1.03)
          `;
          
          // Efeito de brilho em relação à posição do mouse
          const xPos = (e.clientX - rect.left);
          const yPos = (e.clientY - rect.top);
          card.style.setProperty('--x-pos', `${xPos}px`);
          card.style.setProperty('--y-pos', `${yPos}px`);
          card.classList.add(styles.activeShine);
        } else {
          // Reset quando o mouse está longe
          card.style.transform = '';
          card.classList.remove(styles.activeShine);
        }
      });
    };
    
    window.addEventListener('mousemove', handleCardMovement);
    return () => window.removeEventListener('mousemove', handleCardMovement);
  }, []);

  // Efeito de scroll para animação dos elementos
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = 1 - Math.max(0, Math.min(1, rect.top / window.innerHeight));
      
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        
        // Diferencia o timing de cada card com base no índice
        const delay = index * 0.1;
        const cardAnimProgress = Math.max(0, Math.min(1, (scrollProgress - delay) * 2));
        
        if (cardAnimProgress > 0) {
          // Aplica uma transformação baseada no progresso do scroll
          card.style.opacity = cardAnimProgress;
          card.style.transform = `translateY(${(1 - cardAnimProgress) * 50}px)`;
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Inicia com os valores corretos
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efeito de hover em cards
  const handleCardHover = (index) => {
    setActiveCard(index);
  };
  
  const handleCardLeave = () => {
    setActiveCard(null);
  };

  return (
    <section 
      id="services" 
      className={`${styles.container} ${isInView ? styles.inView : ''}`}
      ref={containerRef}
    >
      <div className={styles.bgEffect}></div>
      
      <div className={styles.header}>
        <h2 className={styles.title}>Elevate Your Digital Presence</h2>
        <p className={styles.subtitle}>Next-generation solutions with cutting-edge design</p>
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
          >
            <div 
              ref={el => cardRefs.current[index] = el}
              className={`${styles.card} ${activeCard === index ? styles.active : ''}`}
            >
              <div className={styles.cardGlow}></div>
              <div className={styles.cardContent}>
                <div className={styles.cardIcon}>
                  {index === 0 && <span className={styles.iconSymbol}>📊</span>}
                  {index === 1 && <span className={styles.iconSymbol}>🎨</span>}
                  {index === 2 && <span className={styles.iconSymbol}>✨</span>}
                  {index === 3 && <span className={styles.iconSymbol}>🚀</span>}
                </div>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDescription}>{service.description}</p>
                <div className={styles.cardButton}>Learn more</div>
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