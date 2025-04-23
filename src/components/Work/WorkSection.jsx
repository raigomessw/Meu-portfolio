import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWorkProjects } from '../Work/WorkProjectContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEye } from '@fortawesome/free-solid-svg-icons';
import styles from './WorkSection.module.css';

function WorkSection() {
  const { allProjects, isLoading } = useWorkProjects();
  const [visibleProjects, setVisibleProjects] = useState([]);
  const sectionRef = useRef(null);
  
  // Mostrar apenas projetos em destaque na página inicial
  const featuredProjects = allProjects
    .filter(project => project.featured || project.highlight)
    .slice(0, 3);
  
  // Usar projetos recentes se não houver suficientes em destaque
  const projectsToShow = featuredProjects.length >= 3 
    ? featuredProjects 
    : allProjects.slice(0, 3);
  
  // Efeito de animação de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Quando a seção estiver visível, animamos os projetos um após o outro
          setTimeout(() => {
            setVisibleProjects(projectsToShow);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [projectsToShow]);

  return (
    <section id="trabalhos" ref={sectionRef} className={styles.workSection}>
      <div className={styles.sectionHeader}>
        <h2>My Works</h2>
        <p>Here you can see some of the projects I've worked on.</p>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : (
        <div className={styles.projectsPreview}>
          {projectsToShow.map((project, index) => (
            <Link 
              to={`/work/${project.id}`} 
              key={project.id} 
              className={`${styles.projectCard} ${visibleProjects.includes(project) ? styles.visible : ''}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className={styles.cardImage}>
                <img src={project.thumbnailImage} alt={project.title} loading="lazy" />
                <div className={styles.cardOverlay}></div>
                
                <div className={styles.cardQuickAction}>
                  <button className={styles.quickViewButton} aria-label="Ver detalhes rápidos">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                
                <div className={styles.cardMeta}>
                  <div className={styles.cardTags}>
                    {project.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                  
                  <span className={styles.cardYear}>{project.year || '2023'}</span>
                </div>
              </div>
              
              <div className={styles.cardHoverEffect}>
                <span className={styles.exploreText}>Explorar projeto</span>
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className={styles.viewAllContainer}>
        <Link to="/work" className={styles.viewAllButton}>
          <span>Ver todos os projetos</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
    </section>
  );
}

export default WorkSection;