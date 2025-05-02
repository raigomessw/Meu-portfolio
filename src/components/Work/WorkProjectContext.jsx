import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Contexto para gerenciar os projetos
const WorkProjectContext = createContext();

// Hook para facilitar o uso do contexto
export const useWorkProjects = () => useContext(WorkProjectContext);

// Provider do contexto
export function WorkProjectProvider({ children }) {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [activeImageCategory, setActiveImageCategory] = useState(null);
  const [activeMediaTypeFilter, setActiveMediaTypeFilter] = useState('all'); // 'all', 'image', 'video', 'prototype'

  // Função para buscar projeto por ID com memoização para evitar re-renders desnecessários
  const getProjectById = useCallback((id) => {
    if (!projetos || projetos.length === 0) {
      console.log("Array de projetos vazio ou não inicializado");
      return null;
    }
    
    console.log(`Buscando projeto com ID: ${id} de ${projetos.length} projetos`);
    const found = projetos.find(projeto => projeto.id === id);
    
    if (found) {
      console.log(`Projeto encontrado: ${found.title}`);
      return found;
    } else {
      console.log(`Nenhum projeto encontrado com o ID: ${id}`);
      return null;
    }
  }, [projetos]);

  // Nova função para obter o projeto anterior com base no ID atual
  const getPrevProject = useCallback((currentId) => {
    if (!projetos || projetos.length === 0) return null;
    
    const currentIndex = projetos.findIndex(p => p.id === currentId);
    if (currentIndex <= 0) return null;
    
    return projetos[currentIndex - 1];
  }, [projetos]);
  
  // Nova função para obter o próximo projeto com base no ID atual
  const getNextProject = useCallback((currentId) => {
    if (!projetos || projetos.length === 0) return null;
    
    const currentIndex = projetos.findIndex(p => p.id === currentId);
    if (currentIndex === -1 || currentIndex >= projetos.length - 1) return null;
    
    return projetos[currentIndex + 1];
  }, [projetos]);

  // Função para filtrar imagens por categoria
  const filterImagesByCategory = useCallback((category) => {
    setActiveImageCategory(category);
  }, []);
  
  // Nova função para filtrar por tipo de mídia (imagem, vídeo, protótipo)
  const filterByMediaType = useCallback((type) => {
    setActiveMediaTypeFilter(type);
  }, []);
  
  // Funçao para converter objetos de imagem antigos para o novo formato de mídia
  const convertToMediaObject = (imageObjects, projectId) => {
    if (!imageObjects || !Array.isArray(imageObjects)) return [];
    
    return imageObjects.map((img, index) => {
      // Verifica se já está no formato correto
      if (img.type) return img;
      
      // Detecta o tipo de arquivo baseado na URL
      let type = 'image';
      if (img.url.match(/\.(mp4|webm|mov)$/i)) {
        type = 'video';
      } else if (img.isPrototype || img.externalUrl || img.url.includes('figma') || img.url.includes('prototype')) {
        type = 'prototype';
      }
      
      // Retorna objeto no formato novo
      return {
        id: `${projectId}-media-${index}`,
        url: img.url,
        title: img.title || '',
        caption: img.caption || '',
        type: type,
        thumbnail: img.thumbnail || img.url,
        tags: img.tags || [],
        category: img.category || 'design',
        externalUrl: img.externalUrl || null
      };
    });
  };

  // Efeito para carregar dados de projetos uma única vez e armazenar no estado local
  useEffect(() => {
    // Evita buscar os dados novamente se já foram carregados
    if (isDataFetched) {
      console.log("Dados já foram carregados anteriormente");
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Simula uma chamada a uma API ou banco de dados
        // Em um cenário real, você substituiria isso por uma chamada fetch() para sua API
        const data = [
          {
            id: "clojel",
            title: "Clojel App Design",
            description: "Omdesign av användarupplevelsen för en psykisk hälsoapp",
            tags: ['Mobil', 'Hälsa', 'UX Research'],
            backgroundImage: '/work/clojel/background.jpg',
            coverImage: '/work/clojel/cover.jpg',
            thumbnailImage: '/work/clojel/thumbnail.jpg',
            date: "2023",
            projectLink: "/work/clojel",
            figmaUrl: "https://figma.com/seu-link-para-o-projeto",
            liveUrl: "https://example.com/projeto-clojel",
            githubUrl: null,
            extendedDescription: "En fullständig omdesign av användarupplevelsen för en psykisk hälsoapp, med fokus på enkelhet och tillgänglighet.",
            challenges: "Den största utmaningen var att skapa ett gränssnitt som förmedlade lugn och förtroende, vilket gjorde processen för psykisk hälsovård mindre stigmatiserad och mer tillgänglig.",
            solution: "Vi implementerade en användarcentrerad design med lugnande färger, intuitiva navigationsflöden och visuella element som främjar en avkopplande upplevelse.",
            technologies: [
              { name: "Figma", icon: "🎨" },
              { name: "Adobe XD", icon: "📱" },
              { name: "Prototyping", icon: "🧩" },
              { name: "User Testing", icon: "👥" }
            ],
            media: [
              {
                id: "clojel-media-1",
                type: "image",
                url: '/work/clojel/gallery/background.png',
                title: "App-gränssnitt",
                caption: "Huvudskärmen för applikationen som visar användardashboarden",
                tags: ["UI", "Dashboard"],
                category: "interface"
              },
              {
                id: "clojel-media-2",
                type: "image",
                url: '/work/clojel/gallery/characters.jpg',
                title: "Meditationsflöde",
                caption: "Skärmsekvens för guidad meditationsfunktion",
                tags: ["UX", "Flöde"],
                category: "interface"
              },
              {
                id: "clojel-media-3",
                type: "image",
                url: '/work/clojel/gallery/leveldesign.jpg',
                title: "Level Design",
                caption: "Designprocess för applikationens olika nivåer",
                tags: ["Process", "Design"],
                category: "design"
              },
              {
                id: "clojel-media-4",
                type: "prototype",
                url: "https://www.figma.com/proto/exemplo-clojel",
                thumbnail: '/work/clojel/gallery/prototype-thumb.jpg',
                title: "Interaktiv prototyp",
                caption: "Testa applikationens huvudflöde i en interaktiv prototyp",
                tags: ["Prototyp", "Interaktiv"],
                category: "prototype" 
              },
              {
                id: "clojel-media-5",
                type: "video",
                url: '/work/clojel/gallery/app-preview.mp4',
                thumbnail: '/work/clojel/gallery/video-thumb.jpg',
                title: "Applikationsdemonstration",
                caption: "En kort video som visar huvudflödet i appen",
                tags: ["Demo", "Video"],
                category: "demo"
              }
            ],
            featured: true
          },
          {
            id: "dianaLandingPage",
            title: "Diana Landing Page",
            description: "Design och implementering av målsida för ett hållbart modevarumärke",
            tags: ['Webbdesign', 'Målsida', 'Hållbarhet'],
            backgroundImage: '/work/dianaLandingPage/background.jpg',
            coverImage: '/work/dianaLandingPage/cover.jpg',
            thumbnailImage: '/work/dianaLandingPage/thumbnail.jpg',
            date: "2023",
            projectLink: "/work/dianaLandingPage",
            figmaUrl: "https://figma.com/seu-link-para-o-projeto",
            liveUrl: "https://example.com/diana-landing",
            githubUrl: "https://github.com/username/diana-landing",
            extendedDescription: "Design och implementering av en modern och responsiv målsida för Diana, ett hållbart modevarumärke, med fokus på att kommunicera värderingar för hållbarhet och miljömedvetenhet.",
            challenges: "Att utveckla en sida som kombinerade elegant modeestetik med hållbarhetsvärderingar, samtidigt som man bibehöll balansen mellan visuell attraktion och miljöbudskap.",
            solution: "Vi skapade en ren design med naturliga element, organisk färgpalett och belyste den hållbara produktionscykeln genom visuellt storytelling.",
            technologies: [
              { name: "HTML5", icon: "🌐" },
              { name: "CSS3", icon: "🎨" },
              { name: "JavaScript", icon: "📝" },
              { name: "Responsive Design", icon: "📱" }
            ],
            media: [
              {
                id: "diana-media-1",
                type: "image",
                url: '/work/dianaLandingPage/gallery/homepage.jpg',
                title: "Hemsida",
                caption: "Inledande sektion med presentation av varumärket och dess värderingar",
                tags: ["Hero", "Branding"],
                category: "interface"
              },
              {
                id: "diana-media-2",
                type: "image",
                url: '/work/dianaLandingPage/gallery/features.jpg',
                title: "Hållbara produkter",
                caption: "Presentation av kollektionen av miljövänliga produkter",
                tags: ["Produkter", "Hållbarhet"],
                category: "product"
              },
              {
                id: "diana-media-3",
                type: "image",
                url: '/work/dianaLandingPage/gallery/mobile.jpg',
                title: "Mobilanpassad design",
                caption: "Responsiv design för mobila enheter",
                tags: ["Mobil", "Responsiv"],
                category: "interface"
              },
              {
                id: "diana-media-4",
                type: "video",
                url: '/work/dianaLandingPage/gallery/scrolling-demo.mp4',
                thumbnail: '/work/dianaLandingPage/gallery/video-thumb.jpg',
                title: "Scrollningsinteraktion",
                caption: "Demonstration av parallaxeffekter och animationer vid scrollning",
                tags: ["Animation", "Interaktion"],
                category: "interaction"
              },
              {
                id: "diana-media-5",
                type: "prototype",
                url: "https://www.figma.com/proto/exemplo-diana",
                thumbnail: '/work/dianaLandingPage/gallery/prototype-thumb.jpg',
                title: "Clickable prototype",
                caption: "Genomgång av webbplatsens hela flöde genom en interaktiv prototyp",
                tags: ["Prototyp", "Flow"],
                category: "prototype"
              }
            ],
            featured: true
          },
          {
            id: "studantEkonomiApp",
            title: "App Studant Ekonomi",
            description: "Finansapp för universitetsstudenter",
            tags: ['Finans', 'Mobil', 'Utbildning'],
            backgroundImage: '/work/studantEkonomiApp/background.jpg',
            coverImage: '/work/studantEkonomiApp/cover.jpg',
            thumbnailImage: '/work/studantEkonomiApp/thumbnail.jpg',
            date: "2022",
            projectLink: "/work/studantEkonomiApp",
            figmaUrl: "https://figma.com/seu-link-para-o-projeto",
            liveUrl: "https://example.com/studant-ekonomi",
            githubUrl: "https://github.com/username/studant-ekonomi",
            extendedDescription: "En intuitiv app för att hjälpa universitetsstudenter att hantera sina finanser, med fokus på användbarhet och utbildningsverktyg om ekonomisk förvaltning.",
            challenges: "Att skapa en finansiell lösning som tillgodoser studenters specifika behov, med begränsade budgetar och säsongsbetonade akademiska utgifter.",
            solution: "Vi utvecklade en app med automatisk utgiftskategorisering, räkningspåminnelser, besparingstips och tydlig visualisering av utgifter per termin.",
            technologies: [
              { name: "React Native", icon: "⚛️" },
              { name: "Firebase", icon: "🔥" },
              { name: "Chart.js", icon: "📊" },
              { name: "UX Research", icon: "🔍" }
            ],
            media: [
              {
                id: "student-media-1",
                type: "image",
                url: '/work/studantEkonomiApp/gallery/colors.jpg',
                title: "Finansiell dashboard",
                caption: "Översikt över studentens ekonomi med intuitiva diagram",
                tags: ["Dashboard", "Dataviz"],
                category: "interface"
              },
              {
                id: "student-media-2",
                type: "image",
                url: '/work/studantEkonomiApp/gallery/components.jpg',
                title: "Terminsbudget",
                caption: "Planeringsverktyg för den akademiska terminen",
                tags: ["Komponenter", "UI"],
                category: "design"
              },
              {
                id: "student-media-3",
                type: "image",
                url: '/work/studantEkonomiApp/gallery/documentation.jpg',
                title: "Dokumentation",
                caption: "Teknisk dokumentation och användarmanual",
                tags: ["Dokumentation", "Process"],
                category: "process"
              },
              {
                id: "student-media-4",
                type: "video",
                url: '/work/studantEkonomiApp/gallery/usage-flow.mp4',
                thumbnail: '/work/studantEkonomiApp/gallery/video-thumb.jpg',
                title: "Användarflöde",
                caption: "Demonstration av typiskt användarflöde från registrering till daglig användning",
                tags: ["Användarflöde", "Demo"],
                category: "demo"
              }
            ],
            featured: false
          },
          {
            id: "travelBuddy",
            title: "Travel Buddy",
            description: "Plattform för organisation av gemensamma resor",
            tags: ['Resor', 'Samarbete', 'Webbapp'],
            backgroundImage: '/work/travelBuddy/background.jpg',
            coverImage: '/work/travelBuddy/cover.jpg',
            thumbnailImage: '/work/travelBuddy/thumbnail.jpg',
            date: "2022",
            projectLink: "/work/travelBuddy",
            figmaUrl: "https://figma.com/seu-link-para-o-projeto",
            liveUrl: "https://example.com/travel-buddy",
            githubUrl: "https://github.com/username/travel-buddy",
            extendedDescription: "En webbplattform för organisation av gruppresor, som möjliggör samarbetsplanering av resrutter och budgetar.",
            challenges: "Att utveckla ett gränssnitt som underlättade samarbetsplanering, samtidigt som informationen hålls organiserad och tillgänglig för alla resedeltagare.",
            solution: "Vi skapade ett system med delade tavlor med funktionalitet för drag-and-drop, realtidskommentarer och automatisk synkronisering mellan enheter.",
            technologies: [
              { name: "Vue.js", icon: "🖖" },
              { name: "Node.js", icon: "📡" },
              { name: "MongoDB", icon: "🍃" },
              { name: "Socket.io", icon: "🔌" }
            ],
            media: [
              {
                id: "travel-media-1",
                type: "image",
                url: '/work/travelBuddy/gallery/homepage.jpg',
                title: "Resplanerare",
                caption: "Samarbetsverktyg för organisering av resrutter",
                tags: ["Planering", "UI"],
                category: "interface"
              },
              {
                id: "travel-media-2",
                type: "image",
                url: '/work/travelBuddy/gallery/projects.jpg',
                title: "Kostnadsdelning",
                caption: "System för hantering av delade kostnader",
                tags: ["Finans", "Verktyg"],
                category: "feature"
              },
              {
                id: "travel-media-3",
                type: "prototype",
                url: "https://www.figma.com/proto/exemplo-travel",
                thumbnail: '/work/travelBuddy/gallery/chatbot.jpg',
                title: "AI Assistent",
                caption: "Intelligent virtual assistent för resesupport",
                tags: ["AI", "Support"],
                category: "prototype"
              },
              {
                id: "travel-media-4",
                type: "video",
                url: '/work/travelBuddy/gallery/collaboration-demo.mp4',
                thumbnail: '/work/travelBuddy/gallery/video-thumb.jpg',
                title: "Livekollaboration",
                caption: "Demonstration av realtids-samarbete mellan flera användare",
                tags: ["Samarbete", "Realtid"],
                category: "feature"
              },
              {
                id: "travel-media-5",
                type: "image",
                url: '/work/travelBuddy/gallery/mobile-view.jpg',
                title: "Mobil Vy",
                caption: "Mobilanpassad design för resenärer på språng",
                tags: ["Mobil", "Responsiv"],
                category: "interface"
              }
            ],
            featured: false
          },
          {
            id: "mackeUpinstitute",
            title: "Macke Up Institute",
            description: "Omdesign av onlinekursplattform för makeup",
            tags: ['Utbildning', 'E-learning', 'Mode'],
            backgroundImage: '/work/mackeUpinstitute/background.jpg',
            coverImage: '/work/mackeUpinstitute/cover.jpg',
            thumbnailImage: '/work/mackeUpinstitute/thumbnail.jpg',
            date: "2021",
            projectLink: "/work/mackeUpinstitute",
            figmaUrl: "https://figma.com/seu-link-para-o-projeto",
            liveUrl: "https://example.com/makeup-institute",
            githubUrl: "https://github.com/username/makeup-institute",
            extendedDescription: "Fullständig omdesign av en onlineplattform för makeuputbildningar, med fokus på förbättringar i inlärningsupplevelsen och studentengagemang.",
            challenges: "Att förbättra innehållsorganisationen och öka studentengagemanget genom att skapa en plattform som kombinerade funktionalitet med tilltalande estetik för målgruppen.",
            solution: "Vi implementerade ett visuellt slående gränssnitt med intuitiv navigering, interaktiva funktioner för teknikövning och ett personligt framstegsspårningssystem.",
            technologies: [
              { name: "WordPress", icon: "📰" },
              { name: "LearnDash", icon: "📚" },
              { name: "Custom CSS", icon: "🎨" },
              { name: "JavaScript", icon: "📝" }
            ],
            media: [
              {
                id: "makeup-media-1",
                type: "image",
                url: '/work/mackeUpinstitute/gallery/homepage.jpg',
                title: "Studentdashboard",
                caption: "Anpassat gränssnitt med åtkomst till kurser och framsteg",
                tags: ["Dashboard", "Utbildning"],
                category: "interface"
              },
              {
                id: "makeup-media-2",
                type: "video",
                url: '/work/mackeUpinstitute/gallery/tutorial-sample.mp4',
                thumbnail: '/work/mackeUpinstitute/gallery/courses.jpg',
                title: "Interaktiv lektion",
                caption: "Exempel på lektion med video och interaktiva resurser",
                tags: ["Tutorial", "Lärande"],
                category: "content"
              },
              {
                id: "makeup-media-3",
                type: "image",
                url: '/work/mackeUpinstitute/gallery/mobile.jpg',
                title: "Mobil Upplevelse",
                caption: "Optimerad design för användning på mobila enheter",
                tags: ["Mobil", "Responsiv"],
                category: "interface"
              },
              {
                id: "makeup-media-4",
                type: "image",
                url: '/work/mackeUpinstitute/gallery/contact.jpg',
                title: "Kontaktsida",
                caption: "Kontaktformulär för studentförfrågningar",
                tags: ["Kontakt", "UI"],
                category: "interface"
              },
              {
                id: "makeup-media-5",
                type: "prototype",
                url: "https://www.figma.com/proto/exemplo-makeup",
                thumbnail: '/work/mackeUpinstitute/gallery/prototype-thumb.jpg',
                title: "Kursdesign prototyp",
                caption: "Interaktiv prototyp av kursflöde och användarupplevelse",
                tags: ["Prototyp", "UX"],
                category: "prototype"
              }
            ],
            featured: false
          }
        ];
        
        // Compatibilidade com o formato anterior
        data.forEach(project => {
          if (project.images && !project.media) {
            project.media = convertToMediaObject(project.images, project.id);
          }
          
          console.log(`Projeto ${project.id} tem ${project.media?.length || 0} tipos de mídia (imagens, vídeos, protótipos)`);
          
          if (project.media) {
            const mediaTypes = {
              image: 0,
              video: 0,
              prototype: 0
            };
            
            project.media.forEach(item => {
              if (mediaTypes[item.type] !== undefined) {
                mediaTypes[item.type]++;
              }
            });
            
            console.log(`Distribuição: ${mediaTypes.image} imagens, ${mediaTypes.video} vídeos, ${mediaTypes.prototype} protótipos`);
          }
        });
        
        setProjetos(data);
        setIsDataFetched(true);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar projetos:", err);
        setError("Det gick inte att ladda projekten. Var god försök igen.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isDataFetched]); // Dependência de isDataFetched para evitar re-fetching desnecessário

  // Obter mídia filtrada por tipo e categoria para um projeto
  const getFilteredMedia = useCallback((projectId, mediaTypeFilter = activeMediaTypeFilter, category = activeImageCategory) => {
    const project = getProjectById(projectId);
    if (!project || !project.media) return [];
    
    let filtered = [...project.media];
    
    // Filtrar por categoria se especificado
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
    
    // Filtrar por tipo de mídia se não for 'all'
    if (mediaTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === mediaTypeFilter);
    }
    
    return filtered;
  }, [getProjectById, activeMediaTypeFilter, activeImageCategory]);

  return (
    <WorkProjectContext.Provider value={{ 
      projetos, 
      loading, 
      error, 
      getProjectById,
      getPrevProject,
      getNextProject,
      activeImageCategory,
      filterImagesByCategory,
      activeMediaTypeFilter,
      filterByMediaType,
      getFilteredMedia,
      convertToMediaObject
    }}>
      {children}
    </WorkProjectContext.Provider>
  );
}