// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5290',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      '/uploads': {
        target: 'http://localhost:5290',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173
//   }
// })