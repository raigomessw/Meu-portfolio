import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme(); // Använder useTheme hook
  const location = useLocation();

  // Stäng menyn när sidan ändras
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Upptäck skrollning
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hantering av body overflow
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

  // Bestämmer korrekt temaikon
  const getThemeIcon = () => {
    if (theme === 'auto') return '🔄';
    else if (theme === 'light') return '🌙';
    else return '☀️';
  };

  // Navigationslänkar
  const navLinks = [
    { path: '/', label: 'Hem' },
    { path: '/about', label: 'Om' },
    { path: '/work', label: 'Arbeten' },
    { path: '/contact', label: 'Kontakt' }
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logotyp */}
        <Link to="/" className={styles.logo} aria-label="Hem">
          <span className={styles.logoText}>Rai</span>
          <span className={styles.logoDot}>.</span>
        </Link>
        
        {/* Desktopmeny */}
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
          
          {/* Temaknapp på desktop */}
          <button 
            className={styles.themeToggle} 
            onClick={toggleTheme}
            aria-label={`Byt till ${theme === 'light' ? 'mörkt' : theme === 'dark' ? 'auto' : 'ljust'} läge`}
            title={`Aktuellt tema: ${theme}`}
          >
            {getThemeIcon()}
          </button>
        </nav>
        
        {/* Mobilkontroller */}
        <div className={styles.mobileControls}>
          {/* Temaknapp på mobil */}
          <button 
            className={styles.themeToggle} 
            onClick={toggleTheme}
            aria-label={`Byt till ${theme === 'light' ? 'mörkt' : theme === 'dark' ? 'auto' : 'ljust'} läge`}
          >
            {getThemeIcon()}
          </button>
          
          <button 
            className={`${styles.menuButton} ${menuOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label="Navigeringsmeny"
          >
            <div className={styles.menuIcon}>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
        
        {/* Mobilmeny */}
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