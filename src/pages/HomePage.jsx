import React from 'react';
import Hero from '../components/Hero/Hero';
import Services from '../components/Services/Services';
import WorkSection from '../components/Work/WorkSection';
import styles from './Home.module.css';
import { WorkProjectProvider } from '../components/Work/WorkProjectContext';

function HomePage() {
  return (
    <div className={styles.homePage}>
      <Hero />
      <Services />
      <WorkProjectProvider>
        <WorkSection />
      </WorkProjectProvider>
    </div>
  );
}

export default HomePage;