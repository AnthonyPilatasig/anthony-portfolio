import React from 'react';
import { TerminalConsole } from '@presentation/features/terminal/TerminalConsole';
import { SEO } from '@presentation/components/ui/SEO';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiTerminal } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export const TerminalPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 md:pt-36 pb-24 min-h-[85vh] flex flex-col">
      <SEO
        title="Terminal Interactiva — Anthony Pilatasig"
        description="Emulador UNIX interactivo con comandos CLI, neofetch, easter eggs y detalles técnicos del portafolio."
      />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 border-b border-[var(--theme-border)] pb-6"
      >
        <div>
          <span className="section-index">06 / CLI</span>
          <h1 className="text-3xl md:text-5xl font-sans font-semibold text-[var(--theme-ink)] tracking-tight flex items-center gap-3">
            <FiTerminal className="w-8 h-8 text-[var(--theme-accent)]" />
            <span>Terminal Interactiva</span>
          </h1>
          <p className="text-xs font-mono text-[var(--theme-ink-muted)] mt-2">
            Emulador UNIX con comandos CLI, neofetch, easter eggs y juegos retro.
          </p>
        </div>

        <Link to="/" className="btn-secondary text-xs flex items-center gap-1.5 shrink-0">
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>{t('nav.home')}</span>
        </Link>
      </motion.div>

      <div className="flex-1">
        <TerminalConsole fullHeight />
      </div>
    </div>
  );
};
