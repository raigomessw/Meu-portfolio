// filepath: /Users/raigomes/Desktop/Portfolio/meu-portfolio/src/Hooks/useTheme.js
import { useTheme as useThemeContext } from '../components/context/ThemeContext';

/**
 * Hook para acessar e manipular o tema da aplicação
 * @returns {Object} Objeto com { theme, toggleTheme, setTheme }
 */
export default function useTheme() {
  return useThemeContext();
}

// Para compatibilidade com importação nomeada
export { useTheme };