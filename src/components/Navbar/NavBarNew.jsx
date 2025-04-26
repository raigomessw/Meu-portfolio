import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styles from './NavbarNew.module.css';

const NavbarNew = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  
  // Links de navegação
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/work', label: 'Work' },
    { path: '/contact', label: 'Contact' }
  ];
  
  // Fechar menu quando mudar de página
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);
  
  // Detectar rolagem
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fechar menu ao clicar fora e prevenir propagação de eventos
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);
  
  // NOVO useEffect: Controla classes CSS para integração com o Hero
  useEffect(() => {
    if (menuOpen) {
      document.documentElement.classList.add('mobile-menu-open');
      document.body.classList.add('mobile-menu-open');
    } else {
      document.documentElement.classList.remove('mobile-menu-open');
      document.body.classList.remove('mobile-menu-open');
    }
    
    return () => {
      document.documentElement.classList.remove('mobile-menu-open');
      document.body.classList.remove('mobile-menu-open');
    };
  }, [menuOpen]);
  
  // IMPORTANTE: Stopropagation para evitar que o evento chegue a outros listeners
const toggleMenu = (e) => {
 e.preventDefault(); // Adicione isso
 e.stopPropagation();
 
 // Adicione um delay para iOS
 setTimeout(() => {
   setMenuOpen(prev => !prev);
   
   // Bloqueia scroll diretamente
   if (!menuOpen) {
     document.body.style.overflow = 'hidden';
     document.body.style.position = 'fixed';
     document.body.style.width = '100%';
     document.body.style.top = `0px`;
   } else {
     document.body.style.overflow = '';
     document.body.style.position = '';
     document.body.style.width = '';
     document.body.style.top = '';
   }
 }, 10);
};

  return (
    <header 
      ref={navRef}
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="Home">
          <span className={styles.logoText}>Rai</span>
          <span className={styles.logoDot}>.</span>
        </Link>
        
        {/* Menu desktop */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navLinks.map(link => (
              <li key={link.path} className={styles.navItem}>
                <NavLink 
                  to={link.path} 
                  className={({isActive}) => 
                    isActive ? styles.navLinkActive : styles.navLink
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* NOVO botão que previne propagação de eventos */}
        <div className={styles.mobileControls}>
        <button 
  className={styles.navToggle}
  onClick={toggleMenu}
  onTouchEnd={(e) => {e.preventDefault(); toggleMenu(e);}}
  aria-label="Menu de navegação"
>
  <div className={`${styles.icon} ${menuOpen ? styles.active : ''}`}>
    <span></span>
    <span></span>
    <span></span>
  </div>
</button>
        </div>
      </div>
      

{/* Menu mobile como overlay fullscreen */}
{menuOpen && (
  <div className={styles.menuOverlay}>
    <div className={styles.menuContent}>
      <nav className={styles.mobileNav}>
        <ul className={styles.mobileList}>
          {navLinks.map(link => (
            <li key={link.path} className={styles.mobileNavItem}>
              <NavLink 
                to={link.path} 
                className={({isActive}) => 
                  isActive ? styles.mobileLinkActive : styles.mobileLink
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </div>
)}
    </header>
  );
};

export default NavbarNew;