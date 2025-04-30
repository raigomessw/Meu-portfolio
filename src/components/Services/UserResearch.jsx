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
    heroImage: "/images/services/user-research-hero.jpg",
    description: `Jag använder en mängd olika användarforskningsmetoder för att djupt förstå dina användares behov,
                 beteenden och smärtpunkter. Denna människocentrerade approach säkerställer att vi designar produkter
                 som verkligen resonerar med din målgrupp.`,
    
    benefits: [
      "Skapa produkter som användare verkligen vill ha och behöver",
      "Minska kostsamma designändringar efter lansering",
      "Identifiera och lösa användarnas smärtpunkter",
      "Förstå användarbeteenden och mentala modeller",
      "Ta designbeslut baserade på bevis, inte antaganden"
    ],
    
    process: [
      {
        title: "Användarintervjuer",
        description: "Djupgående samtal med användare för att förstå deras behov, motivationer och frustrationer."
      },
      {
        title: "Användbarhetstestning",
        description: "Observera användare som interagerar med befintliga produkter för att identifiera smärtpunkter och möjligheter."
      },
      {
        title: "Enkäter & Frågeformulär",
        description: "Samla in kvantitativa och kvalitativa data i stor skala för att validera hypoteser."
      },
      {
        title: "Användarpersona-skapande",
        description: "Utveckla representativa användartyper för att vägleda designbeslut och funktionsprioritering."
      }
    ],
    
    caseStudies: [
      {
        title: "Hälsovårdsapp Användarforskning",
        company: "Medicinsk Tech Startup",
        result: "Identifierade 5 kritiska användarbehov som tidigare förbisetts av intressenter",
        image: "/images/case-studies/healthcare-user-research.jpg",
        link: "/case-studies/healthcare-user-research"
      },
      {
        title: "E-lärande Plattform Undersökning",
        company: "Utbildningsföretag",
        result: "Användarinsikter ledde till 45% ökning av kursgenomförandegraden",
        image: "/images/case-studies/elearning-research.jpg",
        link: "/case-studies/elearning-research"
      }
    ],
    
    tools: ["UserTesting", "Lookback", "Optimal Workshop", "Hotjar", "Maze", "Qualtrics"]
  };

  return <ServiceDetailLayout service={serviceData} />;
};

export default UserResearch;