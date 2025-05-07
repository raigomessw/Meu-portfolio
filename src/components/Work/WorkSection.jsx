import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./WorkGridView.module.css";
import workSectionStyles from "./WorkSection.module.css";
import { FiArrowRight } from 'react-icons/fi';
import { useWorkProjects } from "../../components/Work/WorkProjectContext";
import { useReducedMotion } from '../../hooks/useReducedMotion';

const WorkSection = () => {
  // Usando o hook personalizado useWorkProjects em vez do useContext diretamente
  const { projetos, loading, error } = useWorkProjects();
  const prefersReducedMotion = useReducedMotion();
  const [hoveredCard, setHoveredCard] = useState(null);
  const cardRefs = useRef([]);
  const navigate = useNavigate();
  
  // Configurar refs para todos os cards
  useEffect(() => {
    if (Array.isArray(projetos)) {
      cardRefs.current = cardRefs.current.slice(0, projetos.length);
    }
  }, [projetos]);
  
  // Efeito de aparecimento
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
  }, [projetos, prefersReducedMotion]);

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
  const handleViewProject = (e, projeto) => {
    e.preventDefault();
    navigate(`/work/${projeto.id}`);
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

  return (
    <section className={workSectionStyles.workSection} id="work">
      {/* Elementos decorativos */}
      <div className={workSectionStyles.backgroundGlow}></div>
      <div className={workSectionStyles.decorCircleTop}></div>
      <div className={workSectionStyles.decorCircleBottom}></div>
      <div className={workSectionStyles.gridLines}></div>

      <div className={workSectionStyles.sectionHeader}>
        <h2>Mina Projekt</h2>
        <div className={workSectionStyles.headerAccent}></div>
      </div>

      {/* Mostrar erro se houver */}
      {error && (
        <div className={workSectionStyles.errorContainer}>
          <p>{error}</p>
        </div>
      )}

      <div className={`${styles.gridContainer} ${workSectionStyles.projectsPreview}`}>
        {loading ? (
          <div className={workSectionStyles.loadingContainer}>
            <div className={workSectionStyles.loadingSpinner}></div>
          </div>
        ) : Array.isArray(projetos) && projetos.length > 0 ? (
          projetos
            .filter(projeto => projeto.featured) // Filtrar apenas projetos destacados
            .map((projeto, index) => (
              <div
                key={projeto.id}
                className={`${styles.gridCard} workProjectCard`}
                style={{ 
                  backgroundImage: `url(${projeto.thumbnailImage || projeto.coverImage})`,
                  animationDelay: `${index * 0.1}s`
                }}
                ref={el => cardRefs.current[index] = el}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                onClick={(e) => handleViewProject(e, projeto)}
                data-index={index}
              >
                <div className={`${styles.cardOverlay} ${hoveredCard === index ? styles.hovered : ''}`}></div>

                <div className={styles.cardContent}>
                  <div className={styles.cardTags}>
                    {projeto.technologies && projeto.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className={styles.tag}>
                        {renderTechName(tech)}
                      </span>
                    ))}
                    {projeto.tags && projeto.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className={styles.cardTitle}>{projeto.title}</h3>
                  
                  <p className={styles.cardDescription}>
                    {projeto.description?.length > 100 
                      ? `${projeto.description.substring(0, 100)}...` 
                      : projeto.description}
                  </p>
                  
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.viewButton}
                      onClick={(e) => handleViewProject(e, projeto)}
                      aria-label={`Se detaljer om projektet ${projeto.title}`}
                    >
                      Se projekt <FiArrowRight className={styles.buttonIcon} />
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className={workSectionStyles.noProjectsContainer}>
            <p>Inga projekt hittades.</p>
          </div>
        )}
      </div>

      {/* Botão Ver mais - apenas mostrado se houver projetos e não estiver carregando */}
      {!loading && Array.isArray(projetos) && projetos.length > 0 && (
        <div className={workSectionStyles.viewAllContainer}>
          <a href="/work" className={workSectionStyles.viewAllButton}>
            <span>Se alla projekt</span>
            <div className={workSectionStyles.iconCircle}>
              <svg className={workSectionStyles.buttonIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </a>
        </div>
      )}
    </section>
  );
};

export default WorkSection;