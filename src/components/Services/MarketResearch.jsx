import React from 'react';
import ServiceDetailLayout from './ServiceDetailLayout';

const MarketResearch = () => {
  const serviceData = {
    title: "Marknadsundersökning",
    subtitle: "Datadriven insikt för strategiska beslut",
    accent: "rgba(255, 107, 107, 1)",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="1em" height="1em">
        <path d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"/>
      </svg>
    ),
    heroImage: "/images/services/market-research-hero.jpg",
    description: `Jag genomför omfattande marknadsundersökningar för att identifiera trender, luckor och 
                 möjligheter på marknaden. Denna forskning fungerar som grunden för att skapa digitala 
                 produkter som löser verkliga problem och möter genuina marknadsbehov.`,
    
    benefits: [
      "Identifiera outnyttjade marknadsmöjligheter",
      "Förstå konkurrenslandskapet",
      "Validera produktidéer före utveckling",
      "Upptäcka branschtrender och användarpreferenser",
      "Fatta datainformerade affärsbeslut"
    ],
    
    process: [
      {
        title: "Målgruppsanalys",
        description: "Definiera användarsegment och förstå deras behov, beteenden och preferenser."
      },
      {
        title: "Konkurrentanalys",
        description: "Utvärdera direkta och indirekta konkurrenter för att identifiera luckor och möjligheter."
      },
      {
        title: "Trendforskning",
        description: "Analysera nuvarande och framväxande trender som kan påverka din produkts framgång."
      },
      {
        title: "Marknadsstorlek & Möjlighet",
        description: "Bedöma marknadspotentialen och identifiera din produkts unika värdeförslag."
      }
    ],
    
    caseStudies: [
      {
        title: "FinTech Marknadsstrategi",
        company: "Bank Startup",
        result: "Identifierade underserved segment värt 2 miljarder dollar i årlig intäktspotential",
        image: "/images/case-studies/fintech-market-research.jpg",
        link: "/case-studies/fintech-market-research"
      },
      {
        title: "E-handel Konkurrensanalys",
        company: "Online Detaljhandel",
        result: "Upptäckte 3 viktiga differentieringsmöjligheter som konkurrenterna hade missat",
        image: "/images/case-studies/ecommerce-analysis.jpg",
        link: "/case-studies/ecommerce-analysis"
      }
    ],
    
    tools: ["SEMrush", "Google Analytics", "SurveyMonkey", "Statista", "Tableau", "SPSS"]
  };

  return <ServiceDetailLayout service={serviceData} />;
};

export default MarketResearch;