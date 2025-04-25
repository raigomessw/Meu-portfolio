import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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

  // Tratamento para overflow do body
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('nav-menu-open');
    } else {
      document.body.classList.remove('nav-menu-open');
    }
    
    return () => {
      document.body.classList.remove('nav-menu-open');
    };
  }, [menuOpen]);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Links de navegação
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/work', label: 'Work' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
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
        
        {/* Botão mobile */}
        <button 
          className={`${styles.menuButton} ${menuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Menu de navegação"
        >
          <div className={styles.menuIcon}>
            <span></span>
            <span></span>
          </div>
        </button>
        
        {/* Menu mobile */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuContainer}>
            <ul className={styles.mobileNavList}>
              {navLinks.map((link, index) => (
                <li 
                  key={link.path} 
                  className={styles.mobileNavItem}
                  style={{ '--delay': `${index * 0.05 + 0.1}s` }}
                >
                  <NavLink 
                    to={link.path} 
                    className={({isActive}) => 
                      isActive ? styles.mobileNavLinkActive : styles.mobileNavLink
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;