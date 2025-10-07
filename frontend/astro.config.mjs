// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      host: true, // Listens on 0.0.0.0
      fs: {
        // Needed to load fonts in dev mode
        allow: ['..']
      }
    },

    plugins: [tailwindcss()]
  }
});