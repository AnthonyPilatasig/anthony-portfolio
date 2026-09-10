import React from 'react';
import { motion } from 'framer-motion';
import type { Track } from './types';
import { FiChevronUp, FiChevronDown, FiPlay, FiPause, FiSkipForward } from 'react-icons/fi';

interface MiniIpodDockProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  isExpanded: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onToggleExpand: () => void;
}

export const MiniIpodDock: React.FC<MiniIpodDockProps> = ({
  currentTrack,
  isPlaying,
  isExpanded,
  onTogglePlay,
  onNext,
  onToggleExpand,
}) => {
  return (
    <div className="flex items-center gap-3 p-2 px-3 sm:px-4 min-w-[290px] sm:min-w-[340px] bg-gradient-to-r from-[#eab308] via-[#facc15] to-[#eab308] text-slate-900 rounded-2xl shadow-xl border-2 border-amber-300">
      {/* Mini iPod Play Button */}
      <button
        onClick={onTogglePlay}
        className="relative w-10 h-10 rounded-full bg-slate-900 text-amber-300 hover:text-white flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform cursor-pointer border border-amber-400"
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
      >
        {isPlaying ? <FiPause className="w-4 h-4 font-bold" /> : <FiPlay className="w-4 h-4 translate-x-0.5" />}

        {/* Pulsing indicator */}
        <span
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-black ${
            isPlaying ? 'bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse' : 'bg-slate-500'
          }`}
        />
      </button>

      {/* Mini Rotating Vinyl Disk */}
      <div
        className="relative w-8 h-8 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0 cursor-pointer shadow-inner"
        onClick={onToggleExpand}
        title="Click para abrir el iPod completo"
      >
        <motion.div
          className="w-full h-full rounded-full flex items-center justify-center"
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { duration: 2.5, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border border-white/50" />
        </motion.div>
      </div>

      {/* Track Info (Title, Category, Artist) */}
      <div
        className="flex-1 min-w-0 cursor-pointer select-none"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-black text-slate-950 truncate block">
            {currentTrack ? currentTrack.title : 'iPod Retro Music'}
          </span>
          <span className="text-[8px] font-black px-1 rounded bg-black/10 border border-black/20 text-slate-900 shrink-0 font-mono">
            {currentTrack?.category === 'anime' ? 'ANIME' : currentTrack?.category === 'ecuador' ? 'ECUADOR' : 'iPod'}
          </span>
        </div>
        <p className="text-[9px] text-slate-800 font-semibold truncate mt-0.5">
          {currentTrack ? currentTrack.artist : 'Música en segundo plano'}
        </p>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="p-1.5 rounded-lg text-slate-800 hover:text-black hover:bg-black/10 transition-colors cursor-pointer"
        title="Siguiente Canción"
      >
        <FiSkipForward className="w-4 h-4" />
      </button>

      {/* Expand / Collapse Button */}
      <button
        onClick={onToggleExpand}
        className="p-1.5 text-slate-800 hover:text-black hover:bg-black/10 rounded-lg transition-colors cursor-pointer"
        aria-label={isExpanded ? 'Colapsar iPod' : 'Expandir iPod'}
      >
        {isExpanded ? <FiChevronDown className="w-4 h-4" /> : <FiChevronUp className="w-4 h-4" />}
      </button>
    </div>
  );
};
