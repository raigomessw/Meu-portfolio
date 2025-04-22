import React, { useReducer, lazy, Suspense } from 'react';
import styles from './Contact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
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
  submitStatus: null // 'success' ou 'error'
};

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value
        }
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
        formData: initialState.formData
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
        // Simulação de uma API real - pode ser substituído por EmailJS ou outra solução
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simular sucesso
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
    <section id="contato" className={styles.contactContainer}>
      <div className={styles.backgroundWrapper}>
        <div className={styles.gradientBackground}></div>
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.contactHeader}>
          <h1>Let's Chat</h1>
          <p>Would you like to work together, or do you have any questions?</p>
        </div>
        
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard} tabIndex="0">
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
              </a>
            </div>
            
            <div className={styles.infoCard} tabIndex="0">
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
              </div>
              <h3>Telefone</h3>
              <p>+46 (0) 76076-0569</p>
              <a 
                href="tel:+460760700569" 
                className={styles.infoLink}
                aria-label="Call to +46 (0) 76076-0569 on mobile"
              >
                Call Now
              </a>
            </div>
            
            <div className={styles.infoCard} tabIndex="0">
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
              </a>
            </div>
            
            <div className={styles.socialLinks}>
              <a 
                href="https://www.linkedin.com/in/rai-gomes-6487b2153/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Perfil in LinkedIn"
                className={styles.socialLink}
              >
                <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
              </a>
              <a 
                href="https://github.com/raigomessw" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Perfil in GitHub"
                className={styles.socialLink}
              >
                <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
              </a>
              <a 
                href="https://www.instagram.com/raaigms/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Perfil in Instagram"
                className={styles.socialLink}
              >
                <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
              </a>
            </div>
          </div>
          
          <div className={styles.contactForm}>
            <Suspense fallback={
              <div className={styles.loadingForm}>
                <span className={styles.loader}></span>
                <span>Carregando formulário...</span>
              </div>
            }>
              <ContactFormLazy 
                formData={state.formData}
                formErrors={state.formErrors}
                isSubmitting={state.isSubmitting}
                submitMessage={state.submitMessage}
                submitStatus={state.submitStatus}
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;