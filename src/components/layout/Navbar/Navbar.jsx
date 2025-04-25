import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

/**
 * Componente Navbar Premium com otimização de performance
 * @returns {JSX.Element} Componente Navbar responsivo
 */
const Navbar = () => {
  // Estados para controle do comportamento da navbar
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Refs para melhor performance
  const navbarRef = useRef(null);
  const timeoutRef = useRef(null);

  // Array com configurações corretas das rotas
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/work' }, // Corrigido para a rota correta
    { name: 'Contact', path: '/contact' }
  ];

  // Detecção de preferência de redução de movimento
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleMotionPreferenceChange = () => {
        setPrefersReducedMotion(mediaQuery.matches);
      };
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleMotionPreferenceChange);
      } else {
        mediaQuery.addListener(handleMotionPreferenceChange);
      }
      
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
        } else {
          mediaQuery.removeListener(handleMotionPreferenceChange);
        }
      };
    }
  }, []);

  // Otimização da função handleScroll com throttling
  const handleScroll = useCallback(() => {
    if (timeoutRef.current) return;
    
    timeoutRef.current = setTimeout(() => {
      const currentScrollY = window.scrollY;
      
      // Verifica se a página foi rolada para baixo
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Mostra/esconde a navbar com base na direção do scroll
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
      timeoutRef.current = null;
    }, 50); // 50ms throttle para suavizar a performance
  }, [lastScrollY]);

  // Configuração de event listeners otimizados
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Solução para altura do viewport em iOS
    const setVH = () => {
      document.documentElement.style.setProperty(
        '--vh', 
        `${window.innerHeight * 0.01}px`
      );
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', setVH);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleScroll]);

  // Função avançada para alternar o menu mobile
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prevState => {
      const newState = !prevState;
      
      // Gestão de overflow para prevenir scroll quando menu está aberto
      if (newState) {
        document.body.classList.add('mobile-menu-open');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
      }
      
      return newState;
    });
  }, []);

  // Fechar menu ao clicar em um link
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
    document.body.style.overflow = '';
  }, []);

  // Classes dinâmicas com otimização de reflow
  const navbarClasses = `${styles.navbar} 
    ${isScrolled ? styles.navbarScrolled : ''} 
    ${isHidden ? styles.navbarHidden : ''}
    ${prefersReducedMotion ? styles.reducedMotion : ''}`;

  return (
    <nav className={navbarClasses} ref={navbarRef}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <NavLink to="/" onClick={closeMobileMenu}>
            <span className={styles.logoText}>Rai</span>
            <span className={styles.logoAccent}>.</span>
          </NavLink>
        </div>

        {/* Botão menu mobile com otimização touch */}
        <button 
          className={`${styles.mobileButton} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="navigation-menu"
        >
          <div className={styles.hamburgerIcon}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Menu de navegação com foco em acessibilidade */}
        <div 
          id="navigation-menu"
          className={`${styles.navMenu} ${mobileMenuOpen ? styles.open : ''}`}
          aria-hidden={!mobileMenuOpen}
        >
          <ul className={styles.navList}>
            {navItems.map((item, index) => (
              <li 
                className={styles.navItem} 
                key={item.name}
                style={{ 
                  '--item-index': index,
                  '--total-items': navItems.length 
                }}
              >
                <NavLink
                  to={item.path}
                  className={({isActive}) => 
                    isActive 
                      ? `${styles.navLink} ${styles.active}` 
                      : styles.navLink
                  }
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);