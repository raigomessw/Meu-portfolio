import React, { useState, memo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTimes, faExternalLinkAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './WorkCard.module.css';

function WorkCard({ id, title, description, tags, projectLink, projectDetails }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const modalContentRef = useRef(null);
  const navigate = useNavigate();
  
  // Navegar para página de detalhes do projeto
  const viewProjectDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/work/${id}`);
  };

  const openModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Você pode optar por manter o modal ou redirecionar diretamente
    // Para redirecionar, descomente a linha abaixo e remova o restante da função
    // return viewProjectDetails(e);
    
    requestAnimationFrame(() => {
      setModalOpen(true);
      document.body.style.overflow = 'hidden';
    });
  };

  const closeModal = () => {
    if (modalContentRef.current) {
      modalContentRef.current.classList.add(styles.closing);
      
      setTimeout(() => {
        setModalOpen(false);
        document.body.style.overflow = '';
      }, 300);
    } else {
      setModalOpen(false);
      document.body.style.overflow = '';
    }
  };
  
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
  
  const isLowPerformanceDevice = 
    typeof navigator !== 'undefined' && 
    ((navigator.deviceMemory && navigator.deviceMemory < 4) || 
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4));

  const cardClassName = `${styles.workCard} ${isLowPerformanceDevice ? styles.reducedMotion : ''} ${isHovered ? styles.hovered : ''}`;

  const visitProject = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Não faz nada além de impedir a propagação do evento, já que o link <a> lidará com a navegação
  };

  return (
    <>
      <div 
        className={cardClassName} 
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={viewProjectDetails}
      >
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
          
          {/* Action Buttons Container - Sempre visível agora */}
          <div className={styles.buttonContainer}>
            <button 
              className={`${styles.detailsButton} ${styles.primaryButton}`}
              onClick={viewProjectDetails}
              aria-label={`View details of ${title} project`}
            >
              <FontAwesomeIcon icon={faInfoCircle} className={styles.buttonIconLeft} />
              Project Details
            </button>
            
            {projectLink && (
              <a 
                href={projectLink} 
                className={`${styles.viewButton} ${styles.secondaryButton}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit live ${title} project`}
                onClick={visitProject}
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.buttonIconLeft} />
                Visit Live
              </a>
            )}
          </div>
          
          {/* Badge de Interação */}
          <div className={styles.interactionHint}>
            <span>Click to view project</span>
          </div>
        </div>
      </div>

      {/* Modal - Mantido, mas com textos corrigidos para inglês */}
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
                <Link 
                  to={`/work/${id}`} 
                  className={`${styles.modalButton} ${styles.primaryModalButton}`}
                  onClick={closeModal}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className={styles.buttonIconLeft} />
                  View Full Details
                  <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
                </Link>
                
                {projectLink && (
                  <a 
                    href={projectLink} 
                    className={`${styles.modalButton} ${styles.secondaryModalButton}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.buttonIconLeft} />
                    Visit Project
                    <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(WorkCard, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    JSON.stringify(prevProps.tags) === JSON.stringify(nextProps.tags) &&
    prevProps.projectLink === nextProps.projectLink
  );
});