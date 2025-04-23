import React from 'react';
import ServiceDetailLayout from './ServiceDetailLayout';

const MarketResearch = () => {
  const serviceData = {
    title: "Market Research",
    subtitle: "Data-driven insights to guide strategic decisions",
    accent: "rgba(255, 107, 107, 1)",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="1em" height="1em">
        <path d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"/>
      </svg>
    ),
    heroImage: "/images/services/market-research-hero.jpg",
    description: `I conduct comprehensive market research to identify trends, gaps, and opportunities 
                 in the market. This research serves as the foundation for creating digital products
                 that solve real problems and meet genuine market needs.`,
    
    benefits: [
      "Identify untapped market opportunities",
      "Understand competitive landscape",
      "Validate product ideas before development",
      "Discover industry trends and user preferences",
      "Make data-informed business decisions"
    ],
    
    process: [
      {
        title: "Target Audience Analysis",
        description: "Defining user segments and understanding their needs, behaviors, and preferences."
      },
      {
        title: "Competitor Analysis",
        description: "Evaluating direct and indirect competitors to identify gaps and opportunities."
      },
      {
        title: "Trend Research",
        description: "Analyzing current and emerging trends that could impact your product's success."
      },
      {
        title: "Market Sizing & Opportunity",
        description: "Assessing market potential and identifying your product's unique value proposition."
      }
    ],
    
    caseStudies: [
      {
        title: "FinTech Market Entry Strategy",
        company: "Banking Startup",
        result: "Identified underserved segment worth $2B in annual revenue potential",
        image: "/images/case-studies/fintech-market-research.jpg",
        link: "/case-studies/fintech-market-research"
      },
      {
        title: "E-commerce Competitive Analysis",
        company: "Online Retailer",
        result: "Discovered 3 key differentiation opportunities competitors had missed",
        image: "/images/case-studies/ecommerce-analysis.jpg",
        link: "/case-studies/ecommerce-analysis"
      }
    ],
    
    tools: ["SEMrush", "Google Analytics", "SurveyMonkey", "Statista", "Tableau", "SPSS"]
  };

  return <ServiceDetailLayout service={serviceData} />;
};

export default MarketResearch;