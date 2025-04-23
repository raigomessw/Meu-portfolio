import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  // Toggle mobile menu
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isNavOpen &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setIsNavOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isNavOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsNavOpen(false);
  }, [location]);

  const navbarClasses = `${styles.navbar} ${scrolled ? styles.scrolled : ''}`;
  const navListClasses = `${styles.navList} ${isNavOpen ? styles.navOpen : ''}`;
  const hamburgerClasses = `${styles.hamburger} ${isNavOpen ? styles.open : ''}`;

  return (
    <nav className={navbarClasses} ref={navRef}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/" aria-label="Homepage">
            <span className={styles.logoText}>Rai Gomes</span>
            <span className={styles.logoAccent}>.</span>
          </Link>
        </div>

        <ul className={navListClasses}>
          <li>
            <Link
              to="/work"
              className={`${styles.navLink} ${
                location.pathname === '/work' ? styles.active : ''
              }`}
            >
              My Work
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`${styles.navLink} ${
                location.pathname === '/about' ? styles.active : ''
              }`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`${styles.navLink} ${
                location.pathname === '/contact' ? styles.active : ''
              }`}
            >
              Let's Connect
            </Link>
          </li>
        </ul>

        <button
          className={hamburgerClasses}
          onClick={toggleNav}
          aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isNavOpen}
          aria-controls="primary-navigation"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>

      {isNavOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsNavOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}

export default Navbar;
