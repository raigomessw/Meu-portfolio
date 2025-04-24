import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './ProjectDetail.module.css';
import { projects } from './WorkProjectContext';

// Função throttle simples (se ainda não instalou lodash)
function throttle(func, wait) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      return func.apply(this, args);
    }
  };
}

// Componentes de ícone simples
const IconArrowBack = () => <span className={styles.icon}>←</span>;
const IconEye = () => <span className={styles.icon}>👁️</span>;
const IconGithub = () => <span className={styles.icon}>📂</span>;
const IconClose = () => <span className={styles.icon}>✕</span>;
const IconArrowLeft = () => <span className={styles.icon}>←</span>;
const IconArrowRight = () => <span className={styles.icon}>→</span>;
const IconExpand = () => <span className={styles.icon}>⤢</span>;

// URL de fallback local para a pasta public
const FALLBACK_IMAGE = "/work/placeholder.jpg";

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const [nextProject, setNextProject] = useState(null);
  const [prevProject, setPrevProject] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Refs para elementos DOM
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const galleryRef = useRef(null);
  const progressRef = useRef(null);
  const parallaxLayersRef = useRef([]);
  const sectionsRef = useRef({
    overview: null,
    tech: null,
    gallery: null
  });

  // Função para voltar para a página de trabalhos
  const goToProjects = useCallback(() => {
    navigate('/work');
  }, [navigate]);

  // Função para scroll suave até o conteúdo
  const scrollToContent = useCallback(() => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Função para abrir modal
  const openModal = useCallback((index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  // Função para fechar modal
  const closeModal = useCallback(() => {
    setModalOpen(false);
    document.body.style.overflow = '';
  }, []);

  // Função para navegar entre imagens
  const navigateImages = useCallback((direction) => {
    if (!project || !project.images) return;
    
    const imagesLength = project.images.length;
    
    if (direction === 'next') {
      setCurrentImageIndex(prev => (prev + 1) % imagesLength);
    } else {
      setCurrentImageIndex(prev => (prev - 1 + imagesLength) % imagesLength);
    }
  }, [project]);

  // Função para lidar com erro de carregamento da imagem
  const handleImageError = useCallback((e) => {
    console.error("Erro ao carregar a imagem de capa");
    console.log("URL da imagem com problema:", e.target.src);
    setImageError(true);
  }, []);

  useEffect(() => {
    if (project) {
      console.log("DEBUG - Caminhos das imagens:");
      console.log("coverImage:", project.coverImage);
      console.log("backgroundImage:", project.backgroundImage);
      
      // Verificar se as URLs são válidas
      fetch(project.coverImage)
        .then(response => {
          console.log(`Resposta da imagem de capa: ${response.status} ${response.ok ? '✅' : '❌'}`);
        })
        .catch(error => console.error("Erro ao verificar coverImage:", error));
    }
  }, [project]);

  // Buscar dados do projeto
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setImageError(false);

    // Tentar encontrar o projeto pelo ID
    const foundProject = projects.find(p => p.id === projectId);
    
    if (foundProject) {
      console.log("Projeto encontrado:", foundProject);
      console.log("Caminho da imagem de capa:", foundProject.coverImage);
      
      // Verificar se a imagem existe
      fetch(foundProject.coverImage)
        .then(response => {
          if (response.ok) {
            console.log("✅ Imagem encontrada no servidor!");
          } else {
            console.error("❌ Imagem não encontrada no caminho:", foundProject.coverImage);
          }
        })
        .catch(error => {
          console.error("❌ Erro ao verificar imagem:", error);
        });
      
      setProject(foundProject);
      
      // Determinar projetos anterior e próximo
      const currentIndex = projects.findIndex(p => p.id === projectId);
      
      if (currentIndex > 0) {
        setPrevProject(projects[currentIndex - 1]);
      } else {
        setPrevProject(null);
      }
      
      if (currentIndex < projects.length - 1) {
        setNextProject(projects[currentIndex + 1]);
      } else {
        setNextProject(null);
      }
      
      // Definir título da página
      document.title = `${foundProject.title} | Meu Portfolio`;
      
      // Pequeno atraso para simular carregamento
      setTimeout(() => {
        setLoading(false);
      }, 400);
    } else {
      console.error("Projeto não encontrado com ID:", projectId);
      // Redirecionar para página de trabalhos
      navigate("/work");
    }
    
    return () => {
      document.title = 'Meu Portfolio';
    };
  }, [projectId, navigate]);

  // Configurar efeito parallax e eventos de scroll
  useEffect(() => {
    if (loading || !project) return;
    
    const handleScroll = throttle(() => {
      if (!headerRef.current) return;
      
      const scrollTop = window.scrollY;
      
      // Efeito parallax simples
      if (parallaxLayersRef.current[0]) {
        const yPos = scrollTop * 0.3;
        parallaxLayersRef.current[0].style.transform = `translateY(${yPos}px)`;
      }
      
      // Atualizar barra de progresso
      if (progressRef.current) {
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const progress = Math.min(100, Math.max(0, scrollPercent * 100));
        
        progressRef.current.style.width = `${progress}%`;
        setScrollProgress(progress);
      }
      
      // Atualizar seção ativa
      let currentActive = 'overview';
      
      Object.entries(sectionsRef.current).forEach(([section, ref]) => {
        if (!ref) return;
        
        const rect = ref.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          currentActive = section;
        }
      });
      
      setActiveSection(currentActive);
    }, 10);

    // Aplicar listeners
    window.addEventListener('scroll', handleScroll);
    
    // Iniciar com animação
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, project]);

  // Adicionar classes "visible" com atraso para animar entrada
  useEffect(() => {
    if (loading || !project) return;
    
    const timer1 = setTimeout(() => {
      if (headerRef.current) {
        headerRef.current.classList.add(styles.visible);
      }
    }, 100);
    
    const timer2 = setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.classList.add(styles.visible);
      }
    }, 300);
    
    const timer3 = setTimeout(() => {
      if (galleryRef.current) {
        galleryRef.current.classList.add(styles.visible);
      }
    }, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [loading, project]);

  // Componente de carregamento
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Carregando projeto...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.loadingContainer}>
        <h2>Projeto não encontrado</h2>
        <button onClick={goToProjects} className={styles.backButton}>
          <IconArrowBack /> Voltar para projetos
        </button>
      </div>
    );
  }

  return (
    <div className={styles.projectContainer}>
      <div className={styles.glassBg}></div>
      <div ref={progressRef} className={styles.progressBar}></div>
      
      {/* Header com parallax */}
      <header 
  ref={headerRef} 
  className={styles.projectHeader}
>
  <div 
    ref={el => parallaxLayersRef.current[0] = el}
    className={`${styles.parallaxLayer} ${styles.parallaxBg}`}
    style={{ 
      backgroundColor: '#222',
      // Remova transform do estilo inline para evitar conflitos
    }}
  >
    <img 
      src={project.coverImage}
      alt={project.title}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 1, // Aumente para 1 (era 0.95)
        zIndex: 0  // Garanta que está abaixo do overlay
      }}
      onError={handleImageError}
    />
  </div>
  
  <div className={styles.headerOverlay}></div>
        
        <div className={styles.headerOverlay}></div>
        
        <div className={styles.headerContent}>
          <button onClick={goToProjects} className={styles.backButton}>
            <IconArrowBack /> Voltar
          </button>
          
          <h1 className={styles.projectTitle}>{project.title}</h1>
          
          <div className={styles.projectMeta}>
            <div className={styles.projectDate}>{project.date}</div>
            
            <div className={styles.projectTags}>
              {project.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.scrollIndicator} onClick={scrollToContent}>
          <div className={styles.scrollIconArrow}></div>
        </div>
      </header>
      
      {/* Conteúdo principal */}
      <main ref={contentRef} className={styles.projectContent}>
        {/* Visão Geral */}
        <section 
          ref={el => sectionsRef.current.overview = el}
          className={styles.projectOverview}
          id="overview"
        >
          <h2>Visão Geral</h2>
          <p>{project.description}</p>
          <p>{project.extendedDescription}</p>
          
          {project.challenges && (
            <>
              <h3>Desafios</h3>
              <p>{project.challenges}</p>
            </>
          )}
          
          {project.solution && (
            <>
              <h3>Solução</h3>
              <p>{project.solution}</p>
            </>
          )}
        </section>
        
        {/* Tecnologias */}
        <section 
          ref={el => sectionsRef.current.tech = el}
          className={styles.projectTech}
          id="tech"
        >
          <h2>Tecnologias</h2>
          <p>Tecnologias e ferramentas utilizadas neste projeto:</p>
          
          <div className={styles.techBadges}>
            {project.technologies.map((tech, index) => (
              <div key={index} className={styles.techBadge}>
                <span className={styles.techBadgeIcon}>{tech.icon || '🧰'}</span>
                {tech.name}
              </div>
            ))}
          </div>
          
          {/* Links do Projeto */}
          {(project.liveUrl || project.githubUrl) && (
            <div className={styles.projectLinks}>
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.projectLink} ${styles.liveLink}`}
                >
                  <IconEye /> Ver Projeto
                </a>
              )}
              
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.projectLink} ${styles.codeLink}`}
                >
                  <IconGithub /> Ver Código
                </a>
              )}
            </div>
          )}
        </section>
        
        {/* Galeria */}
        {project.images && project.images.length > 0 && (
          <section 
            ref={el => {
              sectionsRef.current.gallery = el;
              galleryRef.current = el;
            }}
            className={styles.projectGallery}
            id="gallery"
          >
            <h2>Galeria</h2>
            
            <div className={styles.galleryGrid}>
              {project.images.map((image, index) => (
                <div 
                  key={index}
                  className={styles.galleryItem}
                  onClick={() => openModal(index)}
                >
                  <img 
                    src={image.url} 
                    alt={image.caption || `${project.title} - Imagem ${index + 1}`} 
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                      e.target.onerror = null;
                    }}
                  />
                  
                  <div className={styles.galleryCaption}>
                    <h4>{image.title || `Imagem ${index + 1}`}</h4>
                    {image.caption && <p>{image.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Navegação entre projetos */}
        <nav className={styles.projectNav}>
          {prevProject && (
            <Link 
              to={`/work/${prevProject.id}`} 
              className={`${styles.projectNavItem} ${styles.projectNavPrev}`}
            >
              <div className={styles.projectNavIcon}>
                <IconArrowLeft />
              </div>
              <div className={styles.projectNavInfo}>
                <span className={styles.projectNavLabel}>Projeto Anterior</span>
                <div className={styles.projectNavTitle}>{prevProject.title}</div>
              </div>
            </Link>
          )}
          
          {nextProject && (
            <Link 
              to={`/work/${nextProject.id}`} 
              className={`${styles.projectNavItem} ${styles.projectNavNext}`}
            >
              <div className={styles.projectNavInfo}>
                <span className={styles.projectNavLabel}>Próximo Projeto</span>
                <div className={styles.projectNavTitle}>{nextProject.title}</div>
              </div>
              <div className={styles.projectNavIcon}>
                <IconArrowRight />
              </div>
            </Link>
          )}
        </nav>
      </main>
      
      {/* Modal de imagem */}
      {modalOpen && (
        <div className={styles.imageModal}>
          <div className={styles.modalContent}>
            <button className={styles.closeModal} onClick={closeModal}>
              <IconClose />
            </button>
            
            <button 
              className={`${styles.modalNavBtn} ${styles.modalPrev}`}
              onClick={() => navigateImages('prev')}
            >
              <IconArrowLeft />
            </button>
            
            <img
              src={project.images[currentImageIndex].url}
              alt={project.images[currentImageIndex].caption || `${project.title} - Imagem ${currentImageIndex + 1}`}
              className={styles.modalImage}
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
                e.target.onerror = null;
              }}
            />
            
            <button 
              className={`${styles.modalNavBtn} ${styles.modalNext}`}
              onClick={() => navigateImages('next')}
            >
              <IconArrowRight />
            </button>
            
            <div className={styles.modalCaption}>
              {project.images[currentImageIndex].caption}
            </div>
            
            <div className={styles.modalCounter}>
              {currentImageIndex + 1} / {project.images.length}
            </div>
          </div>
        </div>
      )}
      
      {/* Indicadores de seção */}
      <div className={styles.sectionIndicators}>
        <div 
          onClick={() => document.getElementById('overview').scrollIntoView({ behavior: 'smooth' })}
          className={`${styles.sectionDot} ${activeSection === 'overview' ? styles.active : ''}`}
          data-title="Overview"
        ></div>
        <div 
          onClick={() => document.getElementById('tech').scrollIntoView({ behavior: 'smooth' })}
          className={`${styles.sectionDot} ${activeSection === 'tech' ? styles.active : ''}`}
          data-title="Tech"
        ></div>
        {project.images && project.images.length > 0 && (
          <div 
            onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
            className={`${styles.sectionDot} ${activeSection === 'gallery' ? styles.active : ''}`}
            data-title="Gallery"
          ></div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;