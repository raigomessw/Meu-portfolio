import React, { memo, useRef } from 'react';
import styles from './WorkGridView.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEye } from '@fortawesome/free-solid-svg-icons';
import useInView from '../hooks/useInView'; // Hook personalizado que criaremos

const WorkGridItem = memo(({ project, onViewDetails }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { threshold: 0.1 });
  
  return (
    <div 
      ref={cardRef}
      className={`${styles.gridCard} ${isInView ? styles.inView : ''}`}
      style={{ 
        backgroundImage: isInView ? `url(${project.backgroundImage})` : 'none',
        backgroundColor: 'rgba(30, 30, 30, 0.8)'
      }}
    >
      <div className={styles.cardOverlay}></div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <div className={styles.cardTags}>
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
      {!isInView && (
        <div className={styles.loadingPlaceholder}>
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
  return (
    <div className={styles.gridContainer}>
      {projects.length === 0 ? (
        <div className={styles.noResults}>
          <h3>No projects found</h3>
          <p>Try changing your filters or check back later for new projects.</p>
        </div>
      ) : (
        projects.map(project => (
          <WorkGridItem 
            key={project.id} 
            project={project}
            onViewDetails={onViewDetails}
          />
        ))
      )}
    </div>
  );
}

export default memo(WorkGridView);