import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiCpu, FiZap, FiMonitor, FiUpload, FiExternalLink
} from 'react-icons/fi';
import { Gamepad2 } from 'lucide-react';

export const LabPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-20 font-sans">

      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-[var(--theme-border)] pb-8"
      >
        <div>
          <span className="section-index">05 / GAME DEV &amp; VIRTUAL CONSOLE</span>
          <h1 className="text-4xl md:text-6xl font-sans font-semibold text-[var(--theme-ink)] tracking-tight flex items-center gap-3">
            <Gamepad2 className="w-10 h-10 text-[var(--theme-accent)]" />
            <span>Laboratorio &amp; Consola Virtual</span>
          </h1>
          <p className="text-sm font-mono text-[var(--theme-ink-muted)] mt-2 max-w-2xl">
            Simulador interactivo de consola estilo Switch / PS5. Juega mini-games nativos, usa RetroArch en WebAssembly o sube tu propio juego en formato <code>.zip</code>.
          </p>
        </div>
      </motion.div>

      {/* ─── Console Preview Card → /console ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="mb-14"
      >
        {/* Big launch card */}
        <div
          className="relative rounded-[28px] overflow-hidden cursor-pointer group"
          onClick={() => navigate('/console')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/console')}
          style={{
            background: 'linear-gradient(135deg, #0F1629 0%, #050811 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
            boxShadow: '0 0 60px rgba(99,102,241,0.08)',
            minHeight: 320,
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)',
            }}
          />

          {/* Noise texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Gamepad watermark */}
          <div className="absolute -right-10 -bottom-10 opacity-[0.04] pointer-events-none">
            <Gamepad2 className="w-80 h-80 text-white" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-10 lg:p-14 flex flex-col gap-6">
            {/* Top badge row */}
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest"
                style={{ background: 'rgba(99,102,241,0.2)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.3)' }}
              >
                Virtual Console
              </span>
              <span className="flex items-center gap-1.5 text-[11px]" style={{ color: '#34D399' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En línea
              </span>
            </div>

            {/* Title */}
            <div>
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.02] tracking-tight"
                style={{ color: '#fff' }}
              >
                AP-Deck
              </h2>
              <p className="text-slate-400 mt-3 text-base max-w-lg leading-relaxed">
                Dashboard estilo Switch / PS5. Carga juegos desde <strong className="text-slate-200">.zip</strong>, juega con RetroArch en WebAssembly, o disfruta los mini-games integrados.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: <FiUpload className="w-3.5 h-3.5" />, label: 'Carga .zip sin descomprimir' },
                { icon: <Gamepad2 className="w-3.5 h-3.5" />, label: 'RetroArch WebAssembly' },
                { icon: <FiMonitor className="w-3.5 h-3.5" />, label: 'Pantalla completa' },
                { icon: <FiCpu className="w-3.5 h-3.5" />, label: 'Compatible con móvil' },
              ].map(f => (
                <span
                  key={f.label}
                  className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}
                >
                  {f.icon}
                  {f.label}
                </span>
              ))}
            </div>

            {/* CTA button */}
            <div className="flex items-center gap-4 mt-2">
              <button
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all active:scale-95 group-hover:shadow-xl"
                style={{
                  background: '#fff',
                  color: '#0F172A',
                  boxShadow: '0 0 24px rgba(255,255,255,0.1)',
                }}
                onClick={e => { e.stopPropagation(); navigate('/console'); }}
              >
                <FiExternalLink className="w-4 h-4" />
                Abrir AP-Deck
              </button>
              <span className="text-[12px] text-slate-500">
                5 juegos disponibles
              </span>
            </div>
          </div>

          {/* Mini preview tiles strip at bottom */}
          <div
            className="relative z-10 flex items-center gap-2 px-8 sm:px-10 lg:px-14 pb-8 overflow-x-auto"
            onClick={e => e.stopPropagation()}
          >
            {[
              { color: '#6366F1', label: 'ZIP' },
              { color: '#F43F5E', label: 'RetroArch' },
              { color: '#06B6D4', label: 'Cyber' },
              { color: '#10B981', label: 'Snake' },
              { color: '#F59E0B', label: '2048' },
            ].map(g => (
              <div
                key={g.label}
                className="shrink-0 w-14 h-14 rounded-[14px] flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${g.color}33 0%, rgba(10,13,20,0.9) 100%)`,
                  border: `1px solid ${g.color}44`,
                }}
              >
                <span className="text-[9px] font-semibold text-center leading-tight px-1" style={{ color: g.color }}>
                  {g.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Info Cards ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono"
      >
        <div className="editorial-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-[var(--theme-accent)]">
            <FiUpload className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-ink)]">
              Carga de Juegos ZIP
            </h3>
          </div>
          <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
            Sube cualquier juego web empaquetado en <code>.zip</code> (con <code>index.html</code> en la raíz). Se extrae con JSZip directamente en memoria — sin subir nada a ningún servidor.
          </p>
          <div className="pt-2 flex flex-wrap gap-1.5">
            <span className="badge-accent text-[9px]">JSZip</span>
            <span className="badge-accent text-[9px]">Blob URLs</span>
            <span className="badge-accent text-[9px]">100% Local</span>
          </div>
        </div>

        <div className="editorial-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-[var(--theme-accent)]">
            <FiCpu className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-ink)]">
              RetroArch WebAssembly
            </h3>
          </div>
          <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
            Ranura de cartuchos real con libretro compilado a WASM — cores mGBA, Gambatte y FCEUmm. Sube tu propia ROM y juega GBA, GBC o NES directamente en el navegador.
          </p>
          <div className="pt-2 flex flex-wrap gap-1.5">
            <span className="badge-accent text-[9px]">mGBA · GBC · NES</span>
            <span className="badge-accent text-[9px]">libretro WASM</span>
            <span className="badge-accent text-[9px]">Autoalojado</span>
          </div>
        </div>

        <div className="editorial-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-[var(--theme-accent)]">
            <FiZap className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-ink)]">
              Mini-Games Integrados
            </h3>
          </div>
          <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
            Cyber-Encounter (RPG táctico), Retro Snake 8-Bit y 2048 Logic Matrix — construidos 100% en TypeScript con síntesis de audio Web Audio API y soporte de gamepad.
          </p>
          <div className="pt-2 flex flex-wrap gap-1.5">
            <span className="badge-accent text-[9px]">Turn-Based</span>
            <span className="badge-accent text-[9px]">WebAudio Synth</span>
            <span className="badge-accent text-[9px]">Gamepad API</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
