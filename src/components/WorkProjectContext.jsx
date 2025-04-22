// Arquivo: WorkProjectContext.jsx
// Esse arquivo cria um contexto para gerenciar o estado dos projetos globalmente
import React, { createContext, useState, useContext, useEffect } from 'react';

// Importando as imagens localmente
import fitnessImage from '../assets/Fitness.jpeg'; 
import tenisImage from '../assets/Tenis.jpeg';
import cafeImage from '../assets/Cafe.jpeg';

const WorkProjectContext = createContext();

export const useWorkProjects = () => useContext(WorkProjectContext);

export const WorkProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([
    {
      id: "work1",
      title: "Super Mario 3D World",
      description: "A platform game for the Nintendo Switch with innovative gameplay mechanics and stunning visuals.",
      tags: ['Nintendo', 'Switch', 'Platform'],
      backgroundImage: fitnessImage,
      projectLink: "https://example.com/project1",
      details: {
        challenge: "The main challenge was to create a game that appeals to both casual and hardcore gamers, balancing difficulty and fun.",
        solution: "We implemented a progressive difficulty system that adapts to player performance, ensuring an engaging experience for all skill levels.",
        technologies: ['Unity', 'C#', '3D Modeling', 'Animation']
      }
    },
    {
      id: "work2",
      title: "Design System",
      description: "A comprehensive design system with reusable components, styleguides and documentation.",
      tags: ['Design', 'Web', 'Components'],
      backgroundImage: tenisImage,
      projectLink: "https://example.com/project2",
      details: {
        challenge: "Creating a unified design language that works across multiple platforms while maintaining flexibility for different product needs.",
        solution: "We developed a token-based system with clear documentation that allows teams to maintain consistency while adapting to specific requirements.",
        technologies: ['Figma', 'React', 'Storybook', 'CSS Modules']
      }
    },
    {
      id: "work3",
      title: "Website",
      description: "A responsive website built with modern web technologies featuring seamless interactions.",
      tags: ['Website', 'HTML', 'CSS', 'JS'],
      backgroundImage: cafeImage,
      projectLink: "https://example.com/project3",
      details: {
        challenge: "Building a high-performance website that maintains visual richness and interactive elements without sacrificing loading speed.",
        solution: "We implemented code splitting, lazy loading, and optimized assets while using modern CSS techniques for animations instead of heavy JavaScript libraries.",
        technologies: ['React', 'Next.js', 'Framer Motion', 'TailwindCSS']
      }
    }
  ]);
  
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Filtrar projetos com base nas tags selecionadas
  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.tags.some(tag => activeFilters.includes(tag))
      );
      setFilteredProjects(filtered);
    }
  }, [activeFilters, projects]);
  
  // Função para alternar filtros
  const toggleFilter = (tag) => {
    setActiveFilters(prevFilters => 
      prevFilters.includes(tag) 
        ? prevFilters.filter(f => f !== tag)
        : [...prevFilters, tag]
    );
  };
  
  // Recuperar todas as tags únicas
  const getAllTags = () => {
    const allTags = new Set();
    projects.forEach(project => {
      project.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags);
  };
  
  return (
    <WorkProjectContext.Provider value={{
      projects: filteredProjects,
      allProjects: projects,
      activeFilters,
      toggleFilter,
      getAllTags
    }}>
      {children}
    </WorkProjectContext.Provider>
  );
};