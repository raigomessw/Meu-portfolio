import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    setIsVisible(true); // Trigger the effect when the component mounts
  }, []);

  const navListClasses = `${styles.navList} ${isNavOpen ? styles.navOpen : ''} ${isVisible ? 'visible' : ''}`;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={`${styles.logo} ${isVisible ? 'visible' : ''}`}>
          <Link to="/">Rai Gomes</Link>
        </div>
        <ul className={navListClasses}>
          <li className={`${isVisible ? 'visible' : ''}`}><Link to="/work" className={styles.navLink}>My Work</Link></li>
          <li className={`${isVisible ? 'visible' : ''}`}><Link to="/about" className={styles.navLink}>About</Link></li>
          <li className={`${isVisible ? 'visible' : ''}`}><Link to="/contact" className={styles.navLink}>Let's Connect</Link></li>
        </ul>

        {/* Hamburger Menu - Added the 'open' class conditionally */}
        <div
          className={`${styles.hamburger} ${isNavOpen ? styles.open : ''} ${isVisible ? 'visible' : ''}`}
          onClick={toggleNav}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;