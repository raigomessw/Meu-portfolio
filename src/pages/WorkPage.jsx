import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { useWorkProjects } from '../components/Work/WorkProjectContext';
import WorkGridView from '../components/Work/WorkGridView';
import styles from './WorkPage.module.css';

function WorkPage() {
  const { allProjects } = useWorkProjects();
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  const navigate = useNavigate();

  // Extrair todas as tags únicas dos projetos
  const allTags = ['All', ...new Set(allProjects.flatMap(project => project.tags))];

  useEffect(() => {
    // Simular carregamento inicial
    setTimeout(() => {
      setIsLoading(false);
      setVisibleProjects(allProjects);
    }, 800);
  }, [allProjects]);

  // Filtrar projetos por tag
  const filterProjects = (tag) => {
    setActiveFilter(tag);
    setIsLoading(true);
    
    setTimeout(() => {
      if (tag === 'All') {
        setVisibleProjects(allProjects);
      } else {
        setVisibleProjects(allProjects.filter(project => project.tags.includes(tag)));
      }
      setIsLoading(false);
    }, 400);
  };

  // Handler para visualizar detalhes do projeto
  const handleViewDetails = (project) => {
    navigate(`/work/${project.id}`);
  };

  return (
    <section className={styles.workContainer}>
      <div className={styles.backgroundWrapper}>
        <div className={styles.darkGradient}></div>
        <div className={styles.noiseTexture}></div>
        <div className={styles.glowEffect}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>My Projects.</h1>
          <p>Explore my design and development work.</p>
        </div>
        
        <div className={styles.controlsBar}>
          <button 
            className={styles.mobileFilterToggle}
            onClick={() => setMobileFiltersVisible(!mobileFiltersVisible)}
            aria-expanded={mobileFiltersVisible}
            aria-controls="project-filters"
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Filtros</span>
          </button>
        </div>
        
        <div 
          id="project-filters"
          className={`${styles.filters} ${mobileFiltersVisible ? styles.filtersVisible : ''}`}
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.filterButton} ${activeFilter === tag ? styles.active : ''}`}
              onClick={() => filterProjects(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <span className={styles.loader}></span>
          </div>
        ) : (
          <WorkGridView 
            projects={visibleProjects} 
            onViewDetails={handleViewDetails}
          />
        )}
      </div>
    </section>
  );
}

export default WorkPage;