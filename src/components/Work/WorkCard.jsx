import React, { useState, memo, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './WorkCard.module.css';

function WorkCard({ title, description, tags, projectLink, projectDetails }) {
  const [modalOpen, setModalOpen] = useState(false);
  const cardRef = useRef(null);
  const modalContentRef = useRef(null);
  
  // Previne múltiplas aberturas de modal
  const openModal = (e) => {
    e.preventDefault();
    
    // Usar requestAnimationFrame para garantir smooth rendering
    requestAnimationFrame(() => {
      setModalOpen(true);
      document.body.style.overflow = 'hidden'; // Bloquear scroll
    });
  };

  const closeModal = () => {
    // Animação de saída antes de remover modal
    if (modalContentRef.current) {
      modalContentRef.current.classList.add(styles.closing);
      
      setTimeout(() => {
        setModalOpen(false);
        document.body.style.overflow = ''; // Restaurar scroll
      }, 300);
    } else {
      setModalOpen(false);
      document.body.style.overflow = ''; // Restaurar scroll
    }
  };
  
  // Handler para tecla ESC fechar modal
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };
    
    if (modalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);
  
  // Detectar se device tem baixa performance
  const isLowPerformanceDevice = 
    typeof navigator !== 'undefined' && 
    ((navigator.deviceMemory && navigator.deviceMemory < 4) || 
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4));

  // Classe CSS condicional para animações
  const cardClassName = `${styles.workCard} ${isLowPerformanceDevice ? styles.reducedMotion : ''}`;

  return (
    <>
      <div className={cardClassName} ref={cardRef}>
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardDescription}>{description}</p>
          <div className={styles.cardTags}>
            {tags && tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.buttonContainer}>
            <a 
              href={projectLink} 
              className={styles.viewButton}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit project ${title}`}
            >
              Visit project
              <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
            </a>
            <button 
              className={styles.detailsButton}
              onClick={openModal}
              aria-label={`View project details ${title}`}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div 
          className={styles.modalOverlay} 
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-${title}`}
        >
          <div 
            className={styles.modal} 
            onClick={(e) => e.stopPropagation()}
            ref={modalContentRef}
          >
            <button 
              className={styles.closeButton} 
              onClick={closeModal}
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className={styles.modalContent}>
              <h2 id={`modal-title-${title}`} className={styles.modalTitle}>{title}</h2>
              
              <div className={styles.modalSection}>
                <h3>About the Project</h3>
                <p>{description}</p>
                {projectDetails && projectDetails.challenge && (
                  <p>{projectDetails.challenge}</p>
                )}
              </div>
              
              <div className={styles.modalSection}>
                <h3>Technologies Used</h3>
                <div className={styles.modalTags}>
                  {tags && tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                  {projectDetails && projectDetails.technologies && 
                    projectDetails.technologies.map((tech, idx) => (
                      <span key={`tech-${idx}`} className={styles.tag}>
                        {tech}
                      </span>
                    ))
                  }
                </div>
              </div>
              
              {projectDetails && projectDetails.solution && (
                <div className={styles.modalSection}>
                  <h3>Challenges and Solutions</h3>
                  <p>{projectDetails.solution}</p>
                </div>
              )}
              
              <div className={styles.modalActions}>
                <a 
                  href={projectLink} 
                  className={styles.modalButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Project
                  <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Memorizar o componente para evitar re-renderizações desnecessárias
export default memo(WorkCard, (prevProps, nextProps) => {
  // Comparação personalizada para melhorar performance
  return (
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    JSON.stringify(prevProps.tags) === JSON.stringify(nextProps.tags) &&
    prevProps.projectLink === nextProps.projectLink
  );
});