import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  // CORREÇÃO: Definindo o estado menuOpen
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const lastScrollY = useRef(0);

  // Fechar o menu quando mudar de página
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Detectar rolagem para esconder/mostrar navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determinar se a página foi rolada para baixo
      if (currentScrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Esconder/mostrar navbar baseado na direção da rolagem
      if (currentScrollY > lastScrollY.current + 10) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // NOVO: Função para definir altura real da viewport em dispositivos móveis
  useEffect(() => {
    const setVhVariable = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Executar uma vez no carregamento
    setVhVariable();
    
    // Adicionar listener de eventos para redimensionamento e mudanças de orientação
    window.addEventListener('resize', setVhVariable);
    window.addEventListener('orientationchange', setVhVariable);
    
    // Gerenciar classe no body para impedir rolagem quando menu estiver aberto
    if (menuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    
    return () => {
      window.removeEventListener('resize', setVhVariable);
      window.removeEventListener('orientationchange', setVhVariable);
      document.body.classList.remove('mobile-menu-open');
    };
  }, [menuOpen]);

  // ATUALIZADO: Toggle menu com lógica aprimorada
  const toggleMenu = () => {
    // Alterna o estado do menu
    const newMenuState = !menuOpen;
    setMenuOpen(newMenuState);
    
    // Manipulação direta do DOM para garantir funcionamento
    if (newMenuState) {
      document.body.classList.add('mobile-menu-open');
      // Bloqueia rolagem
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Recupera a posição de rolagem antes de remover a classe
      const scrollY = document.body.style.top;
      document.body.classList.remove('mobile-menu-open');
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  };

  // Determinar classes para a navbar
  const navbarClasses = `${styles.navbar} ${scrolled ? styles.navbarScrolled : ''} ${hidden ? styles.navbarHidden : ''}`;

  return (
    <nav className={navbarClasses}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <span className={styles.logoText}>Rai</span>
            <span className={styles.logoAccent}>.</span>
          </Link>
        </div>
        
        <button 
          className={`${styles.mobileButton} ${menuOpen ? styles.mobileMenuOpen : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <div className={styles.hamburgerIcon}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <div className={`${styles.navMenu} ${menuOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            {[
              { path: '/', label: 'Home' },
              { path: '/about', label: 'About' },
              { path: '/work', label: 'Work' },
              { path: '/contact', label: 'Contact' }
            ].map((item, index) => (
              <li 
                key={item.path} 
                className={styles.navItem} 
                style={{ '--item-index': index }}
              >
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;