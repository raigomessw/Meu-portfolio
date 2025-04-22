// WorkCard.jsx
import React, { useState } from 'react';
import styles from './WorkCard.module.css';
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function WorkCard({ title, description, tags, projectLink }) {
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
            {tags.map((tag, index) => (
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
              aria-label={`Visitar projeto ${title}`}
            >
              Visitar Projeto
              <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
            </a>
            <button 
              className={styles.detailsButton}
              onClick={openModal}
              aria-label={`Ver detalhes do projeto ${title}`}
            >
              Ver Detalhes
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
                <h3>Sobre o Projeto</h3>
                <p>{description}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.</p>
              </div>
              
              <div className={styles.modalSection}>
                <h3>Tecnologias Utilizadas</h3>
                <div className={styles.modalTags}>
                  {tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                  <span className={styles.tag}>JavaScript</span>
                  <span className={styles.tag}>React</span>
                  <span className={styles.tag}>CSS Modules</span>
                </div>
              </div>
              
              <div className={styles.modalSection}>
                <h3>Desafios e Soluções</h3>
                <p>Nunc aliquet bibendum enim facilisis gravida neque convallis a. Dui faucibus in ornare quam viverra orci sagittis eu volutpat. Elementum pulvinar etiam non quam lacus suspendisse.</p>
              </div>
              
              <div className={styles.modalActions}>
                <a 
                  href={projectLink} 
                  className={styles.modalButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visitar Projeto
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

export default WorkCard;