import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import styles from './WorkPage.module.css';
import WorkGridView from '../components/Work/WorkGridView';
import { projects } from '../components/Work/WorkProjectContext';

function WorkPage() {
  const navigate = useNavigate();
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [allTags, setAllTags] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  
  // Extrair todas as tags únicas dos projetos
  useEffect(() => {
    const tags = new Set(['All']);
    projects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    setAllTags(Array.from(tags));
  }, []);
  
  // Carregar projetos com um pequeno delay para animação
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      filterProjects(activeFilter);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [activeFilter]);
  
  // Função para filtrar projetos
  const filterProjects = (tag) => {
    setActiveFilter(tag);
    
    if (tag === 'All') {
      setVisibleProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.tags.includes(tag)
      );
      setVisibleProjects(filtered);
    }
  };
  
  // Fechar filtros mobile quando clica fora
  const filtersRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setMobileFiltersVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filtersRef]);

  return (
    <section className={styles.workContainer}>
       {/* Elementos de background */}
       <div className={styles.pageBackground}></div>
      <div className={styles.meshGrid}></div>
      <div className={styles.colorFog}></div>
      <div className={styles.topLight}></div>
      
      <div className={styles.nodesContainer}>
        <div className={styles.node}></div>
        <div className={styles.node}></div>
        <div className={styles.node}></div>
        <div className={styles.node}></div>
        <div className={styles.node}></div>
      </div>
      
      <div className={styles.starsContainer}>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
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
          ref={filtersRef}
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
          <WorkGridView projects={visibleProjects} />
        )}
      </div>
    </section>
  );
}

export default WorkPage;