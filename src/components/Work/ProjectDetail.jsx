import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './ProjectDetail.module.css';
import { projects } from './WorkProjectContext';

// Simple throttle function (if lodash isn't installed)
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

// Simple icon components
const IconArrowBack = () => <span className={styles.icon}>←</span>;
const IconEye = () => <span className={styles.icon}>👁️</span>;
const IconGithub = () => <span className={styles.icon}>📂</span>;
const IconClose = () => <span className={styles.icon}>✕</span>;
const IconArrowLeft = () => <span className={styles.icon}>←</span>;
const IconArrowRight = () => <span className={styles.icon}>→</span>;
const IconExpand = () => <span className={styles.icon}>⤢</span>;
const IconFigma = () => <span className={styles.icon}>🎨</span>;


// Local fallback URL for the public folder
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

  // Refs for DOM elements
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

  // Function to go back to projects page
  const goToProjects = useCallback(() => {
    navigate('/work');
  }, [navigate]);

  // Function for smooth scroll to content
  const scrollToContent = useCallback(() => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Function to open modal
  const openModal = useCallback((index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  // Function to close modal
  const closeModal = useCallback(() => {
    setModalOpen(false);
    document.body.style.overflow = '';
  }, []);

  // Function to navigate between images
  const navigateImages = useCallback((direction) => {
    if (!project || !project.images) return;
    
    const imagesLength = project.images.length;
    
    if (direction === 'next') {
      setCurrentImageIndex(prev => (prev + 1) % imagesLength);
    } else {
      setCurrentImageIndex(prev => (prev - 1 + imagesLength) % imagesLength);
    }
  }, [project]);

  // Function to handle image loading error
  const handleImageError = useCallback((e) => {
    console.error("Error loading cover image");
    console.log("Problematic image URL:", e.target.src);
    setImageError(true);
  }, []);

  useEffect(() => {
    if (project) {
      console.log("DEBUG - Image paths:");
      console.log("coverImage:", project.coverImage);
      console.log("backgroundImage:", project.backgroundImage);
      
      // Verify if URLs are valid
      fetch(project.coverImage)
        .then(response => {
          console.log(`Cover image response: ${response.status} ${response.ok ? '✅' : '❌'}`);
        })
        .catch(error => console.error("Error verifying coverImage:", error));
    }
  }, [project]);

  // Fetch project data
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setImageError(false);

    // Try to find project by ID
    const foundProject = projects.find(p => p.id === projectId);
    
    if (foundProject) {
      console.log("Project found:", foundProject);
      console.log("Cover image path:", foundProject.coverImage);
      
      // Check if the image exists
      fetch(foundProject.coverImage)
        .then(response => {
          if (response.ok) {
            console.log("✅ Image found on server!");
          } else {
            console.error("❌ Image not found at path:", foundProject.coverImage);
          }
        })
        .catch(error => {
          console.error("❌ Error verifying image:", error);
        });
      
      setProject(foundProject);
      
      // Determine previous and next projects
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
      
      // Set page title
      document.title = `${foundProject.title} | My Portfolio`;
      
      // Small delay to simulate loading
      setTimeout(() => {
        setLoading(false);
      }, 400);
    } else {
      console.error("Project not found with ID:", projectId);
      // Redirect to projects page
      navigate("/work");
    }
    
    return () => {
      document.title = 'My Portfolio';
    };
  }, [projectId, navigate]);

  // Set up parallax effect and scroll events
  useEffect(() => {
    if (loading || !project) return;
    
    const handleScroll = throttle(() => {
      if (!headerRef.current) return;
      
      const scrollTop = window.scrollY;
      
      // Simple parallax effect
      if (parallaxLayersRef.current[0]) {
        const yPos = scrollTop * 0.3;
        parallaxLayersRef.current[0].style.transform = `translateY(${yPos}px)`;
      }
      
      // Update progress bar
      if (progressRef.current) {
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const progress = Math.min(100, Math.max(0, scrollPercent * 100));
        
        progressRef.current.style.width = `${progress}%`;
        setScrollProgress(progress);
      }
      
      // Update active section
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

    // Apply listeners
    window.addEventListener('scroll', handleScroll);
    
    // Start with animation
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, project]);

  // Add "visible" classes with delay to animate entry
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

  // Loading component
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.loadingContainer}>
        <h2>Project not found</h2>
        <button onClick={goToProjects} className={styles.backButton}>
          <IconArrowBack /> Back to projects
        </button>
      </div>
    );
  }

  return (
    <div className={styles.projectContainer}>
      <div className={styles.glassBg}></div>
      <div ref={progressRef} className={styles.progressBar}></div>
      
      {/* Header with parallax */}
      <header 
        ref={headerRef} 
        className={styles.projectHeader}
      >
        <div 
          ref={el => parallaxLayersRef.current[0] = el}
          className={`${styles.parallaxLayer} ${styles.parallaxBg}`}
          style={{ 
            backgroundColor: '#222',
            // Remove inline transform style to avoid conflicts
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
              opacity: 1, // Increase to 1 (was 0.95)
              zIndex: 0  // Make sure it's below the overlay
            }}
            onError={handleImageError}
          />
        </div>
        
        <div className={styles.headerOverlay}></div>
        
        <div className={styles.headerOverlay}></div>
        
        <div className={styles.headerContent}>
          <button onClick={goToProjects} className={styles.backButton}>
            <IconArrowBack /> Back
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
      
      {/* Main content */}
      <main ref={contentRef} className={styles.projectContent}>
        {/* Overview */}
        <section 
          ref={el => sectionsRef.current.overview = el}
          className={styles.projectOverview}
          id="overview"
        >
          <h2>Overview</h2>
          <p>{project.description}</p>
          <p>{project.extendedDescription}</p>
          
          {project.challenges && (
            <>
              <h3>Challenges</h3>
              <p>{project.challenges}</p>
            </>
          )}
          
          {project.solution && (
            <>
              <h3>Solution</h3>
              <p>{project.solution}</p>
            </>
          )}
        </section>
        
        {/* Technologies */}
        <section 
          ref={el => sectionsRef.current.tech = el}
          className={styles.projectTech}
          id="tech"
        >
          <h2>Technologies</h2>
          <p>Technologies and tools used in this project:</p>
          
          <div className={styles.techBadges}>
            {project.technologies.map((tech, index) => (
              <div key={index} className={styles.techBadge}>
                <span className={styles.techBadgeIcon}>{tech.icon || '🧰'}</span>
                {tech.name}
              </div>
            ))}
          </div>
          
          {/* Project Links */}
          {(project.liveUrl || project.githubUrl) && (
            <div className={styles.projectLinks}>
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.projectLink} ${styles.liveLink}`}
                >
                  <IconEye /> See Project
                </a>
              )}   
              {project.figmaUrl && (
                <a 
                  href={project.figmaUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.projectLink} ${styles.designLink}`}
                >
                  <IconFigma /> See Design
                </a>
              )}       
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${styles.projectLink} ${styles.codeLink}`}
                >
                  <IconGithub /> See Code
                </a>
              )}
            </div>
          )}
        </section>
        
        {/* Gallery */}
        {project.images && project.images.length > 0 && (
          <section 
            ref={el => {
              sectionsRef.current.gallery = el;
              galleryRef.current = el;
            }}
            className={styles.projectGallery}
            id="gallery"
          >
            <h2>Gallery</h2>
            
            <div className={styles.galleryGrid}>
              {project.images.map((image, index) => (
                <div 
                  key={index}
                  className={styles.galleryItem}
                  onClick={() => openModal(index)}
                >
                  <img 
                    src={image.url} 
                    alt={image.caption || `${project.title} - Image ${index + 1}`} 
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                      e.target.onerror = null;
                    }}
                  />
                  
                  <div className={styles.galleryCaption}>
                    <h4>{image.title || `Image ${index + 1}`}</h4>
                    {image.caption && <p>{image.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Navigation between projects */}
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
                <span className={styles.projectNavLabel}>Previous Project</span>
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
                <span className={styles.projectNavLabel}>Next Project</span>
                <div className={styles.projectNavTitle}>{nextProject.title}</div>
              </div>
              <div className={styles.projectNavIcon}>
                <IconArrowRight />
              </div>
            </Link>
          )}
        </nav>
      </main>
      
      {/* Image modal */}
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
              alt={project.images[currentImageIndex].caption || `${project.title} - Image ${currentImageIndex + 1}`}
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
      
      {/* Section indicators */}
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