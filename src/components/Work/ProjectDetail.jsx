import React, { useState, useEffect, useRef, useMemo } from 'react';
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

const ArrowDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
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

function ProjectDetail() {
  const { projectId } = useParams();
  const location = useLocation();
  const { 
    getProjectById, 
    activeImageCategory,
    getNextProject, 
    getPrevProject
  } = useWorkProjects();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('hero');
  const { theme } = useTheme();
  
  // Refs para as seções
  const heroSectionRef = useRef(null);
  const overviewSectionRef = useRef(null);
  const gallerySectionRef = useRef(null);
  const processSectionRef = useRef(null);
  const nextProjectSectionRef = useRef(null);
  
  // Refs para animações de scroll
  const aboutSectionRef = useRef(null);
  const techSectionRef = useRef(null);
  
  // Verificar se os elementos estão visíveis na tela
  const aboutInView = useInView(aboutSectionRef, { threshold: 0.2 });
  const galleryInView = useInView(gallerySectionRef, { threshold: 0.1 });
  const techInView = useInView(techSectionRef, { threshold: 0.2 });
  const processInView = useInView(processSectionRef, { threshold: 0.2 });

  // Previne problema de scroll durante carregamento inicial
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);
  
  // Detectar a seção atual com base no scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      if (heroSectionRef.current && scrollPosition < heroSectionRef.current.offsetTop + heroSectionRef.current.offsetHeight) {
        setCurrentSection('hero');
      } else if (overviewSectionRef.current && scrollPosition < overviewSectionRef.current.offsetTop + overviewSectionRef.current.offsetHeight) {
        setCurrentSection('overview');
      } else if (gallerySectionRef.current && scrollPosition < gallerySectionRef.current.offsetTop + gallerySectionRef.current.offsetHeight) {
        setCurrentSection('gallery');
      } else if (processSectionRef.current && scrollPosition < processSectionRef.current.offsetTop + processSectionRef.current.offsetHeight) {
        setCurrentSection('process');
      } else if (nextProjectSectionRef.current) {
        setCurrentSection('next');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
  
  // Extrair categorias únicas para os filtros
  const mediaCategories = useMemo(() => {
    if (!project || !project.media) return [];
    
    const categories = new Set();
    project.media.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    
    return Array.from(categories);
  }, [project]);
  
  // Contar o número de cada tipo de mídia
  const mediaCounts = useMemo(() => {
    if (!project || !project.media) return { total: 0, image: 0, video: 0, prototype: 0 };
    
    const counts = {
      total: project.media.length,
      image: 0,
      video: 0,
      prototype: 0
    };
    
    project.media.forEach(item => {
      if (counts[item.type] !== undefined) {
        counts[item.type]++;
      }
    });
    
    return counts;
  }, [project]);
  
  // Agrupar mídia por categoria para exibição em seções separadas
  const groupedMedia = useMemo(() => {
    if (!project || !project.media) return {};
    
    const groups = {};
    mediaCategories.forEach(category => {
      const items = project.media.filter(item => item.category === category);
      if (items.length > 0) {
        groups[category] = items;
      }
    });
    
    return groups;
  }, [project, mediaCategories]);
  
  // Scroll para a próxima seção
  const scrollToNextSection = () => {
    if (overviewSectionRef.current) {
      overviewSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Buscar projetos anterior e próximo
  const prevProject = project ? getPrevProject(project.id) : null;
  const nextProject = project ? getNextProject(project.id) : null;
  
  // Lidar com projeto não encontrado
  if (!loading && !project) {
    return (
      <div className={styles.notFound}>
        <h2>Projektet hittades inte</h2>
        <p>Projektet du letar efter finns inte eller har tagits bort.</p>
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
      </div>
    );
  }
  
  return (
    <div className={styles.projectDetail}>
      {/* Navegação lateral fixa */}
      <div className={styles.sideNavigation}>
        <div className={styles.sideNavItems}>
          <a 
            href="#hero" 
            className={`${styles.sideNavItem} ${currentSection === 'hero' ? styles.active : ''}`}
            onClick={(e) => {
              e.preventDefault();
              heroSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className={styles.sideNavDot}></span>
            <span className={styles.sideNavText}>Início</span>
          </a>
          <a 
            href="#overview" 
            className={`${styles.sideNavItem} ${currentSection === 'overview' ? styles.active : ''}`}
            onClick={(e) => {
              e.preventDefault();
              overviewSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className={styles.sideNavDot}></span>
            <span className={styles.sideNavText}>Visão Geral</span>
          </a>
          <a 
            href="#gallery" 
            className={`${styles.sideNavItem} ${currentSection === 'gallery' ? styles.active : ''}`}
            onClick={(e) => {
              e.preventDefault();
              gallerySectionRef.current.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className={styles.sideNavDot}></span>
            <span className={styles.sideNavText}>Galeria</span>
          </a>
          <a 
            href="#process" 
            className={`${styles.sideNavItem} ${currentSection === 'process' ? styles.active : ''}`}
            onClick={(e) => {
              e.preventDefault();
              processSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className={styles.sideNavDot}></span>
            <span className={styles.sideNavText}>Processo</span>
          </a>
        </div>
      </div>

      {/* Header com imagem de fundo em tela cheia */}
      <section 
        id="hero" 
        className={styles.heroSection} 
        ref={heroSectionRef}
        style={{ backgroundImage: `url(${project.coverImage})` }}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
          </div>
          <div className={styles.scrollDown} onClick={scrollToNextSection}>
            <ArrowDownIcon />
            <span>Scroll</span>
          </div>
        </div>
      </section>
      
      {/* Seção de visão geral */}
      <section id="overview" className={styles.overviewSection} ref={overviewSectionRef}>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewMain}>
            <h2>Översikt</h2>
            <div className={styles.overviewDescription}>
              <p>{project.extendedDescription}</p>
            </div>
          </div>
          
          <div className={styles.overviewSidebar}>
            <div className={styles.overviewMetadata}>
              <div className={styles.metadataItem}>
                <h3>År</h3>
                <p>{project.date}</p>
              </div>
              
              <div className={styles.metadataItem}>
                <h3>Roll</h3>
                <div className={styles.tagsList}>
                  {project.tags && project.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className={styles.metadataItem}>
                <h3>Länkar</h3>
                <div className={styles.linksList}>
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.externalLink}
                    >
                      <ExternalLinkIcon />
                      <span>Live Site</span>
                    </a>
                  )}
                  
                  {project.figmaUrl && (
                    <a 
                      href={project.figmaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.externalLink}
                    >
                      <FigmaIcon />
                      <span>Figma</span>
                    </a>
                  )}
                  
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.externalLink}
                    >
                      <GithubIcon />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seção de desafios e soluções */}
      <section className={styles.challengesSection}>
        <div className={styles.challengesGrid}>
          <div className={styles.challengeItem} ref={aboutSectionRef}>
            <div className={`${styles.challengeContent} ${aboutInView ? styles.visible : ''}`}>
              <h3>Utmaningar</h3>
              <p>{project.challenges}</p>
            </div>
          </div>
          
          <div className={styles.challengeItem}>
            <div className={`${styles.challengeContent} ${aboutInView ? styles.visible : ''}`}>
              <h3>Lösning</h3>
              <p>{project.solution}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seção da galeria com rolagem horizontal */}
      <section id="gallery" className={styles.galleryHorizontalSection} ref={gallerySectionRef}>
        <div className={styles.galleryHeader}>
          <h2>Visualisering</h2>
        </div>
        
        <ProjectGallery 
          media={project.media} 
          activeCategory={activeImageCategory || 'all'}
          isVisible={galleryInView}
        />
      </section>
      
      {/* Vídeos em tamanho grande com fundo escuro */}
      {project.media && project.media.filter(item => item.type === "video").length > 0 && (
        <section className={styles.videoSection}>
          <div className={styles.videoWrapper}>
            {project.media
              .filter(item => item.type === "video")
              .slice(0, 1)
              .map((video, index) => (
                <div key={index} className={styles.videoContainer}>
                  <video
                    src={video.url}
                    poster={video.thumbnail}
                    controls
                    className={styles.featureVideo}
                    playsInline
                  />
                  <div className={styles.videoCaption}>
                    <h3>{video.title}</h3>
                    <p>{video.caption}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
      
      {/* Processo e tecnologias */}
      <section id="process" className={styles.processSection} ref={processSectionRef}>
        <div className={styles.processSectionHeader}>
          <h2>Teknisk process</h2>
        </div>
        
        <div className={styles.processGrid}>
          <div className={styles.processDescription}>
            <p>För att leverera detta projekt använde jag följande tekniker och metoder:</p>
          </div>
          
          <div className={styles.technologiesSection} ref={techSectionRef}>
            <div className={`${styles.techGrid} ${techInView ? styles.visible : ''}`}>
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
        </div>
      </section>
      
      {/* Mais imagens da galeria em diferentes layouts */}
      {mediaCategories.length > 0 && (
        <section className={styles.galleryGridSection}>
          {mediaCategories.map(category => {
            const items = groupedMedia[category];
            if (!items || items.length === 0) return null;
            
            return (
              <div key={category} className={styles.galleryCategory}>
                <h3>{category}</h3>
                <div className={styles.galleryGrid}>
                  {items
                    .filter(item => item.type === "image")
                    .map((item, index) => (
                      <div 
                        key={index} 
                        className={`${styles.galleryGridItem} ${index % 3 === 0 ? styles.gridItemLarge : ''}`}
                      >
                        <img 
                          src={item.url} 
                          alt={item.title || 'Gallery image'}
                          className={styles.galleryImage}
                          loading="lazy"
                        />
                        {item.title && (
                          <div className={styles.imageCaption}>
                            <h4>{item.title}</h4>
                            {item.caption && <p>{item.caption}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </section>
      )}
      
      {/* Próximo projeto */}
      {nextProject && (
        <section className={styles.nextProjectSection} ref={nextProjectSectionRef}>
          <div className={styles.nextProjectInfo}>
            <span className={styles.nextProjectLabel}>Nästa projekt</span>
            <h2>{nextProject.title}</h2>
            <Link to={`/work/${nextProject.id}`} className={styles.nextProjectLink}>
              <span>Visa projekt</span>
              <ArrowRightIcon />
            </Link>
          </div>
          <div 
            className={styles.nextProjectBackground}
            style={{ backgroundImage: `url(${nextProject.thumbnailImage})` }}
          ></div>
        </section>
      )}
      
      {/* Navegação entre projetos no rodapé */}
      <div className={styles.projectNavigation}>
        <div className={styles.navLinks}>
          <Link to="/work" className={styles.backToProjects}>
            <ArrowLeftIcon />
            <span>Alla projekt</span>
          </Link>
          
          <div className={styles.projectPagination}>
            {prevProject && (
              <Link to={`/work/${prevProject.id}`} className={styles.prevProject}>
                <ArrowLeftIcon />
                <span>Föregående</span>
              </Link>
            )}
            
            {nextProject && (
              <Link to={`/work/${nextProject.id}`} className={styles.nextProject}>
                <span>Nästa</span>
                <ArrowRightIcon />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;