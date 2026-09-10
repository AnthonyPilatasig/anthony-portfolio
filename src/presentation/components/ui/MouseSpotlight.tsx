import React, { useEffect, useRef } from 'react';

export const MouseSpotlight: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Mutate the DOM directly from a rAF loop instead of calling setState on every
    // mousemove — that used to trigger a React re-render on every pixel of movement.
    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMove);

    const tick = () => {
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${target.current.x}px ${target.current.y}px, rgba(27, 79, 232, 0.04), transparent 80%)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return <div ref={spotlightRef} className="pointer-events-none fixed inset-0 z-30" />;
};
