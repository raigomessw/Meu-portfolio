import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { throttle, detectDeviceCapability } from '../../../utils/performance';
import styles from './Navbar.module.css';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef(null);
  const lastScrollY = useRef(0);
  const location = useLocation();
  
  // Detectar capacidades do dispositivo
  const deviceCaps = detectDeviceCapability();
  
  // Definir seção ativa com base na rota atual
  useEffect(() => {
    const path = location.pathname === '/' ? 'home' : location.pathname.substring(1);
    setActiveSection(path);
  }, [location]);
  
  // Definir estado do scroll
  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      
      // Decidir se mostrar/ocultar navbar baseado na direção do scroll
      // e evitar mudanças de estado desnecessárias
      const shouldScrollUp = lastScrollY.current > currentScrollY || currentScrollY < 100;
      const shouldReflectScrolled = currentScrollY > 50;
      
      // Atualizar state de scroll apenas se mudou
      if ((shouldReflectScrolled && !isScrolled) || (!shouldReflectScrolled && isScrolled)) {
        requestAnimationFrame(() => {
          setIsScrolled(shouldReflectScrolled);
        });
      }
      
      // Atualizar classes diretamente sem rerenderização
      if (navRef.current) {
        if (!shouldScrollUp) {
          navRef.current.classList.add(styles.navbarHidden);
        } else {
          navRef.current.classList.remove(styles.navbarHidden);
        }
      }
      
      lastScrollY.current = currentScrollY;
    }, 100); // Limitar a 10 execuções por segundo
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Executar uma vez para inicialização
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);
  
  // Otimização: Identificar a seção atual durante scroll
  useEffect(() => {
    if (location.pathname !== '/') return;
    
    const handleSectionDetection = throttle(() => {
      // Obter todas as seções da página
      const sections = ['home', 'about', 'services', 'work', 'contact'];
      
      // Encontrar a seção mais próxima do topo da viewport
      let currentSection = '';
      let minDistance = Infinity;
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const absDistance = Math.abs(rect.top);
          
          if (absDistance < minDistance) {
            minDistance = absDistance;
            currentSection = section;
          }
        }
      });
      
      // Só atualizar o state se a seção mudou
      if (currentSection && currentSection !== activeSection) {
        requestAnimationFrame(() => {
          setActiveSection(currentSection);
        });
      }
    }, 200);
    
    window.addEventListener('scroll', handleSectionDetection, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleSectionDetection);
    };
  }, [location.pathname, activeSection]);
  
  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      // Bloquear scroll quando menu está aberto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = '';
      setIsMobileMenuOpen(false);
    }
  };
  
  return (
    <nav 
      className={`${styles.navbar} 
        ${isScrolled ? styles.navbarScrolled : ''} 
        ${isMobileMenuOpen ? styles.menuOpen : ''}
        ${deviceCaps.shouldUseReducedEffects ? styles.reducedMotion : ''}`}
      ref={navRef}
      aria-label="Main navigation"
    >
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" onClick={closeMobileMenu}>
            <span className={styles.logoText}>Rai</span>
            <span className={styles.logoAccent}>.</span>
          </Link>
        </div>
        
        <button 
          className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.open : ''}`}
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Navigation menu"
          aria-controls="navbar-menu"
        >
          <span className={styles.menuBar}></span>
          <span className={styles.menuBar}></span>
          <span className={styles.menuBar}></span>
        </button>
        
        <div 
          className={`${styles.navMenu} ${isMobileMenuOpen ? styles.open : ''}`}
          id="navbar-menu"
        >
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link 
                to="/" 
                className={`${styles.navLink} ${activeSection === 'home' ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            
            <li className={styles.navItem}>
              <Link 
                to="/about" 
                className={`${styles.navLink} ${activeSection === 'about' ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                About
              </Link>
            </li>
            
            <li className={styles.navItem}>
              <Link 
                to="/work" 
                className={`${styles.navLink} ${activeSection === 'work' ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                Projects
              </Link>
            </li>
            
            <li className={styles.navItem}>
              <Link 
                to="/contact" 
                className={`${styles.navLink} ${activeSection === 'contact' ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;