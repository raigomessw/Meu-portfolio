import React from 'react';
import styles from './About.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact, faJs, faHtml5, faCss3Alt, faFigma, faVuejs, } from '@fortawesome/free-brands-svg-icons';


function AboutPage() {
  const skills = [
    { name: "Figma", icon: faFigma, level: 90 },
    { name: "React", icon: faReact, level: 90 },
    { name: "JavaScript", icon: faJs, level: 85 },
    { name: "HTML5", icon: faHtml5, level: 95 },
    { name: "CSS3", icon: faCss3Alt, level: 90 },
    { name: "Vue", icon: faVuejs, level: 80 },
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
            <h1>About me</h1>
            <h2>UI/UX Designer & Front-End Developer</h2>
            
            <p>Since I was a teenager, I have always been fascinated by technology. I kept up with the latest trends and closely followed market innovations. When I moved to Sweden, I decided it was time to turn this passion into a career.</p>

            <p>My journey began with a programming course, where I developed important technical skills. Soon after, I delved into app development. During this time, I worked on several projects and learned different programming languages. It was through creating applications that I discovered another passion: UX/UI Design.</p>

            <p>I realized that it wasn’t enough for an app to function well — it also needed to be intuitive, visually appealing, and provide an enjoyable user experience. This realization led me to explore the world of user experience and interface design more deeply, combining my technical background with a user-centered design approach.</p>
            
            <p>Throughout my learning journey, I participated in workshops, developed practical projects, and deepened my knowledge in UX research, wireframing, prototyping, usability testing, and frontend development. This has allowed me to unite two passions into one career: technology and design.</p>

            <p>When I’m not working, I enjoy spending time with my family, hanging out with friends, and keeping active by training at the gym. I’m also fascinated by computer games and, whenever possible, I like to spend the night gaming with friends online.</p>

            <p>I’m always looking for opportunities to create creative, functional solutions that positively impact people’s lives.</p>

            <h3>"I believe impactful digital experiences bridge connections and transform daily routines. At the crossroads of creativity and code, I focus on usability and accessibility, striving for designs so intuitive they become invisible, enabling users to achieve their objectives seamlessly."</h3>
            
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.number}>5+</span>
                <span className={styles.label}>Projects<br/>Completed</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.number}>3+</span>
                <span className={styles.label}>Years of<br/>Experience</span>
              </div>
              {/* This section displays the number of satisfied clients */}
              {/* <div className={styles.statItem}>
                <span className={styles.number}>30+</span>
                <span className={styles.label}>Clientes<br/>Satisfeitos</span>
              </div> */}
            </div>
          </div>
        </div>
        
        <div className={styles.skillsSection}>
          <h2>My Skills</h2>
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