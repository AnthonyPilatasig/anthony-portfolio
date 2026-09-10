import React, { useEffect, useState } from 'react';
import { ConsoleDashboard } from '@presentation/features/console/ConsoleDashboard';
import { SEO } from '@presentation/components/ui/SEO';

const RELOAD_ATTEMPTED_KEY = 'ap_console_isolation_reload_attempted';

/**
 * ConsolePage — ruta dedicada /console
 * Ocupa el 100% del viewport, sin Navbar ni Footer.
 * Reemplaza el <body> background para que no se vea el fondo del portfolio.
 */
export const ConsolePage: React.FC = () => {
  // The WASM cores need SharedArrayBuffer, which requires this document to be
  // cross-origin isolated — a header only the /console navigation itself carries
  // (see vite.config.ts / coi-serviceworker.min.js). Arriving here via client-side
  // SPA navigation (not a fresh page load) means that header was never set, so we
  // force one real reload to pick it up. If it still isn't isolated after that
  // (private browsing, no service worker support), show a fallback instead of
  // reloading forever.
  const [isolationUnavailable] = useState(
    () => !window.crossOriginIsolated && !!sessionStorage.getItem(RELOAD_ATTEMPTED_KEY)
  );

  useEffect(() => {
    if (window.crossOriginIsolated) {
      sessionStorage.removeItem(RELOAD_ATTEMPTED_KEY);
      return;
    }
    // Already reflected in isolationUnavailable's initial state above.
    if (sessionStorage.getItem(RELOAD_ATTEMPTED_KEY)) return;
    sessionStorage.setItem(RELOAD_ATTEMPTED_KEY, '1');
    window.location.reload();
  }, []);

  useEffect(() => {
    // Forzar que el body no muestre scroll mientras la consola está activa
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!window.crossOriginIsolated && !isolationUnavailable) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100dvw',
        height: '100dvh',
        background: '#050811',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <SEO
        title="AP-Deck — Consola Virtual | Anthony Pilatasig"
        description="Emulación WebAssembly multi-consola, motor RPG Maker / Pokémon Essentials y mini-juegos nativos, todo corriendo 100% local en el navegador."
      />
      {isolationUnavailable ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center font-mono text-slate-300">
          <p className="text-sm font-bold text-amber-400">Modo emulador no disponible en este navegador</p>
          <p className="max-w-md text-xs text-slate-400">
            Este navegador (por ejemplo, en modo incógnito) no permite el aislamiento que los núcleos WebAssembly
            necesitan. Prueba en una ventana normal o en otro navegador.
          </p>
        </div>
      ) : (
        <ConsoleDashboard embeddedFullscreen />
      )}
    </div>
  );
};
