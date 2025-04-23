import React, { useReducer, useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLocationDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';
import ContactForm from './ContactForm';
import styles from './Contact.module.css';

// Reducer para gerenciar estado do formulário
const initialState = {
  formData: {
    name: '',
    email: '',
    confirmEmail: '',
    subject: '',
    message: ''
  },
  formErrors: {},
  isSubmitting: false,
  submitMessage: '',
  submitStatus: null, // 'success' ou 'error'
  formTouched: false
};

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value
        },
        formTouched: true
      };
    
    case 'VALIDATE_FIELD':
      const fieldErrors = validateField(action.field, state.formData);
      return {
        ...state,
        formErrors: {
          ...state.formErrors,
          [action.field]: fieldErrors[action.field]
        }
      };
    
    case 'SET_FORM_ERRORS':
      return {
        ...state,
        formErrors: action.errors
      };
    
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        submitMessage: '',
        submitStatus: null
      };
    
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        submitMessage: action.message,
        submitStatus: 'success',
        formData: initialState.formData,
        formErrors: {},
        formTouched: false
      };
    
    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
        submitMessage: action.message,
        submitStatus: 'error'
      };
    
    case 'RESET_SUBMISSION':
      return {
        ...state,
        submitMessage: '',
        submitStatus: null
      };
    
    default:
      return state;
  }
}

function validateField(fieldName, formData) {
  let errors = {};
  
  switch (fieldName) {
    case 'name':
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
      }
      break;
    
    case 'email':
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      break;
    
    case 'confirmEmail':
      if (!formData.confirmEmail.trim()) {
        errors.confirmEmail = 'Please confirm your email';
      } else if (formData.confirmEmail !== formData.email) {
        errors.confirmEmail = 'Emails do not match';
      }
      break;
    
    case 'message':
      if (!formData.message.trim()) {
        errors.message = 'Message is required';
      } else if (formData.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters';
      }
      break;
    
    default:
      break;
  }
  
  return errors;
}

function validateForm(formData) {
  let errors = {};
  
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.confirmEmail.trim()) {
    errors.confirmEmail = 'Please confirm your email';
  } else if (formData.confirmEmail !== formData.email) {
    errors.confirmEmail = 'Emails do not match';
  }
  
  if (!formData.message.trim()) {
    errors.message = 'Message is required';
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  
  return errors;
}

function ContactPage() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const formRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Referências para animações
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
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
  
  useEffect(() => {
    const animateElements = () => {
      if (isVisible) {
        const cards = document.querySelectorAll(`.${styles.infoCard}, .${styles.socialLinks}, .${styles.contactForm}`);
        
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add(styles.visible);
          }, 200 * index);
        });
      }
    };
    
    animateElements();
  }, [isVisible]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', field: name, value });
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    dispatch({ type: 'VALIDATE_FIELD', field: name });
  };
  
  // Manipulador de envio para Netlify Forms
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(state.formData);
    
    if (Object.keys(errors).length === 0) {
      dispatch({ type: 'SUBMIT_START' });
      
      try {
        console.log("Starting Netlify form submission...");
        
        // Preparar os dados para envio via Netlify Forms
        const formData = new FormData();
        formData.append('form-name', 'portfolio-contact');
        formData.append('name', state.formData.name);
        formData.append('email', state.formData.email);
        formData.append('confirmEmail', state.formData.confirmEmail);
        formData.append('subject', state.formData.subject || 'New contact from portfolio');
        formData.append('message', state.formData.message);
        
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString()
        });
        
        if (response.ok) {
          console.log("Form submitted successfully to Netlify");
          
          dispatch({ 
            type: 'SUBMIT_SUCCESS', 
            message: 'Your message has been sent successfully! I will get back to you soon.'
          });
          
          // Clear success message after 8 seconds
          setTimeout(() => {
            dispatch({ type: 'RESET_SUBMISSION' });
          }, 8000);
        } else {
          throw new Error(`Form submission failed with status: ${response.status}`);
        }
        
      } catch (error) {
        console.error("Form submission error:", error);
        
        dispatch({ 
          type: 'SUBMIT_ERROR', 
          message: 'Failed to send your message. Please try again later or contact me directly via email.'
        });
      }
    } else {
      dispatch({ type: 'SET_FORM_ERRORS', errors });
    }
  };
  
  return (
    <section 
      id="contact" 
      className={`${styles.contactContainer} ${isVisible ? styles.visible : ''}`} 
      ref={sectionRef}
    >
      <div className={styles.backgroundWrapper}>
        <div className={styles.gradientBackground}></div>
        <div className={styles.overlay}></div>
        <div className={styles.patternGrid}></div>
      </div>
      
      <div className={styles.content}>
        <div 
          className={`${styles.contactHeader} ${isVisible ? styles.visible : ''}`} 
          ref={headerRef}
        >
          <span className={styles.preHeading}>Get in Touch</span>
          <h1>Let's Create Something Amazing Together</h1>
          <p>Have a project in mind or want to explore opportunities? I'd love to hear from you!</p>
        </div>
        
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <div className={`${styles.infoCard} ${styles.emailCard}`}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
              </div>
              <h3>Email</h3>
              <p>raigomessw@gmail.com</p>
              <a 
                href="mailto:raigomessw@gmail.com" 
                className={styles.infoLink}
                aria-label="Send email to raigomessw@gmail.com"
              >
                Send Email
                <span className={styles.arrowIcon}>→</span>
              </a>
            </div>
            
            <div className={`${styles.infoCard} ${styles.phoneCard}`}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
              </div>
              <h3>Phone</h3>
              <p>+46 76076-0569</p>
              <a 
                href="tel:+460760760569" 
                className={styles.infoLink}
                aria-label="Call +46 76076-0569"
              >
                Call Now
                <span className={styles.arrowIcon}>→</span>
              </a>
            </div>
            
            <div className={`${styles.infoCard} ${styles.locationCard}`}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
              </div>
              <h3>Location</h3>
              <p>Stockholm, Sweden</p>
              <a 
                href="https://www.google.com/maps?q=Stockholm,Sweden" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.infoLink}
                aria-label="View Stockholm, Sweden on map"
              >
                View on Map
                <span className={styles.arrowIcon}>→</span>
              </a>
            </div>
            
            <div className={styles.socialLinks}>
              <h3>Connect with me</h3>
              <div className={styles.socialIconsContainer}>
                <a 
                  href="https://www.linkedin.com/in/rai-gomes-6487b2153/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Connect with me on LinkedIn"
                  className={`${styles.socialLink} ${styles.linkedinLink}`}
                >
                  <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                  <span className={styles.socialTooltip}>LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/raigomessw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Check my code on GitHub"
                  className={`${styles.socialLink} ${styles.githubLink}`}
                >
                  <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
                  <span className={styles.socialTooltip}>GitHub</span>
                </a>
                <a 
                  href="https://www.instagram.com/raaigms/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow me on Instagram"
                  className={`${styles.socialLink} ${styles.instagramLink}`}
                >
                  <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                  <span className={styles.socialTooltip}>Instagram</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className={styles.contactForm}>
            <div className={styles.formContainer}>
              <h3>Send a Message</h3>
              <form 
                ref={formRef}
                onSubmit={handleSubmit} 
                className={styles.form} 
                name="portfolio-contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
              >
                {/* Campo oculto necessário para o Netlify Forms */}
                <input type="hidden" name="form-name" value="portfolio-contact" />
                
                {/* Campo honeypot para prevenir spam */}
                <div className={styles.hiddenField} style={{ display: 'none' }}>
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={state.formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={state.formErrors.name ? "true" : "false"}
                    aria-describedby={state.formErrors.name ? "name-error" : undefined}
                    className={state.formErrors.name ? `${styles.input} ${styles.inputError}` : styles.input}
                    placeholder="Your full name"
                    required
                  />
                  {state.formErrors.name && (
                    <span 
                      id="name-error" 
                      className={styles.errorMessage} 
                      aria-live="polite"
                    >
                      {state.formErrors.name}
                    </span>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={state.formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={state.formErrors.email ? "true" : "false"}
                    aria-describedby={state.formErrors.email ? "email-error" : undefined}
                    className={state.formErrors.email ? `${styles.input} ${styles.inputError}` : styles.input}
                    placeholder="your.email@example.com"
                    required
                  />
                  {state.formErrors.email && (
                    <span 
                      id="email-error" 
                      className={styles.errorMessage} 
                      aria-live="polite"
                    >
                      {state.formErrors.email}
                    </span>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="confirmEmail" className={styles.label}>Confirm Email</label>
                  <input
                    type="email"
                    id="confirmEmail"
                    name="confirmEmail"
                    value={state.formData.confirmEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={state.formErrors.confirmEmail ? "true" : "false"}
                    aria-describedby={state.formErrors.confirmEmail ? "confirm-email-error" : undefined}
                    className={state.formErrors.confirmEmail ? `${styles.input} ${styles.inputError}` : styles.input}
                    placeholder="Confirm your email"
                    required
                  />
                  {state.formErrors.confirmEmail && (
                    <span 
                      id="confirm-email-error" 
                      className={styles.errorMessage} 
                      aria-live="polite"
                    >
                      {state.formErrors.confirmEmail}
                    </span>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>Subject (Optional)</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={state.formData.subject}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="What is this about?"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={state.formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={state.formErrors.message ? "true" : "false"}
                    aria-describedby={state.formErrors.message ? "message-error" : undefined}
                    className={state.formErrors.message ? `${styles.textarea} ${styles.inputError}` : styles.textarea}
                    placeholder="Write your message here..."
                    required
                  ></textarea>
                  {state.formErrors.message && (
                    <span 
                      id="message-error" 
                      className={styles.errorMessage} 
                      aria-live="polite"
                    >
                      {state.formErrors.message}
                    </span>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className={styles.submitButton} 
                  disabled={state.isSubmitting}
                  aria-busy={state.isSubmitting}
                >
                  {state.isSubmitting ? (
                    <>
                      <span className={styles.loader}></span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      Send Message
                      <FontAwesomeIcon icon={faPaperPlane} className={styles.submitIcon} />
                    </>
                  )}
                </button>
                
                {state.submitMessage && (
                  <div 
                    className={`${styles.feedbackMessage} ${state.submitStatus === 'success' ? styles.successMessage : styles.errorMessage}`}
                    role="alert"
                    aria-live="assertive"
                  >
                    {state.submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;