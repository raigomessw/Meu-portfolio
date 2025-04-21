import React, { useState, useEffect, useRef } from "react";
import styles from './Work.module.css';
import WorkCard from './WorkCard';

// Importando as imagens localmente (assume que as imagens serão movidas para a pasta assets)
import fitnessImage from '../assets/Fitness.jpeg'; 
import tenisImage from '../assets/Tenis.jpeg';
import cafeImage from '../assets/Cafe.jpeg';

function Work() {
  const [activeSection, setActiveSection] = useState(0);
  const workSections = useRef([]);
  const workRef = useRef(null);
  
  const projects = [
    {
      id: "work1",
      title: "Super Mario 3D World",
      description: "A platform game for the Nintendo Switch with innovative gameplay mechanics and stunning visuals.",
      tags: ['Nintendo', 'Switch', 'Platform'],
      backgroundImage: fitnessImage
    },
    {
      id: "work2",
      title: "Design System",
      description: "A comprehensive design system with reusable components, styleguides and documentation.",
      tags: ['Design', 'Web', 'Components'],
      backgroundImage:  tenisImage
    },
    {
      id: "work3",
      title: "Website",
      description: "A responsive website built with modern web technologies featuring seamless interactions.",
      tags: ['Website', 'HTML', 'CSS', 'JS'],
      backgroundImage: cafeImage
    }
  ];

  // Handle intersection observer for scroll sections
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = workSections.current.findIndex(section => section === entry.target);
          setActiveSection(index);
        }
      });
    }, options);

    // Observe all work sections
    workSections.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      workSections.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  // Scroll to section when nav buttons are clicked
  const scrollToSection = (index) => {
    if (workSections.current[index]) {
      workSections.current[index].scrollIntoView({ 
        behavior: 'smooth'
      });
    }
  };

  return (
    <div id="work" className={styles.workContainer} ref={workRef}>
      {/* Navigation dots */}
      <div className={styles.navDots}>
        {projects.map((project, index) => (
          <button 
            key={`nav-${index}`}
            className={`${styles.navDot} ${activeSection === index ? styles.active : ''}`}
            onClick={() => scrollToSection(index)}
            aria-label={`View ${project.title} project`}
          />
        ))}
      </div>
      
      {/* Project sections */}
      {projects.map((project, index) => (
        <section 
          key={project.id}
          id={project.id}
          ref={el => workSections.current[index] = el}
          className={`${styles.section} ${activeSection === index ? styles.active : ''}`}
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${project.backgroundImage})`
          }}
        >
          <div className={styles.workCard}>
            <WorkCard
              title={project.title}
              description={project.description}
              tags={project.tags}
            />
          </div>
        </section>
      ))}
    </div>
  );
}

export default Work;