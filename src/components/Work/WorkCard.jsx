import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './WorkCard.module.css';
import sectionStyles from './WorkSection.module.css';
import { useInView } from '../../Hooks/useInView';
import { useReducedMotion } from '../../Hooks/useReducedMotion';
import { FiArrowRight, FiEye } from 'react-icons/fi';

const WorkCard = ({ 
  project, 
  index, 
  onClick,
  featuredProject = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { threshold: 0.1, triggerOnce: true });
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();

  // Mouse tracking para efeito 3D
  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    
    const card = cardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    card.style.setProperty('--mouse-x', x);
    card.style.setProperty('--mouse-y', y);
  };

  // Animação de entrada com delay progressivo
  useEffect(() => {
    if (!cardRef.current) return;
    if (isInView) {
      const delay = prefersReducedMotion ? 0 : index * 100;
      setTimeout(() => {
        cardRef.current?.classList.add(sectionStyles.visible);
      }, delay);
    }
  }, [isInView, index, prefersReducedMotion]);

  // Função para cortar texto se for muito longo
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Função para lidar com o clique no card
  const handleCardClick = (e) => {
    e.preventDefault();
    // Usa project.id em vez de project.slug
    navigate(`/work/${project.id}`);
  };

  // Função para lidar com o clique no botão de visualização rápida
  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Impede que o evento de clique se propague para o Link
    if (onClick && typeof onClick === 'function') {
      onClick(project);
    }
  };

  return (
    <div className={sectionStyles.projectCardWrapper}>
      <div
        ref={cardRef}
        className={`${sectionStyles.projectCard} ${featuredProject ? styles.featured : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
        aria-label={`Ver detalhes do projeto ${project.title}`}
      >
        <div className={sectionStyles.cardImage}>
          <img src={project.thumbnailImage || project.thumbnail} alt={project.title} />
          <div className={sectionStyles.cardOverlay}></div>
          {featuredProject && (
            <div className={styles.featuredBadge}>
              <span className={styles.featuredStar}>★</span>
              Destaque
            </div>
          )}
          <div className={sectionStyles.thumbnailReflection}></div>
        </div>

        <button 
          type="button"
          className={sectionStyles.cardQuickAction}
          onClick={handleQuickViewClick}
          aria-label="Visualização rápida"
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
        
        <div className={sectionStyles.cardHoverEffect}>
          <span className={sectionStyles.exploreText}>Explorar Projeto</span>
          <FiArrowRight className={sectionStyles.arrowIcon} />
        </div>
      </div>
    </div>
  );
};

export default WorkCard;