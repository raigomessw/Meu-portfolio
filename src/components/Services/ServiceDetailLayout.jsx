import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ServiceDetailLayout.module.css';

const ServiceDetailLayout = ({ service }) => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);
  
  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${isInView ? styles.inView : ''}`}
      style={{ '--accent-color': service.accent }}
    >
      {/* Hero Sektion */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.iconWrapper} style={{ backgroundColor: service.accent }}>
            <div className={styles.icon}>{service.icon}</div>
          </div>
          <h1 className={styles.title}>{service.title}</h1>
          <p className={styles.subtitle}>{service.subtitle}</p>
        </div>
        <div 
          className={styles.heroImage} 
          style={{ backgroundImage: `url(${service.heroImage})` }}
        />
        <div className={styles.overlay} />
      </div>
      
      {/* Beskrivning Sektion */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Vad jag erbjuder</h2>
          <p className={styles.description}>{service.description}</p>
          
          <div className={styles.benefitsGrid}>
            {service.benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitItem}>
                <div className={styles.benefitIcon}>✓</div>
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Sektion */}
      <section className={`${styles.section} ${styles.processSection}`}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Min process</h2>
          <div className={styles.processList}>
            {service.process.map((step, index) => (
              <div key={index} className={styles.processStep}>
                <div className={styles.stepNumber}>{index + 1}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Fallstudier Sektion */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Fallstudier</h2>
          <div className={styles.caseStudiesGrid}>
            {service.caseStudies.map((study, index) => (
              <Link to={study.link} key={index} className={styles.caseStudyCard}>
                <div 
                  className={styles.caseStudyImage}
                  style={{ backgroundImage: `url(${study.image})` }}
                />
                <div className={styles.caseStudyContent}>
                  <h3 className={styles.caseStudyTitle}>{study.title}</h3>
                  <p className={styles.caseStudyCompany}>{study.company}</p>
                  <p className={styles.caseStudyResult}>{study.result}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Verktyg och teknologier Sektion */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Verktyg och teknologier</h2>
          <div className={styles.toolsList}>
            {service.tools.map((tool, index) => (
              <div key={index} className={styles.toolTag}>{tool}</div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Kontakt CTA */}
      <section className={`${styles.section} ${styles.ctaSection}`}>
        <div className={styles.sectionContent}>
          <h2 className={styles.ctaTitle}>Redo att förvandla ditt företag?</h2>
          <p className={styles.ctaText}>
            Låt oss diskutera hur våra {service.title} tjänster kan hjälpa dig att nå dina mål.
          </p>
          <Link to="/contact" className={styles.ctaButton}>
            Kontakta mig
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3L16 10L10 17L8.6 15.6L12.2 12H4V8H12.2L8.6 4.4L10 3Z" fill="currentColor" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailLayout;