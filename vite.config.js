import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/FinalProject-Pocket/', // This must match the repo name exactly
  plugins: [react()],
});
