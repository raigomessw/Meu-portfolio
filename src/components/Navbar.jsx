import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const scrollToWorkSection = (e) => {
    // Prevent default only if we're already on the homepage
    if (location.pathname === '/' || location.pathname === '/work') {
      e.preventDefault();
      
      // Close mobile menu if it's open
      if (isNavOpen) {
        setIsNavOpen(false);
      }
      
      // Find the work section
      const workSection = document.getElementById('work');
      
      // Scroll to the work section if it exists
      if (workSection) {
        workSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    // If we're not on the homepage, the Link will navigate normally
  };

  let navListClasses = `${styles.navList} ${isNavOpen ? styles.navOpen : ''}`;

  navListClasses = isNavOpen ? navListClasses : `${navListClasses} ${styles.navClosed}`;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">Rai Gomes</Link>
        </div>
        <ul className={navListClasses}>
          <li>
            <Link 
              to="/work" 
              className={styles.navLink} 
              onClick={scrollToWorkSection}
            >
              My Work
            </Link>
          </li>
          <li><Link to="/about" className={styles.navLink}>About</Link></li>
          <li><Link to="/contact" className={styles.navLink}>Let's Connect</Link></li>
        </ul>

        <button 
          className={`${styles.hamburger} ${isNavOpen ? styles.open : ''}`} 
          onClick={toggleNav} 
          aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"} 
          tabIndex="0"
        >
          <FontAwesomeIcon icon={isNavOpen ? faTimes : faBars} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;