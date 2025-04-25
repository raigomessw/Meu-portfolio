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
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name is too short';
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Invalid email';
        }
        break;
      
      case 'confirmEmail':
        if (!value.trim()) {
          error = 'Confirm your email';
        } else if (value !== formData.email) {
          error = 'Emails do not match';
        }
        break;
      
      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.trim().length < 10) {
          error = 'Message is too short (min. 10 characters)';
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
      setSubmitMessage('Please correct the errors in the form.');
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
        setSubmitMessage('Your message was sent successfully! I will contact you soon.');
        
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
      setSubmitMessage('An error occurred when sending your message. Please try again.');
      console.error('Error sending form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div ref={sectionRef} className={`${styles.contactContainer} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.backgroundWrapper}>
        <div className={styles.gradientBackground}></div>
        <div className={styles.patternGrid}></div>
        <div className={styles.particles}></div>
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        <header className={`${styles.contactHeader} ${isVisible ? styles.visible : ''}`}>
          <span className={styles.preHeading}>CONTACT</span>
          <h1>Let's Work Together</h1>
          <p>I am available for new projects and opportunities. Get in touch to discuss your ideas.</p>
        </header>
        
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <div className={`${styles.infoCard} ${styles.emailCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: '0.1s' }}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <h3>Email</h3>
              <p>I respond within 24 hours on business days.</p>
              <a href="mailto:raigomessw@gmail.com" className={styles.infoLink}>
                raigomessw@gmail.com
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
              </a>
            </div>
            
            <div className={`${styles.infoCard} ${styles.phoneCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: '0.2s' }}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <h3>Phone</h3>
              <p>Available for calls during business hours.</p>
              <a href="tel:+46 076 070 05 69" className={styles.infoLink}>
                +46 (0) 760700569
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
              </a>
            </div>
            
            <div className={`${styles.infoCard} ${styles.locationCard} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: '0.3s' }}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <h3>Location</h3>
              <p>I work remotely from anywhere in the world.</p>
              <a href="https://www.google.se/maps/@59.3145508,18.0682806,14z?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                Sweden, Stockholm
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
              </a>
            </div>
            
            <div className={`${styles.socialLinks} ${isVisible ? styles.visible : ''}`} style={{ transitionDelay: '0.4s' }}>
              <h3>Social Media</h3>
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