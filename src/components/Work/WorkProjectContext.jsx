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
            titlePt: "Clojel App Design",
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
            images: [
              {
                url: '/work/clojel/gallery/background.png',
                title: "App-gränssnitt",
                caption: "Huvudskärmen för applikationen som visar användardashboarden",

              },
              {
                url: '/work/clojel/gallery/characters.jpg',
                title: "Meditationsflöde",
                caption: "Skärmsekvens för guidad meditationsfunktion",
              },
              {
                url: '/work/clojel/gallery/leveldesign.jpg',
                title: "Level Design",
                caption: "Designprocess för applikationens olika nivåer",
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
            images: [
              {
                url: '/work/dianaLandingPage/gallery/homepage.jpg',
                title: "Hemsida",
                caption: "Inledande sektion med presentation av varumärket och dess värderingar",
              },
              {
                url: '/work/dianaLandingPage/gallery/features.jpg',
                title: "Hållbara produkter",
                caption: "Presentation av kollektionen av miljövänliga produkter",
              },
              {
                url: '/work/dianaLandingPage/gallery/mobile.jpg',
                title: "Mobilanpassad design",
                caption: "Responsiv design för mobila enheter",
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
            solutionPt: "Desenvolvemos um aplicativo com categorização automática de despesas, lembretes de contas, dicas de economia e visualização clara de gastos por semestre.",
            technologies: [
              { name: "React Native", icon: "⚛️" },
              { name: "Firebase", icon: "🔥" },
              { name: "Chart.js", icon: "📊" },
              { name: "UX Research", icon: "🔍" }
            ],
            images: [
              {
                url: '/work/studantEkonomiApp/gallery/colors.jpg',
                title: "Finansiell dashboard",
                caption: "Översikt över studentens ekonomi med intuitiva diagram",
              },
              {
                url: '/work/studantEkonomiApp/gallery/components.jpg',
                title: "Terminsbudget",
                caption: "Planeringsverktyg för den akademiska terminen",
              },
              {
                url: '/work/studantEkonomiApp/gallery/documentation.jpg',
                title: "Dokumentation",
                caption: "Teknisk dokumentation och användarmanual",
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
            images: [
              {
                url: '/work/travelBuddy/gallery/homepage.jpg',
                title: "Resplanerare",
                caption: "Samarbetsverktyg för organisering av resrutter",
              },
              {
                url: '/work/travelBuddy/gallery/projects.jpg',
                title: "Kostnadsdelning",
                caption: "System för hantering av delade kostnader",
              },
              {
                url: '/work/travelBuddy/gallery/chatbot.jpg',
                title: "AI Assistent",
                caption: "Intelligent virtual assistent för resesupport",
              },
              {
                url: '/work/travelBuddy/gallery/mobile-view.jpg',
                title: "Mobil Vy",
                caption: "Mobilanpassad design för resenärer på språng",
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
            images: [
              {
                url: '/work/mackeUpinstitute/gallery/homepage.jpg',
                title: "Studentdashboard",
                caption: "Anpassat gränssnitt med åtkomst till kurser och framsteg",
              },
              {
                url: '/work/mackeUpinstitute/gallery/courses.jpg',
                title: "Interaktiv lektion",
                caption: "Exempel på lektion med video och interaktiva resurser",
              },
              {
                url: '/work/mackeUpinstitute/gallery/mobile.jpg',
                title: "Mobil Upplevelse",
                caption: "Optimerad design för användning på mobila enheter",
              },
              {
                url: '/work/mackeUpinstitute/gallery/contact.jpg',
                title: "Kontaktsida",
                caption: "Kontaktformulär för studentförfrågningar",
              }
            ],
            featured: false
          }
        ];
        
        console.log(`Carregados ${data.length} projetos`);
        setProjetos(data);
        setIsDataFetched(true);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar projetos:", err);
        setError("Não foi possível carregar os projetos. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isDataFetched]); // Dependência de isDataFetched para evitar re-fetching desnecessário

  return (
    <WorkProjectContext.Provider value={{ 
      projetos, 
      loading, 
      error, 
      getProjectById 
    }}>
      {children}
    </WorkProjectContext.Provider>
  );
}