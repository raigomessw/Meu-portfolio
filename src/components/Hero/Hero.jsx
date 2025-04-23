import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import gradientVideo from '../common/video/gradient-video.mp4';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const descriptionRef = useRef(null);
  const socialsRef = useRef(null);
  const buttonRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Animação de entrada dos elementos
    const heroElement = heroRef.current;
    const titleElement = titleRef.current;
    const taglineElement = taglineRef.current;
    const descriptionElement = descriptionRef.current;
    const socialsElement = socialsRef.current;
    const buttonElement = buttonRef.current;
    const scrollElement = scrollRef.current;

    // Aplicar classes de animação com atraso progressivo
    setTimeout(() => titleElement.classList.add(styles.animateIn), 300);
    setTimeout(() => taglineElement.classList.add(styles.animateIn), 600);
    setTimeout(() => descriptionElement.classList.add(styles.animateIn), 900);
    setTimeout(() => socialsElement.classList.add(styles.animateIn), 1200);
    setTimeout(() => buttonElement.classList.add(styles.animateIn), 1500);
    setTimeout(() => scrollElement.classList.add(styles.animateIn), 1800);

    // Efeito parallax no scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (heroElement) {
        heroElement.style.transform = `translateY(${scrollPosition * 0.2}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.backgroundContainer}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.backgroundVideo}
        >
          <source src={gradientVideo} type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
        <div className={styles.blurOverlay}></div>
        <div className={styles.particlesOverlay}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.textColumn}>
          <h1 ref={titleRef} className={styles.hidden}>Rai Gomes</h1>
          <p ref={taglineRef} className={`${styles.tagline} ${styles.hidden}`}>UI/UX Designer & Front-End Developer</p>
          <p ref={descriptionRef} className={`${styles.description} ${styles.hidden}`}>
            Passionate about crafting intuitive and user-centered digital experiences. 
            Transforming complex challenges into elegant and effective solutions.
          </p>
          <div ref={socialsRef} className={`${styles.socialLinks} ${styles.hidden}`}>
            <a href="https://www.linkedin.com/in/rai-gomes-6487b2153/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://github.com/raigomessw" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="mailto:raigomessw@gmail.com" className={styles.socialIcon}>
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </div>
          <Link 
            ref={buttonRef} 
            to="/contact" 
            className={`${styles.contactButton} ${styles.hidden}`}
            aria-label="Get in Touch"
          >
            <span className={styles.buttonText}>Get in Touch</span>
            <span className={styles.buttonHighlight}></span>
          </Link>
        </div>
      </div>
      <div ref={scrollRef} className={`${styles.scrollDownContainer} ${styles.hidden}`}>
        <button 
          onClick={handleScrollToServices} 
          className={styles.scrollDownButton}
          aria-label="Scroll down to see services"
          tabIndex="0"
        >
          <FontAwesomeIcon icon={faArrowDown} className={styles.scrollIcon} />
          <span className={styles.scrollDownText}>Services</span>
        </button>
      </div>
    </section>
  );
}

export default Hero;