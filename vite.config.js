// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  root: 'src', // isso exige que tudo esteja dentro de 'src', inclusive o index.html
});
