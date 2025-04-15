
import React from 'react';
import styles from './WorkCard.module.css';

function WorkCard({ image, title, description, tags }) {
  return (
    <div className={styles.workCard}>
      <img src={image} alt={title} className={styles.cardImage} />
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
        <button className={styles.viewButton}>View</button>
      </div>
    </div>
  );
}

export default WorkCard;