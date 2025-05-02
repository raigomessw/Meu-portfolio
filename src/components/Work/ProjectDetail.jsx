import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useWorkProjects } from './WorkProjectContext';
import { useTheme } from '../../Hooks/useTheme';
import { useInView } from '../../Hooks/useInView';
import styles from './ProjectDetail.module.css';
import ProjectGallery from '../Gallery/ProjectGallery';

// Componentes de ícones para melhorar a UI
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M5 12L12 19M5 12L12 5"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12H19M19 12L12 5M19 12L12 19"/>
  </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const FigmaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z"/>
    <path d="M8 16h4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4"/>
    <path d="M8 8h4V4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4"/>
    <path d="M16 8c2.208 0 4-1.792 4-4s-1.792-4-4-4h-4v8h4z"/>
    <path d="M16 16c2.208 0 4-1.792 4-4s-1.792-4-4-4h-4v8h4z"/>
  </svg>
);

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

function ProjectDetail() {
  const { projectId } = useParams();
  const location = useLocation();
  const { getProjectById, filterImagesByCategory, activeImageCategory, getNextProject, getPrevProject } = useWorkProjects();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  
  // Refs para animações de scroll
  const aboutSectionRef = useRef(null);
  const gallerySectionRef = useRef(null);
  const techSectionRef = useRef(null);
  
  // Verificar se os elementos estão visíveis na tela
  const aboutInView = useInView(aboutSectionRef, { threshold: 0.2 });
  const galleryInView = useInView(gallerySectionRef, { threshold: 0.1 });
  const techInView = useInView(techSectionRef, { threshold: 0.2 });

  // Previne problema de scroll durante carregamento inicial
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);
  
  useEffect(() => {
    setLoading(true);
    
    // Logs para depuração
    console.log("Parâmetros da URL:", { projectId });
    console.log("URL atual:", location.pathname);
    
    // Pequeno delay para melhorar UX com animação de loading
    setTimeout(() => {
      const projectData = getProjectById(projectId);
      console.log("Projeto encontrado:", projectData);
      setProject(projectData);
      setLoading(false);
    }, 300);
  }, [projectId, getProjectById, location.pathname]);
  
  // Buscar projetos anterior e próximo
  const prevProject = project ? getPrevProject(project.id) : null;
  const nextProject = project ? getNextProject(project.id) : null;
  
  // Lidar com projeto não encontrado
  if (!loading && !project) {
    return (
      <div className={styles.notFound}>
        <h2>Projektet hittades inte</h2>
        <p>Projektet du letar efter finns inte eller har tagits bort.</p>
        <p className={styles.debugInfo}>Sökt ID: "{projectId}"</p>
        <Link to="/work" className={styles.backLink}>
          <ArrowLeftIcon />
          Tillbaka till alla projekt
        </Link>
      </div>
    );
  }
  
  // Estado de carregamento
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Laddar projektdetaljer...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.projectDetail}>
      {/* Header com imagem de capa e efeito parallax */}
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
        {/* Seção de informações com animação ao aparecer */}
        <div className={styles.projectInfo} ref={aboutSectionRef}>
          <div className={`${styles.infoSection} ${aboutInView ? 'animate-fade-in' : ''}`}>
            <h2>Om projektet</h2>
            <p>{project.extendedDescription}</p>
          </div>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3>Utmaningar</h3>
              <p>{project.challenges}</p>
            </div>
            
            <div className={styles.infoCard}>
              <h3>Lösning</h3>
              <p>{project.solution}</p>
            </div>
          </div>
          
          <div className={styles.technologiesSection} ref={techSectionRef}>
            <h3>Använda teknologier</h3>
            <div className={`${styles.techGrid} ${techInView ? 'animate-fade-in' : ''}`}>
              {project.technologies.map((tech, index) => (
                <div 
                  key={index} 
                  className={styles.techCard} 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className={styles.techIcon}>{tech.icon}</span>
                  <span className={styles.techName}>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Links do projeto com ícones */}
          {(project.liveUrl || project.githubUrl || project.figmaUrl) && (
            <div className={styles.projectLinks}>
              <h3>Projektlänkar</h3>
              <div className={styles.linksGrid}>
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${styles.linkButton} ${styles.liveLink}`}
                    aria-label="Visa hemsida"
                  >
                    <ExternalLinkIcon />
                    Visa hemsida
                  </a>
                )}
                
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${styles.linkButton} ${styles.githubLink}`}
                    aria-label="GitHub"
                  >
                    <GithubIcon />
                    GitHub
                  </a>
                )}
                
                {project.figmaUrl && (
                  <a 
                    href={project.figmaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${styles.linkButton} ${styles.figmaLink}`}
                    aria-label="Figma"
                  >
                    <FigmaIcon />
                    Figma
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Galeria de imagens com animações */}
        <div className={styles.gallerySection} ref={gallerySectionRef}>
          <h2>Projektgalleri</h2>
          
          {/* Verificação de debug para as imagens */}
          {console.log('DEBUG - Imagens para galeria:', project.images)}
          
          {/* Filtro por categoria */}
          {project.imageCategories && project.imageCategories.length > 0 && (
            <div className={`${styles.categoryFilter} ${galleryInView ? 'animate-fade-in' : ''}`}>
              <button 
                className={`${styles.categoryButton} ${!activeImageCategory ? styles.active : ''}`}
                onClick={() => filterImagesByCategory(null)}
              >
                <GridIcon />
                Alla bilder
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
          
          {/* Componente de galeria melhorado */}
          {project.images && project.images.length > 0 ? (
            <ProjectGallery 
              images={project.images}
              activeCategory={activeImageCategory}
              isVisible={true}
            />
          ) : (
            <div style={{padding: "20px", background: "#f8f8f8", borderRadius: "8px", textAlign: "center"}}>
              <p>Inga bilder tillgängliga</p>
            </div>
          )}
        </div>
        
        {/* Navegação entre projetos */}
        <div className={styles.projectNavigation}>
          {prevProject && (
            <Link to={`/work/${prevProject.id}`} className={styles.prevProject}>
              <ArrowLeftIcon />
              <span>Föregående</span>
            </Link>
          )}
          
          <Link to="/work" className={styles.backToProjects}>
            <ArrowLeftIcon />
            Tillbaka till alla projekt
          </Link>
          
          {nextProject && (
            <Link to={`/work/${nextProject.id}`} className={styles.nextProject}>
              <span>Nästa</span>
              <ArrowRightIcon />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;