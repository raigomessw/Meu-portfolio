import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faBehance } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faHeart, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';
import styles from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { theme } = useTheme();

  // Controlar a visibilidade do botão "Voltar ao topo"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para rolar suavemente para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer 
      className={`${styles.footer} ${theme === 'light' ? styles.footerLight : ''}`} 
      role="contentinfo" 
      aria-label="Sidfot"
      data-theme={theme}
    >
      {/* Botão Voltar ao Topo */}
      <button 
        className={`${styles.scrollTopButton} ${showScrollTop ? styles.visible : ''} ${theme === 'light' ? styles.scrollTopButtonLight : ''}`}
        onClick={scrollToTop}
        aria-label="Tillbaka till toppen"
        title="Tillbaka till toppen"
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>

      <div className={styles.content}>
        <div className={styles.footerTop}>
          <div className={styles.logoSection}>
            <h3 className={`${styles.name} ${theme === 'light' ? styles.nameLight : ''}`}>Rai Gomes</h3>
            <p className={`${styles.title} ${theme === 'light' ? styles.titleLight : ''}`}>UI/UX Designer & Front-End Utvecklare</p>
            <p className={`${styles.subtitle} ${theme === 'light' ? styles.subtitleLight : ''}`}>Bygger användarcentrerade digitala upplevelser</p>
          </div>
          
          <nav className={styles.navigationSection} aria-label="Sidfotnavigation">
            <h4 className={`${styles.navigationTitle} ${theme === 'light' ? styles.navigationTitleLight : ''}`}>Länkar</h4>
            <div className={styles.footerNav}>
              <Link to="/" className={`${styles.footerLink} ${theme === 'light' ? styles.footerLinkLight : ''}`}>Hem</Link>
              <Link to="/about" className={`${styles.footerLink} ${theme === 'light' ? styles.footerLinkLight : ''}`}>Om</Link>
              <Link to="/work" className={`${styles.footerLink} ${theme === 'light' ? styles.footerLinkLight : ''}`}>Arbeten</Link>
              <Link to="/contact" className={`${styles.footerLink} ${theme === 'light' ? styles.footerLinkLight : ''}`}>Kontakt</Link>
            </div>
          </nav>
          
          <div className={styles.socialContainer}>
            <h4 className={`${styles.socialTitle} ${theme === 'light' ? styles.socialTitleLight : ''}`}>Kontakta mig</h4>
            <div className={styles.socialSection}>
              <a 
                href="https://www.linkedin.com/in/rai-gomes-6487b2153/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${styles.socialIcon} ${theme === 'light' ? styles.socialIconLight : ''}`} 
                aria-label="LinkedIn Profil"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a 
                href="https://github.com/raigomessw" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${styles.socialIcon} ${theme === 'light' ? styles.socialIconLight : ''}`} 
                aria-label="GitHub Profil"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a 
                href="mailto:raigomessw@gmail.com" 
                className={`${styles.socialIcon} ${theme === 'light' ? styles.socialIconLight : ''}`} 
                aria-label="Maila mig"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
          </div>
        </div>
        
        <div className={`${styles.divider} ${theme === 'light' ? styles.dividerLight : ''}`} role="separator"></div>
        
        <div className={styles.footerBottom}>
          <p className={`${styles.copyright} ${theme === 'light' ? styles.copyrightLight : ''}`}>
            &copy; {currentYear} Rai Gomes. Alla rättigheter förbehållna.
          </p>
          <p className={`${styles.made} ${theme === 'light' ? styles.madeLight : ''}`}>
            Skapad med <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} /> i Sverige
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;