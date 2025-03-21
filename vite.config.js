import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Ensures it listens on all network interfaces
    port: 5173, // Default Vite port
    strictPort: true, // Prevents it from switching ports automatically
    allowedHosts: [
      'localhost', // Always allow localhost
      '5f8293d1-d311-43b8-ace8-d7b2a61cb2ea-00-1rgzjaygu52q7.spock.replit.dev' // Add your Replit URL here
    ]
  }
});
