import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  // Usamos un chequeo CSRF propio (src/middleware.js) que compara contra el header Host.
  security: { checkOrigin: false },
});
