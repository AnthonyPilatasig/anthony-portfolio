import React, { useState } from 'react';
import { FiGithub, FiLinkedin, FiMail, FiCopy, FiCheck } from 'react-icons/fi';
import { portfolioData } from '../../data/portfolio';

export const Footer: React.FC = () => {
  const { personal } = portfolioData;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // silent
    }
  };

  return (
    <footer className="w-full max-w-5xl mx-auto mt-20 border-t border-[var(--theme-border)] pt-10 pb-14 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Identity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--theme-accent)] flex items-center justify-center font-mono font-bold text-slate-950 text-xs">
              AP
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-[var(--theme-ink)] tracking-widest uppercase">
                {personal.name}
              </p>
              <p className="text-[10px] font-mono text-slate-500">Full Stack Developer & Architect</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="text-[11px] font-mono text-[var(--theme-ink-muted)]">Disponible para proyectos</span>
          </div>
          <p className="text-[11px] font-mono text-[var(--theme-ink-muted)]">
            Quito, Ecuador · UTC-5
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-[var(--theme-accent)] tracking-widest uppercase mb-3">Contacto Directo</p>
          <a
            href={personal.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] transition-colors group"
          >
            <FiGithub className="w-4 h-4 text-[var(--theme-accent)]" />
            <span className="group-hover:underline">GitHub Profile</span>
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] transition-colors group"
          >
            <FiLinkedin className="w-4 h-4 text-[var(--theme-ink-muted)]" />
            <span className="group-hover:underline">LinkedIn</span>
          </a>
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 text-xs font-mono text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] transition-colors group"
          >
            {copied
              ? <FiCheck className="w-4 h-4 text-emerald-500" />
              : <FiMail className="w-4 h-4 text-[var(--theme-accent)]" />}
            <span className="group-hover:underline">
              {copied ? '¡Copiado!' : personal.email}
            </span>
            {!copied && <FiCopy className="w-3 h-3 text-[var(--theme-ink-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />}
          </button>
        </div>

        {/* CV & Tech */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-[var(--theme-accent)] tracking-widest uppercase mb-3">Recursos</p>
          <a
            href={`${import.meta.env.BASE_URL}CV_Anthony_Pilatasig.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] transition-colors group"
          >
            <span className="w-4 h-4 text-[var(--theme-accent)] flex items-center justify-center text-[10px]">↓</span>
            <span className="group-hover:underline">Descargar CV (PDF)</span>
          </a>
          <p className="text-[11px] font-mono text-[var(--theme-ink-muted)] leading-relaxed pt-2">
            Construido con React 19, TypeScript,<br/>
            TailwindCSS v4 & Clean Architecture.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--theme-border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-[10px] font-mono text-[var(--theme-ink-muted)] tracking-wider">
          {personal.name} © {new Date().getFullYear()} — All rights reserved.
        </p>
        <p className="text-[10px] font-mono text-[var(--theme-ink-muted)]">
          Diseñado & Desarrollado por Anthony Pilatasig · Quito, Ecuador
        </p>
      </div>
    </footer>
  );
};
