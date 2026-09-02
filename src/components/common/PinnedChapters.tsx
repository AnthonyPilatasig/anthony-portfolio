import React, { useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

export interface Chapter {
  icon: React.ReactNode;
  label: string;
  description: string;
  tags: string[];
  accentText: string;
  accentBorder: string;
  accentBg: string;
  /** Optional: renders as a small link/CTA under the tags (e.g. "Probar en la terminal"). */
  action?: React.ReactNode;
}

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
      <p className="text-[var(--theme-ink-muted)] text-sm md:text-base max-w-xl leading-relaxed font-light mb-6">
        {chapter.description}
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {chapter.tags.map((t) => (
          <span key={t} className="badge-accent">
            <FiCheckCircle className="w-3 h-3" />
            <span>{t}</span>
          </span>
        ))}
      </div>
      {chapter.action}
    </div>
  );
};

const PinnedShowcase: React.FC<{ chapters: Chapter[]; vhPerChapter: number }> = ({ chapters, vhPerChapter }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] });

  // Driven via a plain subscription + React state rather than style-bound motion values —
  // more predictable for a small, discrete number of chapters, and the crossfade itself
  // is handled by CSS transitions (see ChapterPanel), not scroll-scrubbed transforms.
  useEffect(() => {
    return scrollYProgress.on('change', (p) => {
      const idx = Math.min(chapters.length - 1, Math.max(0, Math.floor(p * chapters.length)));
      setActiveIndex(idx);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
      }
    });
  }, [scrollYProgress, chapters.length]);

  return (
    <section ref={targetRef} className="relative" style={{ height: `${chapters.length * vhPerChapter}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden rounded-[2rem] bg-[var(--theme-surface)] dark:bg-[#0A0A0A] border border-[var(--theme-border)]">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
          {chapters.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-[var(--theme-accent)] scale-[1.6]' : 'bg-[var(--theme-accent)]/30'}`}
            />
          ))}
        </div>

        <div className="relative w-full h-full">
          {chapters.map((chapter, i) => (
            <ChapterPanel
              key={chapter.label}
              chapter={chapter}
              state={i === activeIndex ? 'active' : i < activeIndex ? 'after' : 'before'}
            />
          ))}
        </div>

        <div
          ref={barRef}
          className="absolute bottom-0 left-0 h-1 w-full bg-[var(--theme-accent)] origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </section>
  );
};

const StaticShowcase: React.FC<{ chapters: Chapter[] }> = ({ chapters }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {chapters.map((chapter) => (
      <div key={chapter.label} className="editorial-card rounded-lg p-6 flex flex-col gap-3">
        <div className={`w-12 h-12 rounded-xl border ${chapter.accentBorder} ${chapter.accentBg} ${chapter.accentText} flex items-center justify-center`}>
          {chapter.icon}
        </div>
        <h3 className={`text-lg font-bold ${chapter.accentText}`}>{chapter.label}</h3>
        <p className="text-[var(--theme-ink-muted)] text-sm font-light leading-relaxed">{chapter.description}</p>
        <div className="flex flex-wrap gap-2">
          {chapter.tags.map((t) => (
            <span key={t} className="badge-accent">{t}</span>
          ))}
        </div>
        {chapter.action}
      </div>
    ))}
  </div>
);

interface PinnedChaptersProps {
  chapters: Chapter[];
  /** Scroll distance per chapter, in vh. Defaults to 60 (roughly one screen height each). */
  vhPerChapter?: number;
}

/** Apple-style pinned scroll showcase: framer-motion's useScroll reads scroll position, but the
 * actual chapter crossfade is plain React state + CSS transitions, with a static-grid fallback
 * for prefers-reduced-motion. Generic over `chapters` so it isn't tied to any one topic. */
export const PinnedChapters: React.FC<PinnedChaptersProps> = ({ chapters, vhPerChapter = 60 }) => {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <StaticShowcase chapters={chapters} /> : <PinnedShowcase chapters={chapters} vhPerChapter={vhPerChapter} />;
};
