// WorkProjectContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Importando as imagens localmente
import fitnessImage from '../assets/Fitness.jpeg'; 
import tenisImage from '../assets/Tenis.jpeg';
import cafeImage from '../assets/Cafe.jpeg';

const WorkProjectContext = createContext();

export const useWorkProjects = () => useContext(WorkProjectContext);

export const WorkProjectProvider = ({ children }) => {
  // Lista completa de projetos - em aplicação real pode vir de uma API
  const [allProjects, setAllProjects] = useState([
    {
      id: "work1",
      title: "Super Mario 3D World",
      description: "A platform game for the Nintendo Switch with innovative gameplay mechanics and stunning visuals.",
      tags: ['Nintendo', 'Switch', 'Platform'],
      backgroundImage: fitnessImage,
      thumbnailImage: fitnessImage, // Idealmente, use uma versão menor da imagem
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
      thumbnailImage: tenisImage,
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
      thumbnailImage: cafeImage,
      projectLink: "https://example.com/project3",
      details: {
        challenge: "Building a high-performance website that maintains visual richness and interactive elements without sacrificing loading speed.",
        solution: "We implemented code splitting, lazy loading, and optimized assets while using modern CSS techniques for animations instead of heavy JavaScript libraries.",
        technologies: ['React', 'Next.js', 'Framer Motion', 'TailwindCSS']
      }
    }
  ]);
  
  // Estado para projetos filtrados - os que correspondem aos filtros ativos
  const [filteredProjects, setFilteredProjects] = useState([]);
  
  // Estado para projetos carregados no componente - pode ser menor que a lista completa
  const [loadedProjects, setLoadedProjects] = useState([]);
  
  // Filtros ativos
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Estado para controle de paginação
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Função para filtrar projetos
  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredProjects(allProjects);
    } else {
      const filtered = allProjects.filter(project => 
        project.tags.some(tag => activeFilters.includes(tag))
      );
      setFilteredProjects(filtered);
    }
    
    // Resetar paginação quando filtros mudarem
    setPage(1);
    setHasMore(true);
    setLoadedProjects([]);
  }, [activeFilters, allProjects]);
  
  // Carregar projetos iniciais
  useEffect(() => {
    loadMoreProjects(5);
  }, [filteredProjects]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Função para carregar mais projetos - paginação
  const loadMoreProjects = useCallback((count = 3) => {
    const startIdx = loadedProjects.length;
    const endIdx = startIdx + count;
    
    const newProjects = filteredProjects.slice(startIdx, endIdx);
    
    if (newProjects.length > 0) {
      setLoadedProjects(prev => [...prev, ...newProjects]);
    }
    
    // Verificar se ainda existem mais projetos para carregar
    setHasMore(endIdx < filteredProjects.length);
    setPage(prev => prev + 1);
  }, [filteredProjects, loadedProjects]);
  
  // Alternar filtros
  const toggleFilter = useCallback((tag) => {
    setActiveFilters(prevFilters => 
      prevFilters.includes(tag) 
        ? prevFilters.filter(f => f !== tag)
        : [...prevFilters, tag]
    );
  }, []);
  
  // Recuperar todas as tags únicas
  const getAllTags = useCallback(() => {
    const allTags = new Set();
    allProjects.forEach(project => {
      project.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags);
  }, [allProjects]);
  
  // Adicionar novo projeto - útil para administração de conteúdo
  const addProject = useCallback((project) => {
    setAllProjects(prev => [...prev, project]);
  }, []);
  
  return (
    <WorkProjectContext.Provider value={{
      projects: loadedProjects,
      allProjects,
      filteredProjects,
      activeFilters,
      toggleFilter,
      getAllTags,
      loadMoreProjects,
      hasMoreProjects: hasMore,
      addProject
    }}>
      {children}
    </WorkProjectContext.Provider>
  );
};