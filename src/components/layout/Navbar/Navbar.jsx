import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = React.memo(function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const lastScrollTop = useRef(0);
  const ticking = useRef(false);
  
  // Detectar recursos do dispositivo com mais precisão
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  // Otimizar evento de scroll com RAF e throttling
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 20);
        
        // Auto-esconder navbar em scroll down em mobile (DESATIVADO TEMPORARIAMENTE)
        /* if (isMobile && scrollTop > 100) {
          const isScrollDown = scrollTop > lastScrollTop.current;
          if (navRef.current) {
            navRef.current.style.transform = isScrollDown 
              ? 'translate3d(-50%, -100px, 0)' 
              : 'translate3d(-50%, 0, 0)';
          }
        } */
        
        lastScrollTop.current = scrollTop;
        ticking.current = false;
      });
      
      ticking.current = true;
    }
  }, [isMobile]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  // Atualizar seção ativa com base na URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveSection('home');
    else if (path.includes('/about')) setActiveSection('about');
    else if (path.includes('/work')) setActiveSection('work');
    else if (path.includes('/contact')) setActiveSection('contact');
  }, [location]);
  
  // Melhorar toggle de menu com tratamento específico para dispositivos móveis
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => {
      const newState = !prev;
      document.body.style.overflow = newState ? 'hidden' : '';
      
      // Adicionar toque fora para fechar em dispositivos móveis
      if (newState && isMobile) {
        setTimeout(() => {
          document.addEventListener('touchstart', handleOutsideClick);
        }, 300);
      }
      
      return newState;
    });
  }, [isMobile]);
  
  // Fechar menu ao tocar fora
  const handleOutsideClick = useCallback((e) => {
    if (navRef.current && !navRef.current.contains(e.target)) {
      setIsMobileMenuOpen(false);
      document.body.style.overflow = '';
      document.removeEventListener('touchstart', handleOutsideClick);
    }
  }, []);
  
  // Fechar menu ao clicar em um link
  const closeMobileMenu = useCallback(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = '';
      setIsMobileMenuOpen(false);
      document.removeEventListener('touchstart', handleOutsideClick);
    }
  }, [isMobileMenuOpen, handleOutsideClick]);
  
  // Detectar orientação para ajustes de layout
  useEffect(() => {
    const handleOrientationChange = () => {
      if (isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [isMobileMenuOpen, closeMobileMenu]);
  
  // Detectar recursos do dispositivo
  const deviceCaps = {
    shouldUseReducedEffects: 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || 
      (navigator.userAgent.indexOf('Mobile') !== -1 && navigator.hardwareConcurrency <= 4)
  };

  // Menu items com índices para animação
  const menuItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'work', label: 'Projects', path: '/work' },
    { id: 'contact', label: 'Contact', path: '/contact' }
  ];

  return (
    <nav 
      className={`${styles.navbar} 
        ${isScrolled ? styles.navbarScrolled : ''} 
        ${isMobileMenuOpen ? styles.menuOpen : ''}
        ${deviceCaps.shouldUseReducedEffects ? styles.reducedMotion : ''}
        ${isMobile ? styles.mobileNav : ''}`}
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
        
        {/* NOVO BOTÃO HAMBURGER MAIS SIMPLES */}
        <button 
          className={`${styles.mobileButton} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Menu de navegação"
          style={{display: isMobile ? 'flex' : 'none'}}
        >
          <div className={styles.hamburgerIcon}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <div 
          className={`${styles.navMenu} ${isMobileMenuOpen ? styles.open : ''}`}
          id="navbar-menu"
          role="menu"
        >
          <ul className={styles.navList}>
            {menuItems.map((item, index) => (
              <li 
                className={styles.navItem} 
                key={item.id}
                style={{"--item-index": index}}
              >
                <Link 
                  to={item.path} 
                  className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
                  onClick={closeMobileMenu}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;