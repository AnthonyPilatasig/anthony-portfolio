import React, { useEffect } from 'react';
import { ConsoleDashboard } from '../components/common/ConsoleDashboard';

/**
 * ConsolePage — ruta dedicada /console
 * Ocupa el 100% del viewport, sin Navbar ni Footer.
 * Reemplaza el <body> background para que no se vea el fondo del portfolio.
 */
export const ConsolePage: React.FC = () => {
  useEffect(() => {
    // Forzar que el body no muestre scroll mientras la consola está activa
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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
      <ConsoleDashboard embeddedFullscreen />
    </div>
  );
};
