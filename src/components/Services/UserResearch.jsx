import React from 'react';
import ServiceDetailLayout from './ServiceDetailLayout';

const UserResearch = () => {
  const serviceData = {
    title: "Användarundersökning",
    subtitle: "Förstå användare för att skapa meningsfulla upplevelser",
    accent: "rgba(78, 205, 196, 1)",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" width="1em" height="1em">
        <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352h117.4C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"/>
      </svg>
    ),
    description: `Jag använder en mängd olika användarforskningsmetoder för att djupt förstå dina användares behov,
                 beteenden och smärtpunkter. Denna människocentrerade approach säkerställer att vi designar produkter
                 som verkligen resonerar med din målgrupp.`,
    
    benefits: [
      {
        title: "Användarcentrerad design",
        description: "Skapa produkter som användare verkligen vill ha och behöver baserat på faktiska behov"
      },
      {
        title: "Minskade utvecklingskostnader",
        description: "Undvik kostsamma designändringar genom att få det rätt från början"
      },
      {
        title: "Identifiera smärtpunkter",
        description: "Upptäck och adressera användarnas frustrationer med nuvarande lösningar"
      },
      {
        title: "Förståelse för användarbeteenden",
        description: "Få insikter i hur användare tänker och interagerar med digitala produkter"
      }
    ],
    
    process: [
      "Användarintervjuer och kontextuella observationer för att förstå djupa behov",
      "Användbarhetstestning med faktiska användare för att identifiera problem",
      "Kvantitativa och kvalitativa undersökningar för att samla in bred feedback",
      "Skapa användarpersonas för att vägleda designbeslut"
    ],
    
    deliverables: [
      "Omfattande användarforskningsrapport",
      "Detaljerade användarpersonas",
      "Användarbeteendekartor och kundresor",
      "Insikter och rekommendationer baserade på forskning",
      "Prioriterad lista över användarbehov"
    ],
    
    caseStudy: {
      title: "Hälsovårdsapp Redesign",
      description: "Genomförde omfattande användartestning för en hälsovårdsapp och identifierade fem kritiska användarbehov som tidigare hade förbisetts. Arbetade med klienten för att omformulera produkten utifrån dessa viktiga insikter.",
      outcome: "Den nya designen ledde till en 65% ökning i användarengagemang och en 40% minskning i avhopp under onboardingprocessen."
    }
  };

  return <ServiceDetailLayout serviceData={serviceData} />;
};

export default UserResearch;