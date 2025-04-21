import React from 'react';
import styles from './WorkCard.module.css';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function WorkCard({ title, description, tags }) {
  return (
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
        <button className={styles.viewButton}>
          View Project
          <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
        </button>
      </div>
    </div>
  );
}

export default WorkCard;