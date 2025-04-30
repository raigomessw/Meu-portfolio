import React, { memo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WorkGridView.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEye } from '@fortawesome/free-solid-svg-icons';
import useIntersectionObserver from '../../Hooks/useIntersectionObserver';
import { verifyImageOrFallback } from '../utils/imageHelpers';

// Imagem de fallback
const FALLBACK_IMAGE = "/work/placeholder.jpg";

const WorkGridItem = memo(({ project, index, onKeyDown }) => {
  const [elementRef, isInView] = useIntersectionObserver({ threshold: 0.1 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  
  // Quando o elemento se torna visível, começar a carregar a imagem
  useEffect(() => {
    if (isInView && !isImageLoaded) {
      // Priorizar usar thumbnailImage se disponível, senão usar backgroundImage
      const imageToLoad = project.thumbnailImage || project.backgroundImage;
      
      const img = new Image();
      img.src = imageToLoad;
      img.onload = () => {
        setImageUrl(imageToLoad);
        setIsImageLoaded(true);
      };
      img.onerror = async () => {
        console.error("Erro ao carregar imagem do card:", imageToLoad);
        // Usar função de fallback para verificação adicional
        const fallbackImage = await verifyImageOrFallback(imageToLoad);
        setImageUrl(fallbackImage);
        setImageError(fallbackImage === FALLBACK_IMAGE);
        setIsImageLoaded(true);
      };
    }
  }, [isInView, isImageLoaded, project.thumbnailImage, project.backgroundImage]);
  
  // Função para navegar para página de detalhes
  const viewProjectDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Usando o ID correto para navegar
    console.log("Navegando para o projeto:", project.id);
    navigate(`/work/${project.id}`);
  };
  
  const cardClasses = `
    ${styles.gridCard} 
    ${isInView ? styles.inView : ''} 
  `;
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate(`/work/${project.id}`);
      e.preventDefault();
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };
  
  // Determinar qual imagem exibir
  const displayImage = isImageLoaded 
    ? (imageError ? FALLBACK_IMAGE : imageUrl) 
    : null;
  
  return (
    <div 
      ref={elementRef}
      className={cardClasses}
      style={{ 
        backgroundImage: displayImage ? `url(${displayImage})` : 'none',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        animationDelay: `${index * 0.1}s`
      }}
      tabIndex={0}
      aria-label={`Projeto: ${project.title}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onKeyDown={handleKeyPress}
      onClick={viewProjectDetails}
    >
      <div 
        className={`${styles.cardOverlay} ${isHovered ? styles.hovered : ''}`} 
        aria-hidden="true"
      ></div>
      
      <div className={styles.cardContent}>
        <h3 id={`grid-project-${project.id}`} className={styles.cardTitle}>
          {project.title}
        </h3>
        
        <div className={styles.cardTags} aria-label="Tags do projeto">
          {project.tags.map((tag, idx) => (
            <span key={idx} className={styles.tag}>{tag}</span>
          ))}
        </div>
        
        <p className={styles.cardDescription}>
          {project.description}
        </p>
        
        <div className={styles.cardActions}>
          {project.liveUrl && (
            <a 
              href={project.liveUrl}
              className={styles.viewButton}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View Project: ${project.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              View Project <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
            </a>
          )}
          
          <button
            onClick={viewProjectDetails}
            className={styles.detailsButton}
            aria-label={`View details of ${project.title}`}
          >
            Details <FontAwesomeIcon icon={faEye} className={styles.buttonIcon} />
          </button>
        </div>
      </div>
      
      {!isImageLoaded && (
        <div className={styles.loadingPlaceholder} aria-hidden="true">
          <div className={styles.placeholderPulse}></div>
        </div>
      )}
    </div>
  );
});

function WorkGridView({ projects }) {
  const containerClasses = styles.gridContainer;

  // Handlers para navegação por teclado
  const handleKeyboardNavigation = useCallback((e, index) => {
    const gridItems = document.querySelectorAll(`.${styles.gridCard}`);
    
    if (e.key === 'ArrowRight' && index < gridItems.length - 1) {
      gridItems[index + 1].focus();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      gridItems[index - 1].focus();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      const container = document.querySelector(`.${styles.gridContainer}`);
      if (!container) return;
      
      const itemWidth = gridItems[0].getBoundingClientRect().width;
      const containerWidth = container.getBoundingClientRect().width;
      const itemsPerRow = Math.floor(containerWidth / itemWidth);
      
      if (index + itemsPerRow < gridItems.length) {
        gridItems[index + itemsPerRow].focus();
        e.preventDefault();
      }
    } else if (e.key === 'ArrowUp') {
      const container = document.querySelector(`.${styles.gridContainer}`);
      if (!container) return;
      
      const itemWidth = gridItems[0].getBoundingClientRect().width;
      const containerWidth = container.getBoundingClientRect().width;
      const itemsPerRow = Math.floor(containerWidth / itemWidth);
      
      if (index - itemsPerRow >= 0) {
        gridItems[index - itemsPerRow].focus();
        e.preventDefault();
      }
    }
  }, []);

  return (
    <div 
      className={containerClasses}
      role="region"
      aria-label="Project Visualization"
    >
      {projects.length === 0 ? (
        <div className={styles.noResults} role="alert">
          <h3>No projects found.</h3>
          <p>Try changing the filters or check back later for new projects.</p>
        </div>
      ) : (
        projects.map((project, index) => (
          <WorkGridItem 
            key={project.id} 
            project={project}
            index={index}
            onKeyDown={(e) => handleKeyboardNavigation(e, index)}
          />
        ))
      )}
    </div>
  );
}

export default memo(WorkGridView);