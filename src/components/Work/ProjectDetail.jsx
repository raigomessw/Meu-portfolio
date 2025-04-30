import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useWorkProjects } from './WorkProjectContext';
import styles from './ProjectDetail.module.css';
import ProjectGallery from '../Gallery/ProjectGallery';

function ProjectDetail() {
  // Use o nome correto do parâmetro (projectId)
  const { projectId } = useParams();
  const location = useLocation();
  const { getProjectById, filterImagesByCategory, activeImageCategory } = useWorkProjects();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    
    // Logs para depuração - CORREÇÃO: Não chamar useParams() aqui dentro
    console.log("Parâmetros da URL:", { projectId }); // Usar o valor já capturado
    console.log("URL atual:", location.pathname);
    console.log("ID do projeto a buscar:", projectId);
    
    // Pequeno delay para melhorar UX
    setTimeout(() => {
      const projectData = getProjectById(projectId);
      console.log("Projeto encontrado:", projectData);
      setProject(projectData);
      setLoading(false);
    }, 300);
  }, [projectId, getProjectById, location.pathname]);
  
  // Lidar com projeto não encontrado
  if (!loading && !project) {
    return (
      <div className={styles.notFound}>
        <h2>Projeto não encontrado</h2>
        <p>O projeto que você está procurando não existe ou foi removido.</p>
        <p className={styles.debugInfo}>ID buscado: "{projectId}"</p>
        <Link to="/work" className={styles.backLink}>Voltar para projetos</Link>
      </div>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Carregando detalhes do projeto...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.projectDetail}>
      {/* Header com imagem de capa */}
      <div 
        className={styles.projectHeader}
        style={{ backgroundImage: `url(${project.coverImage})` }}
      >
        <div className={styles.headerOverlay}>
          <div className={styles.projectHeading}>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <div className={styles.projectTags}>
              {project.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.projectContent}>
        {/* Seção de informações */}
        <div className={styles.projectInfo}>
          <div className={styles.infoSection}>
            <h2>Sobre o Projeto</h2>
            <p>{project.extendedDescription}</p>
          </div>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3>Desafios</h3>
              <p>{project.challenges}</p>
            </div>
            
            <div className={styles.infoCard}>
              <h3>Solução</h3>
              <p>{project.solution}</p>
            </div>
          </div>
          
          <div className={styles.technologiesSection}>
            <h3>Tecnologias Utilizadas</h3>
            <div className={styles.techGrid}>
              {project.technologies.map((tech, index) => (
                <div key={index} className={styles.techCard}>
                  <span className={styles.techIcon}>{tech.icon}</span>
                  <span className={styles.techName}>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Links do projeto */}
          {(project.liveUrl || project.githubUrl || project.figmaUrl) && (
            <div className={styles.projectLinks}>
              <h3>Links do Projeto</h3>
              <div className={styles.linksGrid}>
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${styles.linkButton} ${styles.liveLink}`}
                  >
                    Ver Site
                  </a>
                )}
                
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${styles.linkButton} ${styles.githubLink}`}
                  >
                    GitHub
                  </a>
                )}
                
                {project.figmaUrl && (
                  <a 
                    href={project.figmaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${styles.linkButton} ${styles.figmaLink}`}
                  >
                    Figma
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Galeria de imagens */}
        <div className={styles.gallerySection}>
          <h2>Galeria do Projeto</h2>
          
          {/* Filtro por categoria */}
          {project.imageCategories && project.imageCategories.length > 0 && (
            <div className={styles.categoryFilter}>
              <button 
                className={`${styles.categoryButton} ${!activeImageCategory ? styles.active : ''}`}
                onClick={() => filterImagesByCategory(null)}
              >
                Todas as imagens
              </button>
              
              {project.imageCategories.map((category, index) => (
                <button 
                  key={index}
                  className={`${styles.categoryButton} ${activeImageCategory === category ? styles.active : ''}`}
                  onClick={() => filterImagesByCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
          
          {/* Componente de galeria */}
          <ProjectGallery 
            images={project.images} 
            activeCategory={activeImageCategory}
          />
        </div>
        
        {/* Navegação */}
        <div className={styles.projectNavigation}>
          <Link to="/work" className={styles.backToProjects}>
            Voltar para todos os projetos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;