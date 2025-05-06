import React, { useState } from 'react';  // Adicione o useState
import styles from "./WorkSection.module.css";
import { useInView } from "react-intersection-observer";

const ProjectCard = ({ project, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Estado para controlar a visibilidade do modal
  const [modalOpen, setModalOpen] = useState(false);
  
  // Função para abrir o modal com a imagem
  const openImageModal = (imageSrc, imageTitle) => {
    setModalOpen(true);
    // Você pode adicionar lógica adicional aqui, como prevenir o scroll da página
    document.body.style.overflow = 'hidden';
  };
  
  // Função para fechar o modal
  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className={styles.projectCardWrapper} ref={ref}>
      <a 
        href={`/work/${project.slug}`} 
        className={`${styles.projectCard} ${inView ? styles.visible : ''}`} 
        style={{ '--index': index }}
      >
        {/* Substituir a div cardImage pela versão com onClick */}
        <div 
          className={styles.cardImage} 
          onClick={(e) => {
            e.preventDefault();
            openImageModal(project.image, project.title);
          }}
        >
          {/* Imagem principal */}
          <img 
            src={project.image} 
            alt={project.title} 
            loading="lazy" 
          />
          
          {/* Elementos de efeito premium */}
          <div className={styles.cardImageParticles}></div>
          <div className={styles.cardColorTint}></div>
          <div className={styles.cardZoomIndicator}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          
          {/* Overlay gradiente */}
          <div className={styles.cardOverlay}></div>
        </div>
        
        {/* Resto do código continua igual... */}
        <div className={styles.cardContent}>
          <span className={styles.projectCategory}>{project.category}</span>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          
          <div className={styles.cardMeta}>
            <div className={styles.cardTags}>
              {project.tags && project.tags.map((tag, idx) => (
                <span key={idx} className={styles.tag}>{tag}</span>
              ))}
            </div>
            <span className={styles.cardYear}>{project.year}</span>
          </div>
        </div>
        
        {/* Botão de ação rápida */}
        <div className={styles.cardQuickAction}>
          <button 
            className={styles.quickViewButton} 
            aria-label="Snabbvisning"
            onClick={(e) => {
              e.preventDefault(); 
              openImageModal(project.image, project.title);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
        
        {/* Barra de ação no hover */}
        <div className={styles.cardHoverEffect}>
          <span className={styles.exploreText}>Utforska projekt</span>
          <svg className={styles.arrowIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </a>
      
      {/* Modal para exibir a imagem ampliada */}
      {modalOpen && (
        <div className={styles.imageModal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModalButton} onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img src={project.image} alt={project.title} />
            <h3>{project.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;