import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiBriefcase, FiAward, FiCheck, FiDownload, FiFileText, FiBookOpen, FiUsers } from 'react-icons/fi';
import { getPortfolioData } from '@application/useCases/portfolio/getPortfolioData';
import { mergeLocalizedEntries } from '@application/useCases/portfolio/mergeLocalizedEntries';
import { RevealText } from '@presentation/components/ui/RevealText';
import { SEO } from '@presentation/components/ui/SEO';
import type { IExperience, IEducation } from '@domain/entities/portfolio.entity';

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
  const portfolioData = getPortfolioData();
  const { teachingHighlights } = portfolioData;

  const experience = mergeLocalizedEntries<IExperience>(
    portfolioData.experience,
    t('experienceData', { returnObjects: true })
  );

  const education = mergeLocalizedEntries<IEducation>(
    portfolioData.education,
    t('educationData', { returnObjects: true })
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 md:pt-36 pb-24">
      <SEO
        title="Trayectoria & Experiencia — Anthony Pilatasig"
        description="Liderazgo técnico en ISTPET, CDMI Scorecraft y SIAT Policía Nacional, además de formación académica y docencia en programación."
      />
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14 border-b border-[var(--theme-border)] pb-8"
      >
        <div>
          <span className="section-index">03 / {t('experience.badge')}</span>
          <h1 className="text-4xl md:text-6xl font-sans font-semibold text-[var(--theme-ink)] tracking-tight">
            <RevealText text={t('experience.title')} />
          </h1>
          <p className="text-sm font-mono text-[var(--theme-ink-muted)] mt-2">
            Liderazgo técnico en desarrollo institucional, educación superior y proyectos de software.
          </p>
        </div>

        <a
          href={`${import.meta.env.BASE_URL}CV_Anthony_Pilatasig.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs flex items-center gap-2"
        >
          <FiDownload className="w-4 h-4 text-[var(--theme-accent)]" />
          <span>{t('experience.requestCv')}</span>
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start mb-16">
        {/* Experience Timeline */}
        <div className="md:col-span-2 space-y-8">
          <motion.h2 
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUpVariant}
            className="text-2xl font-light text-[var(--theme-ink)] flex items-center gap-2"
          >
            <FiBriefcase className="w-5 h-5 text-[var(--theme-accent)]" />
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
                className="border-l-2 border-[var(--theme-border-strong)] pl-5 relative group"
              >
                <div className="absolute w-3 h-3 rounded-full bg-[var(--theme-accent)] -left-[7.5px] top-1.5 transition-colors" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-2">
                  <h3 className="text-base font-mono font-bold text-[var(--theme-ink)] group-hover:text-[var(--theme-accent)] transition-colors">
                    {exp.role}
                  </h3>
                  <span className="badge-accent">
                    {exp.period}
                  </span>
                </div>

                <p className="text-xs font-mono text-[var(--theme-ink-muted)] mb-2">
                  {exp.company}
                </p>

                <p className="text-xs md:text-sm text-[var(--theme-ink-muted)] leading-relaxed font-light mb-3">
                  {exp.description}
                </p>

                {exp.achievements && (
                  <div className="space-y-1.5 mb-3">
                    {exp.achievements.map((ach, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-2 text-xs text-[var(--theme-ink-muted)] font-light transition-colors">
                        <FiCheck className="w-3.5 h-3.5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education & Philosophy Column */}
        <div className="space-y-8 md:pl-6 md:border-l border-[var(--theme-border)]">
          <div>
            <motion.h2 
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUpVariant}
              className="text-2xl font-light text-[var(--theme-ink)] flex items-center gap-2 mb-6"
            >
              <FiAward className="w-5 h-5 text-[var(--theme-accent)]" />
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
                  className="editorial-card p-4 rounded-xl space-y-1.5 border border-[var(--theme-border)]"
                >
                  <h3 className="text-xs md:text-sm font-mono font-bold text-[var(--theme-ink)]">
                    {edu.degree}
                  </h3>
                  <p className="text-xs text-[var(--theme-ink-muted)] font-light">
                    {edu.institution}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--theme-accent)] font-semibold pt-1">
                    {t('experience.statusLabel')}: {edu.status}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications (Cisco & Python) */}
          {portfolioData.certifications && portfolioData.certifications.length > 0 && (
            <div>
              <motion.h3 
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUpVariant}
                className="text-lg font-mono font-semibold text-[var(--theme-ink)] flex items-center gap-2 mb-4"
              >
                <FiCheck className="w-4 h-4 text-emerald-500" />
                <span>Certificaciones Oficiales</span>
              </motion.h3>

              <div className="space-y-3">
                {portfolioData.certifications.map((cert, cIdx) => (
                  <motion.div
                    key={cIdx}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeUpVariant}
                    className="editorial-card p-3.5 rounded-xl border border-[var(--theme-border)] space-y-1"
                  >
                    <span className="badge-accent text-[9px] py-0.5">{cert.category}</span>
                    <h4 className="text-xs font-mono font-bold text-[var(--theme-ink)]">
                      {cert.title}
                    </h4>
                    <p className="text-[11px] text-[var(--theme-ink-muted)] font-light">
                      {cert.issuer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}
            className="editorial-card p-5 rounded-xl border border-[var(--theme-border-strong)] space-y-3"
          >
            <h4 className="text-xs font-mono font-bold text-[var(--theme-accent)] uppercase flex items-center gap-2">
              <FiFileText className="w-4 h-4" />
              <span>{t('experience.philosophyTitle')}</span>
            </h4>
            <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
              {t('experience.philosophyDesc')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* University Teaching & Mentorship Deep Dive */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUpVariant}
        className="pt-10 border-t border-[var(--theme-border)] space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="section-index text-xs">CÁTEDRA UNIVERSITARIA &amp; MENTORÍA TÉCNICA</span>
            <h3 className="text-2xl font-semibold text-[var(--theme-ink)]">
              Formación de Ingenieros de Software @ ISTPET
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[var(--theme-accent)]">
            <FiUsers className="w-4 h-4" />
            <span>Docencia Técnica &amp; POO</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teachingHighlights.map((th, idx) => (
            <div key={idx} className="editorial-card p-5 rounded-xl space-y-3 border border-[var(--theme-border)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[var(--theme-accent)] text-xs font-mono font-bold uppercase mb-2">
                  <FiBookOpen className="w-4 h-4" />
                  <span>{th.studentsCount}</span>
                </div>
                <h4 className="font-mono text-sm font-bold text-[var(--theme-ink)] mb-2">
                  {th.subject}
                </h4>
                <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
                  {th.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 pt-2">
                {th.focus.map((f, fIdx) => (
                  <span key={fIdx} className="badge text-[9px] py-0.5">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
