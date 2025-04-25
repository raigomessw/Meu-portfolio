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
  
  // NOVA FUNÇÃO: Corrigir altura em dispositivos móveis, especialmente iOS
  useEffect(() => {
    const setVHVariable = () => {
      // Define a altura da unidade vh para uso em CSS
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Definir valor inicial
    setVHVariable();

    // Atualizar em eventos de redimensionamento e orientação
    window.addEventListener('resize', setVHVariable);
    window.addEventListener('orientationchange', setVHVariable);
    
    // Solução específica para iOS: atualizar após renderização completa
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setTimeout(setVHVariable, 100);
      // Detectar mudanças de scroll que podem afetar a barra de URL no iOS
      window.addEventListener('scroll', () => {
        setTimeout(setVHVariable, 100);
      });
    }

    return () => {
      window.removeEventListener('resize', setVHVariable);
      window.removeEventListener('orientationchange', setVHVariable);
    };
  }, []);
  
  // Otimizar evento de scroll com RAF e throttling
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 20);
        
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
  
  // MODIFICADO: Toggle de menu aprimorado para dispositivos móveis
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => {
      const newState = !prev;
      
      // Bloquear scroll quando menu está aberto
      if (newState) {
        // Melhor método para impedir scroll em iOS
        document.body.style.position = 'fixed';
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.width = '100%';
        
        // Adicionar toque fora para fechar em dispositivos móveis
        if (isMobile) {
          // Pequeno atraso para evitar fechamento imediato
          setTimeout(() => {
            document.addEventListener('touchstart', handleOutsideClick);
          }, 300);
        }
      } else {
        // Restaurar scroll quando menu é fechado
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        
        // Remover event listener
        document.removeEventListener('touchstart', handleOutsideClick);
      }
      
      return newState;
    });
  }, [isMobile]);
  
  // MODIFICADO: Fechar menu ao tocar fora (corrigido para iOS)
  const handleOutsideClick = useCallback((e) => {
    // Verificar se o clique foi fora do menu e do botão hamburger
    const isOutsideMenu = navRef.current && !navRef.current.contains(e.target);
    const isHamburgerClick = e.target.closest(`.${styles.mobileButton}`);
    
    if (isOutsideMenu && !isHamburgerClick) {
      setIsMobileMenuOpen(false);
      
      // Restaurar scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      
      document.removeEventListener('touchstart', handleOutsideClick);
    }
  }, []);
  
  // MODIFICADO: Fechar menu ao clicar em um link (corrigido para iOS)
  const closeMobileMenu = useCallback(() => {
    if (isMobileMenuOpen) {
      // Restaurar scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      
      setIsMobileMenuOpen(false);
      document.removeEventListener('touchstart', handleOutsideClick);
    }
  }, [isMobileMenuOpen, handleOutsideClick]);
  
  // Detectar orientação para ajustes de layout
  useEffect(() => {
    const handleOrientationChange = () => {
      if (isMobileMenuOpen) {
        // Adicionar atraso para garantir transição completa
        setTimeout(closeMobileMenu, 100);
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