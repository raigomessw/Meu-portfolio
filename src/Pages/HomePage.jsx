import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Work from '../components/Work';

function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <Services />
      <Work />
    </main>
  );
}

export default HomePage;