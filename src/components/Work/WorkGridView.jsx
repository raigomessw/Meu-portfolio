import React, { memo, useState, useCallback } from 'react';
import styles from './WorkGridView.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEye } from '@fortawesome/free-solid-svg-icons';
import useIntersectionObserver from '../../Hooks/useIntersectionObserver';

const WorkGridItem = memo(({ project, onViewDetails, index }) => {
  const [elementRef, isInView] = useIntersectionObserver({ threshold: 0.1 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Quando o elemento se torna visível, começar a carregar a imagem
  React.useEffect(() => {
    if (isInView && !isImageLoaded) {
      const img = new Image();
      img.src = project.backgroundImage;
      img.onload = () => setIsImageLoaded(true);
    }
  }, [isInView, isImageLoaded, project.backgroundImage]);
  
  const cardClasses = `
    ${styles.gridCard} 
    ${isInView ? styles.inView : ''} 
  `;
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onViewDetails(project);
      e.preventDefault();
    }
  };
  
  return (
    <div 
      ref={elementRef}
      className={cardClasses}
      style={{ 
        backgroundImage: isImageLoaded ? `url(${project.backgroundImage})` : 'none',
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
          <a 
            href={project.projectLink}
            className={styles.viewButton}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View Project: ${project.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            View Project <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
          </a>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(project);
            }}
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

function WorkGridView({ projects, onViewDetails }) {
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
            onViewDetails={onViewDetails}
            index={index}
            onKeyDown={(e) => handleKeyboardNavigation(e, index)}
          />
        ))
      )}
    </div>
  );
}

export default memo(WorkGridView);