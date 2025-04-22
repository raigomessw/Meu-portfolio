import React, { memo, useState } from 'react';
import styles from './WorkGridView.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEye } from '@fortawesome/free-solid-svg-icons';
import useIntersectionObserver from '../Hooks/useIntersectionObserver';


const WorkGridItem = memo(({ project, onViewDetails, index }) => {
  const [elementRef, isInView] = useIntersectionObserver({ threshold: 0.1 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // When element comes into view, start loading the image
  React.useEffect(() => {
    if (isInView && !isImageLoaded) {
      const img = new Image();
      img.src = project.backgroundImage;
      img.onload = () => setIsImageLoaded(true);
    }
  }, [isInView, isImageLoaded, project.backgroundImage]);
  
  return (
    <div 
      ref={elementRef}
      className={`${styles.gridCard} ${isInView ? styles.inView : ''}`}
      style={{ 
        backgroundImage: isImageLoaded ? `url(${project.backgroundImage})` : 'none',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        animationDelay: `${index * 0.1}s`
      }}
      tabIndex={0}
      aria-label={`Project: ${project.title}`}
    >
      <div className={styles.cardOverlay} aria-hidden="true"></div>
      <div className={styles.cardContent}>
        <h3 id={`grid-project-${project.id}`} className={styles.cardTitle}>{project.title}</h3>
        <div className={styles.cardTags} aria-label="Project tags">
          {project.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <p className={styles.cardDescription}>{project.description}</p>
        <div className={styles.cardActions}>
          <a 
            href={project.projectLink}
            className={styles.viewButton}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View project: ${project.title}`}
          >
            View Project <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
          </a>
          <button
            onClick={() => onViewDetails(project)}
            className={styles.detailsButton}
            aria-label={`See details for ${project.title}`}
          >
            Details <FontAwesomeIcon icon={faEye} className={styles.buttonIcon} />
          </button>
        </div>
      </div>
      {!isImageLoaded && (
        <div className={styles.loadingPlaceholder} aria-hidden="true">
          <div className={styles.placeholderTitle}></div>
          <div className={styles.placeholderTags}>
            <div className={styles.placeholderTag}></div>
            <div className={styles.placeholderTag}></div>
          </div>
          <div className={styles.placeholderDescription}></div>
        </div>
      )}
    </div>
  );
});

function WorkGridView({ projects, onViewDetails }) {
  // Handle keyboard navigation
  const handleKeyDown = (e, index) => {
    const gridItems = document.querySelectorAll(`.${styles.gridCard}`);
    
    if (e.key === 'ArrowRight' && index < gridItems.length - 1) {
      gridItems[index + 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      gridItems[index - 1].focus();
    } else if (e.key === 'ArrowDown') {
      const itemsPerRow = Math.floor(
        document.querySelector(`.${styles.gridContainer}`).clientWidth / 
        gridItems[0].clientWidth
      );
      
      if (index + itemsPerRow < gridItems.length) {
        gridItems[index + itemsPerRow].focus();
      }
    } else if (e.key === 'ArrowUp') {
      const itemsPerRow = Math.floor(
        document.querySelector(`.${styles.gridContainer}`).clientWidth / 
        gridItems[0].clientWidth
      );
      
      if (index - itemsPerRow >= 0) {
        gridItems[index - itemsPerRow].focus();
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      onViewDetails(projects[index]);
    }
  };

  return (
    <div 
      className={styles.gridContainer}
      role="region"
      aria-label="Projects grid view"
    >
      {projects.length === 0 ? (
        <div className={styles.noResults} role="alert">
          <h3>No projects found</h3>
          <p>Try changing your filters or check back later for new projects.</p>
        </div>
      ) : (
        projects.map((project, index) => (
          <WorkGridItem 
            key={project.id} 
            project={project}
            onViewDetails={onViewDetails}
            index={index}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))
      )}
    </div>
  );
}

export default memo(WorkGridView);