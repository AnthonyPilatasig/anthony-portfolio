/// <reference types="vitest" />
import path from 'node:path'
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
    headers: {
      // ─── WebAssembly (mkxp-z) requires these ───────────────────────────
      'Content-Security-Policy': [
        "default-src * 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' data: blob:",
        "script-src * 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' data: blob:",
        "style-src * 'unsafe-inline'",
        "img-src * data: blob:",
        "font-src * data:",
        "media-src * data: blob:",
        "connect-src * data: blob:",
        "worker-src * blob:",
      ].join('; '),
      // ─── SharedArrayBuffer + Atomics required by Emscripten ───────────
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    redirectBaseWithoutSlash(),
  ],
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@application': path.resolve(__dirname, 'src/application'),
      '@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
      '@presentation': path.resolve(__dirname, 'src/presentation'),
    },
  },
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
