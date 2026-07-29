import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiBriefcase, FiAward, FiCheck, FiDownload, FiFileText } from 'react-icons/fi';
import { portfolioData } from '../data/portfolio';

const fadeLeftVariant = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const ExperiencePage: React.FC = () => {
  const { t } = useTranslation();
  
  const translatedExp = (t('experienceData', { returnObjects: true }) as unknown) as any[];
  const experience = portfolioData.experience.map(e => {
    const tr = (Array.isArray(translatedExp) ? translatedExp : []).find((tItem: any) => tItem.id === e.id) || {};
    return { ...e, ...tr };
  });

  const translatedEdu = (t('educationData', { returnObjects: true }) as unknown) as any[];
  const education = portfolioData.education.map(e => {
    const tr = (Array.isArray(translatedEdu) ? translatedEdu : []).find((tItem: any) => tItem.id === e.id) || {};
    return { ...e, ...tr };
  });

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
            <FiBriefcase className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span>{t('experience.badge')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter">
            {t('experience.title')}
          </h1>
          <p className="text-xs md:text-sm font-mono text-slate-600 dark:text-slate-400 mt-2">
            {t('experience.subtitle')}
          </p>
        </div>

        <a
          href={`mailto:${portfolioData.personal.email}?subject=Solicitud%20de%20CV%20-%20Anthony%20Pilatasig`}
          className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-yellow-500/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500 hover:text-slate-900 dark:hover:text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 hover:scale-105"
        >
          <FiDownload className="w-4 h-4" />
          <span>{t('experience.requestCv')}</span>
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        {/* Experience Timeline */}
        <div className="md:col-span-2 space-y-8">
          <motion.h2 
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUpVariant}
            className="text-2xl font-light text-slate-900 dark:text-slate-100 flex items-center gap-2"
          >
            <FiBriefcase className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span>{t('experience.careerTitle')}</span>
          </motion.h2>

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeLeftVariant}
                transition={{ delay: index * 0.1 }}
                className="border-l-2 border-slate-300 dark:border-yellow-500/40 pl-5 relative group"
              >
                <div className="absolute w-3 h-3 rounded-full bg-slate-400 dark:bg-yellow-400 -left-[7.5px] top-1.5 luxury-pulse group-hover:bg-yellow-500 transition-colors" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-2">
                  <h3 className="text-base font-mono font-bold text-slate-900 dark:text-slate-100 group-hover:text-yellow-600 dark:group-hover:text-yellow-300 transition-colors">
                    {exp.role}
                  </h3>
                  <span className="text-[11px] font-mono text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/10 px-2.5 py-0.5 rounded border border-yellow-300 dark:border-yellow-500/20">
                    {exp.period}
                  </span>
                </div>

                <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-2">
                  {exp.company}
                </p>

                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light mb-3">
                  {exp.description}
                </p>

                {exp.achievements && (
                  <div className="space-y-1.5 mb-3">
                    {exp.achievements.map((ach, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 font-light group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">
                        <FiCheck className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="luxury-badge text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education & Values Column */}
        <div className="space-y-8 md:pl-6 md:border-l border-slate-300 dark:border-slate-800">
          <div>
            <motion.h2 
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUpVariant}
              className="text-2xl font-light text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6"
            >
              <FiAward className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>{t('experience.educationTitle')}</span>
            </motion.h2>

            <div className="space-y-5">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUpVariant}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 space-y-1.5 hover:scale-105 transition-transform"
                >
                  <h3 className="text-xs md:text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                    {edu.degree}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-light">
                    {edu.institution}
                  </p>
                  <p className="text-[10px] font-mono text-yellow-700 dark:text-yellow-400 font-semibold pt-1">
                    Status: {edu.status}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}
            className="p-5 rounded-2xl border border-yellow-300 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/5 space-y-3 hover:shadow-lg transition-shadow"
          >
            <h4 className="text-xs font-mono font-bold text-yellow-700 dark:text-yellow-300 uppercase flex items-center gap-2">
              <FiFileText className="w-4 h-4" />
              <span>{t('experience.philosophyTitle')}</span>
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-light leading-relaxed">
              {t('experience.philosophyDesc')}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
