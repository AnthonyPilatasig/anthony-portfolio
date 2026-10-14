import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiDroplet, FiSettings, FiLogOut } from 'react-icons/fi';
import type { ConsoleGame } from '../ConsoleDashboard';
import type { ConsoleHomeProps } from './types';

// Family living-room console style: a grid of rounded "channels" on a light striped
// canvas, empty slots included, a big clock at the bottom, and a channel preview screen
// (with "Menú" / "Comenzar") before starting a game.
const SLOTS = 12;
const BLUE = '#34BEED';

export const CanalesHome: React.FC<ConsoleHomeProps> = (p) => {
  const [preview, setPreview] = useState<ConsoleGame | null>(null);
  const now = new Date();
  const date = now.toLocaleDateString('es-EC', { weekday: 'short', day: 'numeric', month: 'numeric' });

  const systemChannels = [
    { label: 'Récords', icon: <FiAward />, onClick: p.onOpenTrophies },
    { label: 'Temas', icon: <FiDroplet />, onClick: p.onOpenThemes },
  ];
  const empty = Math.max(0, SLOTS - p.games.length - systemChannels.length);

  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden text-[#56606B]"
      style={{ background: 'repeating-linear-gradient(180deg, #F4F6F8 0px, #F4F6F8 3px, #EDF0F3 3px, #EDF0F3 6px)' }}
    >
      {/* Channel grid */}
      <div data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-10 pt-6 sm:pt-10 pb-4">
        <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {p.games.map((game, idx) => {
            const isSel = idx === p.selectedIndex;
            return (
              <motion.button
                key={game.id}
                onClick={() => { p.onSelect(idx); setPreview(game); }}
                whileHover={{ scale: 1.04 }}
                animate={{ scale: isSel ? 1.04 : 1 }}
                className="relative aspect-[16/10] rounded-[18px] bg-white p-1.5 border-2 overflow-hidden"
                style={{
                  borderColor: isSel ? BLUE : '#C9D1D9',
                  boxShadow: isSel ? `0 0 0 3px ${BLUE}55, 0 8px 22px rgba(52,190,237,0.35)` : '0 2px 6px rgba(0,0,0,0.06)',
                }}
                aria-label={`Canal ${game.title}`}
              >
                {/* Covers already carry their own title, like real channel banners. */}
                <img src={game.coverArt} alt="" className="w-full h-full object-cover rounded-[12px]" />
              </motion.button>
            );
          })}

          {systemChannels.map((c) => (
            <motion.button
              key={c.label}
              onClick={c.onClick}
              whileHover={{ scale: 1.04 }}
              className="aspect-[16/10] rounded-[18px] bg-white border-2 border-[#C9D1D9] flex flex-col items-center justify-center gap-1.5 text-[#56606B]"
            >
              <span className="text-3xl" style={{ color: BLUE }}>{c.icon}</span>
              <span className="text-xs font-semibold">{c.label}</span>
            </motion.button>
          ))}

          {Array.from({ length: empty }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-[16/10] rounded-[18px] border-2 border-[#D6DCE2] bg-[repeating-linear-gradient(180deg,#EEF1F4_0px,#EEF1F4_4px,#E6EAEE_4px,#E6EAEE_8px)]"
              aria-hidden
            />
          ))}
        </div>
      </div>

      {/* Bottom bar: clock, date and round side buttons */}
      <div className="relative shrink-0 h-28 sm:h-32">
        <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-[#E3E7EB] border-t-2 border-[#C9D1D9]" style={{ borderTopLeftRadius: '50% 40px', borderTopRightRadius: '50% 40px' }} />
        <button
          onClick={p.onOpenSettings}
          aria-label="Ajustes"
          className="absolute left-4 sm:left-10 bottom-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-[#C9D1D9] flex items-center justify-center text-2xl hover:scale-105 transition-transform"
          style={{ color: BLUE }}
        >
          <FiSettings />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 text-center">
          <div className="text-4xl sm:text-5xl font-light tabular-nums text-[#8A949E] tracking-wider">{p.currentTime}</div>
          <div className="text-xs sm:text-sm font-semibold text-[#8A949E] capitalize">{date}</div>
        </div>
        <button
          onClick={p.onExit}
          aria-label="Salir al portafolio"
          className="absolute right-4 sm:right-10 bottom-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-[#C9D1D9] flex items-center justify-center text-2xl hover:scale-105 transition-transform"
          style={{ color: BLUE }}
        >
          <FiLogOut />
        </button>
      </div>

      {/* Channel preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 px-6 bg-white"
          >
            <img
              src={preview.coverArt}
              alt=""
              className="canales-breathe w-56 h-56 sm:w-72 sm:h-72 rounded-[28px] object-cover shadow-xl"
            />
            <div className="text-center max-w-lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#3C454F]">{preview.title}</h2>
              <p className="text-sm text-[#56606B] mt-2">{p.recordLabel(preview)}</p>
              <p className="text-sm text-[#56606B] mt-2 leading-relaxed">{preview.description}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setPreview(null)}
                className="w-36 py-3 rounded-full border-2 border-[#C9D1D9] bg-white font-semibold hover:border-[#9AA5B1]"
              >
                Menú
              </button>
              <button
                onClick={() => p.onLaunch(preview)}
                className="w-36 py-3 rounded-full border-2 font-semibold text-white"
                style={{ background: BLUE, borderColor: BLUE }}
              >
                Comenzar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
