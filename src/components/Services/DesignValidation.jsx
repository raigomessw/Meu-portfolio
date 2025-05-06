import React from 'react';
import ServiceDetailLayout from './ServiceDetailLayout';

const DesignValidation = () => {
  const serviceData = {
    title: "Designvalidering",
    subtitle: "Testa och förfina designer med verklig användarfeedback",
    accent: "rgba(131, 56, 236, 1)",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7-24-24-24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
      </svg>
    ),
    description: `Jag använder olika testmetoder för att validera och förfina designer baserat på verklig användarfeedback.
                 Detta iterativa tillvägagångssätt säkerställer att slutprodukten är intuitiv, effektiv och trevlig att använda.`,
    
    benefits: [
      {
        title: "Validerad användarupplevelse",
        description: "Säkerställ att designen verkligen fungerar för målgruppen genom faktiska användartester"
      },
      {
        title: "Datadrivna beslut",
        description: "Ta designbeslut baserade på verkliga användarbeteenden och feedback snarare än antaganden"
      },
      {
        title: "Minskad risk",
        description: "Identifiera och åtgärda potentiella problem innan full utveckling och lansering"
      },
      {
        title: "Förbättrad ROI",
        description: "Optimera konverteringar och användarengagemang genom iterativ förbättring"
      }
    ],
    
    process: [
      "Planering och uppsättning av användbarhetstester för att mäta designens effektivitet",
      "Genomförande av modererade och omodererade användartester med målgruppsrepresentanter",
      "A/B-testning för att jämföra olika designlösningar mot viktiga mätvärden",
      "Analys av resultat och implementering av datadrivna designförbättringar"
    ],
    
    deliverables: [
      "Omfattande användbarhetsrapporter med insikter och rekommendationer",
      "Analyserade testresultat med datavisualisering",
      "Dokumenterade designändringar baserade på användarfeedback",
      "Uppsättningar av före- och efter-mätvärden för att visa förbättringar",
      "Prioriterade rekommendationer för designförbättringar"
    ],
    
    caseStudy: {
      title: "E-handelsplattform Optimering",
      description: "Genomförde omfattande användbarhetstester och A/B-tester för en e-handelsplattforms kassaflöde. Identifierade flera kritiska friktionspunkter som skapade en hög övergivningsfrekvens.",
      outcome: "De implementerade förändringarna ledde till en imponerande 27% ökning av konverteringsgraden och en 15% minskning i övergivna varukorgar, vilket resulterade i en betydande intäktsökning för klienten."
    }
  };

  return <ServiceDetailLayout serviceData={serviceData} />;
};

export default DesignValidation;