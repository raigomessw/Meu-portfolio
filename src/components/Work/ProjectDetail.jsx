import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkProjects } from './WorkProjectContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExternalLinkAlt, faCode, faPalette, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import styles from './ProjectDetail.module.css';

function ProjectDetail() {
  const { projectId } = useParams();
  const { allProjects } = useWorkProjects();
  const project = allProjects.find(p => p.id === projectId);
  
  // Rolar para o topo quando o componente é carregado
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);
  
  // Se o projeto não existir, mostrar mensagem de erro
  if (!project) {
    return (
      <div className={styles.notFound}>
        <h1>Projeto não encontrado</h1>
        <p>Desculpe, o projeto que você está procurando não existe.</p>
        <Link to="/work" className={styles.backLink}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Voltar aos projetos
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.projectDetail}>
      {/* Hero Section */}
      <header className={styles.projectHeader}>
        <div className={styles.headerContent}>
          <Link to="/work" className={styles.backLink}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Voltar aos projetos
          </Link>
          <h1>{project.title}</h1>
          <div className={styles.tags}>
            {project.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src={project.backgroundImage} alt={project.title} />
        </div>
      </header>
      
      {/* Overview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Visão Geral</h2>
        <p className={styles.description}>{project.description}</p>
      </section>
      
      {/* Process Section */}
      <section className={`${styles.section} ${styles.processSection}`}>
        <div className={styles.processCard}>
          <div className={styles.processIcon}>
            <FontAwesomeIcon icon={faLightbulb} />
          </div>
          <h3>O Desafio</h3>
          <p>{project.details.challenge}</p>
        </div>
        
        <div className={styles.processCard}>
          <div className={styles.processIcon}>
            <FontAwesomeIcon icon={faPalette} />
          </div>
          <h3>A Solução</h3>
          <p>{project.details.solution}</p>
        </div>
      </section>
      
      {/* Technologies Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FontAwesomeIcon icon={faCode} />
          Tecnologias Utilizadas
        </h2>
        <ul className={styles.techList}>
          {project.details.technologies.map(tech => (
            <li key={tech} className={styles.techItem}>{tech}</li>
          ))}
        </ul>
      </section>
      
      {/* External Links */}
      <section className={styles.externalLinks}>
        <a 
          href={project.projectLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.externalLink}
        >
          <span>Ver no Figma</span>
          <FontAwesomeIcon icon={faExternalLinkAlt} />
        </a>
      </section>
      
      {/* Next/Prev Navigation */}
      <div className={styles.projectNavigation}>
        {getPrevNextProjects(allProjects, projectId).prev && (
          <Link 
            to={`/work/${getPrevNextProjects(allProjects, projectId).prev.id}`}
            className={`${styles.navLink} ${styles.prevLink}`}
          >
            <span>Projeto Anterior</span>
            <h4>{getPrevNextProjects(allProjects, projectId).prev.title}</h4>
          </Link>
        )}
        
        {getPrevNextProjects(allProjects, projectId).next && (
          <Link 
            to={`/work/${getPrevNextProjects(allProjects, projectId).next.id}`}
            className={`${styles.navLink} ${styles.nextLink}`}
          >
            <span>Próximo Projeto</span>
            <h4>{getPrevNextProjects(allProjects, projectId).next.title}</h4>
          </Link>
        )}
      </div>
    </div>
  );
}

// Helper function to get previous and next projects
function getPrevNextProjects(projects, currentId) {
  const currentIndex = projects.findIndex(p => p.id === currentId);
  
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null
  };
}

export default ProjectDetail;