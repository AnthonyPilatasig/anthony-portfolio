/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const BASE = '/anthony-portfolio/';

// Visiting the base URL without its trailing slash (e.g. from an old bookmark, or typed
// from muscle memory) makes Vite's dev server show a raw "did you mean X instead?" 404
// instead of the app. This 302-redirects that one specific case to the correct URL.
const redirectBaseWithoutSlash = (): Plugin => ({
  name: 'redirect-base-without-slash',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === BASE.slice(0, -1)) {
        res.statusCode = 302;
        res.setHeader('Location', BASE);
        res.end();
        return;
      }
      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  base: BASE, // Necesario para GitHub Pages
  server: {
    open: BASE,
  },
  plugins: [
    react(),
    tailwindcss(),
    redirectBaseWithoutSlash(),
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Vite 8 / Rolldown requiere función para manualChunks
        manualChunks: (id: string) => {
          if (id.includes('node_modules/three') || id.includes('@react-three')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion-vendor';
          }
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'i18n-vendor';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
