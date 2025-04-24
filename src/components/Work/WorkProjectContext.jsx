import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Ajustando os caminhos para a nova localização das imagens
const fitnessImage = '/work/Fitness.jpeg'; 
const tenisImage = '/work/Tenis.jpeg';
const cafeImage = '/work/Cafe.jpeg';

const WorkProjectContext = createContext();

export const useWorkProjects = () => useContext(WorkProjectContext);

// Definir projetos como array constante também para permitir importação direta
export const projects = [
  {
    id: "work1",
    title: "Super Mario 3D World",
    description: "A platform game for the Nintendo Switch with innovative gameplay mechanics and stunning visuals.",
    tags: ['Nintendo', 'Switch', 'Platform'],
    backgroundImage: fitnessImage,
    coverImage: fitnessImage,
    thumbnailImage: fitnessImage,
    date: "2023",
    projectLink: "/work/work1",
    figmaUrl: "https://figma.com/seu-link-para-o-projeto",
    liveUrl: "https://example.com/project1",
    githubUrl: null,
    extendedDescription: "Super Mario 3D World brings the iconic plumber into a 3D environment with unique power-ups and multiplayer capabilities.",
    challenges: "The main challenge was to create a game that appeals to both casual and hardcore gamers, balancing difficulty and fun.",
    solution: "We implemented a progressive difficulty system that adapts to player performance, ensuring an engaging experience for all skill levels.",
    technologies: [
      { name: "Unity", icon: "🎮" },
      { name: "C#", icon: "💻" },
      { name: "3D Modeling", icon: "🧊" },
      { name: "Animation", icon: "🎬" }
    ],
    images: [
      {
        url: fitnessImage,
        title: "Gameplay Screenshot",
        caption: "In-game footage showing the main character in action"
      },
      {
        url: fitnessImage,
        title: "Level Design",
        caption: "One of the game's innovative level designs"
      }
    ]
  },
  {
    id: "work2",
    title: "Design System",
    description: "A comprehensive design system with reusable components, styleguides and documentation.",
    tags: ['Design', 'Web', 'Components'],
    backgroundImage: tenisImage,
    coverImage: tenisImage,
    thumbnailImage: tenisImage,
    date: "2022",
    projectLink: "/work/work2",
    figmaUrl: "https://figma.com/seu-link-para-o-projeto",
    liveUrl: "https://example.com/project2",
    githubUrl: "https://github.com/username/projeto2",
    extendedDescription: "This design system powers multiple products and ensures consistency across all platforms and applications within the organization.",
    challenges: "Creating a unified design language that works across multiple platforms while maintaining flexibility for different product needs.",
    solution: "We developed a token-based system with clear documentation that allows teams to maintain consistency while adapting to specific requirements.",
    technologies: [
      { name: "Figma", icon: "🎨" },
      { name: "React", icon: "⚛️" },
      { name: "Storybook", icon: "📚" },
      { name: "CSS Modules", icon: "🧩" }
    ],
    images: [
      {
        url: tenisImage,
        title: "Component Library",
        caption: "Overview of the component library structure"
      },
      {
        url: tenisImage,
        title: "Color System",
        caption: "The color system with accessibility considerations"
      }
    ]
  },
  {
    id: "work3",
    title: "Website",
    description: "A responsive website built with modern web technologies featuring seamless interactions.",
    tags: ['Website', 'HTML', 'CSS', 'JS'],
    backgroundImage: cafeImage,
    coverImage: cafeImage,
    thumbnailImage: cafeImage,
    date: "2023",
    projectLink: "/work/work3",
    figmaUrl: "https://figma.com/seu-link-para-o-projeto", // Adicione esta linha
    liveUrl: "https://example.com/project3",
    githubUrl: "https://github.com/username/projeto3",
    extendedDescription: "This website demonstrates modern web development practices with performance optimization and beautiful animations.",
    challenges: "Building a high-performance website that maintains visual richness and interactive elements without sacrificing loading speed.",
    solution: "We implemented code splitting, lazy loading, and optimized assets while using modern CSS techniques for animations instead of heavy JavaScript libraries.",
    technologies: [
      { name: "React", icon: "⚛️" },
      { name: "Next.js", icon: "▲" },
      { name: "Framer Motion", icon: "🎭" },
      { name: "TailwindCSS", icon: "🌊" }
    ],
    images: [
      {
        url: cafeImage,
        title: "Homepage",
        caption: "The hero section of the website with animated elements"
      },
      {
        url: cafeImage,
        title: "Mobile View",
        caption: "Responsive design for mobile devices"
      }
    ]
  }
];

export const WorkProjectProvider = ({ children }) => {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filterProjects = useCallback((tag) => {
    setActiveFilter(tag);
    
    if (tag === 'All') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.tags.includes(tag)
      );
      setFilteredProjects(filtered);
    }
  }, []);
  
  return (
    <WorkProjectContext.Provider value={{ 
      projects: filteredProjects, 
      allProjects: projects,
      activeFilter,
      filterProjects
    }}>
      {children}
    </WorkProjectContext.Provider>
  );
};

export default WorkProjectContext;