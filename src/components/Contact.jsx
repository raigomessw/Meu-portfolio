import React, { useState } from 'react';
import styles from './Contact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validate = () => {
    let errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'O nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'A mensagem é obrigatória';
    }
    
    return errors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      setFormErrors({});
      
      // Simulando envio do formulário
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitMessage('Mensagem enviada com sucesso! Em breve entrarei em contato.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Limpar mensagem de sucesso após 5 segundos
        setTimeout(() => {
          setSubmitMessage('');
        }, 5000);
      }, 1500);
      
    } else {
      setFormErrors(errors);
    }
  };
  
  return (
    <div className={styles.contactContainer}>
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
        <div className={styles.contactHeader}>
          <h1>Vamos Conversar</h1>
          <p>Quer trabalhar juntos ou tem alguma pergunta?</p>
        </div>
        
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <h3>Email</h3>
              <p>seuemail@email.com</p>
              <a href="mailto:seuemail@email.com" className={styles.infoLink}>Enviar Email</a>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <h3>Telefone</h3>
              <p>+55 (11) 98765-4321</p>
              <a href="tel:+5511987654321" className={styles.infoLink}>Ligar Agora</a>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <h3>Localização</h3>
              <p>São Paulo, Brasil</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className={styles.infoLink}>Ver no Mapa</a>
            </div>
            
            <div className={styles.socialLinks}>
              <a href="https://www.linkedin.com/in/seunome/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="https://github.com/seunome/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a href="https://www.instagram.com/seunome/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
          
          <div className={styles.contactForm}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={formErrors.name ? styles.inputError : ''}
                />
                {formErrors.name && <span className={styles.errorMessage}>{formErrors.name}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={formErrors.email ? styles.inputError : ''}
                />
                {formErrors.email && <span className={styles.errorMessage}>{formErrors.email}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="subject">Assunto</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message">Mensagem</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={formErrors.message ? styles.inputError : ''}
                ></textarea>
                {formErrors.message && <span className={styles.errorMessage}>{formErrors.message}</span>}
              </div>
              
              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
              
              {submitMessage && <div className={styles.successMessage}>{submitMessage}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;