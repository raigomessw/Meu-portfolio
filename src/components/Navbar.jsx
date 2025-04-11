import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">Rai Gomes</Link>
        </div>
        <ul className={`${styles.navList} ${isNavOpen ? styles.navOpen : ''}`}>
          <li><Link to="/work" className={styles.navLink}>My Work</Link></li>
          <li><Link to="/about" className={styles.navLink}>About</Link></li>
          <li><Link to="/contact" className={styles.navLink}>Let's Connect</Link></li>
        </ul>

        {/* Hamburger Menu - Added the 'open' class conditionally */}
        <div
          className={`${styles.hamburger} ${isNavOpen ? styles.open : ''}`}
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