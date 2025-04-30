import React from 'react';
import ServiceDetailLayout from './ServiceDetailLayout';

const MVPPrototyping = () => {
  const serviceData = {
    title: "MVP & Prototyping",
    subtitle: "Ge liv till idéer genom interaktiva prototyper",
    accent: "rgba(255, 190, 11, 1)",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em">
        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0-17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
      </svg>
    ),
    description: `Jag omvandlar koncept till interaktiva prototyper som simulerar den verkliga produktupplevelsen.
                 Detta tillvägagångssätt möjliggör tidig testning och validering, minskar utvecklingskostnader och 
                 säkerställer att slutprodukten möter användarnas förväntningar.`,
    
    benefits: [
      {
        title: "Snabb konceptvalidering",
        description: "Testa idéer och koncept tidigt med faktiska användare innan fullständig utveckling"
      },
      {
        title: "Kostnadsbesparing",
        description: "Undvik dyra omdesign genom att hitta problem tidigt i designprocessen"
      },
      {
        title: "Tydlig kommunikation",
        description: "Förbättra kommunikationen med intressenter genom visuella, interaktiva demonstrationer"
      },
      {
        title: "Riktad utveckling",
        description: "Definiera en tydlig MVP som fokuserar på kärnfunktioner som ger mest värde"
      }
    ],
    
    process: [
      "Konceptutveckling och brainstorming för att definiera kärnerbjudandet",
      "Skapande av wireframes och low-fidelity prototyper för att testa koncept",
      "Utveckling av high-fidelity interaktiva prototyper för användarfeedback",
      "Definiering och prioritering av MVP-funktioner baserat på data"
    ],
    
    deliverables: [
      "Interaktiva klickbara prototyper",
      "MVP-funktionsspecifikationer och prioriteringar",
      "Visuella designskisser och mockups",
      "Användarflödesdiagram och interaktionsmodeller",
      "Användbarhetstest och feedback-rapporter"
    ],
    
    caseStudy: {
      title: "Finansapp Prototyp",
      description: "Skapade en fullständig interaktiv prototyp för en bankapps nya funktioner för budgetering och sparande. Genom att prototypa noggrant innan utveckling kunde vi identifiera flera användarfriktionspunkter som hade varit kostsamma att åtgärda efter lansering.",
      outcome: "Prototypen hjälpte klienten att förfina användarupplevelsen, vilket resulterade i en 40% förbättring av användarengagemanget med sparfunktionerna och uppskattningsvis sparade 200 000 kr i potentiella omutvecklingskostnader."
    }
  };

  return <ServiceDetailLayout serviceData={serviceData} />;
};

export default MVPPrototyping;