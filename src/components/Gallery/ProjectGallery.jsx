import React, { useState, useRef, useEffect } from 'react';
import styles from './ProjectGallery.module.css';

const ProjectGallery = ({ media, activeCategory = 'all', isVisible = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewMode, setViewMode] = useState('horizontal'); // horizontal ou grid

  // Compute filtered media based on category
  const filteredMedia = activeCategory === 'all'
    ? media
    : media.filter(item => item.category === activeCategory);

  // Update max scroll value when container or filtered media changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const maxScrollValue = container.scrollWidth - container.clientWidth;
      setMaxScroll(maxScrollValue);
    }
  }, [filteredMedia, scrollContainerRef.current]);

  // Handle scroll event
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const currentPosition = scrollContainerRef.current.scrollLeft;
      setScrollPosition(currentPosition);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Mouse events for drag scroll
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Custom scroll buttons
  const scrollToLeft = (amount = 300) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -amount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = (amount = 300) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: amount,
        behavior: 'smooth'
      });
    }
  };

  // Toggle view mode
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Check if media exists and has items
  if (!filteredMedia || filteredMedia.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Nenhuma imagem disponível para esta categoria.</p>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.galleryContainer} ${isVisible ? styles.visible : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation arrows */}
      <button 
        className={`${styles.navButton} ${styles.navButtonLeft} ${scrollPosition > 0 ? styles.visible : ''}`} 
        onClick={() => scrollToLeft()}
        aria-label="Scroll esquerda"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <button 
        className={`${styles.navButton} ${styles.navButtonRight} ${scrollPosition < maxScroll ? styles.visible : ''}`} 
        onClick={() => scrollRight()}
        aria-label="Scroll direita"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      
      {/* Scroll progress indicator */}
      <div className={styles.scrollProgress}>
        <div 
          className={styles.scrollProgressBar} 
          style={{ width: `${(scrollPosition / maxScroll) * 100 || 0}%` }}
        ></div>
      </div>

      {viewMode === 'horizontal' ? (
        /* Horizontal gallery */
        <div 
          className={styles.scrollContainer}
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {filteredMedia.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.galleryItem} ${item.size === 'large' ? styles.largeItem : ''}`}
            >
              {item.type === 'image' ? (
                <div className={styles.imageContainer}>
                  <img 
                    src={item.url} 
                    alt={item.title || `Imagem ${index + 1}`} 
                    className={styles.galleryImage}
                    loading="lazy"
                  />
                  {item.title && (
                    <div className={styles.imageCaption}>
                      <h3>{item.title}</h3>
                      {item.caption && <p>{item.caption}</p>}
                    </div>
                  )}
                </div>
              ) : item.type === 'video' ? (
                <div className={styles.videoContainer}>
                  <video
                    src={item.url}
                    poster={item.thumbnail}
                    controls
                    className={styles.galleryVideo}
                    playsInline
                  />
                  {item.title && (
                    <div className={styles.videoCaption}>
                      <h3>{item.title}</h3>
                      {item.caption && <p>{item.caption}</p>}
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.prototypeContainer}>
                  <iframe
                    src={item.url}
                    title={item.title || `Protótipo ${index + 1}`}
                    className={styles.prototypeFrame}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  {item.title && (
                    <div className={styles.prototypeCaption}>
                      <h3>{item.title}</h3>
                      {item.caption && <p>{item.caption}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Grid gallery */
        <div className={styles.galleryGrid}>
          {filteredMedia.map((item, index) => (
            <div 
              key={index}
              className={`${styles.galleryGridItem} ${index % 3 === 0 ? styles.itemLarge : ''}`}
            >
              {item.type === 'image' ? (
                <div className={styles.imageContainer}>
                  <img 
                    src={item.url} 
                    alt={item.title || `Imagem ${index + 1}`} 
                    className={styles.galleryImage}
                    loading="lazy"
                  />
                  {item.title && (
                    <div className={styles.imageCaption}>
                      <h3>{item.title}</h3>
                      {item.caption && <p>{item.caption}</p>}
                    </div>
                  )}
                </div>
              ) : item.type === 'video' ? (
                <div className={styles.videoContainer}>
                  <video
                    src={item.url}
                    poster={item.thumbnail}
                    controls
                    className={styles.galleryVideo}
                    playsInline
                  />
                </div>
              ) : (
                <div className={styles.prototypeContainer}>
                  <iframe
                    src={item.url}
                    title={item.title || `Protótipo ${index + 1}`}
                    className={styles.prototypeFrame}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* View mode toggle */}
<div className={styles.viewModeToggle}>
  <button 
    className={`${styles.viewModeButton} ${viewMode === 'horizontal' ? styles.active : ''}`} 
    onClick={() => toggleViewMode('horizontal')}
    aria-label="Visualização horizontal"
    title="Visualização horizontal"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>
  <button 
    className={`${styles.viewModeButton} ${viewMode === 'grid' ? styles.active : ''}`} 
    onClick={() => toggleViewMode('grid')}
    aria-label="Visualização em grid"
    title="Visualização em grid"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
    </svg>
  </button>
</div>
    </div>
  );
};

export default ProjectGallery;