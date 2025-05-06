import React, { useEffect, useRef } from 'react';
import styles from './ServiceDetailLayout.module.css';
import { Link } from 'react-router-dom';

const ServiceDetailLayout = ({ serviceData }) => {
  // Referência para o contêiner para aplicar a classe inView quando visível
  const containerRef = useRef(null);
  
  // Rola para o topo e configura animação de entrada quando o componente é montado
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Adiciona a classe inView após um pequeno atraso para acionar animações
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.add(styles.inView);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Se serviceData for undefined, exibe uma mensagem de carregamento ou erro
  if (!serviceData) {
    return (
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <Link to="/#services" className={styles.backLink}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 17L3 10L10 3L11.4 4.4L7.8 8H17V12H7.8L11.4 15.6L10 17Z" />
              </svg>
              Tillbaka till tjänster
            </Link>
            <h1 className={styles.title}>Tjänsten hittades inte</h1>
            <p className={styles.subtitle}>Detaljerna för denna tjänst är inte tillgängliga för närvarande.</p>
          </div>
        </div>
      </div>
    );
  }

  // Extrair o valor RGB do accent para usar em rgba
  const accentRgb = serviceData.accent && serviceData.accent.match(/\d+/g) 
    ? serviceData.accent.match(/\d+/g).join(',') 
    : '75,75,75';

  // Define uma variável CSS personalizada para a cor de destaque
  const rootStyle = {
    '--accent-color': serviceData.accent,
    '--accent-color-rgb': accentRgb,
    '--accent-color-soft': `rgba(${accentRgb}, 0.15)`
  };

  return (
    <div className={styles.container} style={rootStyle} ref={containerRef}>
      {/* Elementos decorativos de fundo */}
      <div className={`${styles.bgDecoration} ${styles.decoration1}`}></div>
      <div className={`${styles.bgDecoration} ${styles.decoration2}`}></div>
      <div className={`${styles.bgDecoration} ${styles.decoration3}`}></div>
      
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <Link to="#services" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 17L3 10L10 3L11.4 4.4L7.8 8H17V12H7.8L11.4 15.6L10 17Z" />
            </svg>
            Tillbaka till tjänster
          </Link>
          
          <div className={styles.iconWrapper}>
            {serviceData.icon}
          </div>
          
          <h1 className={styles.title}>{serviceData.title}</h1>
          <p className={styles.subtitle}>
            {serviceData.subtitle || "Användarcentrerade designlösningar"}
          </p>
          <p className={styles.description}>{serviceData.description}</p>
        </div>
      </div>
      
      {/* Benefícios */}
      {serviceData.benefits && (
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Fördelar</h2>
            <div className={styles.benefitsGrid}>
              {serviceData.benefits.map((benefit, index) => (
                <div key={index} className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em">
                      <path fillRule="evenodd" clipRule="evenodd" d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM13.7071 8.70711C14.0976 8.31658 14.0976 7.68342 13.7071 7.29289C13.3166 6.90237 12.6834 6.90237 12.2929 7.29289L9 10.5858L7.70711 9.29289C7.31658 8.90237 6.68342 8.90237 6.29289 9.29289C5.90237 9.68342 5.90237 10.3166 6.29289 10.7071L8.29289 12.7071C8.68342 13.0976 9.31658 13.0976 9.70711 12.7071L13.7071 8.70711Z" />
                    </svg>
                  </div>
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Processo */}
      {serviceData.process && (
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Process</h2>
            <ol className={styles.processList}>
              {serviceData.process.map((step, index) => (
                <li key={index} className={styles.processStep}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <div>
                    {typeof step === 'string' ? (
                      <p className={styles.stepDescription}>{step}</p>
                    ) : (
                      <>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                        <p className={styles.stepDescription}>{step.description}</p>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
      
      {/* Entregas */}
      {serviceData.deliverables && (
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Vad du får</h2>
            <div className={styles.benefitsGrid}>
              {serviceData.deliverables.map((deliverable, index) => (
                <div key={index} className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p>{deliverable}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Estudo de Caso */}
      {serviceData.caseStudy && (
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Fallstudie</h2>
            <div className={styles.caseStudyContainer}>
              <div className={styles.caseStudyHeader}>
                <div className={styles.caseStudyTitle}>
                  <h3>{serviceData.caseStudy.title}</h3>
                </div>
              </div>
              <div className={styles.caseStudyContent}>
                <div className={styles.caseStudyDescription}>
                  <p>{serviceData.caseStudy.description}</p>
                </div>
                <div className={styles.caseStudyResult}>
                  <h4>Resultat:</h4>
                  <p>{serviceData.caseStudy.outcome}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ska vi arbeta tillsammans?</h2>
        <p className={styles.ctaText}>Kontakta mig för att diskutera hur jag kan hjälpa till med ditt nästa projekt</p>
        <Link to="/contact" className={styles.ctaButton} style={{ backgroundColor: serviceData.accent }}>
          Kontakta mig
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3L16 10L10 17L8.6 15.6L12.2 12H4V8H12.2L8.6 4.4L10 3Z" />
          </svg>
        </Link>
      </section>
    </div>
  );
};

export default ServiceDetailLayout;