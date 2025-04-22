// WorkCard.jsx
import React, { useState, memo } from 'react';
import styles from './WorkCard.module.css';
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function WorkCard({ title, description, tags, projectLink, projectDetails }) {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className={styles.workCard}>
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
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>{title}</h2>
              
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

// Usar memo para evitar re-renderizações desnecessárias
export default memo(WorkCard, (prevProps, nextProps) => {
  // Comparação personalizada para melhorar performance
  return (
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    JSON.stringify(prevProps.tags) === JSON.stringify(nextProps.tags)
  );
});