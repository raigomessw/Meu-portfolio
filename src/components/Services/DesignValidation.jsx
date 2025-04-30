import React from 'react';
import ServiceDetailLayout from './ServiceDetailLayout';

const DesignValidation = () => {
  const serviceData = {
    title: "Designvalidering",
    subtitle: "Testa och förfina designer med verklig användarfeedback",
    accent: "rgba(131, 56, 236, 1)",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
      </svg>
    ),
    heroImage: "/images/services/design-validation-hero.jpg",
    description: `Jag använder olika testmetoder för att validera och förfina designer baserat på verklig användarfeedback.
                 Detta iterativa tillvägagångssätt säkerställer att slutprodukten är intuitiv, effektiv och trevlig att använda.`,
    
    benefits: [
      "Säkerställ att designer möter användarnas förväntningar",
      "Identifiera och lös användbarhetsproblem före lansering",
      "Samla kvantitativa mätvärden för att stödja designbeslut",
      "Minska risken för omdesign efter lansering",
      "Bygg förtroende för slutprodukten"
    ],
    
    process: [
      {
        title: "Användbarhetstestning",
        description: "Observera verkliga användare som utför uppgifter för att identifiera friktionspunkter och förbättringsområden."
      },
      {
        title: "A/B-testning",
        description: "Jämföra designvariationer för att avgöra vilka som presterar bättre mot viktiga mätvärden."
      },
      {
        title: "Användarfeedbacksessioner",
        description: "Samla kvalitativ feedback genom modererad testning och intervjuer."
      },
      {
        title: "Iterativ Förfining",
        description: "Införliva insikter för att kontinuerligt förbättra designen i successiva iterationer."
      }
    ],
    
    caseStudies: [
      {
        title: "Mobilapp Användartestning",
        company: "Tech Startup",
        result: "Identifierade och löste 12 kritiska användbarhetsproblem före lansering",
        image: "/images/case-studies/mobile-testing.jpg",
        link: "/case-studies/mobile-testing"
      },
      {
        title: "Kassamodul Optimering",
        company: "E-handelsplattform",
        result: "A/B-testning ledde till 27% ökning av konverteringsgraden",
        image: "/images/case-studies/checkout-optimization.jpg",
        link: "/case-studies/checkout-optimization"
      }
    ],
    
    tools: ["Maze", "UserTesting", "Hotjar", "Optimizely", "Google Optimize", "FullStory"]
  };

  return <ServiceDetailLayout service={serviceData} />;
};

export default DesignValidation;