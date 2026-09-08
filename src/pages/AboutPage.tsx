import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FiServer, FiMonitor, FiCpu, FiLayers, FiMapPin,
  FiZap, FiShield, FiGithub, FiLinkedin
} from 'react-icons/fi';
import { SiTwitch } from 'react-icons/si';
import { portfolioData } from '../data/portfolio';
import { AudioVisualizer } from '../components/common/AudioVisualizer';
import { GithubActivity } from '../components/common/GithubActivity';
import { VulnHunterGame } from '../components/common/VulnHunterGame';
import { RevealText } from '../components/common/RevealText';
import { SEO } from '../components/common/SEO';

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
            <RevealText text="De la Lógica de Videojuegos a la Arquitectura de Software" stagger={25} />
          </h2>

          <div className="space-y-4 text-sm text-[var(--theme-ink-muted)] leading-relaxed font-light">
            <p>
              Soy <strong>Anthony David Pilatasig Macas</strong>. Mi interés por la programación nació explorando la lógica detrás de los videojuegos: creando mecánicas por turnos, entendiendo estados y experimentando con estructuras de datos. Aprendí temprano que tanto el loop de un juego en Java como un sistema institucional con miles de consultas comparten un mismo pilar: <em>la claridad en la separación de responsabilidades y el control estricto de excepciones</em>.
            </p>
            <p>
              Como <strong>Full Stack Developer &amp; Mobile Lead en el ISTPET</strong>, desarrollo la app móvil oficial <strong>Mi ISTPET</strong> (React Native en Google Play Store), la modernización del core académico <strong>Gacad</strong> y el sistema de <strong>Recursos Humanos</strong> con contratos y expedientes digitales, utilizando <strong>.NET 8, C#, Angular, Clean Architecture y CQRS</strong>.
            </p>
            <p>
              En paralelo, ejerzo la <strong>docencia técnica superior</strong> en el ISTPET impartiendo cátedras de Programación Orientada a Objetos (POO), algoritmos y control de versiones con Git/GitHub. Para mí, enseñar refuerza la disciplina de escribir código legible, modular y libre de complicaciones innecesarias.
            </p>
          </div>

          {/* Core Values & Security Sandbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="editorial-card p-4 rounded-xl space-y-1.5 border border-[var(--theme-border)]">
              <h4 className="text-[var(--theme-accent)] uppercase font-mono text-xs font-semibold flex items-center gap-1.5">
                <FiZap className="w-3.5 h-3.5" />
                <span>{t('about.valuesTitle')}</span>
              </h4>
              <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
                Clean Code, desacoplamiento estricto, pruebas automatizadas y mantenibilidad a largo plazo sin deuda técnica oculta.
              </p>
            </div>
            <div className="editorial-card p-4 rounded-xl space-y-2 border border-[var(--theme-border)]">
              <h4 className="text-red-500 uppercase font-mono text-xs font-semibold flex items-center gap-1.5">
                <FiShield className="w-3.5 h-3.5" />
                <span>{t('about.securityTitle')}</span>
              </h4>
              <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
                DevSecOps, RBAC estricto, validación criptográfica de tokens y pistas de auditoría inmutables.
              </p>
              <button
                onClick={() => setVulnGameOpen(true)}
                className="text-[10px] font-mono uppercase tracking-wider text-red-500 hover:text-red-400 underline decoration-dotted block pt-1"
              >
                🎮 Jugar: Detecta la Vulnerabilidad →
              </button>
            </div>
          </div>

          {/* Passions: Anime, Gaming, AI, Game Dev & Music */}
          <div className="editorial-card p-5 rounded-xl space-y-3 mt-4 border border-[var(--theme-border-strong)]">
            <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-2">
              <h4 className="text-xs font-mono font-bold text-[var(--theme-ink)] uppercase tracking-wider flex items-center gap-2">
                🎮 Pasiones Creativas, Gaming &amp; Anime
              </h4>
              <a 
                href={`${import.meta.env.BASE_URL}laboratorio`}
                className="text-[10px] font-mono text-[var(--theme-accent)] hover:underline"
              >
                Abrir Laboratorio AP-Deck →
              </a>
            </div>
            <p className="text-xs text-[var(--theme-ink-muted)] leading-relaxed font-light">
              Fuera del backend empresarial, disfruto del desarrollo de videojuegos en Java y Unity (como mi proyecto <strong>RPG Journey</strong>), la emulación WebAssembly, el universo de <em>Sword Art Online</em>, <em>Zenless Zone Zero</em>, <em>Genshin Impact</em>, <em>Resident Evil</em>, streaming ocasional en <strong>Twitch</strong>, y las bandas sonoras orquestales de <em>NieR:Automata</em>, <em>Persona 5</em> y Studio Ghibli.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="badge-accent">RPG Engine Dev</span>
              <span className="badge-accent">Sword Art Online</span>
              <span className="badge-accent">Twitch Streaming</span>
              <span className="badge-accent">WebAssembly Emulation</span>
              <span className="badge-accent">Anime Soundtracks</span>
              <span className="badge-accent">Pixel Art &amp; Sprites</span>
            </div>
          </div>
        </motion.div>

        {vulnGameOpen && <VulnHunterGame onClose={() => setVulnGameOpen(false)} />}

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
                <span className="text-[var(--theme-ink-muted)]">Zona Horaria:</span>
                <span>UTC-5</span>
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

