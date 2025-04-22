import React, { useState, useEffect, useRef } from "react";
import styles from './Work.module.css';
import WorkCard from './WorkCard';
import WorkFilters from './WorkFilters';
import WorkGridView from './WorkGridView';
import { useWorkProjects } from './WorkProjectContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faThLarge, faSquare } from "@fortawesome/free-solid-svg-icons";

function Work() {
  const { projects } = useWorkProjects();
  const [activeSection, setActiveSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [viewMode, setViewMode] = useState('fullscreen'); // 'fullscreen' or 'grid'
  const workSections = useRef([]);
  const workRef = useRef(null);

  // Handle preloading only the first few images for better initial loading
  useEffect(() => {
    if (projects.length === 0) {
      setIsLoading(false);
      return;
    }
    
    // Only preload the first image and critical images
    const criticalImages = projects.slice(0, 1).map(project => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = project.backgroundImage;
        img.onload = () => {
          setLoadingProgress(100);
          resolve();
        };
        img.onerror = () => resolve(); // Continue even if an image fails to load
      });
    });

    Promise.all(criticalImages).then(() => {
      setIsLoading(false);
    });
  }, [projects]);

  // Reset workSections when projects change
  useEffect(() => {
    workSections.current = workSections.current.slice(0, projects.length);
    if (activeSection >= projects.length && projects.length > 0) {
      setActiveSection(0);
      setTimeout(() => {
        scrollToSection(0);
      }, 100);
    }
  }, [projects]);

  // Handle intersection observer for scroll sections (only in fullscreen mode)
  useEffect(() => {
    if (projects.length === 0 || viewMode !== 'fullscreen') return;
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = workSections.current.findIndex(section => section === entry.target);
          if (index !== -1) {
            setActiveSection(index);
            
            // Preload the next image when section becomes visible
            if (index < projects.length - 1) {
              const nextProject = projects[index + 1];
              const img = new Image();
              img.src = nextProject.backgroundImage;
            }
          }
        }
      });
    }, options);

    // Observe all work sections
    workSections.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      workSections.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, [projects, isLoading, viewMode]);

  // Keyboard navigation (only in fullscreen mode)
  useEffect(() => {
    if (viewMode !== 'fullscreen') return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        navigateToSection(activeSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        navigateToSection(activeSection - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, projects, viewMode]);

  // Navigate to previous/next section
  const navigateToSection = (index) => {
    if (index >= 0 && index < projects.length) {
      scrollToSection(index);
    }
  };

  // Scroll to section when nav buttons are clicked
  const scrollToSection = (index) => {
    if (workSections.current[index]) {
      workSections.current[index].scrollIntoView({ 
        behavior: 'smooth'
      });
      setActiveSection(index);
    }
  };

  // Handle wheel events for smooth scrolling (only in fullscreen mode)
  useEffect(() => {
    if (projects.length <= 1 || viewMode !== 'fullscreen') return;
    
    let wheelTimeout;
    let isScrolling = false;

    const handleWheel = (e) => {
      e.preventDefault();
      
      if (isScrolling) return;
      isScrolling = true;

      if (e.deltaY > 0) {
        navigateToSection(activeSection + 1);
      } else {
        navigateToSection(activeSection - 1);
      }

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        isScrolling = false;
      }, 800);
    };

    const workContainer = workRef.current;
    if (workContainer) {
      workContainer.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (workContainer) {
        workContainer.removeEventListener('wheel', handleWheel);
      }
      clearTimeout(wheelTimeout);
    };
  }, [activeSection, projects, viewMode]);

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'fullscreen' ? 'grid' : 'fullscreen');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer} role="alert" aria-busy="true" aria-label="Loading projects">
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
          <div className={styles.loadingText}>
            Carregando projetos... {loadingProgress}%
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${loadingProgress}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div id="work" className={styles.workContainer} ref={workRef}>
        <WorkFilters />
        <div className={styles.noProjectsContainer} role="alert">
          <div className={styles.noProjectsMessage}>
            <h3>No projects found</h3>
            <p>Try other filters or remove the current filters.</p>
          </div>
        </div>
      </div>
    );
  }

  // Toggle view button
  const viewToggleButton = (
    <button 
      className={styles.viewToggleButton}
      onClick={toggleViewMode}
      aria-label={`Switch to ${viewMode === 'fullscreen' ? 'grid' : 'fullscreen'} view mode`}
    >
      <FontAwesomeIcon icon={viewMode === 'fullscreen' ? faThLarge : faSquare} />
      <span className={styles.srOnly}>
        {viewMode === 'fullscreen' ? 'Grid View' : 'Fullscreen View'}
      </span>
    </button>
  );

  return (
    <div 
      id="work" 
      className={`${styles.workContainer} ${viewMode === 'grid' ? styles.gridModeContainer : ''}`} 
      ref={workRef}
      role="region"
      aria-label="Projects showcase"
    >
      <WorkFilters />
      {viewToggleButton}
      
      {viewMode === 'fullscreen' ? (
        <>
          {/* Navigation arrows */}
          {projects.length > 1 && (
            <div className={styles.navArrows} role="navigation" aria-label="Project navigation">
              <button 
                className={`${styles.navArrow} ${styles.upArrow} ${activeSection === 0 ? styles.disabled : ''}`}
                onClick={() => navigateToSection(activeSection - 1)}
                disabled={activeSection === 0}
                aria-label="Previous project"
              >
                <FontAwesomeIcon icon={faChevronUp} />
              </button>
              <button 
                className={`${styles.navArrow} ${styles.downArrow} ${activeSection === projects.length - 1 ? styles.disabled : ''}`}
                onClick={() => navigateToSection(activeSection + 1)}
                disabled={activeSection === projects.length - 1}
                aria-label="Next project"
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>
          )}

          {/* Navigation dots */}
          {projects.length > 1 && (
            <div 
              className={styles.navDots} 
              role="tablist"
              aria-label="Project navigation dots"
            >
              {projects.map((project, index) => (
                <button 
                  key={`nav-${index}`}
                  className={`${styles.navDot} ${activeSection === index ? styles.active : ''}`}
                  onClick={() => scrollToSection(index)}
                  aria-label={`View project ${project.title}`}
                  aria-selected={activeSection === index}
                  role="tab"
                  data-tooltip={project.title}
                  tabIndex={activeSection === index ? 0 : -1}
                />
              ))}
            </div>
          )}
          
          {/* Project sections */}
          <div className={styles.projectSections}>
            {projects.map((project, index) => (
              <section 
                key={project.id}
                id={project.id}
                ref={el => workSections.current[index] = el}
                className={`${styles.section} ${activeSection === index ? styles.active : ''}`}
                data-index={index}
                aria-hidden={activeSection !== index}
                role="tabpanel"
                aria-labelledby={`project-${project.id}`}
              >
                <div 
                  className={styles.backgroundImage}
                  style={{ 
                    backgroundImage: activeSection === index || Math.abs(activeSection - index) <= 1 
                      ? `url(${project.backgroundImage})`
                      : 'none'
                  }}
                  aria-hidden="true"
                />
                <div className={styles.sectionOverlay} aria-hidden="true" />
                <div className={`${styles.workCard} ${activeSection === index ? styles.cardVisible : ''}`}>
                  <WorkCard
                    title={project.title}
                    description={project.description}
                    tags={project.tags}
                    projectLink={project.projectLink}
                    projectDetails={project.details}
                  />
                </div>
                {projects.length > 1 && (
                  <div className={styles.progressIndicator} aria-hidden="true">
                    <span className={styles.currentProject}>{index + 1}</span>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${((index + 1) / projects.length) * 100}%` }}
                      />
                    </div>
                    <span className={styles.totalProjects}>{projects.length}</span>
                  </div>
                )}
              </section>
            ))}
          </div>
        </>
      ) : (
        // Grid view
        <WorkGridView 
          ref={workRef}
          projects={projects} 
          onViewDetails={(project) => {
            // Switch to fullscreen mode and navigate to the project
            setViewMode('fullscreen');
            const projectIndex = projects.findIndex(p => p.id === project.id);
            if (projectIndex >= 0) {
              setTimeout(() => {
                navigateToSection(projectIndex);
              }, 100);
            }
          }}
        />
      )}
    </div>
  );
}

export default React.memo(Work);