import React, { useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import { FiMonitor, FiServer, FiLayers, FiBox, FiCheckCircle } from 'react-icons/fi';

interface Chapter {
  icon: React.ReactNode;
  label: string;
  description: string;
  tech: string[];
  accentText: string;
  accentBorder: string;
  accentBg: string;
}

const CHAPTERS: Chapter[] = [
  {
    icon: <FiMonitor className="w-9 h-9" />,
    label: 'Frontend & Mobile',
    description: 'Interfaces que conectan a miles de usuarios en tiempo real, en web y en el bolsillo.',
    tech: ['Angular', 'React Native', 'TypeScript', 'Tailwind CSS'],
    accentText: 'text-cyan-400',
    accentBorder: 'border-cyan-500/30',
    accentBg: 'bg-cyan-500/10',
  },
  {
    icon: <FiServer className="w-9 h-9" />,
    label: 'Backend & APIs',
    description: 'APIs RESTful seguras en .NET 8, con autenticación JWT y latencias sub-100ms.',
    tech: ['.NET 8', 'C#', 'JWT', 'REST'],
    accentText: 'text-yellow-400',
    accentBorder: 'border-yellow-500/30',
    accentBg: 'bg-yellow-500/10',
  },
  {
    icon: <FiLayers className="w-9 h-9" />,
    label: 'Arquitectura',
    description: 'Clean Architecture, CQRS y DDD — lectura y escritura separadas desde el diseño.',
    tech: ['Clean Architecture', 'CQRS', 'DDD'],
    accentText: 'text-purple-400',
    accentBorder: 'border-purple-500/30',
    accentBg: 'bg-purple-500/10',
  },
  {
    icon: <FiBox className="w-9 h-9" />,
    label: 'Infraestructura',
    description: 'Contenedores y orquestación pensados para producción, no para la demo.',
    tech: ['Docker', 'Kubernetes', 'CI/CD'],
    accentText: 'text-emerald-400',
    accentBorder: 'border-emerald-500/30',
    accentBg: 'bg-emerald-500/10',
  },
];

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
};

const ChapterPanel: React.FC<{ chapter: Chapter; state: 'before' | 'active' | 'after' }> = ({ chapter, state }) => {
  const visibility =
    state === 'active'
      ? 'opacity-100 scale-100 translate-y-0'
      : state === 'before'
        ? 'opacity-0 scale-95 translate-y-9 pointer-events-none'
        : 'opacity-0 scale-95 -translate-y-6 pointer-events-none';

  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-all duration-500 ease-out ${visibility}`}>
      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border ${chapter.accentBorder} ${chapter.accentBg} ${chapter.accentText} flex items-center justify-center mb-6`}>
        {chapter.icon}
      </div>
      <h3 className={`text-3xl md:text-5xl font-bold ${chapter.accentText} mb-4 max-w-2xl`}>
        {chapter.label}
      </h3>
      <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed font-light mb-6">
        {chapter.description}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {chapter.tech.map((t) => (
          <span key={t} className="luxury-badge-cyan">
            <FiCheckCircle className="w-3 h-3" />
            <span>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const PinnedShowcase: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] });

  // Driven via a plain subscription + React state rather than style-bound motion values —
  // more predictable for a small, discrete number of chapters, and the crossfade itself
  // is handled by CSS transitions (see ChapterPanel), not scroll-scrubbed transforms.
  useEffect(() => {
    return scrollYProgress.on('change', (p) => {
      const idx = Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(p * CHAPTERS.length)));
      setActiveIndex(idx);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
      }
    });
  }, [scrollYProgress]);

  return (
    <section ref={targetRef} className="relative" style={{ height: `${CHAPTERS.length * 60}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden rounded-[2rem] bg-[#080c14] border border-slate-800">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
          {CHAPTERS.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-yellow-400 scale-[1.6]' : 'bg-yellow-400/30'}`}
            />
          ))}
        </div>

        <div className="relative w-full h-full">
          {CHAPTERS.map((chapter, i) => (
            <ChapterPanel
              key={chapter.label}
              chapter={chapter}
              state={i === activeIndex ? 'active' : i < activeIndex ? 'after' : 'before'}
            />
          ))}
        </div>

        <div
          ref={barRef}
          className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-400 to-cyan-400 origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </section>
  );
};

const StaticShowcase: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {CHAPTERS.map((chapter) => (
      <div key={chapter.label} className="luxury-card rounded-2xl p-6 flex flex-col gap-3">
        <div className={`w-12 h-12 rounded-xl border ${chapter.accentBorder} ${chapter.accentBg} ${chapter.accentText} flex items-center justify-center`}>
          {chapter.icon}
        </div>
        <h3 className={`text-lg font-bold ${chapter.accentText}`}>{chapter.label}</h3>
        <p className="text-slate-400 text-sm font-light leading-relaxed">{chapter.description}</p>
        <div className="flex flex-wrap gap-2">
          {chapter.tech.map((t) => (
            <span key={t} className="luxury-badge-cyan">{t}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/** Apple-style pinned scroll showcase of the stack: framer-motion's useScroll reads scroll
 * position, but the actual chapter crossfade is plain React state + CSS transitions. */
export const TechShowcase: React.FC = () => {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <StaticShowcase /> : <PinnedShowcase />;
};
