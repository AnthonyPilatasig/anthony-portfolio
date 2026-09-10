import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FiServer, FiMonitor, FiCpu, FiLayers, FiMapPin,
  FiZap, FiShield, FiGithub, FiLinkedin
} from 'react-icons/fi';
import { SiTwitch } from 'react-icons/si';
import { getPortfolioData } from '@application/useCases/portfolio/getPortfolioData';
import { AudioVisualizer } from '@presentation/features/about/AudioVisualizer';
import { GithubActivity } from '@presentation/features/about/GithubActivity';
import { RevealText } from '@presentation/components/ui/RevealText';
import { LiveClock } from '@presentation/components/ui/LiveClock';
import { SEO } from '@presentation/components/ui/SEO';

const musicTasteSearchTerms = ['lofi hip hop', 'synthwave'];

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const { personal, skills } = getPortfolioData();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 md:pt-36 pb-24">
      <SEO
        title="Sobre Mí — Anthony Pilatasig"
        description="Full Stack Developer y Docente Técnico en Quito, Ecuador. Valores de ingeniería, afición al desarrollo de videojuegos en Java y docencia técnica en programación."
      />
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14 border-b border-[var(--theme-border)] pb-8"
      >
        <div>
          <span className="section-index">04 / {t('about.badge')}</span>
          <h1 className="text-4xl md:text-6xl font-sans font-semibold text-[var(--theme-ink)] tracking-tight">
            {t('about.title')}
          </h1>
          <p className="text-sm font-mono text-[var(--theme-ink-muted)] mt-2">
            Arquitecto de Software, Docente Técnico & Creador en Quito, Ecuador.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start mb-16">
        {/* Main Bio & Story */}
        <motion.div 
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}
          className="md:col-span-8 space-y-6"
        >
          <h2 className="text-2xl font-light text-[var(--theme-ink)] leading-snug">
            <RevealText text={t('about.mainTitle')} stagger={25} />
          </h2>

          <div className="space-y-4 text-sm text-[var(--theme-ink-muted)] leading-relaxed font-light">
            <p>{t('about.bio1')}</p>
            <p>{t('about.bio2')}</p>
            <p>{t('about.bio3')}</p>
          </div>

          {/* Core Values & Security — one consolidated card instead of two boxes */}
          <div className="editorial-card p-4 rounded-xl border border-[var(--theme-border)] divide-y divide-[var(--theme-border)] pt-2">
            <div className="pb-3 space-y-1.5">
              <h4 className="text-[var(--theme-accent)] uppercase font-mono text-xs font-semibold flex items-center gap-1.5">
                <FiZap className="w-3.5 h-3.5" />
                <span>{t('about.valuesTitle')}</span>
              </h4>
              <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
                Clean Code, desacoplamiento estricto, pruebas automatizadas y mantenibilidad a largo plazo sin deuda técnica oculta.
              </p>
            </div>
            <div className="pt-3 space-y-1.5">
              <h4 className="text-red-500 uppercase font-mono text-xs font-semibold flex items-center gap-1.5">
                <FiShield className="w-3.5 h-3.5" />
                <span>{t('about.securityTitle')}</span>
              </h4>
              <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
                DevSecOps, RBAC estricto, validación criptográfica de tokens y pistas de auditoría inmutables.
              </p>
            </div>
          </div>

          {/* Passions: Game Dev, Streaming — kept understated on purpose */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className="editorial-card p-5 rounded-xl space-y-3 mt-4 border border-[var(--theme-border)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-2">
              <h4 className="text-xs font-mono font-bold text-[var(--theme-ink)] uppercase tracking-wider flex items-center gap-2">
                <motion.span
                  className="inline-block"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🎮
                </motion.span>
                <span>Fuera del Código</span>
              </h4>
              <a
                href={`${import.meta.env.BASE_URL}laboratorio`}
                className="text-[10px] font-mono text-[var(--theme-accent)] hover:underline"
              >
                Abrir Laboratorio AP-Deck →
              </a>
            </div>
            <p className="text-xs text-[var(--theme-ink-muted)] leading-relaxed font-light">
              Fuera del backend empresarial, disfruto del desarrollo de videojuegos en Java y Unity (mi proyecto <strong>RPG Journey</strong>), la emulación retro y algo de streaming ocasional en <strong>Twitch</strong>.
            </p>
          </motion.div>
        </motion.div>

        {/* Sidebar info */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          className="md:col-span-4 space-y-6"
        >
          {/* Avatar Card */}
          <motion.div variants={fadeUpVariant} className="editorial-card p-4 rounded-2xl border border-[var(--theme-border-strong)] space-y-4">
            <div className="rounded-xl overflow-hidden aspect-square bg-[var(--theme-bg)] border border-[var(--theme-border)] relative">
              <img
                src={personal.avatar}
                alt={personal.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)]/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-mono bg-black/60 backdrop-blur-md py-1 rounded text-slate-200 border border-white/10">
                Anthony David Pilatasig
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-mono text-[var(--theme-ink)]">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border)]">
                <span className="text-[var(--theme-ink-muted)]">Ubicación:</span>
                <span className="flex items-center gap-1"><FiMapPin className="w-3.5 h-3.5 text-[var(--theme-accent)]" /> Quito, Ecuador</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border)]">
                <span className="text-[var(--theme-ink-muted)]">Hora local:</span>
                <LiveClock timeZone="America/Guayaquil" utcLabel="UTC-5" />
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border)]">
                <span className="text-[var(--theme-ink-muted)]">Idiomas:</span>
                <span>Español / English</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--theme-ink-muted)]">Rol:</span>
                <span className="text-[var(--theme-accent)] font-semibold">Full Stack Lead &amp; Docente</span>
              </div>
            </div>

            {/* Social Direct Links */}
            <div className="pt-2 border-t border-[var(--theme-border)] grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <a
                href={personal.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[var(--theme-bg)] hover:bg-[var(--theme-border)] transition-colors flex flex-col items-center gap-1 text-[var(--theme-ink)]"
              >
                <FiGithub className="w-4 h-4" />
                <span className="text-[9px]">GitHub</span>
              </a>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[var(--theme-bg)] hover:bg-[var(--theme-border)] transition-colors flex flex-col items-center gap-1 text-[var(--theme-ink)]"
              >
                <FiLinkedin className="w-4 h-4" />
                <span className="text-[9px]">LinkedIn</span>
              </a>
              <a
                href={personal.twitch}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[var(--theme-bg)] hover:bg-[var(--theme-border)] transition-colors flex flex-col items-center gap-1 text-[#9146FF]"
              >
                <SiTwitch className="w-4 h-4" />
                <span className="text-[9px]">Twitch</span>
              </a>
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <GithubActivity username="AnthonyPilatasig" />
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <AudioVisualizer searchTerms={musicTasteSearchTerms} />
          </motion.div>
        </motion.div>
      </div>

      {/* Tech Stack Signature Grid */}
      <motion.div 
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
        className="space-y-6"
      >
        <div className="border-b border-[var(--theme-border)] pb-3">
          <span className="section-index text-xs">{t('skills.badge')}</span>
          <h3 className="text-2xl font-light text-[var(--theme-ink)]"><RevealText text={t('skills.title')} stagger={25} /></h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={fadeUpVariant} className="editorial-card p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-[var(--theme-accent)] font-mono text-xs uppercase font-semibold border-b border-[var(--theme-border)] pb-2">
              <FiMonitor className="w-4 h-4" />
              <span>{t('skills.frontend')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.frontend.map((item, idx) => (
                <span key={idx} className="badge">{item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="editorial-card p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-[var(--theme-accent)] font-mono text-xs uppercase font-semibold border-b border-[var(--theme-border)] pb-2">
              <FiServer className="w-4 h-4" />
              <span>{t('skills.backend')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.backend.map((item, idx) => (
                <span key={idx} className="badge-accent">{item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="editorial-card p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-[var(--theme-accent)] font-mono text-xs uppercase font-semibold border-b border-[var(--theme-border)] pb-2">
              <FiCpu className="w-4 h-4" />
              <span>{t('skills.desktop')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.desktop.map((item, idx) => (
                <span key={idx} className="badge">{item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="editorial-card p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-[var(--theme-accent)] font-mono text-xs uppercase font-semibold border-b border-[var(--theme-border)] pb-2">
              <FiLayers className="w-4 h-4" />
              <span>{t('skills.architecture')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.architecture.concat(skills.databases).map((item, idx) => (
                <span key={idx} className="badge-accent">{item}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

