import React, { useEffect, useRef, useState } from 'react';

interface RevealTextProps {
  text: string;
  /** ms before the first word starts animating */
  delay?: number;
  /** ms between each word's animation start */
  stagger?: number;
  className?: string;
}

/**
 * Word-by-word clip reveal, triggered once when scrolled into view.
 * Meant to sit inside a heading the caller already sizes/styles —
 * this only wraps the words, it doesn't own font/color.
 */
export const RevealText: React.FC<RevealTextProps> = ({ text, delay = 0, stagger = 40, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.15em] -mb-[0.15em] align-bottom">
          <span
            className="inline-block will-change-transform"
            style={{
              transform: visible ? 'translateY(0%)' : 'translateY(115%)',
              opacity: visible ? 1 : 0,
              transition: `transform 0.75s cubic-bezier(0.165,0.84,0.44,1) ${delay + i * stagger}ms, opacity 0.6s ease ${delay + i * stagger}ms`,
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </span>
  );
};
