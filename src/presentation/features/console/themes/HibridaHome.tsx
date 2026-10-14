import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiSettings, FiTv, FiVolume2, FiVolumeX, FiLogOut, FiWifi, FiWifiOff, FiBattery, FiBatteryCharging, FiDroplet } from 'react-icons/fi';
import type { ConsoleHomeProps } from './types';

// Hybrid-handheld style home: light canvas, one row of big square tiles with a pulsing
// cyan focus frame and the title floating above it, round system buttons underneath.
const FOCUS = '#00C3E3';

export const HibridaHome: React.FC<ConsoleHomeProps> = (p) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const selected = p.games[p.selectedIndex];

  useEffect(() => {
    rowRef.current
      ?.querySelector<HTMLElement>(`[data-tile="${p.selectedIndex}"]`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [p.selectedIndex]);

  const systemButtons = [
    { label: 'Récords', icon: <FiAward />, onClick: p.onOpenTrophies, color: '#F5A623' },
    { label: 'Temas', icon: <FiDroplet />, onClick: p.onOpenThemes, color: '#E60012' },
    { label: 'Filtro CRT', icon: <FiTv />, onClick: p.onToggleCrt, color: '#7B61FF', active: p.crtEnabled },
    { label: 'Sonido', icon: p.soundEnabled ? <FiVolume2 /> : <FiVolumeX />, onClick: p.onToggleSound, color: '#22B14C', active: p.soundEnabled },
    { label: 'Ajustes', icon: <FiSettings />, onClick: p.onOpenSettings, color: '#5B5B5B' },
    { label: 'Salir', icon: <FiLogOut />, onClick: p.onExit, color: '#5B5B5B' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-[#EBEBEB] text-[#2D2D2D] overflow-hidden">
      {/* Top: user + status */}
      <div className="flex items-center justify-between px-5 sm:px-10 pt-5 sm:pt-7">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white font-black flex items-center justify-center ring-4 ring-white shadow">
            AP
          </div>
          <span className="hidden sm:inline font-semibold">Anthony</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <span className="tabular-nums text-lg">{p.currentTime}</span>
          {p.online ? <FiWifi className="w-5 h-5" /> : <FiWifiOff className="w-5 h-5 text-rose-500" />}
          {p.battery && (
            <span className="flex items-center gap-1">
              {p.battery.charging ? <FiBatteryCharging className="w-5 h-5" /> : <FiBattery className="w-5 h-5" />}
              <span className="tabular-nums">{p.battery.level}%</span>
            </span>
          )}
        </div>
      </div>

      {/* Title, tile row and info sit vertically centered, like the hybrid console's home */}
      <div className="flex-1 min-h-0 flex flex-col justify-center">
      <div className="px-5 sm:px-10 h-8">
        <motion.p
          key={selected.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="font-semibold text-lg sm:text-xl truncate"
          style={{ color: FOCUS }}
        >
          {selected.title}
        </motion.p>
      </div>

      {/* Tile row */}
      <div
        ref={rowRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto px-5 sm:px-10 py-5 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {p.games.map((game, idx) => {
          const isSel = idx === p.selectedIndex;
          return (
            <motion.button
              key={game.id}
              data-tile={idx}
              onClick={() => (isSel ? p.onLaunch(game) : p.onSelect(idx))}
              onDoubleClick={() => p.onLaunch(game)}
              animate={{ scale: isSel ? [1, 1.06, 1.04] : 1 }}
              transition={{ duration: 0.28 }}
              className="relative shrink-0 snap-center w-44 h-44 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-[4px] overflow-visible bg-white shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
              aria-label={isSel ? `Jugar ${game.title}` : `Seleccionar ${game.title}`}
            >
              <img src={game.coverArt} alt="" className="w-full h-full object-cover rounded-[4px]" />
              {isSel && (
                // The pulse is a CSS animation (off the main thread), not a JS loop.
                <motion.span
                  layoutId="hibrida-focus"
                  className="console-focus-ring absolute -inset-[7px] rounded-[8px] pointer-events-none"
                  style={{ boxShadow: `0 0 0 4px ${FOCUS}, 0 0 0 7px #fff` }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Short info line for the focused game */}
      <div className="px-5 sm:px-10 text-sm text-[#5B5B5B] min-h-[2.5rem]">
        <span className="font-semibold">{p.recordLabel(selected)}</span>
        {p.showInfo && <span> · {selected.description}</span>}
      </div>
      </div>

      {/* Round system buttons */}
      <div className="flex items-start justify-center gap-4 sm:gap-7 px-4 pb-4">
        {systemButtons.map((b) => (
          <div key={b.label} className="flex flex-col items-center gap-1.5 group">
            <button
              onClick={b.onClick}
              aria-label={b.label}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center text-xl sm:text-2xl shadow-[0_3px_10px_rgba(0,0,0,0.12)] transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4"
              style={{ color: b.color, boxShadow: b.active ? `0 0 0 3px ${b.color}55, 0 3px 10px rgba(0,0,0,0.12)` : undefined }}
            >
              {b.icon}
            </button>
            <span className="text-[11px] font-semibold text-[#5B5B5B] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
              {b.label}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom hints bar */}
      <div className="flex items-center justify-between border-t border-[#D0D0D0] mx-5 sm:mx-10 py-3 text-sm">
        <span className="hidden sm:inline text-[#5B5B5B]">Toca un juego seleccionado para jugar</span>
        <div className="flex items-center gap-4 ml-auto font-semibold">
          <span className="flex items-center gap-1.5"><Btn>A</Btn>Iniciar</span>
          <span className="flex items-center gap-1.5"><Btn>X</Btn>Info</span>
        </div>
      </div>
    </div>
  );
};

const Btn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="w-5 h-5 rounded-full bg-[#2D2D2D] text-white text-[11px] font-bold flex items-center justify-center">{children}</span>
);
