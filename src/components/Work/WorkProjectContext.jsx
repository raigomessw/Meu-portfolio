import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { imageCategories } from '../utils/imageHelpers';

// Importando as imagens dos projetos
// (Suponho que você já tenha essas funções definidas em utils/imageHelpers.js)
import { getProjectImages } from '../utils/imageHelpers';

// Configurando imagens para cada projeto
const clojelImages = getProjectImages('clojel', {
  galleryItems: [
    {
      filename: 'background.png', 
      title: 'Clojel Screenshot',
      caption: 'Clojel e-commerce screenshot showcasing the main character',
      category: imageCategories.ECOMMERCE,
      tags: ['e-commerce', 'web app', 'api', 'clojel']
    },
    {
      filename: 'leveldesign.jpg', 
      title: 'Level Design',
      caption: "Level design for the game with multiple environments",
      category: imageCategories.ECOMMERCE,
      tags: ['level', 'design']
    },
    {
      filename: 'characters.jpg', 
      title: 'Character Selection',
      caption: 'The character selection screen with multiple playable options',
      category: imageCategories.UI_DESIGN,
      tags: ['ui', 'characters', 'selection']
    }
  ]
});

const studantEkonomiAppImages = getProjectImages('studantEkonomiApp', {
  galleryItems: [
    {
      filename: 'components.jpg', 
      title: 'Component Library',
      caption: 'Overview of the component library structure',
      category: imageCategories.UI_DESIGN,
      tags: ['components', 'design-system']
    },
    {
      filename: 'colors.jpg', 
      title: 'Color System',
      caption: 'The color system with accessibility considerations',
      category: imageCategories.UI_DESIGN,
      tags: ['colors', 'accessibility']
    },
    {
      filename: 'documentation.jpg', 
      title: 'Documentation',
      caption: 'Comprehensive documentation for developers',
      category: imageCategories.FEATURES,
      tags: ['documentation', 'developers']
    }
  ]
});

const travelBuddyImages = getProjectImages('travelBuddy', {
  galleryItems: [
    {
      filename: 'homepage.jpg',
      title: 'Travel Buddy Homepage',
      caption: 'Modern and interactive homepage design',
      category: imageCategories.FINAL_PRODUCT,
      tags: ['homepage', 'ui', 'responsive']
    },
    {
      filename: 'projects.jpg',
      title: 'Projects Grid',
      caption: 'Interactive grid showcasing projects',
      category: imageCategories.UI_DESIGN,
      tags: ['grid', 'ui design']
    },
    {
      filename: 'chatbot.jpg',
      title: 'AI Chatbot Interface',
      caption: 'Innovative AI-powered interface',
      category: imageCategories.FEATURES,
      tags: ['ai', 'chatbot']
    },
    {
      filename: 'mobile-view.jpg',
      title: 'Mobile Interface',
      caption: 'Responsive design for mobile devices',
      category: imageCategories.RESPONSIVE,
      tags: ['mobile', 'responsive']
    }
  ]
});

const dianaLandingPageImages = getProjectImages('dianaLandingPage', {
  galleryItems: [
    {
      filename: 'homepage.jpg',
      title: 'Diana Landing Page',
      caption: 'Modern landing page design',
      category: imageCategories.FINAL_PRODUCT,
      tags: ['landing page', 'framer', 'responsive']
    },
    {
      filename: 'mobile.jpg',
      title: 'Mobile View',
      caption: 'Responsive design for mobile devices',
      category: imageCategories.RESPONSIVE,
      tags: ['mobile', 'responsive']
    },
    {
      filename: 'features.jpg',
      title: 'Features Section',
      caption: 'Section highlighting key features',
      category: imageCategories.FEATURES,
      tags: ['features', 'ui design']
    }
  ]
});

const mackeUpinstitutePageImages = getProjectImages('mackeUpinstitute', {
  galleryItems: [
    {
      filename: 'homepage.jpg',
      title: 'Homepage',
      caption: 'Modern institute homepage',
      category: imageCategories.FINAL_PRODUCT,
      tags: ['homepage', 'ui', 'responsive']
    },
    {
      filename: 'courses.jpg',
      title: 'Courses Section',
      caption: 'Display of available courses',
      category: imageCategories.FEATURES,
      tags: ['courses', 'education']
    },
    {
      filename: 'mobile.jpg',
      title: 'Mobile View',
      caption: 'Responsive design for mobile devices',
      category: imageCategories.RESPONSIVE,
      tags: ['mobile', 'responsive']
    },
    {
      filename: 'contact.jpg',
      title: 'Contact Form',
      caption: 'User-friendly contact form',
      category: imageCategories.UI_DESIGN,
      tags: ['form', 'contact', 'ui']
    }
  ]
});

// Array de projetos
export const projects = [
  {
    id: "clojel",
    title: "Clojel",
    description: "Um site de e-commerce com interface moderna e experiência de usuário otimizada.",
    tags: ['E-commerce', 'React', 'Node.js'],
    backgroundImage: clojelImages.backgroundImage,
    coverImage: clojelImages.cover,
    thumbnailImage: clojelImages.thumbnail,
    date: "2024",
    projectLink: "/work/clojel",
    figmaUrl: null,
    liveUrl: "https://clojel.netlify.app",
    githubUrl: "https://github.com/username/clojel",
    extendedDescription: "Clojel é uma plataforma de e-commerce com foco em experiência do usuário e alta performance.",
    challenges: "O principal desafio foi criar uma interface que suportasse uma grande quantidade de produtos sem sacrificar a performance.",
    solution: "Implementamos técnicas avançadas de otimização como lazy loading, virtualização de listas e sistema de cache inteligente.",
    technologies: [
      { name: "React", icon: "⚛️" },
      { name: "Node.js", icon: "🟢" },
      { name: "Tawind CSS", icon: "🎨" },
      { name: "API", icon: "🔌" },
      { name: "JavaScript", icon: "🟡" },
      { name: "Vite", icon: "⚡" },
    ],
    images: clojelImages.gallery,
    imageCategories: [imageCategories.ECOMMERCE, imageCategories.UI_DESIGN]
  },
  {
    id: "studantEkonomiApp",
    title: "Studant Ekonomi App",
    description: "Aplicativo de gestão financeira simples e intuitivo.",
    tags: ['Mobile App', 'Figma', 'UX/UI'],
    backgroundImage: studantEkonomiAppImages.backgroundImage,
    coverImage: studantEkonomiAppImages.cover,
    thumbnailImage: studantEkonomiAppImages.thumbnail,
    date: "2024",
    projectLink: "/work/studantEkonomiApp",
    figmaUrl: "https://figma.com/file/example-portfolio",
    liveUrl: null,
    githubUrl: null,
    extendedDescription: "Um aplicativo que ajuda os estudantes a gerenciar suas finanças de forma simples e intuitiva.",
    challenges: "Criar uma interface que seja fácil de usar e acessível para todos os usuários.",
    solution: "Desenvolvemos um aplicativo simples e intuitivo que permite aos estudantes gerenciar suas finanças de forma eficiente.",
    technologies: [
      { name: "Figma", icon: "🎨" },
      { name: "Google Analytics", icon: "📊" },
    ],
    images: studantEkonomiAppImages.gallery,
    imageCategories: [imageCategories.FINAL_PRODUCT, imageCategories.UI_DESIGN, imageCategories.FEATURES]
  },
  {
    id: "travelBuddy",
    title: "Travel Buddy",
    description: "Aplicativo de planejamento de viagens com recursos de compartilhamento.",
    tags: ['Web App', 'Figma', 'UX/UI', 'AI'],
    backgroundImage: travelBuddyImages.backgroundImage,
    coverImage: travelBuddyImages.cover,
    thumbnailImage: travelBuddyImages.thumbnail,
    date: "2024",
    projectLink: "/work/travelBuddy",
    figmaUrl: "https://figma.com/file/example-portfolio",
    liveUrl: null,
    githubUrl: null,
    extendedDescription: "My team secured 2nd place in the 2024 Chas Challenge with our innovative AI-powered travel companion app. The challenge was to create a digital experience with the theme of AI. As UX/UI team lead, I directed the branding, visual identity, and interface design, working closely with developers to create a unique solution that stands out from typical chatbots. What makes TravelBuddy different is its button-based interaction system built on user preferences, moving beyond traditional conversational interfaces. This intuitive approach to personalized travel recommendations impressed the judges and earned us recognition among all competing school teams.",
    challenges: "O principal desafio foi criar uma interface que fosse intuitiva e fácil de usar, mesmo com a complexidade dos dados.",
    solution: "Desenvolvemos um sistema de botões que permite aos usuários interagir com o aplicativo de forma simples e direta, sem a necessidade de digitar.",
    technologies: [
      { name: "Figma", icon: "🎨" },
      { name: "Google Analytics", icon: "📊" },
      { name: "AI", icon: "🤖" }
    ],
    images: travelBuddyImages.gallery,
    imageCategories: [imageCategories.FINAL_PRODUCT, imageCategories.UI_DESIGN, imageCategories.FEATURES, imageCategories.RESPONSIVE]
  },
  {
    id: "dianaLandingPage",
    title: "Diana Landing Page",
    description: "Landing page para o projeto Diana, com foco em design responsivo.",
    tags: ['Web Design', 'FRAMER', 'UX/UI', 'Responsive'],
    backgroundImage: dianaLandingPageImages.backgroundImage,
    coverImage: dianaLandingPageImages.cover,
    thumbnailImage: dianaLandingPageImages.thumbnail,
    date: "2024",
    projectLink: "/work/dianaLandingPage",
    figmaUrl: "https://figma.com/file/example-portfolio",
    liveUrl: "https://adored-themes-310641.framer.app",
    githubUrl: null,
    extendedDescription: "Landing page para o projeto Diana, com foco em design responsivo e otimização para dispositivos móveis. O projeto foi desenvolvido utilizando a ferramenta FRAMER.",
    challenges: "Criar uma landing page que fosse responsiva e otimizada para dispositivos móveis.",
    solution: "Desenvolvemos uma landing page que se adapta a diferentes tamanhos de tela, garantindo uma ótima experiência de usuário em qualquer dispositivo.",
    technologies: [
      { name: "FRAMER", icon: "⚛️" },
    ],
    images: dianaLandingPageImages.gallery,
    imageCategories: [imageCategories.FINAL_PRODUCT, imageCategories.UI_DESIGN, imageCategories.RESPONSIVE, imageCategories.FEATURES]
  },
  {
    id: "mackeUpinstitute",
    title: "Macke Up Institute",
    description: "Instituto de beleza com foco em design responsivo.",
    tags: ['Web Design', 'Figma', 'UX/UI', 'Responsive'],
    backgroundImage: mackeUpinstitutePageImages.backgroundImage,
    coverImage: mackeUpinstitutePageImages.cover,
    thumbnailImage: mackeUpinstitutePageImages.thumbnail,
    date: "2024",
    projectLink: "/work/mackeUpinstitute",
    figmaUrl: "https://figma.com/file/example-portfolio",
    liveUrl: null,
    githubUrl: null,
    extendedDescription: "Instituto de beleza com foco em design responsivo e otimização para dispositivos móveis. O projeto foi desenvolvido utilizando a ferramenta Figma.",
    challenges: "Criar uma landing page que fosse responsiva e otimizada para dispositivos móveis.",
    solution: "Desenvolvemos uma landing page que se adapta a diferentes tamanhos de tela, garantindo uma ótima experiência de usuário em qualquer dispositivo.",
    technologies: [
      { name: "Figma", icon: "🎨" },
      { name: "Google Analytics", icon: "📊" }
    ],
    images: mackeUpinstitutePageImages.gallery,
    imageCategories: [imageCategories.FINAL_PRODUCT, imageCategories.UI_DESIGN, imageCategories.RESPONSIVE, imageCategories.FEATURES]
  }
];

// Criando o contexto
const WorkProjectContext = createContext();

// Hook personalizado para usar o contexto
export const useWorkProjects = () => {
  const context = useContext(WorkProjectContext);
  if (!context) {
    throw new Error('useWorkProjects deve ser usado dentro de um WorkProjectProvider');
  }
  return context;
};

// Componente Provider
export const WorkProjectProvider = ({ children }) => {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeImageCategory, setActiveImageCategory] = useState(null);
  
  // Criar um mapa de projetos por ID para busca eficiente
  const projectsById = useMemo(() => {
    console.log("Criando lookup de projetos...");
    const lookup = {};
    projects.forEach(project => {
      lookup[project.id] = project;
    });
    console.log("IDs disponíveis:", Object.keys(lookup));
    return lookup;
  }, []);
  
  // Filtrar projetos por tag
  const filterProjects = useCallback((tag) => {
    setActiveFilter(tag);
    
    if (tag === 'All') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.tags && project.tags.some(projectTag => 
          projectTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      setFilteredProjects(filtered);
    }
  }, []);
  
  // Filtrar imagens por categoria
  const filterImagesByCategory = useCallback((category) => {
    setActiveImageCategory(category);
  }, []);
  
  // Obter projeto por ID com logs detalhados
  const getProjectById = useCallback((id) => {
    console.log("getProjectById chamado com ID:", id);
    
    if (!id) {
      console.error("ID não fornecido para getProjectById");
      return null;
    }
    
    // Busca direta no objeto de lookup (mais eficiente que find)
    const project = projectsById[id];
    
    if (!project) {
      console.error(`Projeto com ID "${id}" não encontrado`);
      console.log("IDs disponíveis:", Object.keys(projectsById));
    } else {
      console.log("Projeto encontrado:", project.title);
    }
    
    return project || null;
  }, [projectsById]);
  
  // Valores do contexto
  const value = {
    projects: filteredProjects,
    allProjects: projects,
    activeFilter,
    filterProjects,
    activeImageCategory,
    filterImagesByCategory,
    getProjectById
  };
  
  return (
    <WorkProjectContext.Provider value={value}>
      {children}
    </WorkProjectContext.Provider>
  );
};

export default WorkProjectContext;