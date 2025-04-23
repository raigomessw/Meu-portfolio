import React from 'react';
import ServiceDetailLayout from './ServiceDetailLayout';

const UserResearch = () => {
  const serviceData = {
    title: "User Research",
    subtitle: "Understanding users to create meaningful experiences",
    accent: "rgba(78, 205, 196, 1)",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" width="1em" height="1em">
        <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352h117.4C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"/>
      </svg>
    ),
    heroImage: "/images/services/user-research-hero.jpg",
    description: `I employ a variety of user research methods to deeply understand your users' needs,
                 behaviors, and pain points. This human-centered approach ensures we design products
                 that truly resonate with your target audience.`,
    
    benefits: [
      "Create products users genuinely want and need",
      "Reduce costly design changes post-launch",
      "Identify and solve user pain points",
      "Understand user behaviors and mental models",
      "Make design decisions based on evidence, not assumptions"
    ],
    
    process: [
      {
        title: "User Interviews",
        description: "In-depth conversations with users to understand their needs, motivations, and frustrations."
      },
      {
        title: "Usability Testing",
        description: "Observing users interact with existing products to identify pain points and opportunities."
      },
      {
        title: "Surveys & Questionnaires",
        description: "Collecting quantitative and qualitative data at scale to validate hypotheses."
      },
      {
        title: "User Persona Creation",
        description: "Developing representative user archetypes to guide design decisions and feature prioritization."
      }
    ],
    
    caseStudies: [
      {
        title: "Healthcare App User Research",
        company: "Medical Tech Startup",
        result: "Identified 5 critical user needs previously overlooked by stakeholders",
        image: "/images/case-studies/healthcare-user-research.jpg",
        link: "/case-studies/healthcare-user-research"
      },
      {
        title: "E-learning Platform Research",
        company: "Education Company",
        result: "User insights led to 45% increase in course completion rates",
        image: "/images/case-studies/elearning-research.jpg",
        link: "/case-studies/elearning-research"
      }
    ],
    
    tools: ["UserTesting", "Lookback", "Optimal Workshop", "Hotjar", "Maze", "Qualtrics"]
  };

  return <ServiceDetailLayout service={serviceData} />;
};

export default UserResearch;