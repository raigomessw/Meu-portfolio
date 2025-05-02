import React, { useState, useMemo, useRef, useEffect } from 'react';
import styles from './ProjectGallery.module.css';

// Imagem de fallback
const FALLBACK_IMAGE = "/work/placeholder.jpg";
const FALLBACK_VIDEO = "/work/placeholder-video.mp4";

// Componentes de ícones para melhorar UX
const ZoomInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    <line x1="11" y1="8" x2="11" y2="14"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

// Textos em sueco
const texts = {
  noImages: "Inga mediafiler tillgängliga för detta projekt.",
  noImagesInCategory: "Inga mediafiler hittades i kategori",
  closeButton: "Stäng",
  nextImage: "Nästa",
  prevImage: "Föregående",
  imageOf: "Bild",
  videoOf: "Video",
  of: "av",
  loading: "Laddar...",
  playVideo: "Spela video",
  pauseVideo: "Pausa video",
  openExternalLink: "Öppna extern länk",
  viewDetails: "Visa detaljer",
  expandMedia: "Expandera",
  collapseMedia: "Minimera",
  filter: "Filtrera",
  all: "Alla",
  image: "Bilder",
  video: "Videor",
  prototype: "Prototyper",
  errorLoading: "Kunde inte ladda media"
};

/**
 * Componente de Galeria Premium que suporta imagens e vídeos
 * 
 * @param {Object} props 
 * @param {Array} props.media - Array de objetos de mídia (imagens, vídeos, links externos)
 * @param {string} props.activeCategory - Categoria ativa para filtrar
 * @param {boolean} props.isVisible - Se o componente deve ser visível
 */
const ProjectGallery = ({ media, activeCategory, isVisible = true }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState({});
  const [mediaTransition, setMediaTransition] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // 'all', 'image', 'video', 'prototype'
  const [isPlaying, setIsPlaying] = useState(false);
  
  const lightboxRef = useRef(null);
  const videoRef = useRef(null);
  const mediaCache = useRef(new Map()).current;
  
  // Forçar visibilidade para true por padrão
  const forceVisible = true;

  // Logs para debug inicial
  useEffect(() => {
    console.log('ProjectGallery - dados recebidos:', { 
      totalItems: media?.length || 0,
      media: media || 'sem mídia',
      activeCategory
    });
    
    // Tentar pré-carregar as imagens/vídeos
    if (media && media.length > 0) {
      media.forEach((item, index) => {
        if (item && item.url) {
          // Verifica se é imagem ou vídeo antes de pré-carregar
          if (item.type === 'image') {
            console.log(`Tentativa de pré-carregar imagem ${index + 1}: ${item.url}`);
            const img = new Image();
            img.onload = () => console.log(`Imagem ${index + 1} carregada com sucesso: ${item.url}`);
            img.onerror = () => console.error(`Falha ao carregar imagem ${index + 1}: ${item.url}`);
            img.src = item.url;
          }
        } else {
          console.error(`Item ${index + 1} tem URL inválida:`, item);
        }
      });
    }
  }, [media]);
  
  // Filtra mídia por categoria e tipo
  const filteredMedia = useMemo(() => {
    if (!media || !Array.isArray(media)) return [];
    
    if (!media.length) {
      console.error('Array de mídia está vazio');
      return [];
    }
    
    // Primeiro filtramos por categoria
    let filtered = activeCategory 
      ? media.filter(item => item.category === activeCategory)
      : media;
    
    // Depois filtramos por tipo de mídia
    if (mediaTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === mediaTypeFilter);
    }
    
    console.log(`Mídia filtrada: ${filtered.length} itens`, filtered);
    return filtered;
  }, [media, activeCategory, mediaTypeFilter]);
  
  // Gerencia o carregamento de mídia
  const handleMediaLoaded = (url) => {
    console.log(`Mídia carregada: ${url}`);
    setIsLoaded(prev => ({
      ...prev,
      [url]: true
    }));
  };
  
  // Tratamento de erro de mídia
  const handleMediaError = (e, item) => {
    console.error(`Erro ao carregar mídia: ${item.url}`);
    if (item.type === 'image') {
      e.target.src = FALLBACK_IMAGE;
    } else if (item.type === 'video') {
      e.target.src = FALLBACK_VIDEO;
    }
    e.target.onerror = null; // Evita loop infinito
    handleMediaLoaded(item.url);
  };
  
  // Verifica se a URL da mídia é válida e a corrige se necessário
  const validateUrl = (url, type = 'image') => {
    if (!url) return type === 'image' ? FALLBACK_IMAGE : FALLBACK_VIDEO;
    
    // Se não começar com http ou /, consideramos como caminho relativo
    if (!url.startsWith('http') && !url.startsWith('/')) {
      return `/${url}`;
    }
    
    return url;
  };
  
  // Abre o lightbox
  const openLightbox = (item, index) => {
    setSelectedItem(item);
    setSelectedIndex(index);
    setMediaTransition('');
    setIsPlaying(false);
    // Impedir scroll da página quando lightbox está aberto
    document.body.style.overflow = 'hidden';
  };
  
  // Fecha o lightbox
  const closeLightbox = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedItem(null);
    setMediaTransition('');
    setIsPlaying(false);
    // Restaurar scroll da página
    document.body.style.overflow = '';
  };
  
  // Toggle play/pause para vídeos
  const togglePlayPause = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    
    if (!video) return;
    
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Abre link externo para protótipos
  const openExternalLink = (e, url) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Navega para a próxima mídia
  const nextMedia = (e) => {
    e.stopPropagation();
    if (selectedIndex < filteredMedia.length - 1) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      
      setMediaTransition('slide-left');
      setIsPlaying(false);
      
      setTimeout(() => {
        setSelectedIndex(selectedIndex + 1);
        setSelectedItem(filteredMedia[selectedIndex + 1]);
        setMediaTransition('');
      }, 300);
    }
  };
  
  // Navega para a mídia anterior
  const prevMedia = (e) => {
    e.stopPropagation();
    if (selectedIndex > 0) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      
      setMediaTransition('slide-right');
      setIsPlaying(false);
      
      setTimeout(() => {
        setSelectedIndex(selectedIndex - 1);
        setSelectedItem(filteredMedia[selectedIndex - 1]);
        setMediaTransition('');
      }, 300);
    }
  };
  
  // Gerencia teclas de navegação
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedItem) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          if (selectedIndex < filteredMedia.length - 1) {
            nextMedia(e);
          }
          break;
        case 'ArrowLeft':
          if (selectedIndex > 0) {
            prevMedia(e);
          }
          break;
        case ' ': // Espaço
          if (selectedItem?.type === 'video') {
            togglePlayPause(e);
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, selectedIndex, filteredMedia]);

  // Renderiza o conteúdo apropriado baseado no tipo de mídia
  const renderMediaContent = (item) => {
    const url = validateUrl(item.url, item.type);
    
    switch (item.type) {
      case 'video':
        return (
          <div className={styles.videoWrapper}>
            <video 
              className={styles.videoThumbnail}
              src={url}
              poster={item.thumbnail || ''}
              muted
              playsInline
              loop
              onLoadedData={() => handleMediaLoaded(url)}
              onError={(e) => handleMediaError(e, item)}
            />
            <div className={styles.videoPlayIcon}>
              <PlayIcon />
            </div>
          </div>
        );
        
      case 'prototype':
        return (
          <div className={styles.prototypeWrapper}>
            <img 
              src={item.thumbnail || FALLBACK_IMAGE} 
              alt={item.title || 'Prototypbild'}
              className={styles.thumbnail}
              onLoad={() => handleMediaLoaded(item.thumbnail || '')}
              onError={(e) => handleMediaError(e, { ...item, url: item.thumbnail })}
            />
            <div className={styles.externalLinkIcon}>
              <ExternalLinkIcon />
              <span>{texts.openExternalLink}</span>
            </div>
          </div>
        );
        
      case 'image':
      default:
        return (
          <img 
            src={url} 
            alt={item.title || 'Projektbild'} 
            className={`${styles.thumbnail} ${isLoaded[url] ? styles.loaded : ''}`}
            onLoad={() => handleMediaLoaded(url)}
            onError={(e) => handleMediaError(e, item)}
          />
        );
    }
  };
  
  // Renderiza o conteúdo do lightbox
  const renderLightboxContent = () => {
    if (!selectedItem) return null;
    
    const url = validateUrl(selectedItem.url, selectedItem.type);
    
    switch (selectedItem.type) {
      case 'video':
        return (
          <div className={styles.videoLightbox}>
            <video
              ref={videoRef}
              src={url}
              className={styles.lightboxVideo}
              controls={false}
              onError={(e) => handleMediaError(e, selectedItem)}
              playsInline
              onEnded={() => setIsPlaying(false)}
            />
            <button 
              className={styles.videoControl} 
              onClick={togglePlayPause}
              aria-label={isPlaying ? texts.pauseVideo : texts.playVideo}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>
        );
      
      case 'prototype':
        return (
          <div className={styles.prototypeLightbox}>
            <img 
              src={selectedItem.thumbnail || FALLBACK_IMAGE}
              alt={selectedItem.title || 'Prototypbild'}
              className={styles.lightboxImage}
              onError={(e) => handleMediaError(e, { ...selectedItem, url: selectedItem.thumbnail })}
            />
            <div className={styles.prototypeActions}>
              <button 
                className={styles.prototypeButton}
                onClick={(e) => openExternalLink(e, selectedItem.url)}
              >
                <ExternalLinkIcon /> {texts.openExternalLink}
              </button>
            </div>
          </div>
        );
      
      case 'image':
      default:
        return (
          <img 
            src={url} 
            alt={selectedItem.title || 'Projektbild'} 
            className={styles.lightboxImage}
            onError={(e) => handleMediaError(e, selectedItem)}
          />
        );
    }
  };
  
  // Filtros de tipos de mídia
  const renderTypeFilters = () => (
    <div className={styles.mediaTypeFilters}>
      <button 
        className={`${styles.filterButton} ${mediaTypeFilter === 'all' ? styles.active : ''}`}
        onClick={() => setMediaTypeFilter('all')}
      >
        {texts.all}
      </button>
      <button 
        className={`${styles.filterButton} ${mediaTypeFilter === 'image' ? styles.active : ''}`}
        onClick={() => setMediaTypeFilter('image')}
      >
        {texts.image}
      </button>
      <button 
        className={`${styles.filterButton} ${mediaTypeFilter === 'video' ? styles.active : ''}`}
        onClick={() => setMediaTypeFilter('video')}
      >
        {texts.video}
      </button>
      <button 
        className={`${styles.filterButton} ${mediaTypeFilter === 'prototype' ? styles.active : ''}`}
        onClick={() => setMediaTypeFilter('prototype')}
      >
        {texts.prototype}
      </button>
    </div>
  );
  
  // Verificar se não temos mídia para mostrar
  if (!media || !Array.isArray(media) || media.length === 0) {
    return (
      <div className={styles.emptyGallery}>
        <p>{texts.noImages}</p>
      </div>
    );
  }

  // Classes para animação de entrada - forçar sempre visible
  const galleryClasses = `${styles.galleryContainer} ${styles.visible}`;

  return (
    <div className={galleryClasses} style={{opacity: 1, transform: 'translateY(0)'}}>
      {/* Filtros por tipo de mídia */}
      {renderTypeFilters()}
      
      {filteredMedia.length === 0 ? (
        <p className={styles.emptyMessage}>
          {texts.noImagesInCategory} "{activeCategory}"
        </p>
      ) : (
        <div className={styles.imageGrid}>
          {filteredMedia.map((item, index) => {
            const itemUrl = item.url || '';
            const mediaType = item.type || 'image';
            
            return (
              <div 
                key={`${itemUrl}-${index}`}
                className={`${styles.imageItem} ${styles[mediaType + 'Item'] || ''}`}
                style={{ opacity: 1, transform: 'translateY(0)' }}
                onClick={() => openLightbox(item, index)}
                role="button"
                aria-label={texts.viewDetails}
                tabIndex={0}
              >
                <div className={styles.imageWrapper}>
                  {!isLoaded[itemUrl] && (
                    <div className={styles.imagePlaceholder}>
                      <div className={styles.loadingSpinner}></div>
                      <span>{texts.loading}</span>
                    </div>
                  )}
                  
                  {renderMediaContent(item)}
                </div>
                
                <div className={styles.imageOverlay} style={{opacity: 0.7}}>
                  <div className={styles.zoomIcon}>
                    {mediaType === 'video' ? (
                      <PlayIcon />
                    ) : mediaType === 'prototype' ? (
                      <ExternalLinkIcon />
                    ) : (
                      <ZoomInIcon />
                    )}
                  </div>
                  <div className={styles.imageInfo} style={{opacity: 1, transform: 'translateY(0)'}}>
                    <h4>{item.title}</h4>
                    <div className={styles.mediaInfoDetails}>
                      {item.category && (
                        <span className={styles.category}>{item.category}</span>
                      )}
                      {item.type && (
                        <span className={`${styles.mediaType} ${styles[item.type]}`}>
                          {item.type === 'video' ? texts.video : 
                           item.type === 'prototype' ? texts.prototype : 
                           texts.image}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Lightbox para mídia selecionada com navegação e animações */}
      {selectedItem && (
        <div 
          className={styles.lightbox} 
          onClick={closeLightbox} 
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title || "Media lightbox"}
        >
          <button 
            className={styles.closeButton} 
            onClick={closeLightbox} 
            aria-label={texts.closeButton}
          >
            <CloseIcon />
          </button>
          
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <div className={`${styles.lightboxMediaContainer} ${styles[mediaTransition]}`}>
              {renderLightboxContent()}
            </div>
            
            <div className={styles.lightboxInfo}>
              {selectedItem.title && <h3>{selectedItem.title}</h3>}
              {selectedItem.caption && <p>{selectedItem.caption}</p>}
              
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div className={styles.imageTags}>
                  {selectedItem.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
              
              <div className={styles.imageCounter}>
                {selectedItem.type === 'video' ? texts.videoOf : texts.imageOf} {selectedIndex + 1} {texts.of} {filteredMedia.length}
              </div>
            </div>
          </div>
          
          {/* Botões de navegação do lightbox */}
          {selectedIndex > 0 && (
            <button 
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prevMedia}
              aria-label={texts.prevImage}
            >
              <ArrowLeftIcon />
            </button>
          )}
          
          {selectedIndex < filteredMedia.length - 1 && (
            <button 
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={nextMedia}
              aria-label={texts.nextImage}
            >
              <ArrowRightIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectGallery;