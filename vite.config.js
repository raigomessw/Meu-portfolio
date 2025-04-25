vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import WindiCSS from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    WindiCSS(),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [
        // pacotes externos que podem estar causando problemas
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          styling: ['framer-motion']
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    exclude: [],
    esbuildOptions: {
      target: 'es2020'
    }
  }
});