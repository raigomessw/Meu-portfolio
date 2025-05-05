import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './WorkGridView.module.css';
import useInView from '../../Hooks/useInView';
import { useReducedMotion } from '../../Hooks/useReducedMotion';
import { FiExternalLink, FiArrowRight } from 'react-icons/fi';

const WorkGridView = ({ projects, onQuickView }) => {
  const gridRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [hoveredCard, setHoveredCard] = useState(null);
  const cardRefs = useRef([]);
  const navigate = useNavigate();

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
  
  // Função para navegar para a página de detalhes do projeto
  const handleViewProject = (e, project) => {
    e.preventDefault();
    // Usar project.id em vez de project.slug
    navigate(`/work/${project.id}`);
  };
  
  // Função para chamar a pré-visualização do projeto
  const handleQuickView = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView && typeof onQuickView === 'function') {
      onQuickView(project);
    }
  };

  // Função auxiliar para renderizar tecnologia com segurança
  const renderTechName = (tech) => {
    // Verifica se tech é um objeto com propriedade name
    if (tech && typeof tech === 'object' && tech.name) {
      return tech.name;
    }
    // Caso contrário, tenta converter para string
    return String(tech || '');
  };
  
  if (projects.length === 0) {
    return (
      <div className={styles.gridContainer} ref={gridRef}>
        <div className={styles.noResults}>
          <h3>Inga projekt hittades</h3>
          <p>Försök att justera dina filter eller sökkriterier för att hitta fler projekt.</p>
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
          onClick={(e) => handleViewProject(e, project)}
        >
          <div className={`${styles.cardOverlay} ${hoveredCard === index ? styles.hovered : ''}`}></div>

          <div className={styles.cardContent}>
            <div className={styles.cardTags}>
              {project.technologies && project.technologies.slice(0, 3).map((tech, i) => (
                <span key={i} className={styles.tag}>
                  {renderTechName(tech)}
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
              <button 
                className={styles.viewButton}
                onClick={(e) => handleViewProject(e, project)}
                aria-label={`Se detaljer om projektet ${project.title}`}
              >
                Se projekt <FiArrowRight className={styles.buttonIcon} />
              </button>
              
              <button
                type="button"
                className={styles.detailsButton}
                onClick={(e) => handleQuickView(e, project)}
                aria-label={`Förhandsgranska ${project.title}`}
              >
                Förhandsgranska <FiExternalLink className={styles.buttonIcon} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkGridView;