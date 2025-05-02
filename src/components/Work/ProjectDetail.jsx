import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkProjects } from './WorkProjectContext';
import { useTheme } from '../../Hooks/useTheme';
import styles from './ProjectDetail.module.css';

// Importar todos os ícones necessários do arquivo Icons.jsx
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  GithubIcon, 
  FigmaIcon, 
  ExternalLinkIcon,
  DoubleArrowDownIcon 
} from './Icons';

// Componente principal
function ProjectDetail() {
  const { projectId } = useParams();
  const { getProjectById, getNextProject, getPrevProject } = useWorkProjects();
  const { theme } = useTheme();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('all');
  
  // Refs para scroll e animações
  const gallerySectionRef = useRef(null);
  const challengeSectionRef = useRef(null);

  // Função para filtrar mídia da galeria por tipo
  const filterGallery = (type) => {
    setActiveGalleryFilter(type);
  };

  // Carregar dados do projeto
  useEffect(() => {
    setLoading(true);
    const fetchProject = async () => {
      try {
        const data = await getProjectById(projectId);
        setProject(data);
      } catch (error) {
        console.error('Fel vid inläsning av projektet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, getProjectById]);

  // Filtrar mídia baseada no tipo selecionado
  const filteredMedia = useMemo(() => {
    if (!project || !project.media) return [];
    
    if (activeGalleryFilter === 'all') {
      return project.media;
    }
    
    return project.media.filter(item => item.type === activeGalleryFilter);
  }, [project, activeGalleryFilter]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Laddar projektets detaljer...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.error}>
        <h2>Projektet hittades inte</h2>
        <Link to="/work" className={styles.backLink}>
          <ArrowLeftIcon />
          Tillbaka till alla projekt
        </Link>
      </div>
    );
  }

  // Scroll para a seção da galeria
  const scrollToGallery = () => {
    gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.projectDetail} style={{ backgroundColor: theme.background }}>
      {/* Header för projektet */}
      <div
        className={styles.projectHeader}
        style={{
          backgroundImage: `url(${project.coverImage})`,
          color: theme.textLight,
        }}
      >
        <div className={styles.headerOverlay}>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <div className={styles.projectMeta}>
            <span className={styles.projectDate}>{project.date}</span>
            <div className={styles.projectTags}>
              {project.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
          <button onClick={scrollToGallery} className={styles.scrollDown}>
            <span>Se projektet</span>
            <DoubleArrowDownIcon />
          </button>
        </div>
      </div>

      {/* Informações do projeto */}
      <section className={styles.projectInfo}>
        <div className={styles.projectInfoContent}>
          <div className={styles.projectDescription}>
            <h2>Om projektet</h2>
            <p>{project.extendedDescription}</p>
            
            <div className={styles.projectChallenges}>
              <h3>Utmaningar</h3>
              <p>{project.challenges}</p>
            </div>
            
            <div className={styles.projectSolution}>
              <h3>Lösning</h3>
              <p>{project.solution}</p>
            </div>
          </div>
          
          <div className={styles.projectSidebar}>
            {project.technologies && (
              <div className={styles.technologiesSection}>
                <h3>Teknologier</h3>
                <ul className={styles.technologiesList}>
                  {project.technologies.map((tech, index) => (
                    <li key={index}>
                      <span className={styles.techIcon}>{tech.icon}</span>
                      <span>{tech.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {(project.githubUrl || project.figmaUrl || project.liveUrl) && (
              <div className={styles.externalLinks}>
                <h3>Externa länkar</h3>
                <div className={styles.linksContainer}>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
                      <GithubIcon />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.figmaUrl && (
                    <a href={project.figmaUrl} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
                      <FigmaIcon />
                      <span>Figma</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
                      <ExternalLinkIcon />
                      <span>Live demo</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section ref={gallerySectionRef} className={styles.gallerySection}>
        <h2 className={styles.sectionTitle}>Galleri</h2>
        
        {/* Filtros da galeria */}
        <div className={styles.galleryFilters}>
          <button 
            className={`${styles.filterButton} ${activeGalleryFilter === 'all' ? styles.active : ''}`}
            onClick={() => filterGallery('all')}
          >
            Alla
          </button>
          {project.media.some(item => item.type === 'image') && (
            <button 
              className={`${styles.filterButton} ${activeGalleryFilter === 'image' ? styles.active : ''}`}
              onClick={() => filterGallery('image')}
            >
              Bilder
            </button>
          )}
          {project.media.some(item => item.type === 'video') && (
            <button 
              className={`${styles.filterButton} ${activeGalleryFilter === 'video' ? styles.active : ''}`}
              onClick={() => filterGallery('video')}
            >
              Videor
            </button>
          )}
          {project.media.some(item => item.type === 'prototype') && (
            <button 
              className={`${styles.filterButton} ${activeGalleryFilter === 'prototype' ? styles.active : ''}`}
              onClick={() => filterGallery('prototype')}
            >
              Prototyper
            </button>
          )}
        </div>
        
        <div className={styles.galleryContainer}>
          {filteredMedia.map((item, index) => (
            <div key={index} className={styles.galleryItem}>
              <div className={styles.mediaWrapper}>
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.title || `Bild ${index + 1}`} className={styles.galleryImage} />
                ) : item.type === 'video' ? (
                  <video controls className={styles.galleryVideo}>
                    <source src={item.url} type="video/mp4" />
                    Din webbläsare stöder inte videouppspelning.
                  </video>
                ) : (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.prototypeLink}>
                    <div className={styles.prototypeThumb} style={{ backgroundImage: `url(${item.thumbnail})` }}>
                      <div className={styles.prototypeOverlay}>
                        <ExternalLinkIcon />
                        <span>Öppna prototyp</span>
                      </div>
                    </div>
                  </a>
                )}
              </div>
              {(item.title || item.caption) && (
                <div className={styles.mediaCaption}>
                  {item.title && <h3>{item.title}</h3>}
                  {item.caption && <p>{item.caption}</p>}
                  {item.tags && (
                    <div className={styles.mediaTags}>
                      {item.tags.map((tag, i) => (
                        <span key={i} className={styles.mediaTag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Navegação entre projetos */}
      <div className={styles.projectNavigation}>
        {getPrevProject(projectId) && (
          <Link to={`/work/${getPrevProject(projectId).id}`} className={styles.prevProject}>
            <ArrowLeftIcon />
            <div className={styles.navInfo}>
              <span className={styles.navLabel}>Föregående projekt</span>
              <span className={styles.navTitle}>{getPrevProject(projectId).title}</span>
            </div>
          </Link>
        )}
        <Link to="/work" className={styles.backToProjects}>
          <ArrowLeftIcon />
          <span>Tillbaka till alla projekt</span>
        </Link>
        {getNextProject(projectId) && (
          <Link to={`/work/${getNextProject(projectId).id}`} className={styles.nextProject}>
            <div className={styles.navInfo}>
              <span className={styles.navLabel}>Nästa projekt</span>
              <span className={styles.navTitle}>{getNextProject(projectId).title}</span>
            </div>
            <ArrowRightIcon />
          </Link>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;