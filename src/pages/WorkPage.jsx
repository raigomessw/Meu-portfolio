import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import styles from './WorkPage.module.css';
import WorkGridView from '../components/Work/WorkGridView';
import { useWorkProjects } from '../components/Work/WorkProjectContext';

function WorkPage() {
  const navigate = useNavigate();
  // Desestruturando exatamente o que precisamos do contexto
  const { 
    projects, 
    allProjects, 
    projetos, 
    isLoading: contextLoading, 
    allTags: contextTags,
    filterProjects: contextFilterProjects
  } = useWorkProjects();
  
  // Usando projetos do contexto ou fazendo um fallback para um array vazio
  const availableProjects = projects || projetos || allProjects || [];
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Alla');
  const [allTags, setAllTags] = useState(['Alla']);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  
  useEffect(() => {
    // Log para debug - verificar dados do contexto
    console.log('WorkPage - Kontextdata:', { 
      projects: projects?.length || 0,
      allProjects: allProjects?.length || 0,
      projetos: projetos?.length || 0,
      contextTags: contextTags?.length || 0
    });
    
    // Se houver tags no contexto, usamos elas
    if (contextTags && contextTags.length > 0) {
      // Traduzir "All" para "Alla" se estiver presente
      const translatedTags = contextTags.map(tag => tag === 'All' ? 'Alla' : tag);
      setAllTags(translatedTags);
    }
    
    // Se houver projetos disponíveis, atualizamos o estado
    if (availableProjects.length > 0) {
      setVisibleProjects(availableProjects);
      setIsLoading(false);
    }
  }, [projects, allProjects, projetos, contextTags, availableProjects]);
  
  // Extrair todas as tags únicas apenas se necessário
  useEffect(() => {
    if (!contextTags && availableProjects.length > 0) {
      const tags = new Set(['Alla']);
      availableProjects.forEach(project => {
        if (project.tags) {
          project.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
    }
  }, [availableProjects, contextTags]);

  // Adicione este script em seu componente React que renderiza a WorkPage

// Substitua o useEffect que gerencia o resize com este:
useEffect(() => {
  const handleResize = () => {
    // Use seletores mais específicos baseados nos estilos do seu módulo CSS
    const projectsGrid = document.querySelector(`.${styles.projectsGrid}`);
    const projectCards = document.querySelectorAll(`.${styles.projectCard}`);
    
    // Verificar se é um Surface Pro 7 ou similar (912px de largura)
    if (window.innerWidth >= 900 && window.innerWidth <= 920) {
      console.log('Surface Pro 7 detected!'); // Log para debug
      
      // Aplicar classes específicas com o prefixo do CSS Module
      if (projectsGrid) {
        projectsGrid.classList.add(styles.surfaceProGrid);
        console.log('Added surfaceProGrid class');
      }
      
      if (projectCards && projectCards.length > 0) {
        projectCards.forEach(card => {
          card.classList.add(styles.surfaceProCard);
        });
        console.log(`Added surfaceProCard class to ${projectCards.length} cards`);
      }
    } else {
      // Remover classes específicas
      if (projectsGrid) {
        projectsGrid.classList.remove(styles.surfaceProGrid);
      }
      
      if (projectCards && projectCards.length > 0) {
        projectCards.forEach(card => {
          card.classList.remove(styles.surfaceProCard);
        });
      }
    }
  };
  
  // Executar no carregamento e em cada redimensionamento
  handleResize();
  window.addEventListener('resize', handleResize);
  
  // Executar novamente após um pequeno delay para garantir que o DOM foi carregado
  const timeoutId = setTimeout(handleResize, 500);
  
  return () => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(timeoutId);
  };
}, [styles]); // Adicionar styles como dependência
  
  // Filtrar projetos
  const filterProjects = (tag) => {
    setActiveFilter(tag);
    
    // Se tivermos a função de filtro do contexto, a usamos
    if (contextFilterProjects) {
      // Converter de volta para "All" se for "Alla" antes de passar para o contexto
      const originalTag = tag === 'Alla' ? 'All' : tag;
      contextFilterProjects(originalTag);
      return;
    }
    
    // Caso contrário, filtramos manualmente
    if (tag === 'Alla') {
      setVisibleProjects(availableProjects);
    } else {
      const filtered = availableProjects.filter(project => 
        project.tags && project.tags.includes(tag)
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

  // Função para manipular a visualização prévia
  const handleQuickView = (project) => {
    setSelectedProject(project);
    setQuickViewOpen(true);
    if (project && project.id) {
      navigate(`/work/${project.id}`);
    } else {
      console.error('Ogiltigt projekt eller projekt utan ID:', project);
    }
  };

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
          <h1>Mina Projekt.</h1>
          <p>Utforska mitt design- och utvecklingsarbete.</p>
        </div>
        
        <div className={styles.controlsBar}>
          <button 
            className={styles.mobileFilterToggle}
            onClick={() => setMobileFiltersVisible(!mobileFiltersVisible)}
            aria-expanded={mobileFiltersVisible}
            aria-controls="project-filters"
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Filter</span>
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
        
        {isLoading || contextLoading ? (
          <div className={styles.loaderContainer}>
            <span className={styles.loader}></span>
          </div>
        ) : visibleProjects && visibleProjects.length > 0 ? (
          <WorkGridView 
            projects={visibleProjects} 
            onQuickView={handleQuickView}
          />
        ) : (
          <div className={styles.noProjects}>
            <p>Inga projekt hittades för det valda filtret.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default WorkPage;