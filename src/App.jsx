import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
        <Route path="/work" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Footer className="footer" />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;