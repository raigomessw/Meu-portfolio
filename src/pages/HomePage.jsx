import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Work  from '../components/Work';
import styles from './Home.module.css';



function HomePage() {
  return (
    <div>
      <Hero />
      <Services />
      <h2 className={styles.sectionTitle}>My Works</h2>
      <Work />

      
    </div>
  );
}

export default HomePage;