import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiCpu, FiZap, FiMonitor, FiExternalLink
} from 'react-icons/fi';
import { Gamepad2 } from 'lucide-react';
import { RevealText } from '@presentation/components/ui/RevealText';
import { SEO } from '@presentation/components/ui/SEO';

const MODE_COUNT = 5;

const PREVIEW_TILES = [
  { color: '#F43F5E', label: 'RPG' },
  { color: '#EF4444', label: 'WASM' },
  { color: '#06B6D4', label: 'Cyber' },
  { color: '#10B981', label: 'Snake' },
  { color: '#F59E0B', label: '2048' },
];

export const LabPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const infoCards = [
    {
      key: 'rpgmaker',
      icon: <Gamepad2 className="w-5 h-5" />,
    },
    {
      key: 'wasm',
      icon: <FiCpu className="w-5 h-5" />,
    },
    {
      key: 'native',
      icon: <FiZap className="w-5 h-5" />,
    },
  ] as const;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 md:pt-36 pb-24 font-sans">
      <SEO title={`${t('lab.title')} — Anthony Pilatasig`} description={t('lab.subtitle')} />

      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-[var(--theme-border)] pb-8"
      >
        <div>
          <span className="section-index">{t('lab.badge')}</span>
          <h1 className="text-4xl md:text-6xl font-sans font-semibold text-[var(--theme-ink)] tracking-tight flex items-center gap-3">
            <Gamepad2 className="w-9 h-9 md:w-10 md:h-10 text-[var(--theme-accent)] shrink-0" />
            <RevealText text={t('lab.title')} />
          </h1>
          <p className="text-sm font-mono text-[var(--theme-ink-muted)] mt-2 max-w-2xl">
            {t('lab.subtitle')}
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
            border: '1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)',
            boxShadow: '0 0 60px color-mix(in srgb, var(--theme-accent) 12%, transparent)',
            minHeight: 320,
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, var(--theme-accent) 22%, transparent) 0%, transparent 70%)',
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
                style={{
                  background: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)',
                  color: 'var(--theme-accent)',
                  border: '1px solid color-mix(in srgb, var(--theme-accent) 35%, transparent)',
                }}
              >
                {t('lab.consoleEyebrow')}
              </span>
              <span className="flex items-center gap-1.5 text-[11px]" style={{ color: '#34D399' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t('lab.consoleStatus')}
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
                {t('lab.consoleDesc')}
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: <Gamepad2 className="w-3.5 h-3.5" />, label: t('lab.features.rpgmaker') },
                { icon: <FiCpu className="w-3.5 h-3.5" />, label: t('lab.features.wasm') },
                { icon: <FiMonitor className="w-3.5 h-3.5" />, label: t('lab.features.fullscreen') },
                { icon: <FiZap className="w-3.5 h-3.5" />, label: t('lab.features.mobile') },
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
                {t('lab.consoleCta')}
              </button>
              <span className="text-[12px] text-slate-500">
                {t('lab.consoleModes', { count: MODE_COUNT })}
              </span>
            </div>
          </div>

          {/* Mini preview tiles strip at bottom */}
          <div
            className="relative z-10 flex items-center gap-2 px-8 sm:px-10 lg:px-14 pb-8 overflow-x-auto"
            onClick={e => e.stopPropagation()}
          >
            {PREVIEW_TILES.map(g => (
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
        {infoCards.map(({ key, icon }) => (
          <div key={key} className="editorial-card p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-[var(--theme-accent)]">
              {icon}
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-ink)]">
                {t(`lab.cards.${key}.title`)}
              </h3>
            </div>
            <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
              {t(`lab.cards.${key}.desc`)}
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              {(t(`lab.cards.${key}.tags`, { returnObjects: true }) as string[]).map(tag => (
                <span key={tag} className="badge-accent text-[9px]">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
