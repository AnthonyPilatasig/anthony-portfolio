import { useEffect, useRef } from 'react';

const HOVER_SELECTOR = 'a, button, input, textarea, [role="button"], .luxury-card, .cursor-hover';

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    const handleOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(HOVER_SELECTOR);
      dotRef.current?.classList.toggle('cursor-dot--active', !!el);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return <div ref={dotRef} aria-hidden="true" className="cursor-dot" />;
};
