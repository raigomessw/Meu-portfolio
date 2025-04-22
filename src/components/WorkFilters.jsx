// WorkFilters.jsx
import React from 'react';
import styles from './WorkFilters.module.css';
import { useWorkProjects } from './WorkProjectContext';

function WorkFilters() {
  const { getAllTags, toggleFilter, activeFilters } = useWorkProjects();
  const allTags = getAllTags();
  
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersWrapper}>
        <h3 className={styles.filtersTitle}>Filtrar por:</h3>
        <div className={styles.tagsList}>
          {allTags.map((tag, index) => (
            <button
              key={index}
              className={`${styles.filterTag} ${activeFilters.includes(tag) ? styles.active : ''}`}
              onClick={() => toggleFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WorkFilters;