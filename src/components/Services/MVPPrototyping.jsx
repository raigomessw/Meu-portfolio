import React from 'react';
import ServiceDetailLayout from './ServiceDetailLayout';

const MVPPrototyping = () => {
  const serviceData = {
    title: "MVP & Prototyping",
    subtitle: "Bringing ideas to life through interactive prototypes",
    accent: "rgba(255, 190, 11, 1)",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em">
        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
      </svg>
    ),
    heroImage: "/images/services/mvp-prototyping-hero.jpg",
    description: `I transform concepts into interactive prototypes that simulate the real product experience.
                 This approach allows for early testing and validation, reducing development costs and ensuring
                 the final product meets user expectations.`,
    
    benefits: [
      "Visualize concepts before full development",
      "Test and validate ideas with minimal investment",
      "Identify usability issues early in the process",
      "Facilitate stakeholder alignment and buy-in",
      "Create a solid foundation for development"
    ],
    
    process: [
      {
        title: "Concept Sketching",
        description: "Translating ideas into initial visual concepts and user flows."
      },
      {
        title: "Wireframing",
        description: "Creating structural blueprints that outline layouts and information hierarchy."
      },
      {
        title: "Interactive Prototyping",
        description: "Building clickable prototypes that simulate the user experience and functionality."
      },
      {
        title: "MVP Definition",
        description: "Identifying the minimum feature set needed to deliver value and test key hypotheses."
      }
    ],
    
    caseStudies: [
      {
        title: "Banking App Prototype",
        company: "Financial Services Firm",
        result: "Prototype testing allowed us to refine UX before development, saving $180K",
        image: "/images/case-studies/banking-prototype.jpg",
        link: "/case-studies/banking-prototype"
      },
      {
        title: "E-commerce MVP",
        company: "Retail Startup",
        result: "MVP launch attracted 5,000 users and secured additional $1.2M in funding",
        image: "/images/case-studies/ecommerce-mvp.jpg",
        link: "/case-studies/ecommerce-mvp"
      }
    ],
    
    tools: ["Figma", "Adobe XD", "Sketch", "InVision", "Principle", "Framer"]
  };

  return <ServiceDetailLayout service={serviceData} />;
};

export default MVPPrototyping;