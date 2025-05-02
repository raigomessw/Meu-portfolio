import React, { useState, useMemo, useRef, useEffect } from 'react';
import styles from './ProjectGallery.module.css';

// Imagem de fallback
const FALLBACK_IMAGE = "/work/placeholder.jpg";

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

// Textos em sueco
const texts = {
  noImages: "Inga bilder tillgängliga för detta projekt.",
  noImagesInCategory: "Inga bilder hittades i kategori",
  closeButton: "Stäng",
  nextImage: "Nästa bild",
  prevImage: "Föregående bild",
  imageOf: "Bild",
  of: "av",
  loading: "Laddar bild..."
};

const ProjectGallery = ({ images, activeCategory, isVisible = true }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState({});
  const [imageTransition, setImageTransition] = useState('');
  const lightboxRef = useRef(null);
  const imageCache = useRef(new Map()).current;
  
  // Forçar visibilidade para true
  const forceVisible = true;
  
  // Debug para mostrar as imagens recebidas - versão atualizada
  useEffect(() => {
    console.log('ProjectGallery - dados recebidos:', { 
      totalImages: images?.length || 0,
      images: images || 'sem imagens',
      activeCategory
    });
    
    // Tentar pré-carregar as imagens diretamente
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        if (image && image.url) {
          console.log(`Tentativa de carregar imagem ${index + 1}: ${image.url}`);
          const img = new Image();
          img.onload = () => console.log(`Imagem ${index + 1} carregada com sucesso: ${image.url}`);
          img.onerror = () => console.error(`Falha ao carregar imagem ${index + 1}: ${image.url}`);
          img.src = image.url;
        } else {
          console.error(`Imagem ${index + 1} tem URL inválida:`, image);
        }
      });
    }
  }, [images]);
  
  // Filtra imagens por categoria se necessário
  const filteredImages = useMemo(() => {
    if (!images || !Array.isArray(images)) return [];
    
    if (!images.length) {
      console.error('Array de imagens está vazio');
    }
    
    const filtered = activeCategory 
      ? images.filter(img => img.category === activeCategory)
      : images;
    
    console.log(`Imagens filtradas: ${filtered.length}`, filtered);
    return filtered;
  }, [images, activeCategory]);
  
  // Gerencia o carregamento das imagens
  const handleImageLoaded = (imageUrl) => {
    console.log(`Bild laddad: ${imageUrl}`);
    setIsLoaded(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };
  
  // Tratamento de erro de imagem
  const handleImageError = (e, imageUrl) => {
    console.error(`Fel vid bildladdning: ${imageUrl}`);
    e.target.src = FALLBACK_IMAGE;
    e.target.onerror = null; // Evita loop infinito
    handleImageLoaded(imageUrl);
  };
  
  // Verifica se a URL da imagem é válida e a corrige se necessário
  const validateImageUrl = (url) => {
    if (!url) return FALLBACK_IMAGE;
    
    // Se não começar com http ou /, consideramos como caminho relativo
    if (!url.startsWith('http') && !url.startsWith('/')) {
      return `/${url}`;
    }
    
    return url;
  };
  
  // Abre o lightbox
  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setImageTransition('');
    // Impedir scroll da página quando lightbox está aberto
    document.body.style.overflow = 'hidden';
  };
  
  // Fecha o lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    setImageTransition('');
    // Restaurar scroll da página
    document.body.style.overflow = '';
  };
  
  // Navega para a próxima imagem
  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedIndex < filteredImages.length - 1) {
      setImageTransition('slide-left');
      setTimeout(() => {
        setSelectedIndex(selectedIndex + 1);
        setSelectedImage(filteredImages[selectedIndex + 1]);
        setImageTransition('');
      }, 300);
    }
  };
  
  // Navega para a imagem anterior
  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedIndex > 0) {
      setImageTransition('slide-right');
      setTimeout(() => {
        setSelectedIndex(selectedIndex - 1);
        setSelectedImage(filteredImages[selectedIndex - 1]);
        setImageTransition('');
      }, 300);
    }
  };
  
  // Gerencia teclas de navegação
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          if (selectedIndex < filteredImages.length - 1) {
            nextImage(e);
          }
          break;
        case 'ArrowLeft':
          if (selectedIndex > 0) {
            prevImage(e);
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedIndex, filteredImages]);
  
  // Verificar se não temos imagens para mostrar
  if (!images || !Array.isArray(images) || images.length === 0) {
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
      {filteredImages.length === 0 ? (
        <p className={styles.emptyMessage}>
          {texts.noImagesInCategory} "{activeCategory}"
        </p>
      ) : (
        <div className={styles.imageGrid}>
          {filteredImages.map((image, index) => {
            const imageUrl = validateImageUrl(image.url);
            return (
              <div 
                key={`${imageUrl}-${index}`}
                className={styles.imageItem}
                style={{ 
                  opacity: 1,
                  transform: 'translateY(0)'
                }}
                onClick={() => openLightbox(image, index)}
              >
                <div className={styles.imageWrapper}>
                  {!isLoaded[imageUrl] && (
                    <div className={styles.imagePlaceholder}>
                      <div className={styles.loadingSpinner}></div>
                      <span>{texts.loading}</span>
                    </div>
                  )}
                  
                  <img 
                    src={imageUrl} 
                    alt={image.title || 'Projektbild'} 
                    className={`${styles.thumbnail} ${styles.loaded}`}
                    onLoad={() => handleImageLoaded(imageUrl)}
                    onError={(e) => handleImageError(e, imageUrl)}
                    style={{opacity: 1}}
                  />
                </div>
                
                <div className={styles.imageOverlay} style={{opacity: 0.7}}>
                  <div className={styles.zoomIcon}>
                    <ZoomInIcon />
                  </div>
                  <div className={styles.imageInfo} style={{opacity: 1, transform: 'translateY(0)'}}>
                    <h4>{image.title}</h4>
                    {image.category && (
                      <span className={styles.category}>{image.category}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Lightbox para imagem selecionada com navegação e animações */}
      {selectedImage && (
        <div className={styles.lightbox} onClick={closeLightbox} ref={lightboxRef}>
          <button 
            className={styles.closeButton} 
            onClick={closeLightbox} 
            aria-label={texts.closeButton}
          >
            <CloseIcon />
          </button>
          
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <div className={`${styles.lightboxImageContainer} ${styles[imageTransition]}`}>
              <img 
                src={validateImageUrl(selectedImage.url)} 
                alt={selectedImage.title || 'Projektbild'} 
                className={styles.lightboxImage}
                onError={(e) => handleImageError(e, selectedImage.url)}
              />
            </div>
            
            <div className={styles.lightboxInfo}>
              {selectedImage.title && <h3>{selectedImage.title}</h3>}
              {selectedImage.caption && <p>{selectedImage.caption}</p>}
              
              {selectedImage.tags && selectedImage.tags.length > 0 && (
                <div className={styles.imageTags}>
                  {selectedImage.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
              
              <div className={styles.imageCounter}>
                {texts.imageOf} {selectedIndex + 1} {texts.of} {filteredImages.length}
              </div>
            </div>
          </div>
          
          {/* Botões de navegação do lightbox */}
          {selectedIndex > 0 && (
            <button 
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prevImage}
              aria-label={texts.prevImage}
            >
              <ArrowLeftIcon />
            </button>
          )}
          
          {selectedIndex < filteredImages.length - 1 && (
            <button 
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={nextImage}
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