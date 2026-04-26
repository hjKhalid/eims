import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl'; // <-- Add this

export default defineConfig({
  plugins: [
    react(),
    basicSsl() // <-- Add this
  ],
  server: {
    host: true, // Listen on all local IPs
    // https: true <-- (Optional, basicSsl automatically forces https)
  }
});
