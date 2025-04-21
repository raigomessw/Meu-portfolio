import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Toggle menu
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNavOpen && !event.target.closest(`.${styles.navbar}`)) {
        setIsNavOpen(false);
      }
    };

    // Track scroll position
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isNavOpen]);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsNavOpen(false);
  }, [location]);

  // Dynamic classes
  const navbarClasses = `${styles.navbar} ${scrolled ? styles.scrolled : ''}`;
  const navListClasses = `${styles.navList} ${isNavOpen ? styles.navOpen : ''}`;

  return (
    <nav className={navbarClasses}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <span className={styles.logoText}>Rai Gomes</span>
            <span className={styles.logoAccent}>.</span>
          </Link>
        </div>
        
        <ul className={navListClasses}>
          <li>
            <Link 
              to="/work" 
              className={`${styles.navLink} ${location.pathname === '/work' ? styles.active : ''}`}
            >
              My Work
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`${styles.navLink} ${location.pathname === '/about' ? styles.active : ''}`}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={`${styles.navLink} ${location.pathname === '/contact' ? styles.active : ''}`}
            >
              Let's Connect
            </Link>
          </li>
        </ul>

        <button 
          className={`${styles.hamburger} ${isNavOpen ? styles.open : ''}`} 
          onClick={toggleNav} 
          aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"} 
          aria-expanded={isNavOpen}
          tabIndex="0"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>
      
      {/* Backdrop for mobile menu */}
      {isNavOpen && <div className={styles.backdrop} onClick={() => setIsNavOpen(false)} />}
    </nav>
  );
}

export default Navbar;