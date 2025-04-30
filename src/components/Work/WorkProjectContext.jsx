import React, { createContext, useContext, useState, useEffect } from 'react';

// Dados de exemplo de projetos
const sampleProjects = [
  {
    id: 'clojel',
    title: 'Clojel App Design',
    description: 'Redesign da experiência do usuário para um aplicativo de saúde mental',
    thumbnailImage: '/public/work/clojel/thumbnail.jpg',
    coverImage: '/public/work/clojel/cover.jpg',
    background: '/public/work/clojel/background.jpg',
    category: 'UX/UI Design',
    featured: true,
    tags: ['Mobile', 'Saúde', 'UX Research'],
    year: '2023',
    gallery: [
      '/public/work/clojel/gallery/image1.jpg',
      '/public/work/clojel/gallery/image2.jpg',
      '/public/work/clojel/gallery/image3.jpg'
    ],
    fullDescription: 'Um completo redesign da experiência do usuário para um aplicativo de saúde mental, focando em simplicidade e acessibilidade.'
  },
  {
    id: 'dianaLandingPage',
    title: 'Diana Landing Page',
    description: 'Design e implementação de página de destino para uma marca de moda sustentável',
    thumbnailImage: '/public/work/dianaLandingPage/thumbnail.jpg',
    coverImage: '/public/work/dianaLandingPage/cover.jpg',
    background: '/public/work/dianaLandingPage/background.jpg',
    category: 'Web Design',
    highlight: true,
    tags: ['Landing Page', 'Moda', 'Sustentabilidade'],
    year: '2023',
    gallery: [
      '/public/work/dianaLandingPage/gallery/image1.jpg',
      '/public/work/dianaLandingPage/gallery/image2.jpg'
    ],
    fullDescription: 'Design e implementação de uma landing page moderna e responsiva para uma marca de moda sustentável, com foco em conversão e experiência do usuário.'
  },
  {
    id: 'studantEkonomiApp',
    title: 'App Studant Ekonomi',
    description: 'Aplicativo de finanças para estudantes universitários',
    thumbnailImage: '/public/work/studantEkonomiApp/thumbnail.jpg',
    coverImage: '/public/work/studantEkonomiApp/cover.jpg',
    background: '/public/work/studantEkonomiApp/background.jpg',
    category: 'UI/UX Design',
    featured: true,
    tags: ['Finanças', 'Mobile', 'Educação'],
    year: '2022',
    gallery: [
      '/public/work/studantEkonomiApp/gallery/image1.jpg',
      '/public/work/studantEkonomiApp/gallery/image2.jpg',
      '/public/work/studantEkonomiApp/gallery/image3.jpg'
    ],
    fullDescription: 'Um aplicativo intuitivo para ajudar estudantes universitários a gerenciar suas finanças, com foco em usabilidade e ferramentas educativas.'
  },
  {
    id: 'travelBuddy',
    title: 'Travel Buddy',
    description: 'Plataforma de organização de viagens colaborativas',
    thumbnailImage: '/public/work/travelBuddy/thumbnail.jpg',
    coverImage: '/public/work/travelBuddy/cover.jpg',
    background: '/public/work/travelBuddy/background.jpg',
    category: 'Product Design',
    tags: ['Viagem', 'Colaboração', 'Web App'],
    year: '2022',
    gallery: [
      '/public/work/travelBuddy/gallery/image1.jpg',
      '/public/work/travelBuddy/gallery/image2.jpg'
    ],
    fullDescription: 'Uma plataforma web para organização de viagens em grupo, permitindo planejamento colaborativo de itinerários e orçamentos.'
  },
  {
    id: 'mackeUpinstitute',
    title: 'Macke Up Institute',
    description: 'Redesign da plataforma de cursos online de maquiagem',
    thumbnailImage: '/public/work/mackeUpinstitute/thumbnail.jpg',
    coverImage: '/public/work/mackeUpinstitute/cover.jpg',
    background: '/public/work/mackeUpinstitute/background.jpg',
    category: 'Web Design',
    tags: ['Educação', 'E-learning', 'Moda'],
    year: '2021',
    gallery: [
      '/public/work/mackeUpinstitute/gallery/image1.jpg',
      '/public/work/mackeUpinstitute/gallery/image2.jpg',
      '/public/work/mackeUpinstitute/gallery/image3.jpg'
    ],
    fullDescription: 'Redesign completo de uma plataforma de cursos online de maquiagem, focando em melhorias na experiência de aprendizagem e engajamento dos alunos.'
  }
];

// Criando o contexto
const WorkProjectContext = createContext();

// Hook personalizado para usar o contexto
export function useWorkProjects() {
  return useContext(WorkProjectContext);
}

// Componente provedor que fornece os dados de projetos
export function WorkProjectProvider({ children }) {
  const [allProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Em um cenário real, aqui seria feita uma requisição para uma API
    // Simulando uma requisição assíncrona
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        // Simulando tempo de carregamento
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Corrigindo os caminhos das imagens para formato correto
        const processedProjects = sampleProjects.map(project => ({
          ...project,
          thumbnailImage: project.thumbnailImage.replace('/public', ''),
          coverImage: project.coverImage.replace('/public', ''),
          background: project.background.replace('/public', ''),
          gallery: project.gallery?.map(img => img.replace('/public', ''))
        }));
        
        setAllProjects(processedProjects);
      } catch (err) {
        setError('Erro ao carregar projetos');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Função para obter um projeto específico por ID
  const getProjectById = (id) => {
    return allProjects.find(project => project.id === id) || null;
  };

  // Fornecendo os dados e funções através do contexto
  const value = {
    allProjects,
    isLoading,
    error,
    getProjectById
  };

  return (
    <WorkProjectContext.Provider value={value}>
      {children}
    </WorkProjectContext.Provider>
  );
}