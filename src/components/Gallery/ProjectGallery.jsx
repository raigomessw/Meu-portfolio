import React, { useState, useMemo } from 'react';
import styles from './ProjectGallery.module.css';

// Imagem de fallback
const FALLBACK_IMAGE = "/work/placeholder.jpg";

const ProjectGallery = ({ images, activeCategory }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Filtra imagens por categoria se necessário
  const filteredImages = useMemo(() => {
    if (!images || !Array.isArray(images)) return [];
    return activeCategory 
      ? images.filter(img => img.category === activeCategory)
      : images;
  }, [images, activeCategory]);
  
  // Abre o lightbox
  const openLightbox = (image) => {
    setSelectedImage(image);
    // Impedir scroll da página quando lightbox está aberto
    document.body.style.overflow = 'hidden';
  };
  
  // Fecha o lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    // Restaurar scroll da página
    document.body.style.overflow = '';
  };
  
  // Verificar se não temos imagens para mostrar
  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className={styles.emptyGallery}>
        <p>Nenhuma imagem disponível para este projeto.</p>
      </div>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      {filteredImages.length === 0 ? (
        <p className={styles.emptyMessage}>
          Nenhuma imagem encontrada {activeCategory ? `na categoria "${activeCategory}"` : ''}
        </p>
      ) : (
        <div className={styles.imageGrid}>
          {filteredImages.map((image, index) => (
            <div 
              key={`${image.url}-${index}`}
              className={styles.imageItem}
              onClick={() => openLightbox(image)}
            >
              <img 
                src={image.url || FALLBACK_IMAGE} 
                alt={image.title || 'Project image'} 
                className={styles.thumbnail}
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE;
                  e.target.onerror = null; // Evita loop infinito
                }}
              />
              <div className={styles.imageOverlay}>
                <h4>{image.title}</h4>
                {image.category && (
                  <span className={styles.category}>{image.category}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Lightbox para imagem selecionada */}
      {selectedImage && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.closeButton} onClick={closeLightbox} aria-label="Fechar lightbox">
            ×
          </button>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <img 
              src={selectedImage.url || FALLBACK_IMAGE} 
              alt={selectedImage.title || 'Project image'} 
              className={styles.lightboxImage}
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
                e.target.onerror = null;
              }}
            />
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGallery;