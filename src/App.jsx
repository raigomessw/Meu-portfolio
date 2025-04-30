import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { setupPassiveListeners, detectDeviceCapability } from './components/utils/performance';
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
            workSection.scrollIntoView({ 
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
          }, 100);
        }
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'instant'
      });
    }
  }, [location]);
  
  return null;
};

function App() {
  // Configurações de performance global
  useEffect(() => {
    // 1. Configurar listeners passivos para melhorar performance de eventos
    const cleanupPassiveListeners = setupPassiveListeners();
    
    // 2. Detectar preferências de redução de movimento e capacidades do dispositivo
    const deviceCaps = detectDeviceCapability();
    if (deviceCaps.shouldUseReducedEffects) {
      document.documentElement.classList.add('reduced-motion');
    }
    
    // 3. Otimizar carregamento de imagens
    const lazyloadImages = () => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('data-src');
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
              }
              imageObserver.unobserve(img);
            }
          });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    };
    
    // 4. Limpar timers e animações quando a página não está visível
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.body.classList.add('page-hidden');
      } else {
        document.body.classList.remove('page-hidden');
        // Reiniciar lazy loading quando a página volta a ser visível
        lazyloadImages();
      }
    });
    
    // 5. Desativar animações durante scroll - melhora significativamente a performance
    let scrollTimer;
    const handleScroll = () => {
      document.body.classList.add('is-scrolling');
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Iniciar otimização de imagens
    lazyloadImages();
    
    // Cleanup
    return () => {
      cleanupPassiveListeners();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);
  
  return (
    // ThemeProvider envolve toda a aplicação
    <ThemeProvider>
      <WorkProjectProvider>
        <Router>
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
        </Router>
      </WorkProjectProvider>
    </ThemeProvider>
  );
}

export default App;