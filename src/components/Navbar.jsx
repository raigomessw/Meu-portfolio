import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const navListClasses = `${styles.navList} ${isNavOpen ? styles.navOpen : ''}`;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">Rai Gomes</Link>
        </div>
        <ul className={navListClasses}>
          <li><Link to="/work" className={styles.navLink}>My Work</Link></li>
          <li><Link to="/about" className={styles.navLink}>About</Link></li>
          <li><Link to="/contact" className={styles.navLink}>Let's Connect</Link></li>
        </ul>

        <button className={`${styles.hamburger} ${isNavOpen ? styles.open : ''}`} onClick={toggleNav} aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"} tabIndex="0">
          <span></span>
          <span></span>
          <span></span>
          </button>
      </div>
    </nav>
  );
}

export default Navbar;