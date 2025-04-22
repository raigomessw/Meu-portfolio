import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faHeart } from '@fortawesome/free-solid-svg-icons';
import styles from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.footerTop}>
          <div className={styles.logoSection}>
            <h3 className={styles.name}>Rai Gomes</h3>
            <p className={styles.title}>UI/UX Designer & Front-End Developer</p>
          </div>
          <div className={styles.navigationSection}>
            <nav className={styles.footerNav}>
              <Link to="/" className={styles.footerLink}>Home</Link>
              <Link to="/about" className={styles.footerLink}>About</Link>
              <Link to="/work" className={styles.footerLink}>Works</Link>
              <Link to="/contact" className={styles.footerLink}>Contact</Link>
            </nav>
          </div>
          <div className={styles.socialSection}>
            <a href="https://www.linkedin.com/in/rai-gomes-6487b2153/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn Profile">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://github.com/raigomessw" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub Profile">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="mailto:raigomessw@gmail.com" className={styles.socialIcon} aria-label="Email Me">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Rai Gomes. All rights reserved.
          </p>
          <p className={styles.made}>
            Made with <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} /> in Sweden
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;