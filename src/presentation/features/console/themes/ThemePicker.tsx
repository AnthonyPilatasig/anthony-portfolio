import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import { CONSOLE_THEMES, type ConsoleThemeId } from './types';

/** Theme chooser overlay. Arrow keys move, Enter applies, Esc closes. */
export const ThemePicker: React.FC<{
  current: ConsoleThemeId;
  onPick: (id: ConsoleThemeId) => void;
  onClose: () => void;
}> = ({ current, onPick, onClose }) => {
  const [focus, setFocus] = useState(() => Math.max(0, CONSOLE_THEMES.findIndex((t) => t.id === current)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Capture phase + stopPropagation: the console's own shortcuts stay idle meanwhile.
      e.stopPropagation();
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setFocus((f) => (f + 1) % CONSOLE_THEMES.length);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setFocus((f) => (f - 1 + CONSOLE_THEMES.length) % CONSOLE_THEMES.length);
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPick(CONSOLE_THEMES[focus].id);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [focus, onPick, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[45] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Temas de la consola"
        className="w-full max-w-3xl rounded-[28px] p-5 sm:p-7 bg-[#0D111A] border border-white/10 text-white"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Temas de AP-Deck OS</h3>
            <p className="text-xs text-slate-400">Cada tema está inspirado en una generación de consolas</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/15" aria-label="Cerrar">
            <FiX />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CONSOLE_THEMES.map((t, i) => {
            const active = t.id === current;
            const focused = i === focus;
            return (
              <button
                key={t.id}
                onClick={() => onPick(t.id)}
                onMouseEnter={() => setFocus(i)}
                className="relative text-left rounded-2xl p-3 bg-white/[0.04] border-2 transition-all"
                style={{ borderColor: focused ? t.swatch[1] : 'transparent', transform: focused ? 'translateY(-2px)' : undefined }}
              >
                {/* Mini preview made of the theme's own colors */}
                <div className="h-20 rounded-xl mb-3 relative overflow-hidden" style={{ background: t.swatch[0] }}>
                  <div className="absolute left-3 right-3 bottom-3 flex gap-1.5">
                    {[0, 1, 2].map((k) => (
                      <span
                        key={k}
                        className="h-8 flex-1 rounded-md"
                        style={{ background: k === 0 ? t.swatch[1] : t.swatch[2], opacity: k === 0 ? 1 : 0.55 }}
                      />
                    ))}
                  </div>
                </div>
                <p className="font-semibold text-sm flex items-center gap-1.5">
                  {t.name}
                  {active && <FiCheck className="text-emerald-400" aria-label="Activo" />}
                </p>
                <p className="text-[11px] text-slate-400">{t.inspiration}</p>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500 mt-4">← → elegir · Enter aplicar · Esc cerrar · Tecla T abre este menú</p>
      </motion.div>
    </motion.div>
  );
};
