import React from 'react';
import styles from './SectionDivider.module.css';

const SectionDivider = () => {
  return (
    <div className={styles.sectionDivider} aria-hidden="true">
      {/* Elemento principal conectivo com pulsação */}
      <div className={styles.connectElement}></div>
      
      {/* Elementos decorativos brilhantes */}
      <div className={`${styles.sparkle} ${styles.sparkle1}`}></div>
      <div className={`${styles.sparkle} ${styles.sparkle2}`}></div>
      <div className={`${styles.sparkle} ${styles.sparkle3}`}></div>
      <div className={`${styles.sparkle} ${styles.sparkle4}`}></div>
      
      {/* Partículas flutuantes */}
      <div className={`${styles.particle} ${styles.particle1}`}></div>
      <div className={`${styles.particle} ${styles.particle2}`}></div>
      <div className={`${styles.particle} ${styles.particle3}`}></div>
      <div className={`${styles.particle} ${styles.particle4}`}></div>
      
      {/* Linhas decorativas */}
      <div className={`${styles.decorativeLine} ${styles.line1}`}></div>
      <div className={`${styles.decorativeLine} ${styles.line2}`}></div>
      <div className={`${styles.decorativeLine} ${styles.line3}`}></div>
      <div className={`${styles.decorativeLine} ${styles.line4}`}></div>
      <div className={`${styles.decorativeLine} ${styles.line5}`}></div>
      <div className={`${styles.decorativeLine} ${styles.line6}`}></div>
      
      {/* Ondas duplas para um efeito mais orgânico */}
      <svg 
        className={styles.dividerWaveSecondary} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 100" 
        preserveAspectRatio="none"
      >
        <path d="M0,40 C320,20 420,60 720,30 C1020,0 1200,40 1440,10 L1440,100 L0,100 Z"></path>
      </svg>
      
      <svg 
        className={styles.dividerWave} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 100" 
        preserveAspectRatio="none"
      >
        <path d="M0,0 C240,95 480,65 720,85 C960,100 1200,20 1440,80 L1440,100 L0,100 Z"></path>
      </svg>
    </div>
  );
};

export default SectionDivider;