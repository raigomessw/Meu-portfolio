import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
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


// Scroll handler component for router
function ScrollToSection() {
  const location = useLocation();
  
  useEffect(() => {
    // If the path is /work, scroll to work section
    if (location.pathname === '/work') {
      const workSection = document.getElementById('work');
      if (workSection) {
        setTimeout(() => {
          workSection.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure component is mounted
      }
    } else {
      // For other routes, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);
  
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToSection />
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
    </BrowserRouter>
  );
}

export default App;