import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiUser, FiServer, FiMonitor, FiCpu, FiLayers, FiMapPin } from 'react-icons/fi';
import { portfolioData } from '../data/portfolio';
import { AudioVisualizer } from '../components/common/AudioVisualizer';
import { GithubActivity } from '../components/common/GithubActivity';
import { VulnHunterGame } from '../components/common/VulnHunterGame';
import { RevealText } from '../components/common/RevealText';

// Fed to the public iTunes Search API at runtime — no audio files to upload. Swap these for
// whatever genres/artists fit your taste; the widget adapts automatically.
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
  const { personal, skills } = portfolioData;
  const [vulnGameOpen, setVulnGameOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-20">
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
            {t('about.subtitle')}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start mb-16">
        {/* Main Bio */}
        <motion.div 
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}
          className="md:col-span-2 space-y-6"
        >
          <h2 className="text-2xl font-light text-[var(--theme-ink)] leading-snug">
            <RevealText text={t('about.mainTitle')} stagger={30} />
          </h2>
          <div className="space-y-4 text-sm text-[var(--theme-ink-muted)] leading-relaxed font-light">
            <p>{t('about.bio1')}</p>
            <p>{t('about.bio2')}</p>
            <p>{t('about.bio3')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="editorial-card p-4 rounded-lg space-y-1">
              <h4 className="text-[var(--theme-accent)] uppercase font-mono text-xs font-semibold">{t('about.valuesTitle')}</h4>
              <p className="text-xs text-[var(--theme-ink-muted)] font-light">{t('about.valuesDesc')}</p>
            </div>
            <div className="editorial-card p-4 rounded-lg space-y-2">
              <h4 className="text-[var(--theme-ink)] uppercase font-mono text-xs font-semibold">{t('about.securityTitle')}</h4>
              <p className="text-xs text-[var(--theme-ink-muted)] font-light">{t('about.securityDesc')}</p>
              <button
                onClick={() => setVulnGameOpen(true)}
                className="text-[10px] font-mono uppercase tracking-wider text-red-500 hover:text-red-400 underline decoration-dotted"
              >
                Jugar: Detecta la Vulnerabilidad →
              </button>
            </div>
          </div>

          {/* Passions: Anime, Gaming, AI, Game Dev & Music */}
          <div className="editorial-card p-5 rounded-lg space-y-3 mt-4 border border-[var(--theme-border-strong)]">
            <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-2">
              <h4 className="text-xs font-mono font-bold text-[var(--theme-ink)] uppercase tracking-wider">
                🎮 Intereses Creativos & Game Dev
              </h4>
              <a 
                href={`${import.meta.env.BASE_URL}laboratorio`}
                className="text-[10px] font-mono text-[var(--theme-accent)] hover:underline"
              >
                Abrir Laboratorio RPG →
              </a>
            </div>
            <p className="text-xs text-[var(--theme-ink-muted)] leading-relaxed font-light">
              Apasionado por la creación de videojuegos independientes, emulación de RPG Maker (MV/MZ), narrativa y combate por turnos; integración de Inteligencia Artificial en flujos de desarrollo; y afición por el anime y bandas sonoras orquestales (NieR, Persona, Ghibli).
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="badge-accent">RPG Maker Web</span>
              <span className="badge-accent">Game Dev (C# / Unity)</span>
              <span className="badge-accent">Anime Soundtracks</span>
              <span className="badge-accent">Inteligencia Artificial</span>
              <span className="badge-accent">Pixel Art & Sprites</span>
            </div>
          </div>
        </motion.div>

        {vulnGameOpen && <VulnHunterGame onClose={() => setVulnGameOpen(false)} />}

        {/* Sidebar info */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          className="space-y-6"
        >
        <motion.div
          variants={fadeUpVariant}
          className="editorial-card p-5 rounded-lg space-y-6"
        >
          <div>
            <span className="text-xs font-mono text-[var(--theme-accent)] tracking-widest uppercase block mb-3">
              {t('about.ficheTitle')}
            </span>
            <div className="space-y-3 text-xs font-mono text-[var(--theme-ink)]">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border)]">
                <span className="text-[var(--theme-ink-muted)]">{t('about.location')}:</span>
                <span className="flex items-center gap-1"><FiMapPin className="w-3.5 h-3.5 text-[var(--theme-accent)]" /> Quito, Ecuador</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border)]">
                <span className="text-[var(--theme-ink-muted)]">{t('about.timezone')}:</span>
                <span>UTC-5</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border)]">
                <span className="text-[var(--theme-ink-muted)]">{t('about.language')}:</span>
                <span>Español / English</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--theme-ink-muted)]">{t('about.status')}:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{personal.status}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--theme-border)] space-y-2">
            <span className="text-xs font-mono text-[var(--theme-accent)] tracking-widest uppercase block mb-2">
              {t('about.toolsTitle')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <span className="badge">Visual Studio</span>
              <span className="badge">VS Code</span>
              <span className="badge">Git & GitHub</span>
              <span className="badge">Docker</span>
              <span className="badge">Postman</span>
              <span className="badge">SQL Management</span>
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={fadeUpVariant} className="editorial-card p-5 rounded-lg space-y-3">
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

          <motion.div variants={fadeUpVariant} className="editorial-card p-5 rounded-lg space-y-3">
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

          <motion.div variants={fadeUpVariant} className="editorial-card p-5 rounded-lg space-y-3">
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

          <motion.div variants={fadeUpVariant} className="editorial-card p-5 rounded-lg space-y-3">
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
