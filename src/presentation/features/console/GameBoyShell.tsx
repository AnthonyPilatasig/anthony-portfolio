import React from 'react';
import { FiX } from 'react-icons/fi';

interface GameBoyShellProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

/** A CSS-drawn retro handheld console shell — screen bezel, D-pad, A/B, start/select. */
export const GameBoyShell: React.FC<GameBoyShellProps> = ({ children, onClose, title = 'DEV•BOY' }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[360px] rounded-[28px] rounded-tr-[70px] p-5 pb-7 shadow-2xl"
        style={{ background: 'linear-gradient(160deg, #5b5470 0%, #433d55 100%)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 text-white/50 hover:text-white rounded-full hover:bg-white/10"
        >
          <FiX className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between px-1 mb-3">
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/70">{title}</span>
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.6)]" />
        </div>

        {/* Screen bezel */}
        <div className="rounded-lg bg-[#1a1a1a] p-3 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
          <div className="rounded-sm overflow-hidden" style={{ imageRendering: 'pixelated' }}>
            {children}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-6 px-2">
          {/* D-pad */}
          <div className="relative w-16 h-16">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-5 h-16 bg-[#2a2733] rounded-[3px]" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-16 h-5 bg-[#2a2733] rounded-[3px]" />
          </div>

          {/* A/B buttons */}
          <div className="flex items-center gap-2 -rotate-12">
            <div className="flex flex-col items-center gap-1">
              <span className="w-7 h-7 rounded-full bg-[#8b3a62] shadow-[inset_0_-2px_2px_rgba(0,0,0,0.4)]" />
              <span className="text-[8px] text-white/40 font-mono">B</span>
            </div>
            <div className="flex flex-col items-center gap-1 -translate-y-3">
              <span className="w-7 h-7 rounded-full bg-[#8b3a62] shadow-[inset_0_-2px_2px_rgba(0,0,0,0.4)]" />
              <span className="text-[8px] text-white/40 font-mono">A</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-5">
          <div className="flex flex-col items-center gap-1">
            <span className="w-8 h-2.5 rounded-full bg-[#2a2733] -rotate-12" />
            <span className="text-[7px] text-white/40 font-mono tracking-wider">SELECT</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="w-8 h-2.5 rounded-full bg-[#2a2733] -rotate-12" />
            <span className="text-[7px] text-white/40 font-mono tracking-wider">START</span>
          </div>
        </div>
      </div>
    </div>
  );
};
