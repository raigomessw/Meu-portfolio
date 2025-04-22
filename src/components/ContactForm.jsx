import React from 'react';
import styles from './Contact.module.css';

function ContactForm({ 
  formData, 
  formErrors, 
  isSubmitting, 
  submitMessage,
  submitStatus,
  handleChange,
  handleBlur,
  handleSubmit 
}) {
  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Nome</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={formErrors.name ? "true" : "false"}
          aria-describedby={formErrors.name ? "name-error" : undefined}
          className={formErrors.name ? `${styles.input} ${styles.inputError}` : styles.input}
          placeholder="Your full name"
          required
        />
        {formErrors.name && (
          <span 
            id="name-error" 
            className={styles.errorMessage} 
            aria-live="polite"
          >
            {formErrors.name}
          </span>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={formErrors.email ? "true" : "false"}
          aria-describedby={formErrors.email ? "email-error" : undefined}
          className={formErrors.email ? `${styles.input} ${styles.inputError}` : styles.input}
          placeholder="your.email@exemple.com"
          required
        />
        {formErrors.email && (
          <span 
            id="email-error" 
            className={styles.errorMessage} 
            aria-live="polite"
          >
            {formErrors.email}
          </span>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="confirmEmail" className={styles.label}>Confirm Email</label>
        <input
          type="email"
          id="confirmEmail"
          name="confirmEmail"
          value={formData.confirmEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={formErrors.confirmEmail ? "true" : "false"}
          aria-describedby={formErrors.confirmEmail ? "confirm-email-error" : undefined}
          className={formErrors.confirmEmail ? `${styles.input} ${styles.inputError}` : styles.input}
          placeholder="Confirm your Email"
          required
        />
        {formErrors.confirmEmail && (
          <span 
            id="confirm-email-error" 
            className={styles.errorMessage} 
            aria-live="polite"
          >
            {formErrors.confirmEmail}
          </span>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="subject" className={styles.label}>Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={styles.input}
          placeholder="Message subject (optional)"
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={formErrors.message ? "true" : "false"}
          aria-describedby={formErrors.message ? "message-error" : undefined}
          className={formErrors.message ? `${styles.textarea} ${styles.inputError}` : styles.textarea}
          placeholder="Write your message here..."
          required
        ></textarea>
        {formErrors.message && (
          <span 
            id="message-error" 
            className={styles.errorMessage} 
            aria-live="polite"
          >
            {formErrors.message}
          </span>
        )}
      </div>
      
      <button 
        type="submit" 
        className={styles.submitButton} 
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className={styles.loader}></span>
            <span>Sending...</span>
          </>
        ) : 'Send Message'}
      </button>
      
      {submitMessage && (
        <div 
          className={`${styles.feedbackMessage} ${submitStatus === 'success' ? styles.successMessage : styles.errorMessage}`}
          role="alert"
          aria-live="assertive"
        >
          {submitMessage}
        </div>
      )}
    </form>
  );
}

export default ContactForm;