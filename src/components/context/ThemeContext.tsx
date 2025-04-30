import { createContext, useContext } from 'react';

// Define os tipos de tema disponíveis
export const ThemeTypes = {
  LIGHT: 'light',
  DARK: 'dark', 
  AUTO: 'auto'
};

// Cria o contexto com interface inicial
export const ThemeContext = createContext({
  theme: ThemeTypes.DARK,
  toggleTheme: () => {},
  setTheme: (newTheme) => {}, // Corrigido para aceitar um argumento
});

// Hook personalizado para uso fácil do contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
};