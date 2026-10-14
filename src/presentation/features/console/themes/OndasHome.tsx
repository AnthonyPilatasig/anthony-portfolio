import React from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiAward, FiDroplet, FiLogOut, FiGrid } from 'react-icons/fi';
import type { ConsoleHomeProps } from './types';

// Cross-bar menu style: category icons in a row, the game list running vertically under
// "Juegos" and gliding so the focused game stays in place, flowing waves behind it all.
const ITEM_H = 76;

const WAVE = 'M0 60 Q 150 10 300 60 T 600 60 T 900 60 T 1200 60 V 120 H 0 Z';

export const OndasHome: React.FC<ConsoleHomeProps> = (p) => {
  const selected = p.games[p.selectedIndex];
  const now = new Date();
  const date = now.toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit' });

  const categories = [
    { label: 'Ajustes', icon: <FiSettings />, onClick: p.onOpenSettings },
    { label: 'Temas', icon: <FiDroplet />, onClick: p.onOpenThemes },
    { label: 'Juegos', icon: <FiGrid />, onClick: undefined, active: true },
    { label: 'Récords', icon: <FiAward />, onClick: p.onOpenTrophies },
    { label: 'Salir', icon: <FiLogOut />, onClick: p.onExit },
  ];

  return (
    <div
      className="absolute inset-0 overflow-hidden text-white transition-colors duration-700"
      style={{ background: `linear-gradient(160deg, ${selected.accentColor}66 0%, #0B1C3D 45%, #050B1A 100%)` }}
    >
      {/* Flowing waves (transform-only animation) */}
      <div className="pointer-events-none absolute inset-x-0 top-[38%] h-40 opacity-70" aria-hidden>
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="ondas-wave absolute inset-y-0 left-0 h-full w-[200%]"
            style={{ animationDuration: `${16 + i * 7}s`, animationDirection: i === 1 ? 'reverse' : 'normal', top: i * 10, opacity: 0.35 - i * 0.08 }}
          >
            <path d={WAVE} fill="none" stroke="white" strokeWidth={1.2 - i * 0.3} />
            <path d={WAVE} fill="white" fillOpacity={0.04} />
          </svg>
        ))}
      </div>

      {/* Date & time, top right */}
      <div className="absolute top-5 right-6 sm:right-10 text-right font-light leading-tight">
        <div className="text-2xl sm:text-3xl tabular-nums">{p.currentTime}</div>
        <div className="text-xs sm:text-sm text-white/70">{date}</div>
      </div>

      {/* Category bar */}
      <div className="absolute top-[18%] left-0 right-0 flex items-end gap-6 sm:gap-10 pl-[8%] sm:pl-[22%]">
        {categories.map((c) => (
          <button
            key={c.label}
            onClick={c.onClick}
            disabled={!c.onClick}
            className={`flex flex-col items-center gap-2 transition-all ${c.active ? 'opacity-100' : 'opacity-45 hover:opacity-90'}`}
          >
            <span className={c.active ? 'text-5xl sm:text-6xl drop-shadow-[0_0_14px_rgba(255,255,255,0.7)]' : 'text-3xl sm:text-4xl'}>
              {c.icon}
            </span>
            <span className={`text-xs sm:text-sm ${c.active ? 'font-medium' : ''}`}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Vertical game list under "Juegos": glides so the focused item stays fixed */}
      <div className="absolute left-[8%] sm:left-[calc(22%+12.5rem)] top-[42%] right-4">
        <motion.div
          animate={{ y: -p.selectedIndex * ITEM_H }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        >
          {p.games.map((game, idx) => {
            const isSel = idx === p.selectedIndex;
            return (
              <button
                key={game.id}
                onClick={() => (isSel ? p.onLaunch(game) : p.onSelect(idx))}
                onDoubleClick={() => p.onLaunch(game)}
                className="flex items-center gap-4 text-left w-full"
                style={{ height: ITEM_H }}
              >
                <motion.img
                  src={game.coverArt}
                  alt=""
                  animate={{ width: isSel ? 68 : 44, height: isSel ? 68 : 44, opacity: isSel ? 1 : 0.5 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-lg object-cover shrink-0"
                  style={isSel ? { boxShadow: '0 0 24px rgba(255,255,255,0.45)' } : undefined}
                />
                <span className="min-w-0">
                  <span className={`block truncate ${isSel ? 'text-xl sm:text-2xl font-medium' : 'text-base text-white/55'}`}>
                    {game.title}
                  </span>
                  {isSel && (
                    <span className="block text-xs sm:text-sm text-white/70 truncate">{p.recordLabel(game)}</span>
                  )}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Focused game details */}
      {p.showInfo && (
        <motion.p
          key={selected.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-16 left-[8%] right-[8%] sm:left-auto sm:right-10 sm:w-96 text-sm text-white/80 leading-relaxed"
        >
          {selected.description}
        </motion.p>
      )}

      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-6 text-xs text-white/70">
        <span>Enter · Iniciar</span>
        <span>↑ ↓ · Moverse</span>
        <span>X · Info</span>
        <span>T · Temas</span>
      </div>
    </div>
  );
};
