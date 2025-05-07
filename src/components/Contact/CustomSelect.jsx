import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from './Contact.module.css';

const CustomSelect = ({ 
  name, 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option",
  onFocus,
  onBlur
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  
  // Encontre a label da opção selecionada
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Fecha o dropdown quando clica fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        onBlur && onBlur({ target: { name } });
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onBlur, name]);

  const handleToggle = () => {
    if (!isOpen) {
      onFocus && onFocus();
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
    onBlur && onBlur({ target: { name } });
  };

  return (
    <div className={styles.customSelectContainer} ref={selectRef}>
      <div 
        className={`${styles.customSelect} ${isOpen ? styles.open : ''}`}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`select-label-${name}`}
      >
        <div className={styles.selectedOption} id={`select-label-${name}`}>
          <span className={value ? '' : styles.placeholder}>
            {displayValue}
          </span>
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={styles.selectArrow} 
            aria-hidden="true"
          />
        </div>
        
        {isOpen && (
          <div 
            className={styles.optionsContainer}
            role="listbox"
            aria-activedescendant={value ? `option-${value}` : undefined}
          >
            {options.map((option) => (
              <div
                key={option.value}
                id={`option-${option.value}`}
                className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;