import React from 'react';
import styles from './WorkGridView.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function WorkGridView({ projects }) {
  return (
    <div className={styles.gridContainer}>
      {projects.map(project => (
        <div 
          key={project.id} 
          className={styles.gridCard}
          style={{ backgroundImage: `url(${project.backgroundImage})` }}
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
            <div className={`${styles.cardActions} ${styles.buttonContainer}`}>
              <a 
                href={project.projectLink}
                className={styles.viewButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WorkGridView;