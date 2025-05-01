import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWorkProjects } from '../Work/WorkProjectContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEye, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import styles from './WorkSection.module.css';

function WorkSection() {
  const { projetos, loading } = useWorkProjects();
  const [visibleProjects, setVisibleProjects] = useState([]);
  const sectionRef = useRef(null);
  
  // Mostrar apenas projetos em destaque na página inicial
  const featuredProjects = projetos
    ? projetos.filter(project => project.featured || project.highlight).slice(0, 3)
    : [];
  
  // Usar projetos recentes se não houver suficientes em destaque
  const projectsToShow = featuredProjects.length >= 3 
    ? featuredProjects 
    : projetos ? projetos.slice(0, 3) : [];

  // Configurações de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
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
      {/* Elementos decorativos de fundo */}
      <div className={styles.backgroundGlow}></div>
      <div className={styles.decorCircleTop}></div>
      <div className={styles.decorCircleBottom}></div>
      <div className={styles.gridLines}></div>
      
      <motion.div 
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2>Meus Projetos</h2>
        <p>Conheça alguns dos trabalhos que desenvolvi recentemente.</p>
        <div className={styles.headerAccent}></div>
      </motion.div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : (
        <motion.div 
          className={styles.projectsPreview}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projectsToShow.map((project, index) => (
            <motion.div 
              key={project.id}
              variants={cardVariants}
              className={styles.projectCardWrapper}
            >
              <Link 
                to={`/work/${project.id}`}
                className={`${styles.projectCard} ${visibleProjects.includes(project) ? styles.visible : ''}`}
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
                  <span className={styles.projectCategory}>{project.category || 'Design'}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className={styles.cardMeta}>
                    <div className={styles.cardTags}>
                      {project.tags && project.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                    
                    <span className={styles.cardYear}>{project.year || '2024'}</span>
                  </div>
                </div>
                
                <div className={styles.cardHoverEffect}>
                  <span className={styles.exploreText}>Explorar projeto</span>
                  <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      <motion.div 
        className={styles.viewAllContainer}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        viewport={{ once: true }}
      >
        <Link to="/work" className={styles.viewAllButton}>
          <span>Ver todos os projetos</span>
          <div className={styles.iconCircle}>
            <FontAwesomeIcon icon={faArrowDown} className={styles.buttonIcon} />
          </div>
        </Link>
      </motion.div>
    </section>
  );
}

export default WorkSection;