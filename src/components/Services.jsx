import React, { useRef, useEffect } from 'react';
import styles from './Services.module.css';

function Services() {
  const services = [
    {
      title: "Digital Strategy",
      description: "Data-driven approaches to maximize your digital presence",
      accent: "#FF6B6B"
    },
    {
      title: "Experience Design",
      description: "Immersive interfaces that captivate and convert",
      accent: "#4ECDC4"
    },
    {
      title: "Brand Evolution",
      description: "Transform your visual identity for the digital age",
      accent: "#FFBE0B"
    },
    {
      title: "Tech Innovation",
      description: "Cutting-edge solutions for tomorrow's challenges",
      accent: "#8338EC"
    }
  ];

  const containerRef = useRef(null);
  const mirrorRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY } = window;
      const container = containerRef.current;
      
      if (!container) return;
      
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const scrollProgress = (scrollY - containerTop) / containerHeight;

      mirrorRefs.current.forEach((mirror, index) => {
        if (!mirror) return;
        
        const offset = index * 0.1;
        const mirrorProgress = Math.max(0, scrollProgress - offset);
        const blurAmount = Math.min(8, mirrorProgress * 20);
        const opacity = 1 - mirrorProgress * 0.8;
        
        mirror.style.setProperty('--blur-amount', `${blurAmount}px`);
        mirror.style.opacity = opacity;
        mirror.style.transform = `translateY(${mirrorProgress * 50}px) scale(${1 - mirrorProgress * 0.05})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.container} ref={containerRef}>
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