import React from 'react';
import { portfolioData } from '../../data/portfolio';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-5xl mx-auto mt-20 border-t border-slate-800/80 pt-8 pb-12 px-6 text-center text-slate-500 text-[11px] tracking-widest uppercase font-mono space-y-2">
      <p className="text-slate-400">
        {portfolioData.personal.name} © {new Date().getFullYear()} — Software Developer & Architect
      </p>
      <p className="text-[10px] text-slate-600">
        Quito, Ecuador • Built with React 19, TypeScript, TailwindCSS & Clean Architecture Principles
      </p>
    </footer>
  );
};
