import React, { useEffect, useRef, useState } from 'react';
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
import { faDownload, faBrain, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { detectDeviceCapability, throttle } from '../utils/performance';

// Usar import.meta.url para caminhos de arquivos estáticos
const ProfileImage = new URL('../common/Image/profile.jpeg', import.meta.url).href;
const ResumeEN = new URL('/resume/Rai Gomes CV ENG.pdf', import.meta.url).href;
const ResumeSW = new URL('/resume/Rai Gomes CV SV.pdf', import.meta.url).href;
// Importando corretamente os assets de vídeo/imagem
const GradientStatic = new URL('../../assets/gradient-static.jpg', import.meta.url).href;
const GradientVideo = new URL('../common/video/gradient-video.mp4', import.meta.url).href;

function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const skillsRef = useRef(null);
  const statsRef = useRef(null);
  const philosophyRef = useRef(null);
  const videoRef = useRef(null);
  
  // Detectar preferências de dispositivo para reduzir efeitos
  const deviceCaps = detectDeviceCapability();
  const reducedMotion = deviceCaps.shouldUseReducedEffects;
  
  // Skills data - memoizado para evitar recriação
  const skills = [
    { name: "Figma", icon: faFigma, level: 90, description: "Design system creation, prototyping, and UI design" },
    { name: "React", icon: faReact, level: 90, description: "Component architecture, hooks, state management" },
    { name: "JavaScript", icon: faJs, level: 85, description: "ES6+, async programming, DOM manipulation" },
    { name: "HTML5", icon: faHtml5, level: 95, description: "Semantic markup, accessibility, web standards" },
    { name: "CSS3", icon: faCss3Alt, level: 90, description: "Flexbox, Grid, animations, responsive design" },
    { name: "Vue", icon: faVuejs, level: 80, description: "Vue components, Vue Router, Vuex" },
    { name: "Framer", icon: faLayerGroup, level: 85, description: "Interactive prototyping, animation, and design" },
    { name: "AI", icon: faBrain, level: 80, description: "AI tools integration, prompt engineering, generative design" },
  ];

  // Otimização 1: Carregamento eficiente de vídeo
  useEffect(() => {
    if (videoRef.current && !reducedMotion) {
      // Carregar vídeo somente quando visível
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(err => {
              console.warn("Auto-play was prevented:", err);
            });
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(videoRef.current);
      return () => observer.disconnect();
    }
  }, [reducedMotion]);

  // Otimização 2: Intersection Observer otimizado
  useEffect(() => {
    if (reducedMotion) {
      // Para dispositivos com preferência por movimento reduzido, mostrar tudo de uma vez
      setIsVisible(true);
      if (skillsRef.current) {
        const skillBars = skillsRef.current.querySelectorAll(`.${styles.progressBar}`);
        skillBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-width');
          bar.style.width = targetWidth;
        });
      }
      return;
    }
    
    // Observer principal para animações de entrada com otimização de performance
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Usar requestAnimationFrame para melhor sincronização com o ciclo de renderização
            requestAnimationFrame(() => {
              if (entry.target.classList.contains(styles.progressBar)) {
                const targetWidth = entry.target.getAttribute('data-width');
                entry.target.style.width = targetWidth;
              } else {
                entry.target.classList.add(styles.animate);
              }
            });
            
            // Parar de observar após animar
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px' // Começar animação um pouco antes do elemento entrar na viewport
      }
    );

    // Animação container principal
    if (containerRef.current) {
      setIsVisible(true);
    }

    // Observar barras de progresso
    if (skillsRef.current) {
      // Aplicar hardware acceleration aos elementos
      const skillItems = skillsRef.current.querySelectorAll(`.${styles.skill}`);
      skillItems.forEach((item, index) => {
        // Escalonar a ordem de animação para evitar jank
        item.style.setProperty('--animation-order', index);
        item.style.transform = 'translateZ(0)';
        item.style.willChange = 'opacity, transform';
        observer.observe(item);
      });
      
      const skillBars = skillsRef.current.querySelectorAll(`.${styles.progressBar}`);
      skillBars.forEach(bar => {
        bar.style.willChange = 'width';
        bar.style.transform = 'translateZ(0)';
        observer.observe(bar);
      });
    }

    // Observar estatísticas
    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll(`.${styles.statItem}`);
      statItems.forEach((item, index) => {
        item.style.setProperty('--animation-order', index);
        item.style.transform = 'translateZ(0)';
        item.style.willChange = 'opacity, transform';
        observer.observe(item);
      });
    }
    
    // Observar filosofia
    if (philosophyRef.current) {
      const philosophyItems = philosophyRef.current.querySelectorAll(`.${styles.philosophyItem}`);
      philosophyItems.forEach((item, index) => {
        item.style.setProperty('--animation-order', index);
        item.style.transform = 'translateZ(0)';
        item.style.willChange = 'opacity, transform';
        observer.observe(item);
      });
    }

    return () => observer.disconnect();
  }, [reducedMotion]);

  // Otimização 3: Aplicar efeitos de parallax leves com throttling
  useEffect(() => {
    if (reducedMotion) return;
    
    const handleScroll = throttle(() => {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const scrollPosition = window.scrollY;
          const overlayElements = containerRef.current.querySelectorAll(`.${styles.overlay}`);
          
          overlayElements.forEach(overlay => {
            overlay.style.transform = `translate3d(0, ${scrollPosition * 0.05}px, 0)`;
          });
        }
      });
    }, 50);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  return (
    <div 
      className={`${styles.aboutContainer} ${isVisible ? styles.visible : ''} ${reducedMotion ? styles.reducedMotion : ''}`}
      ref={containerRef}
    >
      {/* Background otimizado com controle de carregamento */}
      <div className={styles.backgroundVideo}>
        <picture>
          {/* Imagem estática para dispositivos móveis ou com preferência por movimento reduzido */}
          <source srcSet={GradientStatic} media="(max-width: 768px), (prefers-reduced-motion: reduce)" />
          {!reducedMotion && (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
              disableRemotePlayback
              className={styles.video}
              aria-hidden="true"
              poster={GradientStatic} // Usar imagem como poster para melhor LCP
            >
              <source src={GradientVideo} type="video/mp4" />
            </video>
          )}
        </picture>
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        {/* Seção de perfil */}
        <div className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <div className={styles.profileImage} aria-label="Profile picture">
              <img 
                loading="lazy"
                src={ProfileImage} 
                alt="Profile" 
                width="300" 
                height="300"
                className={styles.profileImage}
                decoding="async"
              />
              <span className={styles.profileImageOverlay}></span>
            </div>
            
            {/* Links sociais e CV */}
            <div className={styles.socialLinks}>
              <a 
                href="https://www.linkedin.com/in/rai-gomes-6487b2153/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn Profile"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a 
                href="https://github.com/raigomessw" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub Profile"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a 
                href={ResumeEN} 
                download 
                className={styles.resumeLink} 
                aria-label="Download Resume in English"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span className={styles.resumeText}>Resume-EN</span>
              </a>
              <a 
                href={ResumeSW} 
                download 
                className={styles.resumeLink} 
                aria-label="Download Resume in Swedish"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span className={styles.resumeText}>Resume-SW</span>
              </a>
            </div>
          </div>
          
          <div className={styles.profileInfo}>
            <h1>About me</h1>
            <h2>UI/UX Designer & Front-End Developer</h2>
            
            {/* Descrição pessoal */}
            <p>Technology has been my passion since my teenage years. After moving to Sweden, I transformed this enthusiasm into a career, beginning with programming courses that built my technical foundation.</p>

            <p>Throughout my journey into app development, I discovered another passion: UX/UI Design. I realized great applications need both flawless functionality and intuitive, appealing interfaces that delight users.</p>

            <p>This realization guided me deeper into user experience and interface design, where I combine my technical background with a user-centered approach. Through workshops, practical projects, and continuous learning, I've strengthened my skills in UX research, wireframing, prototyping, usability testing, and frontend development.</p>
            
            <p>Outside of work, I enjoy family time, socializing with friends, staying active at the gym, and gaming online. I'm constantly seeking opportunities to create functional, creative solutions that positively impact people's lives.</p>

            <blockquote className={styles.quote}>
              "I believe impactful digital experiences bridge connections and transform daily routines. At the crossroads of creativity and code, I focus on usability and accessibility, striving for designs so intuitive they become invisible, enabling users to achieve their objectives seamlessly."
            </blockquote>
            
            {/* Estatísticas com animação */}
            <div className={styles.stats} ref={statsRef}>
              <div className={styles.statItem}>
                <span className={styles.number}>5+</span>
                <span className={styles.label}>Projects<br/>Completed</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.number}>3+</span>
                <span className={styles.label}>Years of<br/>Experience</span>
              </div>
              
              {/* CTA */}
              <div className={styles.ctaContainer}>
                <a href="/contact" className={styles.ctaButton}>Get in Touch</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção de habilidades */}
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
                  <div 
                    className={styles.progressContainer} 
                    aria-label={`${skill.name} skill level: ${skill.level}%`}
                  >
                    <div 
                      className={styles.progressBar} 
                      style={{ width: reducedMotion ? `${skill.level}%` : '0%' }} 
                      data-width={`${skill.level}%`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Seção de filosofia */}
        <div className={styles.philosophySection} ref={philosophyRef}>
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