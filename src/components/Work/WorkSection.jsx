import React, { useEffect } from 'react';
import styles from "./WorkSection.module.css";
import ProjectCard from "./ProjectCard";
import { useWorkProjects } from "../../components/Work/WorkProjectContext";

const WorkSection = () => {
  // Usando o hook personalizado useWorkProjects em vez do useContext diretamente
  const { projetos, loading, error } = useWorkProjects();
  
  // Efeito para o brilho que segue o cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.querySelectorAll(`.${styles.projectCard}`).forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className={styles.workSection} id="work">
      {/* Elementos decorativos */}
      <div className={styles.backgroundGlow}></div>
      <div className={styles.decorCircleTop}></div>
      <div className={styles.decorCircleBottom}></div>
      <div className={styles.gridLines}></div>

      <div className={styles.sectionHeader}>
        <h2>Mina Projekt</h2>
        <div className={styles.headerAccent}></div>
        <p>Kolla in några av mina senaste arbeten inom utveckling och design.</p>
      </div>

      {/* Mostrar erro se houver */}
      {error && (
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      )}

      <div className={styles.projectsPreview}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
          </div>
        ) : Array.isArray(projetos) && projetos.length > 0 ? (
          projetos
            .filter(projeto => projeto.featured) // Filtrar apenas projetos destacados
            .map((projeto, index) => (
              <ProjectCard 
                key={projeto.id} 
                project={{
                  id: projeto.id,
                  title: projeto.title,
                  description: projeto.description,
                  category: projeto.tags?.[0] || "Design",
                  image: projeto.thumbnailImage || projeto.coverImage,
                  tags: projeto.tags,
                  year: projeto.date,
                  slug: projeto.id
                }} 
                index={index} 
              />
            ))
        ) : (
          <div className={styles.noProjectsContainer}>
            <p>Inga projekt hittades.</p>
          </div>
        )}
      </div>

      {/* Botão Ver mais - apenas mostrado se houver projetos e não estiver carregando */}
      {!loading && Array.isArray(projetos) && projetos.length > 0 && (
        <div className={styles.viewAllContainer}>
          <a href="/work" className={styles.viewAllButton}>
            <span>Se alla projekt</span>
            <div className={styles.iconCircle}>
              <svg className={styles.buttonIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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