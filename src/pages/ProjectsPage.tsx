import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FiFolder, FiGithub, FiMonitor, FiSmartphone, FiCpu, FiLayers,
  FiX, FiCheckCircle, FiExternalLink, FiTrendingUp, FiAlertCircle,
  FiSettings, FiGitBranch, FiShield, FiLock, FiInfo, FiCheck
} from 'react-icons/fi';
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
  const [modalTab, setModalTab] = useState<'case-study' | 'architecture'>('case-study');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 md:pt-36 pb-24">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-[var(--theme-border)] pb-8"
      >
        <div>
          <span className="section-index">02 / {t('projects.badge')}</span>
          <h1 className="text-4xl md:text-6xl font-sans font-semibold text-[var(--theme-ink)] tracking-tight">
            <RevealText text={t('projects.title')} />
          </h1>
          <p className="text-sm font-mono text-[var(--theme-ink-muted)] mt-2 max-w-2xl">
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
                  ? 'bg-[var(--theme-accent)] text-white border border-[var(--theme-accent)] font-medium shadow-sm'
                  : 'btn-secondary font-mono'
              }`}
            >
              <span className={activeCategory === cat.key ? '' : 'text-[var(--theme-accent)]'}>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 group/list">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
            className="editorial-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between border border-[var(--theme-border)] hover:border-[var(--theme-accent)]/60 cursor-pointer group/item transition-all duration-300 shadow-sm hover:shadow-md"
            onClick={() => {
              setSelectedProject(project);
              setModalTab('case-study');
            }}
          >
            {/* Image & Top Meta */}
            <div>
              <div className="w-full rounded-xl overflow-hidden bg-[var(--theme-bg)] border border-[var(--theme-border)] relative aspect-video mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-90 group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)]/90 via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  <span className="badge bg-[var(--theme-surface)] backdrop-blur-md">
                    {project.category.toUpperCase()}
                  </span>
                  {project.isFeatured && (
                    <span className="badge-accent py-0.5">
                      DESTACADO
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-200">
                  <span className="truncate pr-2">{project.client}</span>
                  <span className="text-[var(--theme-accent)] flex items-center gap-1 shrink-0 font-semibold">
                    Ver Detalles →
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-semibold text-[var(--theme-ink)] group-hover/item:text-[var(--theme-accent)] transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--theme-ink-muted)] leading-relaxed font-light mb-4 line-clamp-3">
                {project.description}
              </p>
            </div>

            {/* Badges & Metrics Strip */}
            <div className="space-y-3 pt-2 border-t border-[var(--theme-border)]">
              {project.metrics && project.metrics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.metrics.slice(0, 3).map((m, mIdx) => (
                    <span key={mIdx} className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FiTrendingUp className="w-2.5 h-2.5" />
                      {m}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 5).map((tech, tIdx) => (
                  <span key={tIdx} className="badge text-[10px] py-0.5">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="badge text-[10px] py-0.5">
                    +{project.technologies.length - 5}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── MODAL DETAIL VIEW (RESPONSIVE & NDA-SAFE) ──────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProject(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-5xl bg-[var(--theme-surface)] border border-[var(--theme-border-strong)] rounded-2xl p-6 sm:p-8 md:p-10 max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] rounded-full bg-[var(--theme-border)] hover:bg-[var(--theme-border-strong)] transition-colors z-20"
                aria-label="Cerrar modal"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-2 pr-10">
                <div className="flex flex-wrap items-center gap-2 text-[var(--theme-accent)] font-mono text-xs uppercase">
                  <span className="badge-accent py-0.5">{selectedProject.category}</span>
                  <span>•</span>
                  <span>{selectedProject.client}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-[var(--theme-ink)] tracking-tight">
                  {selectedProject.title}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-[var(--theme-ink-muted)]">
                  {selectedProject.longDescription || selectedProject.description}
                </p>
              </div>

              {/* Modal Tabs Navigation */}
              <div className="flex items-center gap-3 border-b border-[var(--theme-border)] pb-3">
                <button
                  onClick={() => setModalTab('case-study')}
                  className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                    modalTab === 'case-study'
                      ? 'bg-[var(--theme-accent)] text-white font-semibold shadow-sm'
                      : 'text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] bg-[var(--theme-bg)]'
                  }`}
                >
                  1. Caso de Estudio &amp; Reto Técnico
                </button>
                <button
                  onClick={() => setModalTab('architecture')}
                  className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                    modalTab === 'architecture'
                      ? 'bg-[var(--theme-accent)] text-white font-semibold shadow-sm'
                      : 'text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] bg-[var(--theme-bg)]'
                  }`}
                >
                  2. Arquitectura &amp; Seguridad (NDA-Safe)
                </button>
              </div>

              {/* Tab 1: Case Study */}
              {modalTab === 'case-study' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Image & Stack */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="w-full rounded-xl overflow-hidden bg-[var(--theme-bg)] border border-[var(--theme-border)] aspect-video relative">
                        <img
                          src={selectedProject.image}
                          alt={selectedProject.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Key Metrics */}
                      {selectedProject.metrics && (
                        <div className="p-4 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] space-y-2">
                          <span className="font-mono text-xs font-semibold text-[var(--theme-ink)] block">
                            Métricas &amp; Despliegue:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedProject.metrics.map((m, mIdx) => (
                              <span key={mIdx} className="badge bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                                <FiTrendingUp className="w-2.5 h-2.5" />
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technologies */}
                      <div className="p-4 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] space-y-2">
                        <span className="font-mono text-xs font-semibold text-[var(--theme-ink)] block">
                          Stack Tecnológico:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.technologies.map((tech, idx) => (
                            <span key={idx} className="badge text-[10px]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Detailed Structured Sections */}
                    <div className="lg:col-span-7 space-y-4">
                      {/* Problem Statement */}
                      {selectedProject.problem && (
                        <div className="p-4 rounded-xl bg-[var(--theme-bg)] border border-red-500/20 space-y-1.5">
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-mono font-bold text-xs uppercase">
                            <FiAlertCircle className="w-4 h-4" />
                            <span>1. El Reto de Negocio &amp; Problema Técnico</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[var(--theme-ink-muted)] leading-relaxed font-light">
                            {selectedProject.problem}
                          </p>
                        </div>
                      )}

                      {/* Architecture Decision */}
                      {selectedProject.decision && (
                        <div className="p-4 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-accent)]/20 space-y-1.5">
                          <div className="flex items-center gap-2 text-[var(--theme-accent)] font-mono font-bold text-xs uppercase">
                            <FiSettings className="w-4 h-4" />
                            <span>2. Decisión de Ingeniería &amp; Patrón Aplicado</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[var(--theme-ink-muted)] leading-relaxed font-light">
                            {selectedProject.decision}
                          </p>
                        </div>
                      )}

                      {/* Trade-off */}
                      {selectedProject.tradeoff && (
                        <div className="p-4 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border-strong)] space-y-1.5">
                          <div className="flex items-center gap-2 text-[var(--theme-ink)] font-mono font-bold text-xs uppercase">
                            <FiGitBranch className="w-4 h-4" />
                            <span>3. Trade-off &amp; Compensaciones Asumidas</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[var(--theme-ink-muted)] leading-relaxed font-light">
                            {selectedProject.tradeoff}
                          </p>
                        </div>
                      )}

                      {/* Impact */}
                      {selectedProject.impact && (
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs uppercase">
                            <FiCheckCircle className="w-4 h-4" />
                            <span>4. Impacto Cuantitativo &amp; Resultado Real</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[var(--theme-ink)] font-normal leading-relaxed">
                            {selectedProject.impact}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Features List */}
                  {selectedProject.keyFeatures && selectedProject.keyFeatures.length > 0 && (
                    <div className="p-4 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] space-y-2">
                      <h4 className="font-mono text-xs font-semibold text-[var(--theme-ink)] uppercase tracking-wide flex items-center gap-2">
                        <FiCheck className="w-4 h-4 text-emerald-500" />
                        <span>Funcionalidades &amp; Módulos Desarrollados:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {selectedProject.keyFeatures.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-[var(--theme-ink-muted)] font-light">
                            <span className="text-[var(--theme-accent)] mt-0.5">•</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 2: Architecture & Security (NDA-Safe) */}
              {modalTab === 'architecture' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Architecture Overview */}
                    <div className="editorial-card p-5 rounded-xl border border-[var(--theme-border)] space-y-3">
                      <div className="flex items-center gap-2 text-[var(--theme-accent)] font-mono text-xs font-bold uppercase">
                        <FiLayers className="w-4 h-4" />
                        <span>Diseño de Arquitectura &amp; Flujo de Datos</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--theme-ink-muted)] leading-relaxed font-light">
                        {selectedProject.architectureOverview || 'Arquitectura estructurada bajo principios de Clean Architecture y bajo acoplamiento.'}
                      </p>
                      
                      {selectedProject.architectureBadges && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--theme-border)]">
                          {selectedProject.architectureBadges.map((badge, bIdx) => (
                            <span key={bIdx} className="badge-accent text-[10px]">
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Security & Compliance */}
                    <div className="editorial-card p-5 rounded-xl border border-[var(--theme-border)] space-y-3">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-mono text-xs font-bold uppercase">
                        <FiShield className="w-4 h-4" />
                        <span>Seguridad, RBAC &amp; Cumplimiento</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--theme-ink-muted)] leading-relaxed font-light">
                        {selectedProject.securityAndCompliance || 'Implementación de roles RBAC, autenticación JWT segura y pistas de auditoría.'}
                      </p>
                    </div>
                  </div>

                  {/* NDA Disclaimer Note */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                    <FiLock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300 block uppercase">
                        Nota de Confidencialidad &amp; Cumplimiento Contractual (NDA-Safe)
                      </span>
                      <p className="text-xs text-[var(--theme-ink-muted)] font-light leading-relaxed">
                        {selectedProject.ndaDisclaimer || 'La información expuesta describe exclusivamente patrones arquitectónicos de dominio público, metodologías de ingeniería de software y tecnologías aplicadas, protegiendo llaves criptográficas, credenciales internas y bases de datos privadas.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons Footer */}
              <div className="flex flex-wrap gap-3 items-center pt-4 border-t border-[var(--theme-border)]">
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
                    <span>{selectedProject.category === 'mobile' ? 'Ver en Google Play Store' : t('projects.liveDemo')}</span>
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
