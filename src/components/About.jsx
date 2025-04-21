import React from 'react';
import styles from './About.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact, faJs, faHtml5, faCss3Alt, faFigma } from '@fortawesome/free-brands-svg-icons';


function AboutPage() {
  const skills = [
    { name: "React", icon: faReact, level: 90 },
    { name: "JavaScript", icon: faJs, level: 85 },
    { name: "HTML5", icon: faHtml5, level: 95 },
    { name: "CSS3", icon: faCss3Alt, level: 90 },
    { name: "Figma", icon: faFigma, level: 80 }
  ];

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.backgroundVideo}>
        <video
          autoPlay
          loop
          muted
          className={styles.video}
        >
          <source src="/src/assets/gradient-video.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <div className={styles.profileImage}>
              {/* Placeholder for profile image */}
              <div className={styles.imagePlaceholder}>R</div>
            </div>
          </div>
          <div className={styles.profileInfo}>
            <h1>Sobre Mim</h1>
            <h2>UI/UX Designer & Front-End Developer</h2>
            
            <p>Olá! Sou Rai Gomes, um designer e desenvolvedor apaixonado por criar experiências digitais que combinam estética e funcionalidade. Com mais de 5 anos de experiência no setor digital, transformo ideias complexas em soluções elegantes e intuitivas.</p>
            
            <p>Minha jornada começou com design de interfaces, evoluindo para desenvolvimento front-end completo. Trabalho na interseção entre criatividade e código, com foco em usabilidade e acessibilidade. Acredito que o melhor design é aquele que desaparece, permitindo que os usuários alcancem seus objetivos sem obstáculos.</p>
            
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.number}>50+</span>
                <span className={styles.label}>Projetos<br/>Concluídos</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.number}>5+</span>
                <span className={styles.label}>Anos de<br/>Experiência</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.number}>30+</span>
                <span className={styles.label}>Clientes<br/>Satisfeitos</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.skillsSection}>
          <h2>Minhas Habilidades</h2>
          <div className={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <div key={index} className={styles.skill}>
                <div className={styles.skillIconContainer}>
                  <FontAwesomeIcon icon={skill.icon} className={styles.skillIcon} />
                </div>
                <div className={styles.skillInfo}>
                  <h3>{skill.name}</h3>
                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.philosophySection}>
          <h2>Minha Filosofia de Design</h2>
          <div className={styles.philosophyItems}>
            <div className={styles.philosophyItem}>
              <h3>Centrado no Usuário</h3>
              <p>Crio soluções que atendem às necessidades reais das pessoas, com base em pesquisa e empatia.</p>
            </div>
            <div className={styles.philosophyItem}>
              <h3>Minimalismo Funcional</h3>
              <p>Acredito em designs limpos que removem o desnecessário e destacam o essencial.</p>
            </div>
            <div className={styles.philosophyItem}>
              <h3>Acessibilidade para Todos</h3>
              <p>Comprometo-me a criar experiências digitais que sejam acessíveis para pessoas de todas as habilidades.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;