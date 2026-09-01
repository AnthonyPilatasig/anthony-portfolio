import React from 'react';
import type { IProject } from '../../types/portfolio.types';

interface ProjectReelProps {
  projects: IProject[];
}

export const ProjectReel: React.FC<ProjectReelProps> = ({ projects }) => {
  if (projects.length === 0) return null;

  // Duplicated once so the CSS marquee loop (0% -> -50%) is seamless.
  const track = [...projects, ...projects];

  return (
    <div className="project-reel mt-8 -mx-6 px-6 overflow-hidden">
      <div className="project-reel-track flex gap-4 w-max">
        {track.map((p, idx) => (
          <div
            key={`${p.id}-${idx}`}
            className="relative w-56 h-32 shrink-0 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 bg-slate-200 dark:bg-slate-900 group"
          >
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-full object-cover opacity-80 dark:opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] dark:from-[#080c14] via-transparent to-transparent opacity-90" />
            <span className="absolute bottom-2 left-3 right-3 text-[10px] font-mono text-slate-700 dark:text-slate-300 truncate">
              {p.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
