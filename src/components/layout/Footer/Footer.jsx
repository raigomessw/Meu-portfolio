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
            <p className={styles.title}>UI/UX Designer & Front-End Utvecklare</p>
          </div>
          <div className={styles.navigationSection}>
            <nav className={styles.footerNav}>
              <Link to="/" className={styles.footerLink}>Hem</Link>
              <Link to="/about" className={styles.footerLink}>Om</Link>
              <Link to="/work" className={styles.footerLink}>Arbeten</Link>
              <Link to="/contact" className={styles.footerLink}>Kontakt</Link>
            </nav>
          </div>
          <div className={styles.socialSection}>
            <a href="https://www.linkedin.com/in/rai-gomes-6487b2153/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn Profil">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://github.com/raigomessw" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub Profil">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="mailto:raigomessw@gmail.com" className={styles.socialIcon} aria-label="Maila mig">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Rai Gomes. Alla rättigheter förbehållna.
          </p>
          <p className={styles.made}>
            Skapad med <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} /> i Sverige
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;