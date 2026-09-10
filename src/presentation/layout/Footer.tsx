import React, { useState } from 'react';
import { FiGithub, FiLinkedin, FiMail, FiCopy, FiCheck, FiDownload } from 'react-icons/fi';
import { SiTwitch } from 'react-icons/si';
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
    <footer className="w-full max-w-7xl mx-auto mt-20 border-t border-[var(--theme-border)] pt-10 pb-14 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Identity */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={personal.avatar}
              alt={personal.name}
              className="w-9 h-9 rounded-full object-cover border border-[var(--theme-border-strong)]"
            />
            <div>
              <p className="text-xs font-mono font-bold text-[var(--theme-ink)] tracking-widest uppercase">
                {personal.name}
              </p>
              <p className="text-[10px] font-mono text-[var(--theme-accent)] font-medium">{personal.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="text-[11px] font-mono text-[var(--theme-ink-muted)]">{personal.status}</span>
          </div>
          <p className="text-[11px] font-mono text-[var(--theme-ink-muted)]">
            Quito, Ecuador · UTC-5
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-[var(--theme-accent)] tracking-widest uppercase mb-3">Conexiones Directas</p>
          <a
            href={personal.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] transition-colors group"
          >
            <FiGithub className="w-4 h-4 text-[var(--theme-accent)]" />
            <span className="group-hover:underline">GitHub (@AnthonyPilatasig)</span>
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] transition-colors group"
          >
            <FiLinkedin className="w-4 h-4 text-[var(--theme-accent)]" />
            <span className="group-hover:underline">LinkedIn Profile</span>
          </a>
          <a
            href={personal.twitch}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-[var(--theme-ink-muted)] hover:text-[#9146FF] transition-colors group"
          >
            <SiTwitch className="w-4 h-4 text-[#9146FF]" />
            <span className="group-hover:underline">Twitch Stream</span>
          </a>
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 text-xs font-mono text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] transition-colors group"
          >
            {copied
              ? <FiCheck className="w-4 h-4 text-emerald-500" />
              : <FiMail className="w-4 h-4 text-[var(--theme-accent)]" />}
            <span className="group-hover:underline">
              {copied ? '¡Email Copiado!' : personal.email}
            </span>
            {!copied && <FiCopy className="w-3 h-3 text-[var(--theme-ink-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />}
          </button>
        </div>

        {/* CV & Tech */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-[var(--theme-accent)] tracking-widest uppercase mb-3">Recursos &amp; Docs</p>
          <a
            href={`${import.meta.env.BASE_URL}CV_Anthony_Pilatasig.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] transition-colors group"
          >
            <FiDownload className="w-4 h-4 text-[var(--theme-accent)]" />
            <span className="group-hover:underline">Descargar CV Oficial (PDF)</span>
          </a>
          <p className="text-[11px] font-mono text-[var(--theme-ink-muted)] leading-relaxed pt-2">
            Desarrollado con React 19, TypeScript,<br/>
            TailwindCSS v4 &amp; Clean Architecture.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--theme-border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-[10px] font-mono text-[var(--theme-ink-muted)] tracking-wider">
          {personal.name} © {new Date().getFullYear()} — Todos los derechos reservados.
        </p>
        <p className="text-[10px] font-mono text-[var(--theme-ink-muted)]">
          Diseñado &amp; Desarrollado por Anthony Pilatasig · Quito, Ecuador
        </p>
      </div>
    </footer>
  );
};
