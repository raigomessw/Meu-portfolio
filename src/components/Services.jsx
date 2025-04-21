import React, { useRef, useEffect } from 'react';
import styles from './Services.module.css';

function Services() {
  const services = [
    {
      title: "Digital Strategy",
      description: "Data-driven approaches to maximize your digital presence",
      accent: "rgba(255, 107, 107, 1)" // Mudado para formato RGBA completo
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

  const containerRef = useRef(null);
  const mirrorRefs = useRef([]);

  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      // Limpa o timeout anterior se ainda estiver pendente
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Define um pequeno atraso antes de processar o scroll
      scrollTimeout = setTimeout(() => {
        const container = containerRef.current;
        if (!container) return;
        
        // Obtém a posição do container em relação à janela
        const rect = container.getBoundingClientRect();
        const containerTop = rect.top;
        const containerHeight = container.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calcula o progresso do scroll como percentual (0 a 1)
        // 0 quando o topo do container está na parte inferior da janela
        // 1 quando o fundo do container está no topo da janela
        const scrollProgress = Math.max(0, Math.min(1, 1 - (containerTop / (containerHeight + windowHeight))));

        // Aplica o efeito a cada espelho
        mirrorRefs.current.forEach((mirror, index) => {
          if (!mirror) return;
          
          const offset = index * 0.1;
          const mirrorProgress = Math.max(0, Math.min(0.5, scrollProgress - offset)); // Limitado a 0.5 para efeito mais suave
          const blurAmount = Math.min(5, mirrorProgress * 10);
          const opacity = Math.max(0.3, 1 - mirrorProgress * 0.8);
          
          mirror.style.setProperty('--blur-amount', `${blurAmount}px`);
          mirror.style.opacity = opacity;
          mirror.style.transform = `translateY(${mirrorProgress * 20}px) scale(${1 - mirrorProgress * 0.05})`;
        });
      }, 10); // Pequeno atraso para suavizar
    };

    // Executa handleScroll uma vez para configurar o estado inicial
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Limpa event listeners ao desmontar
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  return (
    <section id="services" className={styles.container} ref={containerRef}>
      <div className={styles.header}>
        <h2 className={styles.title}>Elevate Your Digital Presence</h2>
        <p className={styles.subtitle}>Next-generation solutions with cutting-edge design</p>
      </div>

      <div className={styles.cardsContainer}>
        {services.map((service, index) => (
          <div key={index} className={styles.cardWrapper}>
            <div 
              className={styles.card}
              style={{ '--accent-color': service.accent }}
            >
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
            <div 
              ref={el => mirrorRefs.current[index] = el}
              className={styles.mirror}
              style={{ '--accent-color': service.accent }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;