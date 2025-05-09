import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faUser, 
  faEnvelope, 
  faCheckCircle,
  faComment,
  faPaperclip,
  faShield,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import CustomSelect from './CustomSelect';
import styles from './Contact.module.css';

function ContactForm({ 
  formData = {}, 
  formErrors = {}, 
  isSubmitting = false, 
  submitMessage = '',
  submitStatus = null,
  handleChange,
  handleBlur,
  handleSubmit,
  formRef,
  fileInputRef
}) {
  const [focusedField, setFocusedField] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const requiredFields = ['name', 'email', 'confirmEmail', 'message'];

  // Funções de manipulação unificadas
  const handleFocus = (field) => {
    setFocusedField(field);
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileSelected(true);
      setFileName(file.name);
    } else {
      setFileSelected(false);
      setFileName("");
    }
  };
  
  // Calculate form progress - with added safety checks
  useEffect(() => {
    if (!formData) return; // Verificação de segurança
    
    const filledFields = requiredFields.filter(field => 
      formData[field] && typeof formData[field] === 'string' && formData[field].trim() !== '');
    const progress = (filledFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [formData, requiredFields]);

  // Importante: verifique se handleChange está disponível
  const onChangeHandler = handleChange || ((e) => console.warn("onChange handler not provided"));

  return (
    <div className={styles.formContainer}>
      <h3>Skicka ett meddelande</h3>
      
      <div className={styles.progressContainer} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={formProgress}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${formProgress}%` }}
        >
          {formProgress === 100 && (
            <span className={styles.progressComplete}>
              <FontAwesomeIcon icon={faCheckCircle} /> Redo att skicka
            </span>
          )}
        </div>
      </div>

      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className={styles.form}
        name="contact"
        method="POST" 
        data-netlify="true"
        netlify-honeypot="bot-field"
        encType="multipart/form-data"
        noValidate
      >
        {/* Campos Netlify necessários */}
        <input type="hidden" name="form-name" value="contact" />
        
        {/* Campo honeypot para prevenção de spam */}
        <p style={{ display: 'none' }}>
          <label>
            Fyll inte i detta om du är människa: <input name="bot-field" />
          </label>
        </p>
        
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${focusedField === 'name' ? styles.focused : ''}`}>
            <label htmlFor="name" className={styles.label}>
              <FontAwesomeIcon icon={faUser} className={styles.labelIcon} /> Ditt namn
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={onChangeHandler}
              onBlur={handleBlur}
              onFocus={() => handleFocus('name')}
              className={formErrors.name ? `${styles.input} ${styles.inputError}` : styles.input}
              placeholder="Ange ditt fullständiga namn"
              required
            />
            {formErrors.name && (
              <span className={styles.errorMessage}>
                <FontAwesomeIcon icon={faExclamationCircle} /> {formErrors.name}
              </span>
            )}
          </div>
          
          <div className={`${styles.formGroup} ${focusedField === 'email' ? styles.focused : ''}`}>
            <label htmlFor="email" className={styles.label}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.labelIcon} /> E-post
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={onChangeHandler}
              onBlur={handleBlur}
              onFocus={() => handleFocus('email')}
              className={formErrors.email ? `${styles.input} ${styles.inputError}` : styles.input}
              placeholder="dinepost@exempel.com"
              required
            />
            {formErrors.email && (
              <span className={styles.errorMessage}>
                <FontAwesomeIcon icon={faExclamationCircle} /> {formErrors.email}
              </span>
            )}
          </div>
        </div>
        
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${focusedField === 'confirmEmail' ? styles.focused : ''}`}>
            <label htmlFor="confirmEmail" className={styles.label}>
              <FontAwesomeIcon icon={faCheckCircle} className={styles.labelIcon} /> Bekräfta e-post
            </label>
            <input
              type="email"
              id="confirmEmail"
              name="confirmEmail"
              value={formData.confirmEmail || ''}
              onChange={onChangeHandler}
              onBlur={handleBlur}
              onFocus={() => handleFocus('confirmEmail')}
              className={formErrors.confirmEmail ? `${styles.input} ${styles.inputError}` : styles.input}
              placeholder="Bekräfta din e-post"
              required
            />
            {formErrors.confirmEmail && (
              <span className={styles.errorMessage}>
                <FontAwesomeIcon icon={faExclamationCircle} /> {formErrors.confirmEmail}
              </span>
            )}
          </div>
          
          <div className={`${styles.formGroup} ${focusedField === 'subject' ? styles.focused : ''}`}>
            <label className={styles.label}>
              <FontAwesomeIcon icon={faComment} className={styles.labelIcon} /> Ämne
              
              {/* CustomSelect dentro da label não precisa de htmlFor/id */}
              <CustomSelect
                name="subject"
                value={formData.subject || ''}
                onChange={onChangeHandler}
                onBlur={() => setFocusedField(null)}
                onFocus={() => handleFocus('subject')}
                placeholder="Välj ett ämne"
                options={[
                  { value: 'Project Inquiry', label: 'Projektförfrågan' },
                  { value: 'Job Opportunity', label: 'Jobbmöjlighet' },
                  { value: 'Collaboration', label: 'Samarbete' },
                  { value: 'Feedback', label: 'Feedback' },
                  { value: 'Other', label: 'Annat' }
                ]}
              />
            </label>
          </div>
        </div>
        
        <div className={`${styles.formGroup} ${styles.formMessageBlock} ${focusedField === 'message' ? styles.focused : ''}`}>
          <label htmlFor="message" className={styles.label}>
            <FontAwesomeIcon icon={faComment} className={styles.labelIcon} /> Ditt meddelande
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message || ''}
            onChange={onChangeHandler}
            onBlur={handleBlur}
            onFocus={() => handleFocus('message')}
            className={formErrors.message ? `${styles.textarea} ${styles.inputError}` : styles.textarea}
            placeholder="Skriv ditt meddelande här..."
            required
          ></textarea>
          {formErrors.message && (
            <span className={styles.errorMessage}>
              <FontAwesomeIcon icon={faExclamationCircle} /> {formErrors.message}
            </span>
          )}
        </div>
        
        <div className={styles.fileUploadContainer}>
          <label className={styles.fileUploadLabel}>
            <input 
              type="file" 
              className={styles.fileInput}
              name="attachment"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            <span className={styles.fileUploadButton}>
              <FontAwesomeIcon icon={faPaperclip} /> 
              {fileSelected ? fileName : "Bifoga fil (valfritt)"}
            </span>
            <span className={styles.fileUploadText}>Maximum: 5MB</span>
          </label>
        </div>
        
        <div className={styles.privacyNote}>
          <FontAwesomeIcon icon={faShield} />
          <span>Din information är säker och kommer aldrig att delas.</span>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={isSubmitting || formProgress < 100}
        >
          {isSubmitting ? (
            <>
              <div className={styles.loader}></div>
              <span>Skickar...</span>
            </>
          ) : (
            <>
              <span>Skicka meddelande</span>
              <FontAwesomeIcon icon={faPaperPlane} className={styles.submitIcon} />
            </>
          )}
        </button>
        
        {submitMessage && (
          <div 
            className={`${styles.feedbackMessage} ${submitStatus === 'success' ? styles.successMessage : styles.errorFeedback}`}
          >
            {submitStatus === 'success' ? (
              <FontAwesomeIcon icon={faCheckCircle} />
            ) : (
              <FontAwesomeIcon icon={faExclamationCircle} />
            )} {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default ContactForm;