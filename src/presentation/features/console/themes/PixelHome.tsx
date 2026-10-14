import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ConsoleHomeProps } from './types';

// Green-screen handheld style: the whole console becomes a CSS-drawn handheld with a
// dot-matrix LCD (4-shade green palette) and working D-pad, A/B, SELECT and START.
const C = { darkest: '#0F380F', dark: '#306230', light: '#8BAC0F', lightest: '#9BBC0F' };
const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';

const usePixelFont = () => {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
};

export const PixelHome: React.FC<ConsoleHomeProps> = (p) => {
  usePixelFont();
  const selected = p.games[p.selectedIndex];
  const prev = () => p.onSelect((p.selectedIndex - 1 + p.games.length) % p.games.length);
  const next = () => p.onSelect((p.selectedIndex + 1) % p.games.length);

  const screen = (
    <div
      className="pixel-lcd relative w-full h-full overflow-hidden"
      style={{ background: C.lightest, color: C.darkest, fontFamily: "'Press Start 2P', monospace" }}
    >
      <div data-lenis-prevent className="relative z-10 h-full overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 text-[9px] sm:text-[10px] leading-relaxed">
        <div className="flex items-center justify-between">
          <span>AP-DECK</span>
          <span className="tabular-nums">{p.currentTime}</span>
        </div>
        <div className="h-[3px]" style={{ background: C.darkest }} />

        <div className="flex gap-3 items-start">
          <img
            src={selected.coverArt}
            alt=""
            className="pixel-cover w-20 h-20 sm:w-24 sm:h-24 shrink-0 border-4"
            style={{ borderColor: C.darkest }}
          />
          <div className="min-w-0 space-y-2">
            <p className="uppercase break-words" style={{ color: C.darkest }}>{selected.title}</p>
            <p style={{ color: C.dark }}>{p.recordLabel(selected)}</p>
          </div>
        </div>

        <p style={{ color: C.dark }}>SELECCIONA UN JUEGO</p>
        <ul className="space-y-2">
          {p.games.map((game, idx) => {
            const isSel = idx === p.selectedIndex;
            return (
              <li key={game.id}>
                <button
                  onClick={() => (isSel ? p.onLaunch(game) : p.onSelect(idx))}
                  className="flex items-start gap-2 text-left w-full uppercase"
                  style={{ color: isSel ? C.darkest : C.dark }}
                >
                  <span className={isSel ? 'pixel-blink' : 'invisible'}>▶</span>
                  <span className="break-words">{game.title}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {p.showInfo && <p className="normal-case" style={{ color: C.dark }}>{selected.description}</p>}

        <div className="mt-auto pt-2 flex flex-wrap gap-x-4 gap-y-1" style={{ color: C.dark }}>
          <span>START: JUGAR</span>
          <span>SELECT: TEMAS</span>
          <span>B: INFO</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ background: '#1B1B1F' }}>
      {/* Phones: the LCD is the whole screen, with the controls as a slim bar */}
      <div className="sm:hidden absolute inset-0 flex flex-col">
        <div className="flex-1 min-h-0">{screen}</div>
        <div className="flex items-center justify-between px-4 py-3" style={{ background: '#C4C0BA' }}>
          <DPad onUp={prev} onDown={next} onLeft={prev} onRight={next} small />
          <div className="flex gap-2">
            <Pill onClick={p.onOpenThemes}>SELECT</Pill>
            <Pill onClick={() => p.onLaunch(selected)}>START</Pill>
          </div>
          <div className="flex gap-2">
            <Round onClick={p.onToggleInfo}>B</Round>
            <Round onClick={() => p.onLaunch(selected)}>A</Round>
          </div>
        </div>
      </div>

      {/* Larger screens: a full handheld */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        className="hidden sm:flex flex-col items-center h-[94%] aspect-[9/14] max-w-[92vw] rounded-[20px] rounded-br-[70px] px-[5%] pt-[5%] pb-[4%] shadow-[0_30px_80px_rgba(0,0,0,0.6),inset_0_-6px_0_rgba(0,0,0,0.12)]"
        style={{ background: 'linear-gradient(180deg, #D3CFC9 0%, #C4C0BA 100%)' }}
      >
        <div className="w-full rounded-t-[10px] rounded-b-[34px] p-[6%] pb-[4%]" style={{ background: '#5B5F6B' }}>
          <div className="flex items-center gap-2 mb-2 text-[9px] text-[#B8BCC8]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
            <span>BATTERY</span>
          </div>
          <div className="aspect-[10/9] w-full">{screen}</div>
        </div>
        <div className="self-start mt-3 text-[#2D3A8C] italic font-black tracking-tight text-lg">
          AP<span className="font-light"> Deck</span> <span className="text-xs not-italic font-bold">8-BIT</span>
        </div>

        <div className="flex-1 w-full flex items-center justify-between px-[4%]">
          <DPad onUp={prev} onDown={next} onLeft={prev} onRight={next} />
          <div className="flex gap-4 -rotate-[25deg] translate-y-[-10%]">
            <Round onClick={p.onToggleInfo} big label="B" />
            <Round onClick={() => p.onLaunch(selected)} big label="A" />
          </div>
        </div>

        <div className="flex gap-6 -rotate-[25deg] mb-[6%]">
          <Pill onClick={p.onOpenThemes} label="SELECT" />
          <Pill onClick={() => p.onLaunch(selected)} label="START" />
        </div>

        <div className="flex items-center gap-4 text-[11px] font-semibold text-[#5B5F6B]">
          <button onClick={p.onOpenSettings} className="hover:underline">Ajustes</button>
          <button onClick={p.onOpenTrophies} className="hover:underline">Récords</button>
          <button onClick={p.onExit} className="hover:underline">Salir</button>
        </div>
      </motion.div>
    </div>
  );
};

const DPad: React.FC<{ onUp: () => void; onDown: () => void; onLeft: () => void; onRight: () => void; small?: boolean }> = ({ onUp, onDown, onLeft, onRight, small }) => {
  const s = small ? 'w-7 h-7' : 'w-10 h-10 lg:w-12 lg:h-12';
  const btn = `${s} bg-[#2B2B2E] active:bg-black flex items-center justify-center text-[#6B6B70] text-[10px]`;
  return (
    <div className="grid grid-cols-3" aria-label="Cruceta">
      <span />
      <button className={`${btn} rounded-t-md`} onClick={onUp} aria-label="Arriba">▲</button>
      <span />
      <button className={`${btn} rounded-l-md`} onClick={onLeft} aria-label="Izquierda">◀</button>
      <span className={`${s} bg-[#2B2B2E]`} />
      <button className={`${btn} rounded-r-md`} onClick={onRight} aria-label="Derecha">▶</button>
      <span />
      <button className={`${btn} rounded-b-md`} onClick={onDown} aria-label="Abajo">▼</button>
      <span />
    </div>
  );
};

const Round: React.FC<{ onClick: () => void; children?: React.ReactNode; big?: boolean; label?: string }> = ({ onClick, children, big, label }) => (
  <div className="flex flex-col items-center gap-1">
    <button
      onClick={onClick}
      aria-label={label ?? String(children)}
      className={`${big ? 'w-14 h-14 lg:w-16 lg:h-16' : 'w-9 h-9'} rounded-full bg-[#9A2257] active:translate-y-0.5 shadow-[inset_0_-4px_0_rgba(0,0,0,0.25)] text-white/80 font-bold text-xs`}
    >
      {children}
    </button>
    {label && <span className="text-[#2D3A8C] font-black text-sm">{label}</span>}
  </div>
);

const Pill: React.FC<{ onClick: () => void; children?: React.ReactNode; label?: string }> = ({ onClick, children, label }) => (
  <div className="flex flex-col items-center gap-1">
    <button
      onClick={onClick}
      aria-label={label ?? String(children)}
      className="w-14 h-4 rounded-full bg-[#7B7E87] active:translate-y-0.5 text-[8px] font-bold text-white/80"
    >
      {children}
    </button>
    {label && <span className="text-[#2D3A8C] font-bold text-[10px] tracking-widest">{label}</span>}
  </div>
);
