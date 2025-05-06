// WorkFilters.jsx
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import styles from './WorkFilters.module.css';
import { useWorkProjects } from './WorkProjectContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import useReducedMotion from '../../Hooks/useReducedMotion';

// Componente otimizado com memo para evitar re-renderizações desnecessárias
const WorkFilters = memo(function WorkFilters() {
  const { getAllTags, toggleFilter, activeFilters, resetFilters, projects } = useWorkProjects();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tagCounts, setTagCounts] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dropdownRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Dicionário de tradução para sueco
  const tagTranslations = {
    'UI/UX': 'UI/UX',
    'Web': 'Webb',
    'Mobile': 'Mobil',
    'Branding': 'Varumärke',
    'Design': 'Design',
    'Development': 'Utveckling',
    'Frontend': 'Frontend',
    'Backend': 'Backend',
    'Fullstack': 'Fullstack',
    'App': 'App',
    'React': 'React',
    'Node': 'Node',
    'E-commerce': 'E-handel',
    'Wordpress': 'WordPress',
    'Animation': 'Animation',
    'Graphic': 'Grafisk',
    'iOS': 'iOS',
    'Android': 'Android',
    'Portfolio': 'Portfolio'
  };
  
  // Calcular contagem de projetos por tag
  useEffect(() => {
    const counts = {};
    getAllTags().forEach(tag => {
      counts[tag] = projects.filter(project => project.tags.includes(tag)).length;
    });
    setTagCounts(counts);
  }, [projects, getAllTags]);
  
  // Detectar tamanho da tela para responsividade
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fechar dropdown quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handler para tecla Escape fechar o dropdown
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen]);
  
  // Obter tradução ou retornar a tag original
  const getTranslatedTag = useCallback((tag) => tagTranslations[tag] || tag, [tagTranslations]);
  
  // Ordenar tags por contagem (mais usadas primeiro) e depois alfabeticamente
  const allTags = getAllTags().sort((a, b) => {
    const countDiff = tagCounts[b] - tagCounts[a];
    // Se a contagem for igual, ordenar alfabeticamente
    return countDiff !== 0 ? countDiff : getTranslatedTag(a).localeCompare(getTranslatedTag(b));
  });
  
  // Função para alternar o filtro e fechar o dropdown em mobile
  const handleFilterClick = useCallback((tag) => {
    toggleFilter(tag);
    if (isMobile) {
      // Pequeno delay antes de fechar para melhor UX
      setTimeout(() => setIsDropdownOpen(false), 300);
    }
  }, [toggleFilter, isMobile]);
  
  // Resetar todos os filtros
  const handleResetFilters = useCallback(() => {
    resetFilters();
    if (isMobile) {
      setIsDropdownOpen(false);
    }
  }, [resetFilters, isMobile]);

  return (
    <>
      {/* Container para toggle em telas mobile */}
      <div className={styles.filterToggleContainer}>
        <button
          className={styles.mobileFilterToggle}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-controls="filter-dropdown"
          aria-label="Öppna/stäng filter"
        >
          <FontAwesomeIcon 
            icon={faFilter} 
            className={styles.filterIcon} 
            style={prefersReducedMotion ? { animation: 'none' } : {}} 
          />
          <span>{activeFilters.length > 0 
            ? `Filter (${activeFilters.length})` 
            : 'Filtrera projekt'
          }</span>
        </button>
      </div>
      
      {/* Container principal de filtros */}
      <div
        ref={dropdownRef}
        id="filter-dropdown" 
        className={`${styles.filterContainer} ${isDropdownOpen ? styles.visible : ''}`}
        role="group"
        aria-label="Projektfilter"
      >
        {/* Botão para mostrar todos os projetos */}
        <button
          className={`${styles.filterButton} ${activeFilters.length === 0 ? styles.active : ''} ${styles.allButton}`}
          onClick={handleResetFilters}
          aria-pressed={activeFilters.length === 0}
          style={prefersReducedMotion ? { transition: 'none' } : {}}
        >
          <span className={styles.filterText}>Alla projekt</span>
          <FontAwesomeIcon icon={faSyncAlt} className={styles.resetIcon} />
        </button>
        
        {/* Filtros por tag */}
        {allTags.map((tag, index) => {
          const isActive = activeFilters.includes(tag);
          const count = tagCounts[tag] || 0;
          
          return (
            <button
              key={index}
              className={`${styles.filterButton} ${isActive ? styles.active : ''}`}
              onClick={() => handleFilterClick(tag)}
              aria-pressed={isActive}
              style={prefersReducedMotion ? { transition: 'none' } : {}}
              data-tag={tag}
            >
              <span className={styles.filterText}>{getTranslatedTag(tag)}</span>
              <span 
                className={styles.count} 
                data-tooltip={`${count} projekt`}
                aria-label={`${count} projekt`}
              >
                {count}
              </span>
            </button>
          );
        })}
        
        {/* Botão para fechar filtros em mobile */}
        {isMobile && (
          <button
            className={`${styles.filterButton} ${styles.closeButton}`}
            onClick={() => setIsDropdownOpen(false)}
            aria-label="Stäng filter"
          >
            <span>Stäng</span>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
    </>
  );
});

export default WorkFilters;