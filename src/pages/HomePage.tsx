import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiArrowRight, FiDownload, FiCopy, FiCheck, FiMonitor, FiServer,
  FiLayers, FiBox, FiTerminal, FiBookOpen, FiAward,
  FiCpu, FiZap, FiCheckCircle, FiGithub, FiLinkedin
} from 'react-icons/fi';
import { SiTwitch } from 'react-icons/si';
import { portfolioData } from '../data/portfolio';
import { CountUp } from '../components/common/CountUp';
import { RevealText } from '../components/common/RevealText';
import { Magnetic } from '../components/common/Magnetic';
import { ProjectReel } from '../components/common/ProjectReel';
import { AnimeGridCanvas } from '../components/common/AnimeGridCanvas';
import { ArchitectureDiagram } from '../components/common/ArchitectureDiagram';
import { TwitchLiveStatus } from '../components/common/TwitchLiveStatus';
import type { IProject } from '../types/portfolio.types';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 90, damping: 18 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const STACK_CARDS = [
  {
    icon: <FiMonitor className="w-5 h-5" />,
    label: 'Frontend & Mobile',
    tech: ['Angular', 'React Native', 'TypeScript', 'Tailwind CSS', 'RxJS'],
  },
  {
    icon: <FiServer className="w-5 h-5" />,
    label: 'Backend & Server',
    tech: ['.NET 8', 'C#', 'Java Spring/Core', 'REST APIs', 'JWT Auth'],
  },
  {
    icon: <FiLayers className="w-5 h-5" />,
    label: 'Arquitectura & Core',
    tech: ['Clean Architecture', 'CQRS', 'DDD', 'MediatR', 'Event-Driven'],
  },
  {
    icon: <FiBox className="w-5 h-5" />,
    label: 'Infra & Data',
    tech: ['Docker', 'Kubernetes', 'SQL Server', 'MySQL', 'SQLite'],
  },
];

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { personal, manifesto, teachingHighlights } = portfolioData;

  const translatedProjects = t('projectsData', { returnObjects: true }) as Partial<IProject>[];
  const projects: IProject[] = portfolioData.projects.map(p => {
    const tr = (Array.isArray(translatedProjects) ? translatedProjects : []).find(ti => ti.id === p.id) || {};
    return { ...p, ...tr };
  });
  const featured = projects.filter(p => p.isFeatured).slice(0, 5);

  const [copied, setCopied] = useState(false);
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* silent */ }
  };

  return (
    <div className="max-w-5xl mx-auto px-6">

      {/* ─── 01 / DEV IDENTITY HERO ─────────────────────────────── */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={stagger}
        className="pt-32 md:pt-40 pb-16 border-b border-[var(--theme-border)] relative"
      >
        <AnimeGridCanvas />
        <motion.div variants={fadeUp} className="flex items-center justify-between gap-4 mb-4 relative z-10">
          <span className="section-index">01 / {t('home.profileBadge')}</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-[var(--theme-accent)] font-semibold uppercase tracking-wider">
              {personal.status}
            </span>
          </div>
        </motion.div>

        {/* Hero Bento Grid Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-2">
          
          {/* Main Info */}
          <motion.div variants={fadeUp} className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-accent py-1">Full Stack &amp; Mobile Lead @ ISTPET</span>
                <span className="badge py-1">Docente Técnico Superior</span>
                <span className="badge py-1">Quito, Ecuador (UTC-5)</span>
              </div>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-[var(--theme-ink)] tracking-tight font-semibold"
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
              >
                <RevealText text={personal.name} stagger={18} />
              </h1>
              <p className="text-sm font-mono text-[var(--theme-accent)] font-medium">
                {personal.title} • {personal.subtitle}
              </p>
            </div>

            <p className="text-base text-[var(--theme-ink-muted)] leading-relaxed font-light max-w-xl">
              {personal.bio}
            </p>

            {/* Motto / Personal Quote */}
            <div className="p-4 rounded-xl border border-[var(--theme-border-strong)] bg-[var(--theme-surface)]/80 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--theme-accent)]" />
              <p className="text-xs sm:text-sm font-mono text-[var(--theme-ink)] italic pl-2">
                "{personal.tagline}"
              </p>
            </div>

            {/* Action Buttons & Socials */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Magnetic>
                <Link to="/proyectos" className="btn-primary">
                  {t('hero.viewProjects')}
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Magnetic>

              <a
                href={`${import.meta.env.BASE_URL}CV_Anthony_Pilatasig.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <FiDownload className="w-3.5 h-3.5" />
                {t('hero.downloadCv')}
              </a>

              <button onClick={handleCopyEmail} className="btn-secondary">
                {copied
                  ? <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                  : <FiCopy className="w-3.5 h-3.5" />}
                <span>{copied ? t('hero.emailCopied') : t('hero.copyEmail')}</span>
              </button>

              <Link to="/terminal" className="btn-secondary text-xs">
                <FiTerminal className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                <span>CLI Terminal</span>
              </Link>
            </div>

            {/* Social Links Strip */}
            <div className="flex items-center gap-4 pt-1 font-mono text-xs text-[var(--theme-ink-muted)]">
              <a
                href={personal.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[var(--theme-accent)] transition-colors"
              >
                <FiGithub className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[var(--theme-accent)] transition-colors"
              >
                <FiLinkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <a
                href={personal.twitch}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#9146FF] transition-colors"
              >
                <SiTwitch className="w-3.5 h-3.5 text-[#9146FF]" />
                <span>Twitch</span>
              </a>
              <Link
                to="/laboratorio"
                className="flex items-center gap-1.5 hover:text-[var(--theme-accent)] transition-colors ml-auto"
              >
                <FiZap className="w-3.5 h-3.5 text-amber-500" />
                <span>AP-Deck Lab →</span>
              </Link>
            </div>
          </motion.div>

          {/* Dev Identity Card with Real Avatar */}
          <motion.div variants={fadeUp} className="lg:col-span-4 flex flex-col items-center">
            <div className="editorial-card p-4 rounded-2xl w-full max-w-sm space-y-4 border border-[var(--theme-border-strong)] relative group">
              
              {/* Photo Frame */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-[var(--theme-bg)] border border-[var(--theme-border)]">
                <img
                  src={personal.avatar}
                  alt={personal.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)]/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-200 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    Anthony Pilatasig
                  </span>
                  <span className="text-amber-300">Full Stack &amp; Mobile Lead</span>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2.5 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)]">
                  <span className="text-lg font-bold text-[var(--theme-ink)] block">
                    <CountUp end={7} suffix="+" />
                  </span>
                  <span className="text-[9px] text-[var(--theme-ink-muted)] uppercase">Sistemas &amp; Apps</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)]">
                  <span className="text-lg font-bold text-[var(--theme-ink)] block">
                    <CountUp end={2} suffix="+ Años" />
                  </span>
                  <span className="text-[9px] text-[var(--theme-ink-muted)] uppercase">Docencia Técnica</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ─── 02 / ENGINEERING MANIFESTO (SELLO DE SENIORITY) ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="py-16 border-b border-[var(--theme-border)]"
      >
        <motion.div variants={fadeUp} className="mb-8">
          <span className="section-index">02 / MANIFIESTO &amp; PRINCIPIOS DE INGENIERÍA</span>
          <h2 className="text-2xl font-semibold text-[var(--theme-ink)] tracking-tight">
            Mis Reglas No Negociables de Arquitectura
          </h2>
          <p className="text-xs font-mono text-[var(--theme-ink-muted)] mt-1">
            Criterio técnico forjado liderando sistemas empresariales institucionales y cátedras universitarias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {manifesto.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="editorial-card p-5 rounded-xl space-y-2 border border-[var(--theme-border)] hover:border-[var(--theme-accent)] transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[var(--theme-accent)] px-2 py-0.5 rounded bg-[var(--theme-accent)]/10">
                  {item.number}
                </span>
                <h3 className="font-mono text-xs font-bold text-[var(--theme-ink)] uppercase tracking-wide">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-[var(--theme-ink-muted)] leading-relaxed font-light">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── 03 / SELECTED WORK ───────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="py-16 border-b border-[var(--theme-border)]"
      >
        <motion.div variants={fadeUp} className="flex items-end justify-between mb-8">
          <div>
            <span className="section-index">03 / {t('projects.badge')}</span>
            <h2 className="text-2xl font-semibold text-[var(--theme-ink)] tracking-tight">{t('projects.title')}</h2>
            <p className="text-xs font-mono text-[var(--theme-ink-muted)] mt-1">
              Cores institucionales, aplicaciones móviles, software nativo de escritorio y motores de videojuegos.
            </p>
          </div>
          <Link
            to="/proyectos"
            className="font-mono text-xs text-[var(--theme-ink-muted)] hover:text-[var(--theme-accent)] transition-colors flex items-center gap-1 shrink-0"
          >
            {t('home.viewAll', { count: projects.length })}
            <FiArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        <div className="divide-y divide-[var(--theme-border)]">
          {featured.map((p, idx) => (
            <motion.div
              key={p.id}
              variants={fadeUp}
            >
              <Link
                to="/proyectos"
                className="flex flex-col sm:flex-row sm:items-center gap-4 py-5 group hover:text-[var(--theme-accent)] transition-colors"
              >
                <span className="font-mono text-xs text-[var(--theme-ink-muted)] w-8 shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-[var(--theme-ink)] group-hover:text-[var(--theme-accent)] transition-colors truncate">
                      {p.title}
                    </h3>
                    {p.architectureBadges && p.architectureBadges[0] && (
                      <span className="badge-accent py-0.5 text-[9px] hidden md:inline-flex">
                        {p.architectureBadges[0]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--theme-ink-muted)] font-light truncate mt-0.5">
                    {p.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="badge">{p.category}</span>
                  <FiArrowRight className="w-4 h-4 text-[var(--theme-ink-muted)] group-hover:text-[var(--theme-accent)] group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-8">
          <ProjectReel projects={projects} />
        </motion.div>
      </motion.section>

      {/* ─── 04 / ARQUITECTURA & CQRS EN VIVO ─────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="py-16 border-b border-[var(--theme-border)]"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <span className="section-index">04 / INGENIERÍA DE SOFTWARE &amp; ARQUITECTURA</span>
          <h2 className="text-2xl font-semibold text-[var(--theme-ink)] tracking-tight">
            Diseño por Capas &amp; Patrón CQRS (.NET 8)
          </h2>
          <p className="text-xs font-mono text-[var(--theme-ink-muted)] mt-1">
            Explora interactivamente la estructura desacoplada utilizada en los cores de <strong>Gacad</strong> y <strong>Mi ISTPET</strong>.
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <ArchitectureDiagram />
        </motion.div>
      </motion.section>

      {/* ─── 05 / UNIVERSIDAD & DOCENCIA TÉCNICA (LEADERSHIP) ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="py-16 border-b border-[var(--theme-border)]"
      >
        <motion.div variants={fadeUp} className="mb-8">
          <span className="section-index">05 / LIDERAZGO &amp; DOCENCIA UNIVERSITARIA</span>
          <h2 className="text-2xl font-semibold text-[var(--theme-ink)] tracking-tight">
            Formación Técnica &amp; Mentoría Universitaria
          </h2>
          <p className="text-xs font-mono text-[var(--theme-ink-muted)] mt-1">
            Impartiendo cátedras de programación avanzada, estructuras de datos y buenas prácticas de ingeniería en ISTPET.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teachingHighlights.map((teach, i) => (
            <motion.div key={i} variants={fadeUp} className="editorial-card p-5 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-[var(--theme-border)] pb-2 mb-2">
                  <div className="flex items-center gap-2 text-[var(--theme-accent)]">
                    <FiBookOpen className="w-4 h-4" />
                    <span className="font-mono text-[10px] font-bold uppercase">{teach.studentsCount}</span>
                  </div>
                  <FiAward className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <h3 className="font-mono text-xs font-bold text-[var(--theme-ink)] mb-1">
                  {teach.subject}
                </h3>
                <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
                  {teach.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 pt-2">
                {teach.focus.map((f) => (
                  <span key={f} className="badge text-[9px] py-0.5">
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── 06 / STACK & ARQUITECTURA ───────────────── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="py-16 border-b border-[var(--theme-border)]"
      >
        <motion.div variants={fadeUp}>
          <span className="section-index">06 / {t('techShowcase.badge')}</span>
          <h2 className="text-2xl font-semibold text-[var(--theme-ink)] tracking-tight mb-8">
            {t('techShowcase.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {STACK_CARDS.map((card, i) => (
            <motion.div key={i} variants={fadeUp} className="editorial-card p-5 rounded-xl space-y-3">
              <div className="text-[var(--theme-accent)]">{card.icon}</div>
              <h3 className="font-mono text-xs font-semibold text-[var(--theme-ink)] uppercase tracking-wide">
                {card.label}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {card.tech.map(tech => (
                  <span key={tech} className="badge">{tech}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── 07 / TWITCH LIVE HUB & COMMUNITY ─────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeUp}
        className="py-12 border-b border-[var(--theme-border)]"
      >
        <span className="section-index mb-2 block">07 / COMUNIDAD &amp; STREAMING EN VIVO</span>
        <TwitchLiveStatus channel="anthony_pilatasig" />
      </motion.section>

      {/* ─── 08 / GET IN TOUCH ────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-20"
      >
        <span className="section-index">08 / {t('contact.badge')}</span>
        <h2
          className="text-3xl md:text-4xl text-[var(--theme-ink)] tracking-tight mt-2 mb-6"
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
        >
          ¿Construimos algo extraordinario juntos?
        </h2>
        <p className="text-sm font-light text-[var(--theme-ink-muted)] max-w-xl mb-6">
          Disponible para roles de Full Stack Senior / Lead (.NET 8 + Angular / React + Mobile), Arquitectura de Software y proyectos de alto rendimiento.
        </p>
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <Link to="/contacto" className="btn-primary">
              {t('nav.contact')} <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Magnetic>
          <a href={personal.github} target="_blank" rel="noreferrer" className="btn-secondary">
            GitHub
          </a>
          <a href={personal.linkedin} target="_blank" rel="noreferrer" className="btn-secondary">
            LinkedIn
          </a>
          <a href={personal.twitch} target="_blank" rel="noreferrer" className="btn-secondary text-[#9146FF]">
            Twitch
          </a>
        </div>
      </motion.section>
    </div>
  );
};

