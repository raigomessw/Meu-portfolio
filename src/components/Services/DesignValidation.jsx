import React from 'react';
import ServiceDetailLayout from './ServiceDetailLayout';

const DesignValidation = () => {
  const serviceData = {
    title: "Design Validation",
    subtitle: "Testing and refining designs with real user feedback",
    accent: "rgba(131, 56, 236, 1)",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
      </svg>
    ),
    heroImage: "/images/services/design-validation-hero.jpg",
    description: `I use a variety of testing methodologies to validate and refine designs based on real user feedback.
                 This iterative approach ensures the final product is intuitive, efficient, and delightful to use.`,
    
    benefits: [
      "Ensure designs meet user expectations",
      "Identify and resolve usability issues before launch",
      "Gather quantitative metrics to support design decisions",
      "Reduce risk of post-launch redesigns",
      "Build confidence in the final product"
    ],
    
    process: [
      {
        title: "Usability Testing",
        description: "Observing real users complete tasks to identify friction points and areas for improvement."
      },
      {
        title: "A/B Testing",
        description: "Comparing design variations to determine which performs better against key metrics."
      },
      {
        title: "User Feedback Sessions",
        description: "Collecting qualitative feedback through moderated testing and interviews."
      },
      {
        title: "Iterative Refinement",
        description: "Incorporating insights to continuously improve the design in successive iterations."
      }
    ],
    
    caseStudies: [
      {
        title: "Mobile App User Testing",
        company: "Tech Startup",
        result: "Identified and resolved 12 critical usability issues before launch",
        image: "/images/case-studies/mobile-testing.jpg",
        link: "/case-studies/mobile-testing"
      },
      {
        title: "Checkout Flow Optimization",
        company: "E-commerce Platform",
        result: "A/B testing led to 27% increase in conversion rate",
        image: "/images/case-studies/checkout-optimization.jpg",
        link: "/case-studies/checkout-optimization"
      }
    ],
    
    tools: ["Maze", "UserTesting", "Hotjar", "Optimizely", "Google Optimize", "FullStory"]
  };

  return <ServiceDetailLayout service={serviceData} />;
};

export default DesignValidation;