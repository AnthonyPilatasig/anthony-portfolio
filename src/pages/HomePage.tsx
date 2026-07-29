import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiShield, FiCpu, FiTerminal, FiBriefcase, FiUser, FiFolder } from 'react-icons/fi';
import { portfolioData } from '../data/portfolio';
import { TerminalConsole } from '../components/common/TerminalConsole';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { personal } = portfolioData;
  const translatedProjects = (t('projectsData', { returnObjects: true }) as unknown) as any[];
  const projects = portfolioData.projects.map(p => {
    const tr = (Array.isArray(translatedProjects) ? translatedProjects : []).find((tItem: any) => tItem.id === p.id) || {};
    return { ...p, ...tr };
  });
  const featuredProjects = projects.filter((p) => p.isFeatured).slice(0, 4);

  const isEn = i18n.language === 'en';

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-16 flex flex-col justify-center">
      {/* Upper Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-300 dark:border-yellow-500/20 pb-8 mb-12"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-mono text-xs tracking-widest uppercase">
            <FiCpu className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span>{isEn ? 'Professional Profile & Architecture' : 'Perfil Profesional & Arquitectura'}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extralight tracking-tight text-gold-gradient uppercase">
            {personal.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm tracking-wider font-mono">
            {isEn ? 'Full Stack Developer & Software Architect in Training' : personal.title}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <span className="luxury-badge">
            <FiShield className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
            <span>{t('hero.badgeArchitecture')}</span>
          </span>
          <span className="luxury-badge luxury-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 inline-block mr-1"></span>
            <span>{t('hero.statusAvailable')}</span>
          </span>
        </div>
      </motion.div>

      {/* Main Pitch */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-16"
      >
        <motion.div variants={fadeUpVariant} className="md:col-span-2 space-y-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {t('hero.mainTitle')}
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light max-w-2xl">
            {t('hero.heroDesc')}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/proyectos"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-950 font-bold text-xs tracking-wider uppercase hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2 hover:scale-105"
            >
              <FiFolder className="w-4 h-4" />
              <span>{t('hero.viewProjects')}</span>
            </Link>

            <Link
              to="/terminal"
              className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-yellow-500/30 hover:border-yellow-600 dark:hover:border-yellow-400 bg-slate-100/60 dark:bg-slate-900/60 text-yellow-700 dark:text-yellow-300 font-mono text-xs tracking-wider uppercase transition-all flex items-center gap-2 hover:scale-105"
            >
              <FiTerminal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{t('hero.cliMode')}</span>
            </Link>
          </div>
        </motion.div>

        {/* Premium Bento Stats (Semi-Senior Level) */}
        <motion.div variants={fadeUpVariant} className="grid grid-cols-2 gap-3 md:gap-4 w-full md:w-auto shrink-0">
          <div className="col-span-2 p-5 rounded-2xl border border-slate-300/80 dark:border-yellow-500/20 bg-gradient-to-br from-slate-100 to-white dark:from-slate-900/80 dark:to-slate-950/80 flex flex-col justify-center relative overflow-hidden group shadow-sm dark:shadow-none hover:border-yellow-400 dark:hover:border-yellow-500 transition-colors">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <span className="text-3xl font-mono font-bold text-yellow-600 dark:text-yellow-400">10+</span>
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase mt-1 tracking-wider">{t('hero.statSystems')}</span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 flex flex-col justify-center hover:border-cyan-400 dark:hover:border-cyan-500 transition-colors group relative overflow-hidden">
            <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <span className="text-xl md:text-2xl font-mono font-bold text-cyan-600 dark:text-cyan-400">3+ Yrs</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase mt-1 leading-tight tracking-wider">{t('hero.statExperience')}</span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 flex flex-col justify-center hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors group relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <span className="text-xl md:text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">.NET 8</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase mt-1 leading-tight tracking-wider">{t('hero.statArchitecture')}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Multipage Hub Cards */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="mb-16 space-y-4"
      >
        <div className="flex justify-between items-end border-b border-slate-300 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-yellow-600 dark:text-yellow-400 tracking-widest uppercase">{t('hub.badge')}</span>
            <h3 className="text-xl font-light text-slate-800 dark:text-slate-100">{t('hub.title')}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { path: '/proyectos', icon: FiFolder, label: t('nav.projects'), desc: t('hub.projectsDesc'), color: 'text-yellow-500', hoverColor: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-300' },
            { path: '/trayectoria', icon: FiBriefcase, label: t('nav.experience'), desc: t('hub.experienceDesc'), color: 'text-cyan-500', hoverColor: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-300' },
            { path: '/sobre-mi', icon: FiUser, label: t('nav.about'), desc: t('hub.aboutDesc'), color: 'text-emerald-500', hoverColor: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-300' },
            { path: '/terminal', icon: FiTerminal, label: t('nav.terminal'), desc: t('hub.terminalDesc'), color: 'text-purple-500', hoverColor: 'group-hover:text-purple-600 dark:group-hover:text-purple-300' }
          ].map((item, idx) => (
            <motion.div key={idx} variants={fadeUpVariant}>
              <Link to={item.path} className="luxury-card p-5 rounded-2xl flex flex-col justify-between group h-full">
                <div className="space-y-3">
                  <div className={`p-2.5 w-fit rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className={`text-sm font-mono font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between ${item.hoverColor}`}>
                    <span>{item.label}</span>
                    <FiArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Featured Projects Showcase Teaser */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="mb-16 space-y-6"
      >
        <div className="flex justify-between items-end border-b border-slate-300 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-yellow-600 dark:text-yellow-400 tracking-widest uppercase">{t('projects.badge')}</span>
            <h3 className="text-2xl font-light text-slate-800 dark:text-slate-100">{t('projects.title')}</h3>
          </div>
          <Link to="/proyectos" className="text-xs font-mono text-yellow-600 dark:text-yellow-400 hover:underline flex items-center gap-1">
            <span>{isEn ? `View all (${projects.length})` : `Ver todos (${projects.length})`}</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((p) => (
            <motion.div key={p.id} variants={fadeUpVariant} className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer">
              <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-90 dark:opacity-70 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] dark:from-[#080c14] to-transparent opacity-80" />
                <span className="absolute top-3 left-3 luxury-badge">{p.category.toUpperCase()}</span>
              </div>
              <div className="p-5 flex flex-col gap-2 relative z-10">
                <h4 className="text-base font-mono font-bold text-slate-900 dark:text-slate-100 group-hover:text-yellow-600 dark:group-hover:text-yellow-300 transition-colors">{p.title}</h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-400/80 font-mono">{t('projects.client')} {p.client}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 font-light">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {p.technologies.map((tech, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Terminal CLI Teaser */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUpVariant}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-light text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FiTerminal className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span>{t('terminal.title')}</span>
          </h3>
          <Link to="/terminal" className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline">
            Consola Fullscreen ↗
          </Link>
        </div>
        <div className="shadow-2xl shadow-cyan-500/10 rounded-xl overflow-hidden">
          <TerminalConsole />
        </div>
      </motion.div>
    </div>
  );
};
