import React from 'react';
import { TerminalConsole } from '../components/common/TerminalConsole';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export const TerminalPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 min-h-0 sm:min-h-[85vh] flex flex-col justify-between">
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 justify-between items-center text-[10px] sm:text-xs font-mono text-slate-400">
        <span className="text-yellow-400 font-bold uppercase tracking-wider">[ CLI FULLSCREEN ]</span>
        <Link to="/" className="text-cyan-400 hover:underline flex items-center gap-1 shrink-0">
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Inicio</span>
        </Link>
      </div>

      <TerminalConsole fullHeight />
    </div>
  );
};
