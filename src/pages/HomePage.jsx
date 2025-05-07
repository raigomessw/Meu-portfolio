import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/Hero/Hero';
import Services from '../components/Services/Services';
import WorkSection from '../components/Work/WorkSection';
import styles from './Home.module.css';
import { WorkProjectProvider } from '../components/Work/WorkProjectContext';

function HomePage() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [servicesVisible, setServicesVisible] = useState(false);
  const [workVisible, setWorkVisible] = useState(false);
  
  const homeRef = useRef(null);
  const servicesRef = useRef(null);
  const workRef = useRef(null);
  
  // Função para detectar elementos visíveis na tela
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    // Função de callback para o observer
    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Identifica qual seção ficou visível
          if (entry.target === homeRef.current) {
            setHeroVisible(true);
          } else if (entry.target === servicesRef.current) {
            setServicesVisible(true);
          } else if (entry.target === workRef.current) {
            setWorkVisible(true);
          }
          
          // Opcionalmente, desconecta o observer após a animação da seção
          // observer.unobserve(entry.target);
        }
      });
    };
    
    // Criar o observer
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observar as seções
    if (homeRef.current) observer.observe(homeRef.current);
    if (servicesRef.current) observer.observe(servicesRef.current);
    if (workRef.current) observer.observe(workRef.current);
    
    // Limpeza
    return () => {
      if (homeRef.current) observer.unobserve(homeRef.current);
      if (servicesRef.current) observer.unobserve(servicesRef.current);
      if (workRef.current) observer.unobserve(workRef.current);
    };
  }, []);
  
  return (
    <div className={styles.homePage}>
      {/* Background comum para toda a página */}
      <div className={styles.sectionBackground}>
        <div className={styles.gradientLayer}></div>
        <div className={styles.patternGrid}></div>
      </div>
      
      {/* Seção Hero */}
      <div ref={homeRef} className={heroVisible ? 'visible' : ''}>
        <Hero />
      </div>
      
      {/* Seção Services */}
      <div 
        ref={servicesRef} 
        className={`${styles.sectionWrapper} ${servicesVisible ? styles.visible : ''}`}
        id="services"
      >
        <Services />
      </div>
      
      {/* Seção Work */}
      <WorkProjectProvider>
        <div 
          ref={workRef} 
          className={`${styles.sectionWrapper} ${workVisible ? styles.visible : ''}`}
          id="work"
        >
          <WorkSection />
        </div>
      </WorkProjectProvider>
    </div>
  );
}

export default HomePage;