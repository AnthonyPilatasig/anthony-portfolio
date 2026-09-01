import React, { useRef } from 'react';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

/** Wraps a single interactive child and gives it a subtle magnetic pull toward the cursor. */
export const Magnetic: React.FC<MagneticProps> = ({ children, strength = 16, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left - rect.width / 2) / rect.width) * strength;
    const y = ((e.clientY - rect.top - rect.height / 2) / rect.height) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`inline-block transition-transform duration-200 ease-out will-change-transform ${className ?? ''}`}
    >
      {children}
    </div>
  );
};
