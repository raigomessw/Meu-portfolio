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
    { name: "Figma", icon: faFigma, level: 90, description: "Designsystemskapande, prototyper och UI-design" },
    { name: "React", icon: faReact, level: 90, description: "Komponentarkitektur, hooks, tillståndshantering" },
    { name: "JavaScript", icon: faJs, level: 85, description: "ES6+, asynkron programmering, DOM-manipulation" },
    { name: "HTML5", icon: faHtml5, level: 95, description: "Semantisk markup, tillgänglighet, webbstandarder" },
    { name: "CSS3", icon: faCss3Alt, level: 90, description: "Flexbox, Grid, animationer, responsiv design" },
    { name: "Vue", icon: faVuejs, level: 80, description: "Vue-komponenter, Vue Router, Vuex" },
    { name: "Framer", icon: faLayerGroup, level: 85, description: "Interaktiva prototyper, animation och design" },
    { name: "AI", icon: faBrain, level: 80, description: "AI-verktygsintegration, prompt engineering, generativ design" },
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
            <div className={styles.profileImage} aria-label="Profilbild">
              <img 
                loading="lazy"
                src={ProfileImage} 
                alt="Profil" 
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
                aria-label="LinkedIn-profil"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a 
                href="https://github.com/raigomessw" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub-profil"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a 
                href={ResumeEN} 
                download 
                className={styles.resumeLink} 
                aria-label="Ladda ner CV på engelska"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span className={styles.resumeText}>CV-EN</span>
              </a>
              <a 
                href={ResumeSW} 
                download 
                className={styles.resumeLink} 
                aria-label="Ladda ner CV på svenska"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span className={styles.resumeText}>CV-SV</span>
              </a>
            </div>
          </div>
          
          <div className={styles.profileInfo}>
            <h1>Om mig</h1>
            <h2>UI/UX-designer och Front-End-utvecklare</h2>
            
            {/* Descrição pessoal */}
            <p>Teknik har varit min passion sedan tonåren. Efter att ha flyttat till Sverige omvandlade jag denna entusiasm till en karriär, börjande med programmeringskurser som byggde min tekniska grund.</p>

            <p>Under min resa inom apputveckling upptäckte jag en annan passion: UX/UI-design. Jag insåg att bra applikationer behöver både felfri funktionalitet och intuitiva, tilltalande gränssnitt som glädjer användare.</p>

            <p>Denna insikt vägledde mig djupare in i användarupplevelse och gränssnittsdesign, där jag kombinerar min tekniska bakgrund med ett användarcentrerat tillvägagångssätt. Genom workshops, praktiska projekt och kontinuerligt lärande har jag stärkt mina färdigheter inom UX-forskning, wireframing, prototypning, användbarhetstest och frontendutveckling.</p>
            
            <p>Utanför arbetet njuter jag av familjetid, umgänge med vänner, träning på gymmet och onlinespel. Jag söker ständigt möjligheter att skapa funktionella, kreativa lösningar som positivt påverkar människors liv.</p>

            <blockquote className={styles.quote}>
              "Jag tror att meningsfulla digitala upplevelser skapar förbindelser och förvandlar vardagsrutiner. I korsningen mellan kreativitet och kod fokuserar jag på användbarhet och tillgänglighet, och strävar efter design så intuitiv att den blir osynlig, vilket gör det möjligt för användare att uppnå sina mål sömlöst."
            </blockquote>
            
            {/* Estatísticas com animação */}
            <div className={styles.stats} ref={statsRef}>
              <div className={styles.statItem}>
                <span className={styles.number}>5+</span>
                <span className={styles.label}>Projekt<br/>Slutförda</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.number}>3+</span>
                <span className={styles.label}>År av<br/>Erfarenhet</span>
              </div>
              
              {/* CTA */}
              <div className={styles.ctaContainer}>
                <a href="/contact" className={styles.ctaButton}>Kontakta mig</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção de habilidades */}
        <div className={styles.skillsSection} id="skills">
          <h2>Mina färdigheter</h2>
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
                    aria-label={`${skill.name} färdighetsnivå: ${skill.level}%`}
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
          <h2>Min designfilosofi</h2>
          <div className={styles.philosophyItems}>
            <div className={styles.philosophyItem}>
              <h3>Användarcentrerad</h3>
              <p>Jag skapar lösningar som möter människors verkliga behov, baserat på forskning och empati.</p>
            </div>
            <div className={styles.philosophyItem}>
              <h3>Funktionell minimalism</h3>
              <p>Jag tror på ren design som tar bort det onödiga och framhäver det väsentliga.</p>
            </div>
            <div className={styles.philosophyItem}>
              <h3>Tillgänglighet för alla</h3>
              <p>Jag är engagerad i att skapa digitala upplevelser som är tillgängliga för människor med alla förmågor.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;