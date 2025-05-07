import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/Hero/Hero';
import Services from '../components/Services/Services';
import WorkSection from '../components/Work/WorkSection';
import styles from './Home.module.css';
import { WorkProjectProvider } from '../components/Work/WorkProjectContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

function HomePage() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [servicesVisible, setServicesVisible] = useState(false);
  const [workVisible, setWorkVisible] = useState(false);
  
  const homeRef = useRef(null);
  const servicesRef = useRef(null);
  const workRef = useRef(null);
  const decorElementsRef = useRef([]);
  
  // Verificar preferência de movimento reduzido
  const prefersReducedMotion = useReducedMotion();
  
  // Função para detectar elementos visíveis na tela com melhorias
  useEffect(() => {
    // Para dispositivos com movimento reduzido, tornamos tudo visível imediatamente
    if (prefersReducedMotion) {
      setHeroVisible(true);
      setServicesVisible(true);
      setWorkVisible(true);
      return;
    }
    
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
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
          
          // Desconecta o observer após a animação da seção
          observer.unobserve(entry.target);
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
  }, [prefersReducedMotion]);
  
  // Configura efeitos parallax para elementos decorativos
  useEffect(() => {
    // Não aplicar efeitos parallax se usuário prefere movimento reduzido
    if (prefersReducedMotion) return;
    
    // Capturar elementos decorativos e configurar parallax
    const decorElements = document.querySelectorAll(`.${styles.parallaxElement}`);
    if (!decorElements || decorElements.length === 0) return;
    
    decorElementsRef.current = Array.from(decorElements);
    
    // Função para gerenciar efeito parallax com throttle
    let lastKnownScrollY = window.scrollY;
    let ticking = false;
    
    const onScroll = () => {
      lastKnownScrollY = window.scrollY;
      requestTick();
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    
    const updateParallax = () => {
      const scrollY = lastKnownScrollY;
      
      decorElementsRef.current.forEach((el, index) => {
        // Fator de velocidade diferente para cada elemento
        const speed = parseFloat(el.dataset.speed || (0.1 + (index * 0.05)));
        const yPos = -(scrollY * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
      
      ticking = false;
    };
    
    // Adicionar listener de scroll com opção passive para melhor performance
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Executar inicialmente
    requestTick();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [prefersReducedMotion]);
  
  return (
    <div className={styles.homePage}>
      {/* Background comum para toda a página */}
      <div className={`${styles.sectionBackground} ${heroVisible ? styles.visible : ''}`}>
        <div className={styles.gradientLayer}></div>
        <div className={styles.patternGrid}></div>
        
        {/* Elementos decorativos com efeito parallax */}
        <div 
          className={`${styles.parallaxElement} ${styles.floatingElement}`} 
          data-speed="0.05"
          style={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110, 7, 243, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        ></div>
        
        <div 
          className={`${styles.parallaxElement} ${styles.floatingElement}`} 
          data-speed="0.08"
          style={{
            position: 'absolute',
            top: '60%',
            right: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110, 7, 243, 0.1) 0%, transparent 70%)',
            filter: 'blur(50px)'
          }}
        ></div>
        
        <div 
          className={`${styles.parallaxElement} ${styles.floatingElement}`} 
          data-speed="0.12"
          style={{
            position: 'absolute',
            top: '40%',
            left: '70%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110, 7, 243, 0.12) 0%, transparent 70%)',
            filter: 'blur(30px)'
          }}
        ></div>
      </div>
      
      {/* Seção Hero */}
      <div 
        ref={homeRef} 
        className={`${heroVisible ? styles.visible : ''}`}
        id="hero"
      >
        <Hero />
      </div>
      
      {/* Seção Services */}
      <div 
        ref={servicesRef} 
        className={`${styles.sectionWrapper} ${servicesVisible ? styles.visible : ''}`}
        id="services"
      >
        {/* Título da seção com animação escalonada */}
        <div className={`${styles.preHeading} ${styles.staggerItem}`}>Tjänster</div>
        <h2 className={`${styles.sectionTitle} ${styles.staggerItem}`}>Hur jag kan hjälpa dig</h2>
        <p className={`${styles.sectionSubtitle} ${styles.staggerItem}`}>
          Jag erbjuder specialiserade UX/UI-designtjänster för att hjälpa företag att skapa
          exceptionella och slagkraftiga digitala upplevelser.
        </p>
        
        <Services />
        
        {/* Botão de navegação com efeito premium */}
        <div className={styles.sectionNav}>
          <a href="#work" className={styles.navButton}>
            Se mitt arbete
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3L14 8L8 13M14 8H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
      
      {/* Seção Work */}
      <WorkProjectProvider>
        <div 
          ref={workRef} 
          className={`${styles.sectionWrapper} ${workVisible ? styles.visible : ''}`}
          id="work"
        >
          {/* Título da seção com animação escalonada */}
          <div className={`${styles.preHeading} ${styles.staggerItem}`}>Portfölj</div>
          <h2 className={`${styles.sectionTitle} ${styles.staggerItem}`}>Utvalda projekt</h2>
          <p className={`${styles.sectionSubtitle} ${styles.staggerItem}`}>
            Utforska några av mina senaste projekt, från mobilapplikationer
            till företagssystem och webbplatser.
          </p>
          
          <WorkSection />
        </div>
      </WorkProjectProvider>
    </div>
  );
}

export default HomePage;