import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './WorkGridView.module.css';
import useInView from '../../Hooks/useInView';
import { useReducedMotion } from '../../Hooks/useReducedMotion';
import { FiExternalLink, FiArrowRight } from 'react-icons/fi';

const WorkGridView = ({ projects, onQuickView }) => {
  const gridRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [hoveredCard, setHoveredCard] = useState(null);
  const cardRefs = useRef([]);

  // Configurar refs para todos os cards
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, projects.length);
  }, [projects]);

  // Versão atualizada utilizando o hook useInView corretamente
  useEffect(() => {
    if (prefersReducedMotion) {
      // Aplicar imediatamente para usuários que preferem movimento reduzido
      cardRefs.current.forEach(ref => {
        if (ref) ref.classList.add(styles.inView);
      });
      return;
    }

    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Adiciona delay progressivo para criar efeito em cascata
              setTimeout(() => {
                ref.classList.add(styles.inView);
              }, index * 120);
              observer.unobserve(ref);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -100px 0px' }
      );
      
      observer.observe(ref);
      return observer;
    });
    
    // Limpeza
    return () => {
      observers.forEach(obs => obs?.disconnect());
    };
  }, [projects, prefersReducedMotion]);

  // Tratamento de movimento do mouse para efeito 3D
  const handleMouseMove = (e, index) => {
    if (prefersReducedMotion) return;
    
    const card = cardRefs.current[index];
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Cálculos para efeito 3D suave
    const tiltX = -((y - 0.5) * 10);
    const tiltY = (x - 0.5) * 10;
    
    card.style.setProperty('--mouse-x', x);
    card.style.setProperty('--mouse-y', y);
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02) translateZ(10px)`;
  };
  
  // Reset da transformação 3D quando o mouse deixa o card
  const handleMouseLeave = (index) => {
    const card = cardRefs.current[index];
    if (!card) return;
    
    card.style.transform = '';
    setHoveredCard(null);
  };
  
  if (projects.length === 0) {
    return (
      <div className={styles.gridContainer} ref={gridRef}>
        <div className={styles.noResults}>
          <h3>Nenhum projeto encontrado</h3>
          <p>Tente ajustar seus filtros ou critérios de busca para encontrar mais projetos.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.gridContainer} ref={gridRef}>
      {projects.map((project, index) => (
        <div
          key={project.id || index}
          className={styles.gridCard}
          style={{ 
            backgroundImage: `url(${project.thumbnailImage})`,
            animationDelay: `${index * 0.1}s`
          }}
          ref={el => cardRefs.current[index] = el}
          onMouseMove={(e) => handleMouseMove(e, index)}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => handleMouseLeave(index)}
        >
          <div className={`${styles.cardOverlay} ${hoveredCard === index ? styles.hovered : ''}`}></div>

          <div className={styles.cardContent}>
            <div className={styles.cardTags}>
              {project.technologies && project.technologies.slice(0, 3).map((tech, i) => (
                <span key={i} className={styles.tag}>
                  {tech}
                </span>
              ))}
            </div>
            
            <h3 className={styles.cardTitle}>{project.title}</h3>
            
            <p className={styles.cardDescription}>
              {project.description?.length > 100 
                ? `${project.description.substring(0, 100)}...` 
                : project.description}
            </p>
            
            <div className={styles.cardActions}>
              <Link 
                to={`/work/${project.slug}`}
                className={styles.viewButton}
                aria-label={`Ver detalhes do projeto ${project.title}`}
              >
                Ver projeto <FiArrowRight className={styles.buttonIcon} />
              </Link>
              
              <button
                type="button"
                className={styles.detailsButton}
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(project);
                }}
              >
                Pré-visualizar <FiExternalLink className={styles.buttonIcon} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkGridView;