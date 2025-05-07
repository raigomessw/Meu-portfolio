import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faPhone, 
  faLocationDot, 
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

import {
  faGithub,
  faLinkedin,
  faInstagram
} from '@fortawesome/free-brands-svg-icons';
import ContactForm from './ContactForm';
import styles from './Contact.module.css';

function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Adicionando referência para o input de arquivo
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const sectionRef = useRef(null);
  
  // Detectar quando seção está visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Validar campo individual
  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'name':
        if (!value.trim()) {
          error = 'Namn krävs';
        } else if (value.trim().length < 2) {
          error = 'Namnet är för kort';
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          error = 'E-post krävs';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Ogiltig e-postadress';
        }
        break;
      
      case 'confirmEmail':
        if (!value.trim()) {
          error = 'Bekräfta din e-post';
        } else if (value !== formData.email) {
          error = 'E-postadresserna matchar inte';
        }
        break;
      
      case 'message':
        if (!value.trim()) {
          error = 'Meddelande krävs';
        } else if (value.trim().length < 10) {
          error = 'Meddelandet är för kort (min. 10 tecken)';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };
  
  // Gerenciar mudança nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Validar ao perder foco
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  // Validar formulário completo
  const validateForm = () => {
    const errors = {};
    
    Object.keys(formData).forEach(key => {
      if (key === 'subject') return; // Subject é opcional
      
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Lidar com envio do formulário - MODIFICADO PARA NETLIFY
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      setSubmitMessage('Var god rätta felen i formuläret.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Criar FormData a partir do formulário para envio ao Netlify
      const formDataObj = new FormData(formRef.current);
      
      // Garantir que o nome do formulário seja passado
      formDataObj.append('form-name', 'contact');
      
      // Enviar para o endpoint do Netlify
      const response = await fetch('/', {
        method: 'POST',
        body: formDataObj,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        // Sucesso
        setSubmitStatus('success');
        setSubmitMessage('Ditt meddelande har skickats! Jag återkommer snart.');
        
        // Limpar o formulário após envio bem-sucedido
        setFormData({
          name: '',
          email: '',
          confirmEmail: '',
          subject: '',
          message: ''
        });
        
        // Limpar o campo de arquivo se houver
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      // Erro
      setSubmitStatus('error');
      setSubmitMessage('Ett fel uppstod när ditt meddelande skickades. Försök igen senare.');
      console.error('Error sending form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div ref={sectionRef} className={`${styles.contactContainer} ${styles.contactComponent} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.backgroundWrapper}>
        <div className={styles.gradientBackground}></div>
        <div className={styles.patternGrid}></div>
        <div className={styles.particles}></div>
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        <header className={`${styles.contactHeader} ${isVisible ? styles.visible : ''}`}>
          <span className={styles.preHeading}>KONTAKT</span>
          <h1>Låt oss arbeta tillsammans</h1>
          <p>Jag är tillgänglig för nya projekt och möjligheter. Hör av dig för att diskutera dina idéer.</p>
        </header>
        
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <div className={`${styles.infoCard} ${styles.emailCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: '0.1s' }}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <h3>E-post</h3>
              <p>Jag svarar inom 24 timmar på vardagar.</p>
              <a href="mailto:raigomessw@gmail.com" className={styles.infoLink}>
                raigomessw@gmail.com
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
              </a>
            </div>
            
            <div className={`${styles.infoCard} ${styles.phoneCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: '0.2s' }}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <h3>Telefon</h3>
              <p>Tillgänglig för samtal under kontorstid.</p>
              <a href="tel:+46 076 070 05 69" className={styles.infoLink}>
                +46 (0) 760700569
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
              </a>
            </div>
            
            <div className={`${styles.infoCard} ${styles.locationCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: '0.3s' }}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <h3>Plats</h3>
              <p>Jag arbetar på distans från var som helst i världen.</p>
              <a href="https://www.google.se/maps/@59.3145508,18.0682806,14z?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                Sverige, Stockholm
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
              </a>
            </div>
            
            <div className={`${styles.socialLinks} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: '0.4s' }}>
              <h3>Sociala Medier</h3>
              <div className={styles.socialIconsContainer}>
                <a href="https://www.linkedin.com/in/rai-gomes-6487b2153/" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.linkedinLink}`}>
                  <FontAwesomeIcon icon={faLinkedin} />
                  <span className={styles.socialTooltip}>LinkedIn</span>
                </a>
                
                <a href="https://github.com/raigomessw" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.githubLink}`}>
                  <FontAwesomeIcon icon={faGithub} />
                  <span className={styles.socialTooltip}>GitHub</span>
                </a>
                
                <a href="https://instagram.com/raaigms" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.instagramLink}`}>
                  <FontAwesomeIcon icon={faInstagram} />
                  <span className={styles.socialTooltip}>Instagram</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className={`${styles.contactForm} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.formContainer}>
              {/* Adicionando fileInputRef como prop */}
              <ContactForm 
                formData={formData}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
                submitMessage={submitMessage}
                submitStatus={submitStatus}
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
                formRef={formRef}
                fileInputRef={fileInputRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;