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
    description: `Jag genomför omfattande marknadsundersökningar för att identifiera trender, luckor och 
                 möjligheter på marknaden. Denna forskning fungerar som grunden för att skapa digitala 
                 produkter som löser verkliga problem och möter genuina marknadsbehov.`,
    
    benefits: [
      {
        title: "Identifiera marknadsmöjligheter",
        description: "Upptäck outnyttjade marknadssegment och möjligheter för din produkt eller tjänst"
      },
      {
        title: "Konkurrensanalys",
        description: "Förstå konkurrenternas styrkor och svagheter för att hitta din nisch"
      },
      {
        title: "Validera produktidéer",
        description: "Testa och validera dina produktkoncept med marknadsdata innan full utveckling"
      },
      {
        title: "Insiktsdriven strategi",
        description: "Basera dina affärsbeslut på solida marknadsinsikter istället för antaganden"
      }
    ],
    
    process: [
      "Målgruppsanalys och segmentering för att förstå potentiella användare",
      "Djupgående konkurrensanalys för att identifiera luckor och möjligheter",
      "Trendforskning för att förutse marknadsutveckling",
      "Datainsamling och analys för att validera antaganden"
    ],
    
    deliverables: [
      "Omfattande marknadsanalysrapport",
      "Konkurrenslandskapsöversikt",
      "Identifiering av målgruppssegment och behov",
      "Specifika rekommendationer baserade på marknadsinsikter",
      "Presentation av marknadsdata och trender"
    ],
    
    caseStudy: {
      title: "FinTech Marknadsstrategi",
      description: "Hjälpte en nystartat finansföretag att identifiera ett underserverat marknadssegment värt över 2 miljarder kronor i årlig intäktspotential. Genom grundlig marknadsanalys kunde vi identifiera specifika kundsmärtpunkter som konkurrenterna missade.",
      outcome: "Klienten lanserade en riktad produktlinje som uppnådde produktmarknadsmatchning inom 6 månader och säkrade ytterligare finansiering på 40 miljoner kronor."
    }
  };

  return <ServiceDetailLayout serviceData={serviceData} />;
};

export default MarketResearch;