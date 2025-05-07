import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './ServiceDetailLayout.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ServiceDetailLayout = ({ serviceData }) => {
  // Referências e estados
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const reducedMotion = useReducedMotion();
  
  // References para seções animadas
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const processRef = useRef(null);
  const deliverablesRef = useRef(null);
  const caseStudyRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Configurar observadores de interseção para animações de rolagem
  const { observedElements, setObservedElements } = useIntersectionObserver({
    threshold: 0.15,
    rootMargin: '-50px 0px',
  });

  // Registrar elementos para observação
  useEffect(() => {
    const elementsToObserve = [
      { id: 'hero', ref: heroRef },
      { id: 'benefits', ref: benefitsRef },
      { id: 'process', ref: processRef },
      { id: 'deliverables', ref: deliverablesRef },
      { id: 'caseStudy', ref: caseStudyRef },
      { id: 'cta', ref: ctaRef }
    ].filter(item => item.ref.current);
    
    setObservedElements(elementsToObserve);
    
    // Animação de entrada inicial
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Rolagem suave para o topo
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  }, [setObservedElements, reducedMotion]);
  
  // Se não houver dados do serviço
  if (!serviceData) {
    return (
      <div className={styles.container}>
        <div className={styles.hero} role="banner">
          <div className={styles.heroContent}>
            <Link to="/#services" className={styles.backLink} aria-label="Gå tillbaka till tjänstelistan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"></path>
                <path d="M12 19l-7-7 7-7"></path>
              </svg>
              <span>Tillbaka till tjänster</span>
            </Link>
            <h1 className={styles.title}>Tjänsten hittades inte</h1>
            <p className={styles.subtitle}>Detaljerna för denna tjänst är inte tillgängliga för närvarande.</p>
          </div>
        </div>
      </div>
    );
  }

  // Extrair cores do tema para uso dinâmico
  const accentRgb = serviceData.accent && serviceData.accent.match(/\d+/g)
    ? serviceData.accent.match(/\d+/g).join(',')
    : '75,75,75';

  // Variáveis CSS dinâmicas
  const rootStyle = {
    '--accent': serviceData.accent || 'var(--color-primary)',
    '--accent-rgb': accentRgb,
    '--accent-soft': `rgba(${accentRgb}, 0.15)`,
    '--accent-lighten': `rgba(${accentRgb}, 0.07)`,
    '--accent-darken': serviceData.accentDarken || serviceData.accent || 'var(--color-primary)'
  };

  return (
    <div
      className={`${styles.container} ${isLoaded ? styles.loaded : ''}`}
      style={rootStyle}
      ref={containerRef}
    >
      {/* Decorações de fundo premium */}
      <div className={styles.backgroundDecorations}>
        <div className={`${styles.decoration} ${styles.decorationPrimary}`}></div>
        <div className={`${styles.decoration} ${styles.decorationSecondary}`}></div>
        <div className={`${styles.decoration} ${styles.decorationTertiary}`}></div>
        <div className={`${styles.decoration} ${styles.decorationAccent}`}></div>
      </div>
      
      {/* Linhas de grade */}
      <div className={styles.gridLines}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.gridLine}></div>
        ))}
      </div>
      
      {/* Hero Section */}
      <section 
        className={`${styles.hero} ${observedElements.hero ? styles.inView : ''}`}
        ref={heroRef}
        id="hero"
        role="banner"
      >
        <div className={styles.heroBackdrop} aria-hidden="true"></div>
        <div className={styles.heroContent}>
          <Link 
            to="/#services" 
            className={styles.backLink}
            aria-label="Gå tillbaka till tjänstelistan"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            <span>Tillbaka till tjänster</span>
          </Link>
          
          <div className={styles.iconContainer}>
            <div className={styles.iconWrapper} aria-hidden="true">
              {serviceData.icon}
            </div>
          </div>
          
          <h1 className={styles.title}>{serviceData.title}</h1>
          
          <p className={styles.subtitle}>
            {serviceData.subtitle || "Användarcentrerade designlösningar"}
          </p>
          
          <div className={styles.descriptionWrapper}>
            <p className={styles.description}>{serviceData.description}</p>
          </div>
          
          <div className={styles.heroDivider} aria-hidden="true">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M1200 0L0 0 598.97 114.72 1200 0z" fill="currentColor"></path>
            </svg>
          </div>
        </div>
      </section>
      
      {/* Seção de Benefícios */}
      {serviceData.benefits && (
        <section 
          className={`${styles.section} ${styles.benefitsSection} ${observedElements.benefits ? styles.inView : ''}`}
          ref={benefitsRef}
          id="benefits"
        >
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionTitleText}>Fördelar</span>
            </h2>
            
            <div className={styles.benefitsGrid}>
              {serviceData.benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className={styles.benefitCard}
                  style={{ '--animation-order': index }}
                >
                  <div className={styles.benefitCardInner}>
                    <div className={styles.benefitIconWrapper}>
                      <div className={styles.benefitIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <path d="M22 4L12 14.01l-3-3"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                    <p className={styles.benefitDescription}>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Seção de Processo */}
      {serviceData.process && (
        <section 
          className={`${styles.section} ${styles.processSection} ${observedElements.process ? styles.inView : ''}`}
          ref={processRef}
          id="process"
        >
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionTitleText}>Process</span>
            </h2>
            
            <div className={styles.processContainer}>
              <div className={styles.processTimeline} aria-hidden="true"></div>
              
              <ol className={styles.processList}>
                {serviceData.process.map((step, index) => (
                  <li 
                    key={index} 
                    className={styles.processStep}
                    style={{ '--animation-order': index }}
                  >
                    <div className={styles.processStepContent}>
                      <div className={styles.stepNumberContainer}>
                        <div className={styles.stepNumber} aria-hidden="true">
                          <span>{index + 1}</span>
                        </div>
                      </div>
                      
                      <div className={styles.stepContent}>
                        {typeof step === 'string' ? (
                          <p className={styles.stepDescription}>{step}</p>
                        ) : (
                          <>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDescription}>{step.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}
      
      {/* Seção de Entregas */}
      {serviceData.deliverables && (
        <section 
          className={`${styles.section} ${styles.deliverablesSection} ${observedElements.deliverables ? styles.inView : ''}`}
          ref={deliverablesRef}
          id="deliverables"
        >
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionTitleText}>Vad du får</span>
            </h2>
            
            <div className={styles.deliverablesGrid}>
              {serviceData.deliverables.map((deliverable, index) => (
                <div 
                  key={index} 
                  className={styles.deliverableItem}
                  style={{ '--animation-order': index }}
                >
                  <div className={styles.deliverableIconWrapper}>
                    <div className={styles.deliverableIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                  <p className={styles.deliverableText}>{deliverable}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Seção de Estudo de Caso */}
      {serviceData.caseStudy && (
        <section 
          className={`${styles.section} ${styles.caseStudySection} ${observedElements.caseStudy ? styles.inView : ''}`}
          ref={caseStudyRef}
          id="caseStudy"
        >
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionTitleText}>Fallstudie</span>
            </h2>
            
            <div className={styles.caseStudyContainer}>
              <div className={styles.caseStudyCard}>
                <div className={styles.caseStudyHeader}>
                  <h3 className={styles.caseStudyTitle}>{serviceData.caseStudy.title}</h3>
                </div>
                
                <div className={styles.caseStudyBody}>
                  <div className={styles.caseStudyDescription}>
                    <p>{serviceData.caseStudy.description}</p>
                  </div>
                  
                  <div className={styles.caseStudyResult}>
                    <div className={styles.resultHeader}>
                      <div className={styles.resultIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <h4>Resultat:</h4>
                    </div>
                    <p>{serviceData.caseStudy.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Seção CTA */}
      <section 
        className={`${styles.ctaSection} ${observedElements.cta ? styles.inView : ''}`}
        ref={ctaRef}
        id="cta"
      >
        <div className={styles.ctaBackdrop} aria-hidden="true">
          <div className={styles.ctaGlow}></div>
        </div>
        
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ska vi arbeta tillsammans?</h2>
          <p className={styles.ctaText}>Kontakta mig för att diskutera hur jag kan hjälpa till med ditt nästa projekt</p>
          
          <Link 
            to="/contact" 
            className={styles.ctaButton}
            aria-label="Kontakta mig för att diskutera ditt projekt"
          >
            <span>Kontakta mig</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailLayout;