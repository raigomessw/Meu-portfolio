import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkProjects } from './WorkProjectContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faExternalLinkAlt, 
  faCode, 
  faPalette, 
  faLightbulb,
  faCalendarAlt,
  faUsers,
  faLayerGroup,
  faChevronLeft,
  faChevronRight,
  faExpand,
  faTimes,
  faLink
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faFigma } from '@fortawesome/free-brands-svg-icons';
import styles from './ProjectDetail.module.css';

function ProjectDetail() {
  const { projectId } = useParams();
  const { allProjects } = useWorkProjects();
  const project = allProjects.find(p => p.id === projectId);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('overview');
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const sectionRefs = {
    hero: useRef(null),
    overview: useRef(null),
    process: useRef(null),
    features: useRef(null),
    gallery: useRef(null),
    technologies: useRef(null)
  };

  const prevNextProjects = getPrevNextProjects(allProjects, projectId);
  
  // Handle scroll and loading
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
      setScrollProgress(currentProgress);
      
      // Update current section based on scroll position
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const { top, bottom } = ref.current.getBoundingClientRect();
          const threshold = window.innerHeight * 0.4;
          
          if (top <= threshold && bottom >= threshold) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [projectId]);
  
  if (!project) {
    return (
      <motion.div 
        className={styles.notFound}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={styles.notFoundContent}>
          <h1>Project Not Found</h1>
          <p>The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/work" className={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to Projects</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Handle keyboard navigation for gallery
  useEffect(() => {
    const handleKeydown = (e) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') setLightboxOpen(false);
        if (e.key === 'ArrowLeft') navigateGallery('prev');
        if (e.key === 'ArrowRight') navigateGallery('next');
      }
    };
    
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [lightboxOpen, activeImageIndex]);

  const navigateGallery = (direction) => {
    if (!project.gallery || project.gallery.length <= 1) return;
    
    if (direction === 'next') {
      setActiveImageIndex((prevIndex) => 
        prevIndex < project.gallery.length - 1 ? prevIndex + 1 : 0
      );
    } else {
      setActiveImageIndex((prevIndex) => 
        prevIndex > 0 ? prevIndex - 1 : project.gallery.length - 1
      );
    }
  };

  return (
    <motion.div 
      className={`${styles.projectDetail} ${loading ? styles.loading : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progressIndicator} 
          style={{ width: `${scrollProgress * 100}%` }} 
        />
      </div>
      
      {/* Side navigation */}
      <nav className={styles.sideNavigation}>
        <ul>
          {Object.keys(sectionRefs).map((section) => (
            section !== 'hero' && (
              <li key={section} className={currentSection === section ? styles.active : ''}>
                <a href={`#${section}`} 
                   onClick={(e) => {
                     e.preventDefault();
                     sectionRefs[section].current.scrollIntoView({ behavior: 'smooth' });
                   }}
                >
                  <span className={styles.navDot}></span>
                  <span className={styles.navLabel}>{formatSectionName(section)}</span>
                </a>
              </li>
            )
          ))}
        </ul>
      </nav>
      
      {/* Hero Section */}
      <header 
        className={styles.projectHeader}
        ref={sectionRefs.hero}
      >
        <div className={styles.heroBackdrop}>
          {!loading && (
            <>
              <div className={styles.heroBackdropImage} style={{
                backgroundImage: `url(${project.backgroundImage})`
              }}></div>
              <div className={styles.heroBackdropOverlay}></div>
            </>
          )}
        </div>

        <div className={styles.navbar}>
          <Link to="/work" className={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>All Projects</span>
          </Link>
          
          {project.projectLink && (
            <a 
              href={project.projectLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.externalLinkButton}
            >
              <span>View Live</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          )}
        </div>
        
        <div className={styles.heroContent}>
          <motion.div 
            className={styles.heroTextContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className={styles.projectMeta}>
              {project.details.date && (
                <div className={styles.metaItem}>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>{project.details.date}</span>
                </div>
              )}
              
              {project.details.client && (
                <div className={styles.metaItem}>
                  <FontAwesomeIcon icon={faUsers} />
                  <span>{project.details.client}</span>
                </div>
              )}
            </div>
            
            <h1 className={styles.projectTitle}>{project.title}</h1>
            
            <div className={styles.tags}>
              {project.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
            
            <p className={styles.projectSummary}>
              {project.summary || project.description.split('.')[0] + '.'}
            </p>
          </motion.div>
          
          <motion.div 
            className={styles.heroImageContainer}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: loading ? 0 : 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            {loading ? (
              <div className={styles.imageSkeleton}></div>
            ) : (
              <img 
                src={project.heroImage || project.backgroundImage} 
                alt={project.title} 
                className={styles.heroMainImage}
              />
            )}
          </motion.div>
        </div>
        
        <div className={styles.scrollIndicator}>
          <div className={styles.mouse}>
            <div className={styles.mouseWheel}></div>
          </div>
          <span>Scroll to explore</span>
        </div>
      </header>
      
      <div className={styles.projectContent}>
        {/* Overview Section */}
        <section 
          id="overview" 
          ref={sectionRefs.overview}
          className={styles.section}
        >
          <ScrollAnimation>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Overview</h2>
              <div className={styles.sectionDivider}></div>
            </div>
            
            <div className={styles.description}>
              {loading ? (
                <>
                  <div className={styles.paragraphSkeleton}></div>
                  <div className={styles.paragraphSkeleton}></div>
                </>
              ) : (
                project.description.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              )}
            </div>
          </ScrollAnimation>
        </section>
        
        {/* Process Section */}
        <section 
          id="process" 
          ref={sectionRefs.process}
          className={`${styles.section} ${styles.processSection}`}
        >
          <ScrollAnimation>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Design Process</h2>
              <div className={styles.sectionDivider}></div>
            </div>
            
            <div className={styles.processCards}>
              <div className={`${styles.processCard} ${styles.challengeCard}`}>
                <div className={styles.processIconWrapper}>
                  <FontAwesomeIcon icon={faLightbulb} className={styles.processIcon} />
                </div>
                <h3>The Challenge</h3>
                <p>{project.details.challenge || "Identifying and addressing key user pain points while delivering a solution that meets business objectives."}</p>
              </div>
              
              <div className={styles.processArrow}>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
              
              <div className={`${styles.processCard} ${styles.solutionCard}`}>
                <div className={styles.processIconWrapper}>
                  <FontAwesomeIcon icon={faPalette} className={styles.processIcon} />
                </div>
                <h3>The Solution</h3>
                <p>{project.details.solution || "Creating an intuitive interface with carefully crafted user journeys and a cohesive visual language that communicates the brand's values."}</p>
              </div>
            </div>
          </ScrollAnimation>
        </section>
        
        {/* Features Section */}
        {project.details.features && (
          <section 
            id="features" 
            ref={sectionRefs.features}
            className={styles.section}
          >
            <ScrollAnimation>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Key Features</h2>
                <div className={styles.sectionDivider}></div>
              </div>
              
              <div className={styles.featuresList}>
                {project.details.features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    <div className={styles.featureNumber}>{index + 1}</div>
                    <div className={styles.featureContent}>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollAnimation>
          </section>
        )}
        
        {/* Gallery Section */}
        {project.gallery && project.gallery.length > 0 && (
          <section 
            id="gallery" 
            ref={sectionRefs.gallery}
            className={`${styles.section} ${styles.gallerySection}`}
          >
            <ScrollAnimation>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Project Gallery</h2>
                <div className={styles.sectionDivider}></div>
              </div>
              
              <div className={styles.galleryGrid}>
                {project.gallery.map((image, index) => (
                  <div 
                    key={index}
                    className={styles.galleryItem}
                    onClick={() => {
                      setActiveImageIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <img 
                      src={image.thumbnail || image.src} 
                      alt={image.alt || `Project image ${index + 1}`} 
                    />
                    <div className={styles.galleryItemOverlay}>
                      <FontAwesomeIcon icon={faExpand} />
                      <span>View</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollAnimation>
            
            <AnimatePresence>
              {lightboxOpen && (
                <motion.div 
                  className={styles.lightbox}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setLightboxOpen(false)}
                >
                  <div 
                    className={styles.lightboxContent}
                    onClick={e => e.stopPropagation()}
                  >
                    <button 
                      className={styles.lightboxClose}
                      onClick={() => setLightboxOpen(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    
                    <div className={styles.lightboxImageContainer}>
                      <motion.img 
                        key={activeImageIndex}
                        src={project.gallery[activeImageIndex].src} 
                        alt={project.gallery[activeImageIndex].alt || `Project image ${activeImageIndex + 1}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    
                    <p className={styles.lightboxCaption}>
                      {project.gallery[activeImageIndex].caption || `${activeImageIndex + 1} / ${project.gallery.length}`}
                    </p>
                    
                    <button 
                      className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateGallery('prev');
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    
                    <button 
                      className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateGallery('next');
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}
        
        {/* Technologies Section */}
        <section 
          id="technologies" 
          ref={sectionRefs.technologies}
          className={styles.section}
        >
          <ScrollAnimation>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Technologies</h2>
              <div className={styles.sectionDivider}></div>
            </div>
            
            <div className={styles.technologiesContent}>
              <div className={styles.techList}>
                {project.details.technologies.map((tech, index) => (
                  <div key={tech} className={styles.techItem}>
                    <span className={styles.techName}>{tech}</span>
                  </div>
                ))}
              </div>
              
              <div className={styles.projectLinks}>
                {project.codeLink && (
                  <a 
                    href={project.codeLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.projectLink}
                  >
                    <FontAwesomeIcon icon={faGithub} />
                    <span>Source Code</span>
                  </a>
                )}
                
                {project.designLink && (
                  <a 
                    href={project.designLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.projectLink}
                  >
                    <FontAwesomeIcon icon={faFigma} />
                    <span>Design in Figma</span>
                  </a>
                )}
                
                {project.projectLink && (
                  <a 
                    href={project.projectLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.projectLink}
                  >
                    <FontAwesomeIcon icon={faLink} />
                    <span>Live Project</span>
                  </a>
                )}
              </div>
            </div>
          </ScrollAnimation>
        </section>
      </div>
      
      {/* Next/Prev Projects Navigation */}
      <div className={styles.projectNavigation}>
        {prevNextProjects.prev && (
          <Link 
            to={`/work/${prevNextProjects.prev.id}`}
            className={`${styles.projectNavItem} ${styles.prevProject}`}
          >
            <div className={styles.projectNavImage} style={{
              backgroundImage: `url(${prevNextProjects.prev.backgroundImage})`
            }}>
              <div className={styles.projectNavOverlay}></div>
            </div>
            <div className={styles.projectNavContent}>
              <span className={styles.projectNavLabel}>
                <FontAwesomeIcon icon={faChevronLeft} />
                Previous Project
              </span>
              <h4 className={styles.projectNavTitle}>{prevNextProjects.prev.title}</h4>
            </div>
          </Link>
        )}
        
        {prevNextProjects.next && (
          <Link 
            to={`/work/${prevNextProjects.next.id}`}
            className={`${styles.projectNavItem} ${styles.nextProject}`}
          >
            <div className={styles.projectNavImage} style={{
              backgroundImage: `url(${prevNextProjects.next.backgroundImage})`
            }}>
              <div className={styles.projectNavOverlay}></div>
            </div>
            <div className={styles.projectNavContent}>
              <span className={styles.projectNavLabel}>
                Next Project
                <FontAwesomeIcon icon={faChevronRight} />
              </span>
              <h4 className={styles.projectNavTitle}>{prevNextProjects.next.title}</h4>
            </div>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

// Scroll animation component
function ScrollAnimation({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      }, 
      { threshold: 0.1 }
    );
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  return (
    <div 
      ref={ref}
      className={`${styles.scrollAnimation} ${isVisible ? styles.visible : ''}`}
    >
      {children}
    </div>
  );
}

// Helper function to format section names for display
function formatSectionName(section) {
  return section.charAt(0).toUpperCase() + section.slice(1);
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