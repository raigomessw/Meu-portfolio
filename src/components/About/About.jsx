import React, { useState, useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaFileAlt } from 'react-icons/fa';
import { MdDesignServices, MdDevices, MdSpeed, MdAccessibility } from 'react-icons/md';
import { SiJavascript, SiReact, SiNodedotjs } from 'react-icons/si';
import styles from './About.module.css';
import profileImage from '../common/Image/profile.jpeg';
import CVsv from '../../../public/resume/Rai Gomes CV SV.pdf';
import CVeng from '../../../public/resume/Rai Gomes CV ENG.pdf';

const About = () => {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const statsRef = useRef(null);
  const philosophyRef = useRef(null);
  const statItems = useRef([]);
  const skills = useRef([]);
  const philosophyItems = useRef([]);

  // Verificar preferência por movimento reduzido
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);
    
    // Observer para animação de entrada
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Animar elementos na visualização
  useEffect(() => {
    if (reducedMotion) return;
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };
    
    const createIntersectionObserver = (elements, className) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(className);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      elements.forEach((el) => {
        if (el) observer.observe(el);
      });
      
      return observer;
    };
    
    // Observadores para cada tipo de elemento
    const statObserver = createIntersectionObserver(statItems.current, styles.animate);
    const skillObserver = createIntersectionObserver(skills.current, styles.animate);
    const philosophyObserver = createIntersectionObserver(philosophyItems.current, styles.animate);
    
    return () => {
      statObserver.disconnect();
      skillObserver.disconnect();
      philosophyObserver.disconnect();
    };
  }, [reducedMotion]);

  // Animar barras de progresso
  useEffect(() => {
    if (reducedMotion) return;
    
    const progressBars = document.querySelectorAll(`.${styles.progressBar}`);
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const percentage = target.getAttribute('data-percentage');
          
          // Pequeno atraso para melhor efeito visual
          setTimeout(() => {
            target.style.width = `${percentage}%`;
          }, 200);
          
          observer.unobserve(target);
        }
      });
    }, observerOptions);
    
    progressBars.forEach((bar) => {
      observer.observe(bar);
    });
    
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section 
      ref={aboutRef} 
      className={`${styles.aboutContainer} ${visible ? styles.visible : ''} ${reducedMotion ? styles.reducedMotion : ''}`}
      id="about"
    >
      {/* Background escandinavo moderno */}
      <div className={styles.scandinavianBackground}>
        <div className={styles.patternLayer}></div>
        <div className={styles.minimalLayer}></div>
        <div className={styles.dotPattern}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <div className={styles.profileImage}>
              <img src={profileImage} alt="Profilbild" loading="lazy" />
              <div className={styles.profileImageOverlay}></div>
              <div className={styles.profileImageGlow}></div>
            </div>
            
            <div className={styles.socialLinks}>
              <a href="https://github.com/raigomessw" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/in/rai-gomes-6487b2153/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href={CVsv} target="_blank" rel="noopener noreferrer" className={styles.resumeLink} aria-label="CV SV">
                <FaFileAlt />
                <span className={styles.resumeText}>CV SV</span>
              </a>
              <a href={CVeng} target="_blank" rel="noopener noreferrer" className={styles.resumeLink} aria-label="CV ENG">
                <FaFileAlt />
                <span className={styles.resumeText}>CV ENG</span>
              </a>
            </div>
          </div>
          
          <div className={styles.profileInfo}>
  <h1>Rai Gomes</h1>
  <h2>Fullstack-utvecklare & UX/UI-designer</h2>
  
  <p>
    Sedan jag var tonåring har jag alltid varit fascinerad av teknologi. Jag höll mig uppdaterad med de senaste trenderna och följde marknadsinnovationer noga. När jag flyttade till Sverige bestämde jag mig för att det var dags att omvandla den här passionen till en karriär.
  </p>
  
  <p>
    Min resa började med en programmeringskurs, där jag utvecklade viktiga tekniska färdigheter. Strax därefter fördjupade jag mig i apputveckling. Under den här tiden arbetade jag med flera projekt och lärde mig olika programmeringsspråk. Det var genom att skapa applikationer som jag upptäckte en annan passion: UX/UI-design.
  </p>
  
  <p>
    Jag insåg att det inte räckte med att en applikation fungerade bra – den behövde också vara intuitiv, visuellt tilltalande och erbjuda en angenäm användarupplevelse. Denna insikt ledde mig till att utforska världen av användarupplevelse och gränssnittsdesign djupare, och kombinera min tekniska bakgrund med ett användarcentrerat designperspektiv.
  </p>
  
  <p>
    Under min inlärningsresa deltog jag i workshops, utvecklade praktiska projekt och fördjupade mina kunskaper inom UX-research, wireframing, prototyputveckling, användbarhetstester och frontend-utveckling. Detta har gjort det möjligt för mig att förena två passioner till en karriär: teknologi och design.
  </p>
  
  <p>
    När jag inte arbetar tycker jag om att tillbringa tid med min familj, umgås med vänner och hålla mig aktiv genom att träna på gymmet. Jag är också fascinerad av datorspel och, när det är möjligt, gillar jag att spela spel online med vänner på kvällarna.
  </p>

  <div className={styles.quote}>
    "Jag tror att fantastiska digitala upplevelser har kraften att koppla samman människor och förändra vardagslivet."
  </div>
  
  <div ref={statsRef} className={styles.stats}>
    {[
      { number: "4+", label: "Års erfarenhet", order: 0 },
      { number: "8+", label: "Avslutade projekt", order: 1 },
      { number: "5+", label: "Behärskade teknologier", order: 2 }
    ].map((stat, index) => (
      <div 
        key={index}
        className={styles.statItem}
        ref={el => statItems.current[index] = el}
        style={{ "--animation-order": stat.order }}
      >
        <span className={styles.number}>{stat.number}</span>
        <span className={styles.label}>{stat.label}</span>
      </div>
    ))}
  </div>
  
  <div className={styles.ctaContainer}>
    <a href="/contact" className={styles.ctaButton}>Kontakta mig</a>
  </div>
</div>
        </div>
        
        <div ref={skillsRef} className={styles.skillsSection}>
          <h2>Mina färdigheter</h2>
          
          <div className={styles.skillsContainer}>
            {[
              {
                icon: <SiReact />,
                title: "React & Next.js",
                description: "Utveckling av moderna gränssnitt med React, React Native och Next.js",
                percentage: 85,
                order: 0
              },
              {
                icon: <SiJavascript />,
                title: "JavaScript & TypeScript",
                description: "Avancerad erfarenhet med ES6+, TypeScript och moderna ramverk",
                percentage: 85,
                order: 1
              },
              {
                icon: <SiNodedotjs />,
                title: "Node.js & Backend",
                description: "Utveckling av RESTful APIs, GraphQL och skalbara tjänster",
                percentage: 85,
                order: 2
              },
              {
                icon: <MdDesignServices />,
                title: "UI/UX Design",
                description: "Design av intuitiva gränssnitt med fokus på användarupplevelse",
                percentage: 95,
                order: 3
              },
              {
                icon: <MdDevices />,
                title: "Responsiv utveckling",
                description: "Skapande av gränssnitt som fungerar perfekt på alla enheter",
                percentage: 95,
                order: 4
              },
              {
                icon: <MdAccessibility />,
                title: "Tillgänglighet",
                description: "Implementering av WCAG-riktlinjer för inkluderande design",
                percentage: 85,
                order: 5
              }
            ].map((skill, index) => (
              <div 
                key={index}
                className={styles.skill}
                ref={el => skills.current[index] = el}
                style={{ "--animation-order": skill.order }}
              >
                <div className={styles.skillIconContainer}>
                  {skill.icon}
                </div>
                <div className={styles.skillInfo}>
                  <h3>{skill.title}</h3>
                  <p className={styles.skillDescription}>{skill.description}</p>
                  <div className={styles.progressContainer}>
                    <div 
                      className={styles.progressBar}
                      data-percentage={skill.percentage}
                      style={reducedMotion ? { width: `${skill.percentage}%` } : {}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div ref={philosophyRef} className={styles.philosophySection}>
          <h2>Min arbetsfilosofi</h2>
          
          <div className={styles.philosophyItems}>
            {[
              {
                title: "Tillgänglighet först",
                description: "Jag skapar applikationer som kan användas av alla, oavsett deras förmågor eller begränsningar.",
                order: 0
              },
              {
                title: "Ren och skalbar kod",
                description: "Jag utvecklar välstrukturerade lösningar som är lätta att underhålla och är förberedda för framtida tillväxt.",
                order: 1
              },
              {
                title: "Användarcentrerad",
                description: "Jag designar varje gränssnitt med slutanvändarnas verkliga behov och mål i åtanke.",
                order: 2
              }
            ].map((item, index) => (
              <div 
                key={index}
                className={styles.philosophyItem}
                ref={el => philosophyItems.current[index] = el}
                style={{ "--animation-order": item.order }}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;