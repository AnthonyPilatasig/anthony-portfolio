import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiFolder, FiGithub, FiMonitor, FiSmartphone, FiCpu, FiLayers, FiX, FiCheckCircle, FiExternalLink, FiTrendingUp, FiAlertCircle, FiSettings, FiGitBranch } from 'react-icons/fi';
import { portfolioData } from '../data/portfolio';
import { RevealText } from '../components/common/RevealText';
import type { IProject, ProjectCategory } from '../types/portfolio.types';

export const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const translatedProjects = t('projectsData', { returnObjects: true }) as Partial<IProject>[];
  const projects: IProject[] = portfolioData.projects.map(p => {
    const tr = (Array.isArray(translatedProjects) ? translatedProjects : []).find((tItem) => tItem.id === p.id) || {};
    return { ...p, ...tr };
  });

  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter((p) => p.category === activeCategory);

  const categories: { key: ProjectCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: t('projects.catAll'), icon: <FiFolder className="w-3.5 h-3.5" /> },
    { key: 'web', label: t('projects.catWeb'), icon: <FiMonitor className="w-3.5 h-3.5" /> },
    { key: 'mobile', label: t('projects.catMobile'), icon: <FiSmartphone className="w-3.5 h-3.5" /> },
    { key: 'desktop', label: t('projects.catDesktop'), icon: <FiCpu className="w-3.5 h-3.5" /> },
    { key: 'architecture', label: t('projects.catArchitecture'), icon: <FiLayers className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-20">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14 border-b border-[var(--theme-border)] pb-8"
      >
        <div>
          <span className="section-index">02 / {t('projects.badge')}</span>
          <h1 className="text-4xl md:text-6xl font-sans font-semibold text-[var(--theme-ink)] tracking-tight">
            <RevealText text={t('projects.title')} />
          </h1>
          <p className="text-sm font-mono text-[var(--theme-ink-muted)] mt-2">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                activeCategory === cat.key
                  ? 'bg-[var(--theme-accent)] text-white border border-[var(--theme-accent)] font-medium'
                  : 'btn-secondary font-mono'
              }`}
            >
              <span className={activeCategory === cat.key ? '' : 'text-[var(--theme-accent)]'}>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Projects List Layout */}
      <div className="flex flex-col gap-6 md:gap-2 group/list">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
            className="flex flex-col md:flex-row gap-6 p-4 md:p-6 rounded-2xl transition-all duration-300 md:group-hover/list:opacity-30 md:hover:!opacity-100 hover:bg-[var(--theme-border)]/50 cursor-pointer group/item"
            onClick={() => setSelectedProject(project)}
          >
            {/* Image Section */}
            <div className="w-full md:w-1/3 shrink-0 rounded-xl overflow-hidden bg-[var(--theme-surface)] border border-[var(--theme-border)] relative aspect-video md:aspect-[4/3]">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-90 group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] to-transparent opacity-80" />
              
              <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                <span className="badge bg-[var(--theme-surface)]">
                  {project.category.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-start">
              <h3 className="text-xl md:text-2xl font-semibold text-[var(--theme-ink)] group-hover/item:text-[var(--theme-accent)] transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-[var(--theme-ink-muted)] font-mono mb-3">
                {t('projects.client')} {project.client}
              </p>
              <p className="text-sm md:text-base text-[var(--theme-ink-muted)] leading-relaxed font-light mb-4">
                {project.description}
              </p>

              {/* Badges & Technologies */}
              <div className="mt-auto space-y-3">
                {project.metrics && project.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.metrics.map((m, mIdx) => (
                      <span key={mIdx} className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FiTrendingUp className="w-2.5 h-2.5" />
                        {m}
                      </span>
                    ))}
                  </div>
                )}
                {project.architectureBadges && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.architectureBadges.map((badge, bIdx) => (
                      <span key={bIdx} className="badge-accent py-0.5">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Detail View */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--theme-ink)]/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[var(--theme-surface)] border border-[var(--theme-border-strong)] rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] rounded-full bg-[var(--theme-border)] hover:bg-[var(--theme-border-strong)] transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-[var(--theme-accent)] font-mono text-xs uppercase mb-2">
                <span>{selectedProject.category}</span>
                <span>•</span>
                <span>{selectedProject.client}</span>
              </div>

              <h3 className="text-2xl font-mono font-bold text-[var(--theme-ink)] mb-2">
                {selectedProject.title}
              </h3>

              <div className="w-full h-56 rounded-xl overflow-hidden mb-6 bg-[var(--theme-bg)] relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] to-transparent opacity-80" />
              </div>

              <div className="space-y-4 text-xs md:text-sm text-[var(--theme-ink-muted)] font-light leading-relaxed">
                {!selectedProject.problem && (
                  <p>{selectedProject.longDescription || selectedProject.description}</p>
                )}

                {selectedProject.problem && (
                  <div className="p-4 rounded-xl bg-[var(--theme-bg)] border border-red-500/20 space-y-1.5">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-mono font-bold text-xs uppercase tracking-wider">
                      <FiAlertCircle className="w-4 h-4" />
                      <span>{t('projects.sectionProblem')}</span>
                    </div>
                    <p>{selectedProject.problem}</p>
                  </div>
                )}

                {selectedProject.decision && (
                  <div className="p-4 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-accent)]/20 space-y-1.5">
                    <div className="flex items-center gap-2 text-[var(--theme-accent)] font-mono font-bold text-xs uppercase tracking-wider">
                      <FiSettings className="w-4 h-4" />
                      <span>{t('projects.sectionDecision')}</span>
                    </div>
                    <p>{selectedProject.decision}</p>
                  </div>
                )}

                {selectedProject.tradeoff && (
                  <div className="p-4 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border-strong)] space-y-1.5">
                    <div className="flex items-center gap-2 text-[var(--theme-ink)] font-mono font-bold text-xs uppercase tracking-wider">
                      <FiGitBranch className="w-4 h-4" />
                      <span>{t('projects.sectionTradeoff')}</span>
                    </div>
                    <p>{selectedProject.tradeoff}</p>
                  </div>
                )}

                {selectedProject.impact && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
                      <FiTrendingUp className="w-4 h-4" />
                      <span>{t('projects.sectionImpact')}</span>
                    </div>
                    <p className="text-[var(--theme-ink)] font-normal">{selectedProject.impact}</p>

                    {selectedProject.metrics && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {selectedProject.metrics.map((metric, idx) => (
                          <span key={idx} className="badge bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                            <FiCheckCircle className="w-3 h-3" />
                            <span>{metric}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {selectedProject.architectureBadges && (
                  <div>
                    <h4 className="text-xs font-mono font-bold text-[var(--theme-accent)] uppercase mb-2">
                      {t('projects.sectionStack')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.architectureBadges.map((badge, idx) => (
                        <span key={idx} className="badge-accent">
                          <FiCheckCircle className="w-3 h-3 text-[var(--theme-accent)]" />
                          <span>{badge}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, idx) => (
                      <span key={idx} className="badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center pt-6 mt-6 border-t border-[var(--theme-border)]">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary text-xs flex items-center gap-2"
                  >
                    <FiGithub className="w-4 h-4 text-[var(--theme-accent)]" />
                    <span>{t('projects.viewCode')}</span>
                  </a>
                )}
                {selectedProject.liveUrl && selectedProject.liveUrl !== '#' && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs flex items-center gap-2"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    <span>{t('projects.liveDemo')}</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="ml-auto btn-secondary text-xs"
                >
                  {t('projects.close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
