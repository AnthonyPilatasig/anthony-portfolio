import React from 'react';

interface ClickWheelProps {
  onMenu: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelect: () => void;
  isPlaying: boolean;
}

export const ClickWheel: React.FC<ClickWheelProps> = ({
  onMenu,
  onPlayPause,
  onNext,
  onPrev,
  onSelect,
  isPlaying,
}) => {
  return (
    <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto my-2 select-none flex items-center justify-center">
      {/* ─── OUTER WHITE WHEEL ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 rounded-full bg-[#f8fafc] border-4 border-slate-300 shadow-xl flex items-center justify-center cursor-pointer"
        style={{
          boxShadow: '0 8px 24px rgba(0,0,0,0.35), inset 0 2px 6px rgba(255,255,255,0.9), inset 0 -3px 8px rgba(0,0,0,0.15)',
        }}
      >
        {/* Top: MENU / BACK */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenu();
          }}
          className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 font-sans font-black text-xs text-slate-700 hover:text-black active:scale-90 transition-transform cursor-pointer tracking-wider"
          title="Menú / Atrás"
        >
          MENU
        </button>

        {/* Left: PREVIOUS ⏮ */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 font-black text-sm text-slate-700 hover:text-black active:scale-90 transition-transform cursor-pointer"
          title="Pista Anterior"
        >
          |◀◀
        </button>

        {/* Right: NEXT ⏭ */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 font-black text-sm text-slate-700 hover:text-black active:scale-90 transition-transform cursor-pointer"
          title="Siguiente Pista"
        >
          ▶▶|
        </button>

        {/* Bottom: PLAY / PAUSE ⏯ */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayPause();
          }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 font-black text-xs text-slate-700 hover:text-black active:scale-90 transition-transform cursor-pointer tracking-wider flex items-center gap-1"
          title={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          <span>▶||</span>
        </button>
      </div>

      {/* ─── CENTER SELECT BUTTON (Matching Handheld Color) ─────────── */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[#facc15] via-[#eab308] to-[#ca8a04] border-2 border-amber-300 shadow-md flex items-center justify-center active:scale-92 transition-transform cursor-pointer hover:brightness-105"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.6), 0 4px 10px rgba(0,0,0,0.25)',
        }}
        title="Seleccionar / Enter"
      >
        <div className="w-4 h-4 rounded-full bg-amber-200/50 blur-[1px]" />
      </button>
    </div>
  );
};
