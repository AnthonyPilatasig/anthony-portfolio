import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiFolder, FiGithub, FiMonitor, FiSmartphone, FiCpu, FiLayers, FiX, FiCheckCircle } from 'react-icons/fi';
import { portfolioData } from '../data/portfolio';
import type { IProject, ProjectCategory } from '../types/portfolio.types';

export const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const translatedProjects: any[] = t('projectsData', { returnObjects: true });
  const projects = portfolioData.projects.map(p => {
    const tr = (Array.isArray(translatedProjects) ? translatedProjects : []).find((tItem: any) => tItem.id === p.id) || {};
    return { ...p, ...tr };
  }) as IProject[];

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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-300 dark:border-yellow-500/20 pb-8"
      >
        <div>
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-mono text-xs tracking-widest uppercase mb-2">
            <FiFolder className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span>{t('projects.badge')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter">
            {t('projects.title')}
          </h1>
          <p className="text-xs md:text-sm font-mono text-slate-600 dark:text-slate-400 mt-2">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeCategory === cat.key
                  ? 'bg-yellow-500 text-slate-950 font-bold border border-yellow-400 shadow-md shadow-yellow-500/20'
                  : 'bg-slate-100/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-700'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Projects List Layout (Brittany Chiang Style) */}
      <div className="flex flex-col gap-6 md:gap-2 group/list">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
            className="flex flex-col md:flex-row gap-6 p-4 md:p-6 rounded-2xl transition-all duration-300 md:group-hover/list:opacity-30 md:hover:!opacity-100 md:hover:bg-slate-200/40 md:dark:hover:bg-slate-800/40 cursor-pointer shadow-none md:hover:shadow-lg md:hover:shadow-yellow-500/5 group/item"
            onClick={() => setSelectedProject(project)}
          >
            {/* Image Section */}
            <div className="w-full md:w-1/3 shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 relative shadow-sm aspect-video md:aspect-[4/3]">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-90 dark:opacity-70 group-hover/item:opacity-100 dark:group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] dark:from-[#080c14] via-transparent to-transparent opacity-80" />
              
              <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                <span className="luxury-badge bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
                  {project.category.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-start">
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 group-hover/item:text-yellow-600 dark:group-hover/item:text-yellow-400 transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400/80 font-mono mb-3">
                {t('projects.client')} {project.client}
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-400 leading-relaxed font-light mb-4">
                {project.description}
              </p>

              {/* Badges & Technologies */}
              <div className="mt-auto space-y-3">
                {project.architectureBadges && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.architectureBadges.map((badge, bIdx) => (
                      <span key={bIdx} className="luxury-badge-cyan text-[10px] py-0.5">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-700">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#fdfbf7] dark:bg-[#090d16] border border-yellow-500/30 rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-200 dark:bg-slate-800/60 hover:bg-slate-300 dark:hover:bg-slate-800"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-mono text-xs uppercase mb-2">
                <span>{selectedProject.category}</span>
                <span>•</span>
                <span>{selectedProject.client}</span>
              </div>

              <h3 className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100 mb-2">
                {selectedProject.title}
              </h3>

              <div className="w-full h-56 rounded-xl overflow-hidden mb-6 bg-slate-200 dark:bg-slate-900">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-xs md:text-sm text-slate-700 dark:text-slate-300 font-light leading-relaxed">
                <div>
                  <h4 className="text-xs font-mono font-bold text-yellow-600 dark:text-yellow-400 uppercase mb-1">
                    Descripción del Sistema & Arquitectura
                  </h4>
                  <p>{selectedProject.longDescription || selectedProject.description}</p>
                </div>

                {selectedProject.architectureBadges && (
                  <div>
                    <h4 className="text-xs font-mono font-bold text-yellow-600 dark:text-yellow-400 uppercase mb-2">
                      Patrones de Diseño
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.architectureBadges.map((badge, idx) => (
                        <span key={idx} className="luxury-badge-cyan">
                          <FiCheckCircle className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                          <span>{badge}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-mono font-bold text-yellow-600 dark:text-yellow-400 uppercase mb-2">
                    Stack Tecnológico Utilizado
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, idx) => (
                      <span key={idx} className="luxury-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center pt-6 mt-6 border-t border-slate-300 dark:border-slate-800">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 rounded-full border border-slate-400 dark:border-slate-700 hover:border-yellow-600 dark:hover:border-yellow-400 text-xs font-mono text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-all"
                  >
                    <FiGithub className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span>{t('projects.viewCode')}</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="ml-auto px-5 py-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-mono transition-all"
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
