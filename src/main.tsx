import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import Lenis from 'lenis';
import './index.css';
import '@infrastructure/i18n/config';
import App from './presentation/app/App.tsx';
import { prefersRichMotion } from './presentation/utils/motion';

// Smooth scroll con Lenis, solo en equipos con mouse: en celulares el scroll nativo ya
// es suave y el bucle requestAnimationFrame permanente solo gasta batería y CPU.
if (prefersRichMotion()) {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
