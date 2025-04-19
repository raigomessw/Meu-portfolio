import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import gradientVideo from '../assets/gradient-video.mp4';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Hero() {
  const handleScrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      <div  className={styles.backgroundContainer}>
        <video
          autoPlay
          loop
          muted
          className={styles.backgroundVideo}
        >
          <source src={gradientVideo} type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
        <div className={styles.blurOverlay}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.textColumn}>
          <h1>Rai Gomes</h1>
          <p className={styles.tagline}>UI/UX Designer & Front-End Developer</p>
          <p className={styles.description}>Passionate about crafting intuitive and user-centered digital experiences. Transforming complex challenges into elegant and effective solutions.</p>
          <div className={styles.socialLinks}>
            <a href="https://www.linkedin.com/in/seunome/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://github.com/seunome/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="mailto:seuemail@email.com">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </div>
          <Link to="/contact" className={styles.contactButton}>Let's Talk</Link>
        </div>
      </div>
      <div className={styles.scrollDownContainer}>
        <button 
          onClick={handleScrollToServices} 
          className={styles.scrollDownButton}
          aria-label="Scroll down to see services"
          tabIndex="0"
        >
          <FontAwesomeIcon icon={faArrowDown} />
          <span className={styles.scrollDownText}>Services</span>
        </button>
      </div>
    </section>
  );
}

export default Hero;