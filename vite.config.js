import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // Alterado de 'terser' para 'esbuild'
    target: 'es2018'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});