import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExternalLinkAlt, faCode, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { throttle, detectDeviceCapability } from '../../utils/performance';
import styles from './ProjectDetail.module.css';
import { useWorkProjects } from './WorkProjectContext';

function ProjectDetail() {
  // Obtenha os projetos do contexto
  const { allProjects } = useWorkProjects();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const galleryRef = useRef(null);
  const modalRef = useRef(null);
  const imageRefs = useRef([]);
  const loadingTimers = useRef([]);
  
  const deviceCaps = detectDeviceCapability();
  const prefersReducedMotion = deviceCaps.prefersReducedMotion;
  
  // Encontrar projeto pelo ID
  useEffect(() => {
    // Usar allProjects do contexto para encontrar o projeto pelo ID
    const foundProject = allProjects.find(p => p.id === projectId);
    
    if (foundProject) {
      document.title = `${foundProject.title} | Projeto - Rai Gomes`;
      setProject(foundProject);
      
      // Simular um tempo de carregamento mínimo para evitar flash
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      
      loadingTimers.current.push(timer);
    } else {
      navigate('/work', { replace: true });
    }
    
    return () => {
      document.title = 'Portfolio - Rai Gomes';
      loadingTimers.current.forEach(timer => clearTimeout(timer));
    };
  }, [projectId, navigate, allProjects]);
  
  // Animações de entrada - otimizadas para evitar jank
  useEffect(() => {
    if (!loading && !prefersReducedMotion) {
      // Layout header
      const showHeader = setTimeout(() => {
        if (headerRef.current) {
          headerRef.current.classList.add(styles.visible);
        }
      }, 100);
      
      // Layout content com atraso para evitar trabalho simultâneo
      const showContent = setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.classList.add(styles.visible);
        }
      }, 300);
      
      loadingTimers.current.push(showHeader, showContent);
    }
    
    return () => {
      loadingTimers.current.forEach(timer => clearTimeout(timer));
    };
  }, [loading, prefersReducedMotion]);
  
  // Rastrear imagens carregadas
  const handleImageLoaded = useCallback(() => {
    setImagesLoaded(prev => {
      const newCount = prev + 1;
      // Mostrar galeria apenas quando todas as imagens estiverem carregadas
      if (project && newCount >= (project.images?.length || 0)) {
        requestAnimationFrame(() => {
          setGalleryVisible(true);
        });
      }
      return newCount;
    });
  }, [project]);
  
  // Fechar com ESC e evitar scroll quando modal aberto
  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setSelectedImage(null);
        }
      };
      
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [selectedImage]);
  
  // Detectar cliques fora do modal para fechar
  const handleOutsideClick = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedImage(null);
    }
  }, []);
  
  // Voltar para página de trabalhos
  const goBack = useCallback(() => {
    navigate('/work');
  }, [navigate]);
  
  // Scroll suave para o conteúdo
  const scrollToContent = useCallback(() => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }, []);
  
  // Optimized scroll handler with throttle
  const handleScroll = throttle(() => {
    if (!headerRef.current) return;
    
    const scrollPos = window.scrollY;
    const opacity = Math.max(0, Math.min(1, 1 - scrollPos / 300));
    const scale = Math.max(0.92, Math.min(1, 1 - scrollPos / 1000));
    
    requestAnimationFrame(() => {
      headerRef.current.style.opacity = opacity;
      headerRef.current.style.transform = `scale(${scale})`;
    });
  }, 60);
  
  useEffect(() => {
    if (!loading && !prefersReducedMotion) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, handleScroll, prefersReducedMotion]);
  
  // Classes dinâmicas
  const containerClass = `${styles.projectContainer} 
    ${prefersReducedMotion ? styles.reducedMotion : ''} 
    ${loading ? styles.loading : ''}`;
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Carregando projeto...</p>
      </div>
    );
  }
  
  if (!project) return null;
  
  return (
    <div className={containerClass}>
      <header 
        className={styles.projectHeader} 
        ref={headerRef} 
        style={{ backgroundImage: `url(${project.backgroundImage})` }}
      >
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <div className={styles.backButton} onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Voltar para Projetos</span>
          </div>
          
          <h1 className={styles.projectTitle}>{project.title}</h1>
          
          <div className={styles.projectMeta}>
            {project.date && (
              <span className={styles.projectDate}>{project.date}</span>
            )}
            
            <div className={styles.projectTags}>
              {project.tags.map((tag, idx) => (
                <span key={idx} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Indicador de rolagem para o conteúdo */}
        <div 
          className={styles.scrollIndicator} 
          onClick={scrollToContent}
          aria-hidden="true"
        >
          <span className={styles.scrollIconArrow}></span>
        </div>
      </header>
      
      <main className={styles.projectContent} ref={contentRef}>
        <section className={styles.projectOverview}>
          <h2>Visão Geral</h2>
          <p>{project.overview || project.description}</p>
          
          {project.details?.challenge && (
            <>
              <h3>O Desafio</h3>
              <p>{project.details.challenge}</p>
            </>
          )}
          
          {project.details?.solution && (
            <>
              <h3>A Solução</h3>
              <p>{project.details.solution}</p>
            </>
          )}
        </section>
        
        <section className={styles.projectTech}>
          <h2>Tecnologias Utilizadas</h2>
          <ul className={styles.techList}>
            {project.details?.technologies?.map((tech, idx) => (
              <li key={idx} className={styles.techItem}>
                {tech.icon && <FontAwesomeIcon icon={tech.icon} />}
                {tech.name || tech}
              </li>
            ))}
          </ul>
        </section>
        
        <section className={styles.projectLinks}>
          {project.projectLink && (
            <a 
              href={project.projectLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.projectLink} ${styles.liveLink}`}
            >
              <FontAwesomeIcon icon={faGlobe} />
              Ver Projeto
            </a>
          )}
          
          {project.githubLink && (
            <a 
              href={project.githubLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.projectLink} ${styles.codeLink}`}
            >
              <FontAwesomeIcon icon={faCode} />
              Ver Código
            </a>
          )}
        </section>
        
        {project.images && project.images.length > 0 && (
          <section 
            className={`${styles.projectGallery} ${galleryVisible ? styles.visible : ''}`}
            ref={galleryRef}
          >
            <h2>Galeria</h2>
            <div className={styles.galleryGrid}>
              {project.images.map((image, idx) => (
                <div 
                  key={idx} 
                  className={styles.galleryItem}
                  onClick={() => setSelectedImage(image)}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <img 
                    src={image.thumbnail || image.src} 
                    alt={image.alt || `${project.title} - Imagem ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    ref={el => imageRefs.current[idx] = el}
                    onLoad={handleImageLoaded}
                  />
                  <div className={styles.imageOverlay}>
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {selectedImage && (
          <div 
            className={styles.imageModal} 
            onClick={handleOutsideClick}
          >
            <div 
              className={styles.modalContent} 
              ref={modalRef}
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt || 'Imagem em destaque'}
                className={styles.modalImage}
              />
              
              {selectedImage.caption && (
                <p className={styles.imageCaption}>{selectedImage.caption}</p>
              )}
              
              <button 
                className={styles.closeModal}
                onClick={() => setSelectedImage(null)}
                aria-label="Fechar imagem"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProjectDetail;