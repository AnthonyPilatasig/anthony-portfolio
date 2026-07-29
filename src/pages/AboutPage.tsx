import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiUser, FiServer, FiMonitor, FiCpu, FiLayers, FiMapPin } from 'react-icons/fi';
import { portfolioData } from '../data/portfolio';

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

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-300 dark:border-yellow-500/20 pb-8"
      >
        <div>
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-mono text-xs tracking-widest uppercase mb-2">
            <FiUser className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span>{t('about.badge')}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extralight text-gold-gradient uppercase tracking-tight">
            {t('about.title')}
          </h1>
          <p className="text-xs md:text-sm font-mono text-slate-600 dark:text-slate-400 mt-2">
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
          <h2 className="text-2xl font-light text-slate-900 dark:text-slate-100 leading-snug">
            {t('about.mainTitle')}
          </h2>
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light">
            <p>{t('about.bio1')}</p>
            <p>{t('about.bio2')}</p>
            <p>{t('about.bio3')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 space-y-1 hover:scale-105 transition-transform">
              <h4 className="text-xs font-mono font-bold text-yellow-700 dark:text-yellow-300 uppercase">{t('about.valuesTitle')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-light">{t('about.valuesDesc')}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 space-y-1 hover:scale-105 transition-transform">
              <h4 className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase">{t('about.securityTitle')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-light">{t('about.securityDesc')}</p>
            </div>
          </div>
        </motion.div>

        {/* Sidebar info */}
        <motion.div 
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}
          className="p-6 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 space-y-6 hover:shadow-lg transition-shadow"
        >
          <div>
            <span className="text-[11px] font-mono text-yellow-700 dark:text-yellow-400 tracking-widest uppercase block mb-3">
              {t('about.ficheTitle')}
            </span>
            <div className="space-y-3 text-xs font-mono text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-300 dark:border-slate-800">
                <span className="text-slate-500">{t('about.location')}:</span>
                <span className="flex items-center gap-1"><FiMapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Quito, Ecuador</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-300 dark:border-slate-800">
                <span className="text-slate-500">{t('about.timezone')}:</span>
                <span>UTC-5</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-300 dark:border-slate-800">
                <span className="text-slate-500">{t('about.language')}:</span>
                <span>Español / English</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{t('about.status')}:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{personal.status}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-300 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-yellow-700 dark:text-yellow-400 tracking-widest uppercase block mb-2">
              {t('about.toolsTitle')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <span className="luxury-badge">Visual Studio</span>
              <span className="luxury-badge">VS Code</span>
              <span className="luxury-badge">Git & GitHub</span>
              <span className="luxury-badge">Docker</span>
              <span className="luxury-badge">Postman</span>
              <span className="luxury-badge">SQL Management</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tech Stack Signature Grid */}
      <motion.div 
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
        className="space-y-6"
      >
        <div className="border-b border-slate-300 dark:border-slate-800 pb-3">
          <span className="text-[10px] font-mono text-yellow-700 dark:text-yellow-400 tracking-widest uppercase">{t('skills.badge')}</span>
          <h3 className="text-2xl font-light text-slate-900 dark:text-slate-100">{t('skills.title')}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={fadeUpVariant} className="luxury-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300 font-mono text-xs uppercase font-bold border-b border-slate-300 dark:border-slate-800 pb-2">
              <FiMonitor className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span>{t('skills.frontend')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.frontend.map((item, idx) => (
                <span key={idx} className="luxury-badge text-[10px]">{item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="luxury-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-mono text-xs uppercase font-bold border-b border-slate-300 dark:border-slate-800 pb-2">
              <FiServer className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{t('skills.backend')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.backend.map((item, idx) => (
                <span key={idx} className="luxury-badge-cyan text-[10px]">{item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="luxury-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300 font-mono text-xs uppercase font-bold border-b border-slate-300 dark:border-slate-800 pb-2">
              <FiCpu className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span>{t('skills.desktop')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.desktop.map((item, idx) => (
                <span key={idx} className="luxury-badge text-[10px]">{item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="luxury-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-mono text-xs uppercase font-bold border-b border-slate-300 dark:border-slate-800 pb-2">
              <FiLayers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('skills.architecture')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.architecture.concat(skills.databases).map((item, idx) => (
                <span key={idx} className="luxury-badge-cyan text-[10px]">{item}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
