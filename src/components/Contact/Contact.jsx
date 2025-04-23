import React, { useReducer, lazy, Suspense, useRef, useEffect } from 'react';
import styles from './Contact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLocationDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';


// Importação assíncrona do componente de formulário
const ContactFormLazy = lazy(() => import('./ContactForm'));

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
        isSubmitting: true
      };
    
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        submitMessage: action.message,
        submitStatus: 'success',
        formData: initialState.formData,
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
        errors.email = 'Invalid email';
      }
      break;
    
    case 'confirmEmail':
      if (formData.confirmEmail !== formData.email) {
        errors.confirmEmail = 'Emails do not match';
      }
      break;
    
    case 'message':
      if (!formData.message.trim()) {
        errors.message = 'Message is required';
      } else if (formData.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
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
    errors.email = 'Invalid email';
  }
  
  if (formData.confirmEmail !== formData.email) {
    errors.confirmEmail = 'Emails do not match';
  }
  
  if (!formData.message.trim()) {
    errors.message = 'Message is required';
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }
  
  return errors;
}

function ContactPage() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const formRef = useRef();
  
  // Referências para animações
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
      
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', field: name, value });
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    dispatch({ type: 'VALIDATE_FIELD', field: name });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(state.formData);
    
    if (Object.keys(errors).length === 0) {
      dispatch({ type: 'SUBMIT_START' });
      
      try {
        // EmailJS implementation
        await emailjs.sendForm(
          'service_id', // Replace with your service ID
          'template_id', // Replace with your template ID
          formRef.current,
          'i4oRO7Rw7fM9RFdbl' // Your user ID
        );
        
        dispatch({ 
          type: 'SUBMIT_SUCCESS', 
          message: 'Message sent successfully! I will contact you shortly.'
        });
        
        // Limpar mensagem de sucesso após 5 segundos
        setTimeout(() => {
          dispatch({ type: 'RESET_SUBMISSION' });
        }, 5000);
        
      } catch (error) {
        dispatch({ 
          type: 'SUBMIT_ERROR', 
          message: 'There was an error sending your message. Please try again.'
        });
      }
    } else {
      dispatch({ type: 'SET_FORM_ERRORS', errors });
    }
  };
  
  return (
    <section 
      id="contato" 
      className={styles.contactContainer} 
      ref={sectionRef}
    >
      <div className={styles.backgroundWrapper}>
        <div className={styles.gradientBackground}></div>
        <div className={styles.overlay}></div>
        <div className={styles.patternGrid}></div>
      </div>
      
      <div className={styles.content}>
        <div 
          className={styles.contactHeader} 
          ref={headerRef}
        >
          <span className={styles.preHeading}>Contact me</span>
          <h1>Let's Create Something Amazing Together</h1>
          <p>Have a project in mind or just want to chat? Drop me a message below!</p>
        </div>
        
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <div 
              className={`${styles.infoCard} ${styles.emailCard}`} 
              tabIndex="0"
              ref={(el) => (cardsRef.current[0] = el)}
            >
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
                <span className={styles.arrowIcon}>&rarr;</span>
              </a>
            </div>
            
            <div 
              className={`${styles.infoCard} ${styles.phoneCard}`} 
              tabIndex="0"
              ref={(el) => (cardsRef.current[1] = el)}
            >
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
              </div>
              <h3>Phone</h3>
              <p>+46 (0) 76076-0569</p>
              <a 
                href="tel:+460760700569" 
                className={styles.infoLink}
                aria-label="Call to +46 (0) 76076-0569 on mobile"
              >
                Call Now
                <span className={styles.arrowIcon}>&rarr;</span>
              </a>
            </div>
            
            <div 
              className={`${styles.infoCard} ${styles.locationCard}`} 
              tabIndex="0"
              ref={(el) => (cardsRef.current[2] = el)}
            >
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
              </div>
              <h3>Location</h3>
              <p>Sweden, Stockholm</p>
              <a 
                href="https://www.google.com/maps/@59.3145508,18.0682806,14z?entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.infoLink}
                aria-label="See location in Sweden, Stockholm in Google Maps"
              >
                View on Map
                <span className={styles.arrowIcon}>&rarr;</span>
              </a>
            </div>
            
            <div 
              className={styles.socialLinks}
              ref={(el) => (cardsRef.current[3] = el)}
            >
              <h3>Connect with me</h3>
              <div className={styles.socialIconsContainer}>
                <a 
                  href="https://www.linkedin.com/in/rai-gomes-6487b2153/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Profile on LinkedIn"
                  className={`${styles.socialLink} ${styles.linkedinLink}`}
                >
                  <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                  <span className={styles.socialTooltip}>LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/raigomessw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Profile on GitHub"
                  className={`${styles.socialLink} ${styles.githubLink}`}
                >
                  <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
                  <span className={styles.socialTooltip}>GitHub</span>
                </a>
                <a 
                  href="https://www.instagram.com/raaigms/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Profile on Instagram"
                  className={`${styles.socialLink} ${styles.instagramLink}`}
                >
                  <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                  <span className={styles.socialTooltip}>Instagram</span>
                </a>
              </div>
            </div>
          </div>
          
          <div 
            className={styles.contactForm}
            ref={(el) => (cardsRef.current[4] = el)}
          >
            <Suspense fallback={
              <div className={styles.loadingForm}>
                <span className={styles.loader}></span>
                <span>Loading form...</span>
              </div>
            }>
              <div className={styles.formContainer}>
                <h3>Send a Message</h3>
                <form ref={formRef} onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={state.formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={state.formErrors.name ? styles.errorInput : ''}
                      placeholder="Your name"
                    />
                    {state.formErrors.name && (
                      <span className={styles.errorMessage}>{state.formErrors.name}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={state.formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={state.formErrors.email ? styles.errorInput : ''}
                      placeholder="Your email address"
                    />
                    {state.formErrors.email && (
                      <span className={styles.errorMessage}>{state.formErrors.email}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmEmail">Confirm Email</label>
                    <input
                      type="email"
                      id="confirmEmail"
                      name="confirmEmail"
                      value={state.formData.confirmEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={state.formErrors.confirmEmail ? styles.errorInput : ''}
                      placeholder="Confirm your email address"
                    />
                    {state.formErrors.confirmEmail && (
                      <span className={styles.errorMessage}>{state.formErrors.confirmEmail}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject (Optional)</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={state.formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={state.formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={state.formErrors.message ? styles.errorInput : ''}
                      placeholder="Your message here..."
                      rows="5"
                    ></textarea>
                    {state.formErrors.message && (
                      <span className={styles.errorMessage}>{state.formErrors.message}</span>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className={styles.submitButton} 
                    disabled={state.isSubmitting}
                  >
                    {state.isSubmitting ? (
                      <>
                        <span className={styles.buttonLoader}></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <FontAwesomeIcon icon={faPaperPlane} className={styles.submitIcon} />
                      </>
                    )}
                  </button>
                  
                  {state.submitStatus && (
                    <div 
                      className={`${styles.submitFeedback} ${
                        state.submitStatus === 'success' ? styles.successMessage : styles.errorMessage
                      }`}
                    >
                      {state.submitMessage}
                    </div>
                  )}
                </form>
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;