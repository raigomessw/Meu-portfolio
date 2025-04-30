import React, { useEffect, useState } from 'react';
import { ThemeContext, ThemeTypes } from './ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Inicializa o tema a partir do localStorage ou preferência do sistema
  const [theme, setThemeState] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme && Object.values(ThemeTypes).includes(savedTheme as any)) {
      return savedTheme;
    }
    
    // Verifica preferência do sistema se não houver tema salvo
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return ThemeTypes.DARK;
    }
    
    return ThemeTypes.LIGHT;
  });

  // Aplica o tema ao documento HTML
  useEffect(() => {
    if (theme === ThemeTypes.AUTO) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? ThemeTypes.DARK : ThemeTypes.LIGHT);
      
      // Atualizar quando a preferência do usuário mudar
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.setAttribute('data-theme', e.matches ? ThemeTypes.DARK : ThemeTypes.LIGHT);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Função para alternar entre temas em ciclo: light -> dark -> auto -> light
  const toggleTheme = () => {
    setThemeState(prevTheme => {
      if (prevTheme === ThemeTypes.LIGHT) return ThemeTypes.DARK;
      if (prevTheme === ThemeTypes.DARK) return ThemeTypes.AUTO;
      return ThemeTypes.LIGHT;
    });
  };

  // Função para definir um tema específico
  const setTheme = (newTheme: string) => {
    if (Object.values(ThemeTypes).includes(newTheme as any)) {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
