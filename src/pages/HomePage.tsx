import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiDownload, FiCopy, FiCheck, FiMonitor, FiServer, FiLayers, FiBox } from 'react-icons/fi';
import { portfolioData } from '../data/portfolio';
import { CountUp } from '../components/common/CountUp';
import { RevealText } from '../components/common/RevealText';
import { Magnetic } from '../components/common/Magnetic';
import { ProjectReel } from '../components/common/ProjectReel';
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
    tech: ['Angular', 'React Native', 'TypeScript', 'Tailwind'],
  },
  {
    icon: <FiServer className="w-5 h-5" />,
    label: 'Backend & APIs',
    tech: ['.NET 8', 'C#', 'JWT', 'REST'],
  },
  {
    icon: <FiLayers className="w-5 h-5" />,
    label: 'Arquitectura',
    tech: ['Clean Arch', 'CQRS', 'DDD'],
  },
  {
    icon: <FiBox className="w-5 h-5" />,
    label: 'Infraestructura',
    tech: ['Docker', 'Kubernetes', 'CI/CD'],
  },
];

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { personal } = portfolioData;

  const translatedProjects = t('projectsData', { returnObjects: true }) as Partial<IProject>[];
  const projects: IProject[] = portfolioData.projects.map(p => {
    const tr = (Array.isArray(translatedProjects) ? translatedProjects : []).find(ti => ti.id === p.id) || {};
    return { ...p, ...tr };
  });
  const featured = projects.filter(p => p.isFeatured).slice(0, 4);

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

      {/* ─── 01 / PROFILE ─────────────────────────────── */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={stagger}
        className="pt-36 md:pt-44 pb-20 border-b border-[var(--theme-border)]"
      >
        <motion.div variants={fadeUp}>
          <span className="section-index">01 / {t('home.profileBadge')}</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mt-2">
          {/* Texto principal */}
          <motion.div variants={fadeUp} className="md:col-span-8 space-y-6">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl leading-[1.06] text-[var(--theme-ink)] tracking-tight"
              style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
            >
              <RevealText text={t('hero.mainTitle')} stagger={20} />
            </h1>

            <p className="text-base md:text-lg text-[var(--theme-ink-muted)] leading-relaxed font-light max-w-xl">
              {t('hero.heroDesc')}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
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

            {/* Disponibilidad */}
            <div className="flex items-center gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs text-[var(--theme-ink-muted)]">{t('hero.statusAvailable')}</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3">
            {[
              { value: <CountUp end={10} suffix="+" />, label: t('hero.statSystems') },
              { value: <><CountUp end={3} suffix="+" /> <span>Yrs</span></>, label: t('hero.statExperience') },
              { value: '.NET 8', label: t('hero.statArchitecture') },
            ].map((stat, i) => (
              <div
                key={i}
                className="editorial-card p-4 rounded-lg flex flex-col gap-1"
              >
                <span className="font-mono text-xl font-semibold text-[var(--theme-ink)] flex items-baseline gap-1">
                  {stat.value}
                </span>
                <span className="font-mono text-[10px] text-[var(--theme-ink-muted)] uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ─── 02 / SELECTED WORK ───────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="py-20 border-b border-[var(--theme-border)]"
      >
        <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
          <div>
            <span className="section-index">02 / {t('projects.badge')}</span>
            <h2 className="text-2xl font-semibold text-[var(--theme-ink)] tracking-tight">{t('projects.title')}</h2>
          </div>
          <Link
            to="/proyectos"
            className="font-mono text-xs text-[var(--theme-ink-muted)] hover:text-[var(--theme-accent)] transition-colors flex items-center gap-1"
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
                  <h3 className="text-base font-semibold text-[var(--theme-ink)] group-hover:text-[var(--theme-accent)] transition-colors truncate">
                    {p.title}
                  </h3>
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

      {/* ─── 03 / STACK ───────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="py-20 border-b border-[var(--theme-border)]"
      >
        <motion.div variants={fadeUp}>
          <span className="section-index">03 / {t('techShowcase.badge')}</span>
          <h2 className="text-2xl font-semibold text-[var(--theme-ink)] tracking-tight mb-10">
            {t('techShowcase.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STACK_CARDS.map((card, i) => (
            <motion.div key={i} variants={fadeUp} className="editorial-card p-5 rounded-lg space-y-3">
              <div className="text-[var(--theme-accent)]">{card.icon}</div>
              <h3 className="font-mono text-xs font-semibold text-[var(--theme-ink)] uppercase tracking-wide">
                {card.label}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {card.tech.map(t => (
                  <span key={t} className="badge">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── 04 / GET IN TOUCH ────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-20"
      >
        <span className="section-index">04 / {t('contact.badge')}</span>
        <h2
          className="text-3xl md:text-4xl text-[var(--theme-ink)] tracking-tight mt-2 mb-6"
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
        >
          {t('hub.aboutDesc')}
        </h2>
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
        </div>
      </motion.section>
    </div>
  );
};
