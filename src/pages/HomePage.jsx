import React from 'react';
import Hero from '../components/Hero/Hero';
import Services from '../components/Services/Services';
import WorkSection from '../components/Work/WorkSection'; 
import SectionDivider from '../components/Services/SectionDivider';






function HomePage() {
  return (
    <div>
      <Hero />
      <SectionDivider />
      <Services />
      <WorkSection />
    </div>
  );
}

export default HomePage;