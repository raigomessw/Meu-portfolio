import React, { useEffect, useRef } from 'react';
import styles from './About.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faReact, 
  faJs, 
  faHtml5, 
  faCss3Alt, 
  faFigma, 
  faVuejs, 
  faLinkedin, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

function AboutPage() {
  // Skills with improved accessibility descriptions
  const skills = [
    { name: "Figma", icon: faFigma, level: 90, description: "Design system creation, prototyping, and UI design" },
    { name: "React", icon: faReact, level: 90, description: "Component architecture, hooks, state management" },
    { name: "JavaScript", icon: faJs, level: 85, description: "ES6+, async programming, DOM manipulation" },
    { name: "HTML5", icon: faHtml5, level: 95, description: "Semantic markup, accessibility, web standards" },
    { name: "CSS3", icon: faCss3Alt, level: 90, description: "Flexbox, Grid, animations, responsive design" },
    { name: "Vue", icon: faVuejs, level: 80, description: "Vue components, Vue Router, Vuex" },
  ];

  // Refs for scroll animation elements
  const skillsRef = useRef(null);
  const statsRef = useRef(null);

  // Handle scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate);
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe skill progress bars
    if (skillsRef.current) {
      const skillBars = skillsRef.current.querySelectorAll(`.${styles.progressBar}`);
      skillBars.forEach(bar => observer.observe(bar));
    }

    // Observe stat items
    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll(`.${styles.statItem}`);
      statItems.forEach(item => observer.observe(item));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.aboutContainer}>
      {/* Optimized background with fallback */}
      <div className={styles.backgroundVideo}>
        <picture>
          {/* Static fallback for mobile or slow connections */}
          <source srcSet="/src/assets/gradient-static.jpg" media="(max-width: 768px), (prefers-reduced-motion: reduce)" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles.video}
            aria-hidden="true"
          >
            <source src="/src/assets/gradient-video.mp4" type="video/mp4" />
          </video>
        </picture>
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <div className={styles.profileImage} aria-label="Profile picture">
              {/* Replace with actual image when available */}
              <div className={styles.imagePlaceholder} aria-hidden="true">R</div>
            </div>
            
            {/* Social links moved near profile image */}
            <div className={styles.socialLinks}>
              <a href="https://www.linkedin.com/in/yourprofile/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="https://github.com/yourprofile/" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                <FontAwesomeIcon icon={faGithub} />
              </a>
              {/* Resume download option */}
              <a href="/path/to/your-resume.pdf" download className={styles.resumeLink} aria-label="Download Resume">
                <FontAwesomeIcon icon={faDownload} />
                <span className={styles.resumeText}>Resume</span>
              </a>
            </div>
          </div>
          <div className={styles.profileInfo}>
            <h1>About me</h1>
            <h2>UI/UX Designer & Front-End Developer</h2>
            
            {/* Streamlined personal description */}
            <p>Technology has been my passion since my teenage years. After moving to Sweden, I transformed this enthusiasm into a career, beginning with programming courses that built my technical foundation.</p>

            <p>Throughout my journey into app development, I discovered another passion: UX/UI Design. I realized great applications need both flawless functionality and intuitive, appealing interfaces that delight users.</p>

            <p>This realization guided me deeper into user experience and interface design, where I combine my technical background with a user-centered approach. Through workshops, practical projects, and continuous learning, I've strengthened my skills in UX research, wireframing, prototyping, usability testing, and frontend development.</p>
            
            <p>Outside of work, I enjoy family time, socializing with friends, staying active at the gym, and gaming online. I'm constantly seeking opportunities to create functional, creative solutions that positively impact people's lives.</p>

            <blockquote className={styles.quote}>
              "I believe impactful digital experiences bridge connections and transform daily routines. At the crossroads of creativity and code, I focus on usability and accessibility, striving for designs so intuitive they become invisible, enabling users to achieve their objectives seamlessly."
            </blockquote>
            
            {/* Stats section with animation */}
            <div className={styles.stats} ref={statsRef}>
              <div className={styles.statItem}>
                <span className={styles.number}>5+</span>
                <span className={styles.label}>Projects<br/>Completed</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.number}>3+</span>
                <span className={styles.label}>Years of<br/>Experience</span>
              </div>
              
              {/* Call to action button */}
              <div className={styles.ctaContainer}>
                <a href="/contact" className={styles.ctaButton}>Get in Touch</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.skillsSection} id="skills">
          <h2>My Skills</h2>
          <div className={styles.skillsContainer} ref={skillsRef}>
            {skills.map((skill, index) => (
              <div key={index} className={styles.skill}>
                <div className={styles.skillIconContainer} aria-hidden="true">
                  <FontAwesomeIcon icon={skill.icon} className={styles.skillIcon} />
                </div>
                <div className={styles.skillInfo}>
                  <h3>{skill.name}</h3>
                  <p className={styles.skillDescription}>{skill.description}</p>
                  <div className={styles.progressContainer} aria-label={`${skill.name} skill level: ${skill.level}%`}>
                    <div 
                      className={styles.progressBar} 
                      style={{ width: '0%' }} 
                      data-width={`${skill.level}%`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.philosophySection}>
          <h2>My Design Philosophy</h2>
          <div className={styles.philosophyItems}>
            <div className={styles.philosophyItem}>
              <h3>User-Centered</h3>
              <p>I create solutions that meet the real needs of people, based on research and empathy.</p>
            </div>
            <div className={styles.philosophyItem}>
              <h3>Functional Minimalism</h3>
              <p>I believe in clean designs that remove the unnecessary and highlight the essential.</p>
            </div>
            <div className={styles.philosophyItem}>
              <h3>Accessibility for All</h3>
              <p>I am committed to creating digital experiences that are accessible to people of all abilities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;