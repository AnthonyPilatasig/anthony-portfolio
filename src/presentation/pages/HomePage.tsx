import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiArrowRight, FiDownload, FiCopy, FiCheck, FiMonitor, FiServer,
  FiLayers, FiBox, FiBookOpen, FiBriefcase, FiMessageSquare,
  FiZap, FiGithub, FiLinkedin
} from 'react-icons/fi';
import { SiTwitch } from 'react-icons/si';
import { getPortfolioData } from '@application/useCases/portfolio/getPortfolioData';
import { mergeLocalizedEntries } from '@application/useCases/portfolio/mergeLocalizedEntries';
import { CountUp } from '@presentation/components/ui/CountUp';
import { RevealText } from '@presentation/components/ui/RevealText';
import { Magnetic } from '@presentation/components/ui/Magnetic';
import { ProjectReel } from '@presentation/features/projects/ProjectReel';
import { AnimeGridCanvas } from '@presentation/components/ui/AnimeGridCanvas';
import { TwitchLiveStatus } from '@presentation/features/about/TwitchLiveStatus';
import type { IProject } from '@domain/entities/portfolio.entity';

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
    tech: ['Angular', 'React', 'Ionic', 'React Native', 'TypeScript'],
  },
  {
    icon: <FiServer className="w-5 h-5" />,
    label: 'Backend',
    tech: ['.NET 8', 'C#', 'REST APIs', 'JWT', 'Java'],
  },
  {
    icon: <FiLayers className="w-5 h-5" />,
    label: 'Arquitectura',
    tech: ['Clean Architecture', 'CQRS', 'MediatR', 'FluentValidation'],
  },
  {
    icon: <FiBox className="w-5 h-5" />,
    label: 'Datos & Herramientas',
    tech: ['MySQL', 'SQL Server', 'SQLite', 'Git', 'Azure DevOps'],
  },
];

// Three entry points for the three audiences the portfolio serves.
const AUDIENCE_PATHS = [
  {
    icon: <FiBriefcase className="w-5 h-5" />,
    title: 'Busco un desarrollador',
    desc: 'Sistemas institucionales en producción, una app publicada en Google Play y cómo trabajo en equipo.',
    to: '/proyectos',
    cta: 'Ver proyectos',
  },
  {
    icon: <FiBookOpen className="w-5 h-5" />,
    title: 'Soy estudiante o institución',
    desc: 'Cómo enseño, qué materias dicto y cómo evalúo con proyectos creativos en GitHub.',
    to: '/docencia',
    cta: 'Ver docencia',
  },
  {
    icon: <FiMessageSquare className="w-5 h-5" />,
    title: 'Clases, mentorías o consultoría',
    desc: 'Talleres de programación, acompañamiento en proyectos o apoyo para modernizar un sistema.',
    to: '/contacto',
    cta: 'Escribirme',
  },
];

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const portfolioData = getPortfolioData();
  const { personal, manifesto, teachingHighlights } = portfolioData;

  const projects = mergeLocalizedEntries<IProject>(
    portfolioData.projects,
    t('projectsData', { returnObjects: true })
  );
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

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
                <span className="badge-accent py-1">Desarrollador Full Stack @ ISTPET</span>
                <span className="badge py-1">Docente de Desarrollo de Software</span>
                <span className="badge py-1">Quito, Ecuador (UTC-5)</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] text-[var(--theme-ink)] tracking-tight">
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
                to="/zona-interactiva"
                className="flex items-center gap-1.5 hover:text-[var(--theme-accent)] transition-colors ml-auto"
              >
                <FiZap className="w-3.5 h-3.5 text-amber-500" />
                <span>Zona Interactiva →</span>
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
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)]/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-200 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    Anthony Pilatasig
                  </span>
                  <span className="text-amber-300">Full Stack &amp; Docente</span>
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
                    <CountUp end={1.5} decimals={1} suffix=" años" />
                  </span>
                  <span className="text-[9px] text-[var(--theme-ink-muted)] uppercase">Como docente</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ─── ¿QUÉ BUSCAS? — accesos por tipo de visitante ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="py-12 border-b border-[var(--theme-border)]"
      >
        <motion.h2 variants={fadeUp} className="text-lg font-semibold text-[var(--theme-ink)] mb-5">
          ¿Qué te trae por aquí?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AUDIENCE_PATHS.map((path) => (
            <motion.div key={path.to} variants={fadeUp}>
              <Link to={path.to} className="glass-card group flex h-full flex-col gap-3 p-5">
                <span className="text-[var(--theme-accent)]">{path.icon}</span>
                <h3 className="text-base font-semibold text-[var(--theme-ink)]">{path.title}</h3>
                <p className="text-sm text-[var(--theme-ink-muted)] leading-relaxed flex-1">{path.desc}</p>
                <span className="font-mono text-xs text-[var(--theme-accent)] flex items-center gap-1">
                  {path.cta}
                  <FiArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── 02 / PRINCIPIOS DE TRABAJO ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="py-16 border-b border-[var(--theme-border)]"
      >
        <motion.div variants={fadeUp} className="mb-8">
          <span className="section-index">02 / CÓMO TRABAJO</span>
          <h2 className="text-2xl font-semibold text-[var(--theme-ink)] tracking-tight">
            Principios que aplico en el código y en el aula
          </h2>
          <p className="text-sm text-[var(--theme-ink-muted)] mt-1">
            Aprendidos construyendo sistemas para una institución educativa y enseñando a programar.
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
            <p className="text-sm text-[var(--theme-ink-muted)] mt-1">
              Sistemas institucionales, una app móvil publicada y proyectos personales.
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

      {/* ─── 04 / DOCENCIA ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="py-16 border-b border-[var(--theme-border)]"
      >
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="section-index">04 / DOCENCIA</span>
            <h2 className="text-2xl font-semibold text-[var(--theme-ink)] tracking-tight">
              Enseño con casos reales, no solo con teoría
            </h2>
            <p className="text-sm text-[var(--theme-ink-muted)] mt-1 max-w-2xl">
              Docente de la carrera de Desarrollo de Software en el ISTPET. Llevo al aula lo que vivo en el trabajo:
              equipos, código heredado y proyectos que los estudiantes construyen en GitHub.
            </p>
          </div>
          <Link to="/docencia" className="btn-secondary shrink-0">
            Ver mi perfil docente <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teachingHighlights.map((teach) => (
            <motion.div key={teach.subject} variants={fadeUp} className="glass-card p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[var(--theme-accent)] mb-2">
                  <FiBookOpen className="w-4 h-4" />
                  <span className="font-mono text-[11px] font-semibold uppercase">{teach.studentsCount}</span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--theme-ink)] mb-1">{teach.subject}</h3>
                <p className="text-sm text-[var(--theme-ink-muted)] leading-relaxed">{teach.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 pt-2">
                {teach.focus.map((f) => (
                  <span key={f} className="badge text-[11px] py-0.5">{f}</span>
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
          <span className="section-index">05 / {t('techShowcase.badge')}</span>
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
        <span className="section-index mb-2 block">06 / COMUNIDAD &amp; STREAMING</span>
        <TwitchLiveStatus channel="anthonworld" />
      </motion.section>

      {/* ─── 08 / GET IN TOUCH ────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-20"
      >
        <span className="section-index">07 / {t('contact.badge')}</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--theme-ink)] tracking-tight mt-2 mb-6">
          ¿Trabajamos juntos?
        </h2>
        <p className="text-sm font-light text-[var(--theme-ink-muted)] max-w-xl mb-6">
          Abierto a puestos de desarrollo Full Stack (Angular, React, Ionic y .NET), clases y talleres de programación, mentorías y consultorías.
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

