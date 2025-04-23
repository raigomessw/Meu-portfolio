import React from 'react';
import Hero from '../components/Hero/Hero';
import Services from '../components/Services/Services';
import WorkSection from '../components/Work/WorkSection'; // Assuming you have a CSS module for styling





function HomePage() {
  return (
    <div>
      <Hero />
      <Services />
      <WorkSection />
    </div>
  );
}

export default HomePage;