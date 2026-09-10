import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ end, suffix = '', duration = 1200, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played.current) return;
        played.current = true;

        // Dynamically imported so the animation engine ships in its own chunk instead
        // of padding out every page that renders a stat counter.
        import('animejs').then(({ animate }) => {
          // Tween a plain counter object — anime.js drives the easing, we just mirror
          // its rounded value into state on every frame.
          const counter = { value: 0 };
          animate(counter, {
            value: end,
            duration,
            ease: 'outExpo',
            onUpdate: () => setValue(Math.round(counter.value)),
          });
        });
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {value}{suffix}
    </span>
  );
};
