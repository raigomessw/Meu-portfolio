import React, { useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useLocation,
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import { WorkProjectProvider } from './components/Work/WorkProjectContext';
import { ThemeProvider } from './components/context/ThemeProvider';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import WorkPage from './pages/WorkPage';
import ProjectDetail from './components/Work/ProjectDetail';
import MarketResearch from './components/Services/MarketResearch';
import UserResearch from './components/Services/UserResearch';
import MVPPrototyping from './components/Services/MVPPrototyping';
import DesignValidation from './components/Services/DesignValidation';
// Importando funções premium ao invés das básicas
import {
  detectDevicePerformance,
  setupPremiumLazyLoading,
  setupOptimizedBgImages
} from './components/utils/premiumPerformance';
import PremiumEffects from './components/common/PremiumEffects';
import ScrollToTop from './components/common/ScrollToTop';

// Componente ScrollManager separado para usar dentro do BrowserRouter
const ScrollManager = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === '/work') {
      requestAnimationFrame(() => {
        const workSection = document.getElementById('work');
        if (workSection) {
          setTimeout(() => {
            // Verifica preferência por movimento reduzido usando detectDevicePerformance
            const { prefersReducedMotion } = (typeof window !== 'undefined') ? 
              detectDevicePerformance() : { prefersReducedMotion: false };
              
            workSection.scrollIntoView({ 
              behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
          }, 100);
        }
      });
    } else {
      // Verifica preferência por movimento reduzido
      const { prefersReducedMotion } = (typeof window !== 'undefined') ? 
        detectDevicePerformance() : { prefersReducedMotion: false };
        
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'instant'
      });
    }
  }, [location]);
  
  return null;
};

// Layout comum para todas as rotas
const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <PremiumEffects />
      <Navbar />
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:projectId" element={<ProjectDetail />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} /> 
        <Route path="/services/market-research" element={<MarketResearch />} />
        <Route path="/services/user-research" element={<UserResearch />} />
        <Route path="/services/mvp-prototyping" element={<MVPPrototyping />} />
        <Route path="/services/design-validation" element={<DesignValidation />} />
      </Routes>
      <Footer />
    </>
  );
};

function App() {
  // Configurações de performance premium global
  useEffect(() => {
    // Apenas executa no client-side
    if (typeof window === 'undefined') return;
    
    // 1. Detectar capacidades do dispositivo usando a função premium
    const deviceInfo = detectDevicePerformance();
    
    // 2. Aplicar classes CSS com base nas capacidades detectadas
    if (deviceInfo.prefersReducedMotion || deviceInfo.shouldReduceEffects) {
      document.documentElement.classList.add('reduced-motion');
    }
    
    if (deviceInfo.isLowEndDevice) {
      document.documentElement.classList.add('low-end-device');
    }
    
    if (deviceInfo.isTouchDevice) {
      document.documentElement.classList.add('touch-device');
    }
    
    // 3. Configurar otimizações premium de lazy loading
    const premiumLazyObserver = setupPremiumLazyLoading();
    
    // 4. Configurar otimizações para imagens de fundo
    setupOptimizedBgImages();
    
    // 5. Otimizar interações durante scroll
    let scrollTimer;
    const handleScroll = () => {
      document.body.classList.add('is-scrolling');
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 6. Limpar recursos quando a página está inativa
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.body.classList.add('page-hidden');
      } else {
        document.body.classList.remove('page-hidden');
      }
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
      
      // Se houver observadores ativos, os desconecta
      if (premiumLazyObserver && typeof premiumLazyObserver.disconnect === 'function') {
        premiumLazyObserver.disconnect();
      }
    };
  }, []);
  
  // Criar router com flags futuras para evitar avisos
  const router = createBrowserRouter(
    [
      {
        path: "*",
        element: (
          <ThemeProvider>
            <WorkProjectProvider>
              <AppLayout />
            </WorkProjectProvider>
          </ThemeProvider>
        )
      }
    ],
    {
      // Adicionando flags futuras para evitar os avisos
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }
    }
  );
  
  return <RouterProvider router={router} />;
}

export default App;