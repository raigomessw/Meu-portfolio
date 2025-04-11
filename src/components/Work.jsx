import React from 'react';
import styles from './Work.module.css';

function Work() {
  const projects = [
    { title: 'Fray/n', description: 'Online boutique to personalize your shoes.', link: '/project/frayn' },
    { title: 'TravelBuddy', description: 'Platform to find inspiration for restaurants, destinations, accommodations, and activities.', link: '/project/travelbuddy' },
  ];

  return (
    <section className={styles.work}>
      <h2>Some of my recent work</h2>
      <div className={styles['projects-list']}>
        {projects.map((project, index) => (
          <div key={index} className={styles['project-card']}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <a href={project.link}>View Project</a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Work;