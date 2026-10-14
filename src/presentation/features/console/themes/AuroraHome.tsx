import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiInfo, FiAward, FiSettings, FiDroplet, FiVolume2, FiVolumeX, FiLogOut,
  FiWifi, FiWifiOff, FiBattery, FiBatteryCharging, FiClock,
} from 'react-icons/fi';
import type { ConsoleHomeProps } from './types';

// AP-Deck's own look: minimal, an aurora of soft light behind frosted-glass surfaces —
// a floating status capsule, one glass card for the focused game and a magnifying dock.
const glass = 'bg-white/[0.06] border border-white/[0.12] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]';

export const AuroraHome: React.FC<ConsoleHomeProps> = (p) => {
  const selected = p.games[p.selectedIndex];
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dockRef.current
      ?.querySelector<HTMLElement>(`[data-dock="${p.selectedIndex}"]`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [p.selectedIndex]);

  const actions = [
    { label: 'Temas (T)', icon: <FiDroplet />, onClick: p.onOpenThemes, mobile: true },
    { label: 'Récords', icon: <FiAward />, onClick: p.onOpenTrophies },
    { label: p.soundEnabled ? 'Silenciar' : 'Activar sonido', icon: p.soundEnabled ? <FiVolume2 /> : <FiVolumeX />, onClick: p.onToggleSound },
    { label: 'Ajustes', icon: <FiSettings />, onClick: p.onOpenSettings, mobile: true },
    { label: 'Salir al portafolio', icon: <FiLogOut />, onClick: p.onExit, mobile: true },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#04050B] text-white">
      {/* Aurora: the main light follows the focused game's color */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="deck-aurora-blob absolute -top-[30%] -left-[15%] w-[75vmax] h-[75vmax] rounded-full"
          style={{ background: `radial-gradient(circle, ${selected.accentColor}55 0%, transparent 62%)`, transition: 'background 0.9s ease' }}
        />
        <div
          className="deck-aurora-blob deck-aurora-blob--slow absolute -bottom-[35%] -right-[20%] w-[80vmax] h-[80vmax] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.38) 0%, transparent 62%)' }}
        />
        <div
          className="deck-aurora-blob deck-aurora-blob--reverse absolute top-[20%] right-[10%] w-[50vmax] h-[50vmax] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.28) 0%, transparent 62%)' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(4,5,11,0.65)_100%)]" />
      </div>

      <div className="relative h-full flex flex-col">
        {/* Floating status capsule + round glass actions */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-8 pt-4 sm:pt-6">
          <div className={`flex items-center gap-3 rounded-full pl-1.5 pr-4 py-1.5 ${glass}`}>
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-xs font-black">AP</span>
            <span className="hidden sm:inline text-sm font-medium">Anthony</span>
            <span className="hidden sm:block w-px h-4 bg-white/20" />
            <span className="text-sm tabular-nums">{p.currentTime}</span>
            {p.online ? <FiWifi className="w-4 h-4 text-white/80" /> : <FiWifiOff className="w-4 h-4 text-rose-300" />}
            {p.battery && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-white/80">
                {p.battery.charging ? <FiBatteryCharging className="w-4 h-4" /> : <FiBattery className="w-4 h-4" />}
                {p.battery.level}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={a.onClick}
                title={a.label}
                aria-label={a.label}
                className={`${a.mobile ? 'flex' : 'hidden sm:flex'} w-10 h-10 rounded-full items-center justify-center text-white/85 hover:text-white hover:bg-white/[0.12] transition-colors ${glass}`}
              >
                {a.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Focused game: one frosted-glass card */}
        <div className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-8 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className={`w-full max-w-3xl max-h-full overflow-y-auto rounded-[32px] p-5 sm:p-8 flex flex-col sm:flex-row items-center sm:items-stretch gap-5 sm:gap-8 ${glass}`}
              data-lenis-prevent
            >
              <button
                onClick={() => p.onLaunch(selected)}
                className="relative shrink-0 w-32 h-32 sm:w-48 sm:h-48 rounded-[26px] overflow-hidden group"
                aria-label={`Jugar ${selected.title}`}
                style={{ boxShadow: `0 24px 60px -18px ${selected.accentColor}` }}
              >
                <img src={selected.coverArt} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                  <FiPlay className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                </span>
              </button>

              <div className="min-w-0 flex flex-col justify-center text-center sm:text-left gap-3">
                <span
                  className="self-center sm:self-start text-[11px] font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                  style={{ background: `${selected.accentColor}26`, color: selected.accentColor }}
                >
                  {selected.badge}
                </span>
                <h2 className="text-[clamp(1.6rem,4.2vw,2.75rem)] font-semibold leading-[1.08] tracking-tight break-words">
                  {selected.title}
                </h2>
                <p className={`text-sm text-white/70 leading-relaxed ${p.showInfo ? '' : 'line-clamp-2'}`}>
                  {selected.description}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-xs text-white/70">
                  <span className="flex items-center gap-1.5"><FiAward className="w-3.5 h-3.5 text-amber-300" />{p.recordLabel(selected)}</span>
                  {selected.playtime && <span className="flex items-center gap-1.5"><FiClock className="w-3.5 h-3.5" />{selected.playtime}</span>}
                </div>
                <div className="flex justify-center sm:justify-start gap-2 pt-1">
                  <button
                    onClick={() => p.onLaunch(selected)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-900 text-sm font-semibold hover:scale-[1.03] active:scale-95 transition-transform"
                  >
                    <FiPlay className="w-4 h-4 fill-current" /> Jugar
                  </button>
                  <button
                    onClick={p.onToggleInfo}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-sm font-medium border border-white/10"
                  >
                    <FiInfo className="w-4 h-4" /> {p.showInfo ? 'Menos' : 'Info'}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Magnifying glass dock */}
        <div className="flex flex-col items-center gap-2 px-3 pb-4 sm:pb-6">
          <div
            ref={dockRef}
            className={`max-w-full flex items-end gap-2 sm:gap-3 overflow-x-auto rounded-[28px] px-3 sm:px-4 pt-7 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${glass}`}
          >
            {p.games.map((game, idx) => {
              const isSel = idx === p.selectedIndex;
              return (
                <div key={game.id} data-dock={idx} className="relative flex flex-col items-center shrink-0 group">
                  <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-full bg-black/70 px-2.5 py-1 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
                    {game.title}
                  </span>
                  <motion.button
                    onClick={() => (isSel ? p.onLaunch(game) : p.onSelect(idx))}
                    onDoubleClick={() => p.onLaunch(game)}
                    animate={{ scale: isSel ? 1.3 : 1, y: isSel ? -8 : 0 }}
                    whileHover={{ scale: isSel ? 1.34 : 1.12, y: isSel ? -10 : -3 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] overflow-hidden origin-bottom"
                    style={{ boxShadow: isSel ? `0 10px 26px -6px ${game.accentColor}` : '0 4px 12px rgba(0,0,0,0.35)' }}
                    aria-label={isSel ? `Jugar ${game.title}` : `Seleccionar ${game.title}`}
                    aria-current={isSel}
                  >
                    <img src={game.coverArt} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                  <span className={`mt-2 w-1 h-1 rounded-full transition-opacity ${isSel ? 'bg-white opacity-100' : 'opacity-0'}`} />
                </div>
              );
            })}
          </div>
          <p className="hidden sm:block text-[11px] text-white/45">← → elegir · Enter jugar · X info · T temas · Esc salir</p>
        </div>
      </div>
    </div>
  );
};
