import React from 'react';
import styles from './Services.module.css';

function Services() {
  const services = [
    { title: 'Market Research', description: 'Analyze market trends, study competitors, and identify opportunities for differentiation.' },
    { title: 'User Research', description: 'Conduct user interviews, create data-driven personas, and map user journeys.' },
    { title: 'MVP Definition & Prototyping', description: 'Define and develop the Minimum Viable Product, create interface wireframes, and build high-fidelity interactive prototypes for usability testing.' },
    { title: 'Design Validation & Iteration', description: 'Conduct feedback sessions with real users, analyze interaction data, and iterate prototypes based on user and stakeholder insights.' },
  ];

  return (
    <section id="services" className={styles.services}> 
      <h2>What I do</h2>
      <div className={styles['services-list']}>
        {services.map((service, index) => (
          <div key={index} className={styles['service-item']}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;