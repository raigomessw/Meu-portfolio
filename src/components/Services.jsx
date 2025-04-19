import React, { useRef, useEffect } from 'react';
import styles from './Services.module.css';

function Services() {
  const serviceRefs = useRef([]);
  const services = [
    { title: 'Market Research', description: 'Analyze market trends, study competitors, and identify opportunities for differentiation.' },
    { title: 'User Research', description: 'Conduct user interviews, create data-driven personas, and map user journeys.' },
    { title: 'MVP Definition & Prototyping', description: 'Define and develop the Minimum Viable Product, create interface wireframes, and build high-fidelity interactive prototypes for usability testing.' },
    { title: 'Design Validation & Iteration', description: 'Conduct feedback sessions with real users, analyze interaction data, and iterate prototypes based on user and stakeholder insights.' },
  ];

    useEffect(() => {
        serviceRefs.current = [];
        for (let i = 0; i < services.length; i++) {
            serviceRefs.current[i] = React.createRef();
        }

        function handleScroll() {
            const scrollPosition = window.scrollY;
            for (let i = 0; i < serviceRefs.current.length; i++) {
              const serviceTop = serviceRefs.current[i].current.offsetTop;
              const serviceBottom = serviceTop + serviceRefs.current[i].current.offsetHeight;
              if (scrollPosition >= serviceTop && scrollPosition <= serviceBottom) {
                const currentService = serviceRefs.current[i].current;
              }
            }
          
          // Check if currentService is defined before scrolling
          //if (currentService) {
          //  window.scrollTo({ top: currentService.offsetTop, behavior: 'smooth' });
          //}
        };
      }, [services.length]);


  return (
    <section id="services" className={styles.services}> 
      <h2>What I do</h2>
      <div className={styles['services-list']}>
        {services.map((service, index) => (
          <div key={index} className={styles['service-item']} ref={serviceRefs.current[index]}>
          <h3>{service.title}</h3><p>{service.description}</p></div>
        ))}
      </div>
    </section>
  );
}

export default Services;