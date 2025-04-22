import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Work  from '../components/Work';
import styles from './Home.module.css';
import Footer from '../components/Footer'; // Assuming you have a CSS module for styling





function HomePage() {
  return (
    <div>
      <Hero />
      <Services />
      <h2 className={styles.sectionTitle} id="my-works">My Works</h2>
      <Work />
      <Footer />
    </div>
  );
}

export default HomePage;