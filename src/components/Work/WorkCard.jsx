import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './WorkCard.module.css';
import sectionStyles from './WorkSection.module.css';
import { useInView } from '../../Hooks/useInView';
import { useReducedMotion } from '../../Hooks/useReducedMotion';
import { FiArrowRight, FiEye } from 'react-icons/fi';
// Importando utilitários premium para melhor desempenho
import { 
  detectDevicePerformance, 
  setupMouseTracking,
  loadOptimizedImage
} from '../utils/premiumPerformance';

const WorkCard = ({ 
  project, 
  index, 
  onClick,
  featuredProject = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const isInView = useInView(cardRef, { threshold: 0.1, triggerOnce: true });
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();

  // Detectar capacidades do dispositivo no mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDeviceInfo(detectDevicePerformance());
    }
  }, []);

  // Carregamento otimizado de imagem quando o componente entra na viewport
  useEffect(() => {
    if (!isInView) return;
    
    const loadImage = async () => {
      try {
        // Usar a função premium para carregar imagem com qualidade adequada
        const quality = deviceInfo?.isLowEndDevice ? 'low' : 'medium';
        
        if (project.thumbnailImage || project.thumbnail) {
          await loadOptimizedImage(project.thumbnailImage || project.thumbnail, quality);
          setImageLoaded(true);
        }
      } catch (error) {
        console.log('Fel vid inläsning av optimerad bild:', error);
        // Fallback para carregamento normal
        setImageLoaded(true);
      }
    };
    
    loadImage();
  }, [isInView, project.thumbnailImage, project.thumbnail, deviceInfo]);

  // Setup de efeitos 3D avançados com cleanup adequado
  useEffect(() => {
    if (!cardRef.current || prefersReducedMotion || (deviceInfo && deviceInfo.shouldReduceEffects)) return;
    
    // Usa a função premium para setup de mouse tracking
    const cleanupMouseTracking = setupMouseTracking(cardRef.current, {
      throttleLimit: 50,
      effectIntensity: featuredProject ? 1.2 : 0.8,
      perspective: true
    });
    
    return () => {
      if (cleanupMouseTracking) cleanupMouseTracking();
    };
  }, [prefersReducedMotion, deviceInfo, featuredProject]);

  // Animação de entrada com delay progressivo
  useEffect(() => {
    if (!cardRef.current || !isInView) return;
    
    const noAnimations = prefersReducedMotion || (deviceInfo && deviceInfo.prefersReducedMotion);
    const delay = noAnimations ? 0 : index * 100;
    
    const timeoutId = setTimeout(() => {
      cardRef.current?.classList.add(sectionStyles.visible);
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [isInView, index, prefersReducedMotion, deviceInfo]);

  // Função para cortar texto se for muito longo
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Função para lidar com o clique no card
  const handleCardClick = useCallback((e) => {
    e.preventDefault();
    navigate(`/work/${project.id}`);
  }, [navigate, project.id]);

  // Função para lidar com o clique no botão de visualização rápida
  const handleQuickViewClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation(); // Impede que o evento de clique se propague para o Link
    if (onClick && typeof onClick === 'function') {
      onClick(project);
    }
  }, [onClick, project]);

  return (
    <div className={sectionStyles.projectCardWrapper}>
      <div
        ref={cardRef}
        className={`${sectionStyles.projectCard} ${featuredProject ? styles.featured : ''} premium-lazy`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
        aria-label={`Se detaljer om projektet ${project.title}`}
        data-premium-effect={featuredProject ? "enhanced" : "standard"}
      >
        <div className={sectionStyles.cardImage}>
          <div className={`${sectionStyles.imageContainer} ${imageLoaded ? sectionStyles.loaded : ''}`}>
            {/* Div de placeholder enquanto a imagem carrega */}
            <div className={sectionStyles.imagePlaceholder}>
              <span className={sectionStyles.loadingText}>Laddar...</span>
            </div>
            
            {/* Imagem com carregamento otimizado */}
            <img 
              ref={imageRef}
              src={project.thumbnailImage || project.thumbnail} 
              alt={project.title}
              className={imageLoaded ? sectionStyles.visible : ''}
              loading="lazy"
            />
          </div>
          <div className={sectionStyles.cardOverlay}></div>
          {featuredProject && (
            <div className={styles.featuredBadge}>
              <span className={styles.featuredStar}>★</span>
              Utmärkt
            </div>
          )}
          <div className={sectionStyles.thumbnailReflection}></div>
        </div>

        <button 
          type="button"
          className={sectionStyles.cardQuickAction}
          onClick={handleQuickViewClick}
          aria-label="Snabbvy"
        >
          <span className={sectionStyles.quickViewButton}>
            <FiEye size={20} />
          </span>
        </button>
        
        <div className={sectionStyles.cardContent}>
          <span className={sectionStyles.projectCategory}>
            {project.category}
          </span>
          
          <h3>{truncateText(project.title, 40)}</h3>
          <p>{truncateText(project.description, 100)}</p>
          
          <div className={sectionStyles.cardMeta}>
            <div className={sectionStyles.cardTags}>
              {project.technologies && project.technologies.slice(0, 3).map((tech, i) => (
                <span key={i} className={sectionStyles.tag}>
                  {tech}
                </span>
              ))}
              {project.tags && project.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className={sectionStyles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            
            <span className={sectionStyles.cardYear}>
              {project.year}
            </span>
          </div>
        </div>
        
        <div className={`${sectionStyles.cardHoverEffect} ${isHovered ? sectionStyles.active : ''}`}>
          <span className={sectionStyles.exploreText}>Utforska projekt</span>
          <FiArrowRight className={sectionStyles.arrowIcon} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(WorkCard);