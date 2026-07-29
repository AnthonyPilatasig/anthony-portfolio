import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiExternalLink, FiGithub, FiLayers, FiSmartphone, FiMonitor, FiCpu, FiX, FiCheckCircle } from 'react-icons/fi';
import { portfolioData } from '../../data/portfolio';
import type { IProject, ProjectCategory } from '../../types/portfolio.types';

export const ProjectsSection: React.FC = () => {
  const { projects } = portfolioData;
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter((p) => p.category === activeCategory);

  const categories: { key: ProjectCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Todos', icon: <FiFolder className="w-3.5 h-3.5" /> },
    { key: 'web', label: 'Web & Core (Gacad)', icon: <FiMonitor className="w-3.5 h-3.5" /> },
    { key: 'mobile', label: 'Móvil (Mi ISTPET)', icon: <FiSmartphone className="w-3.5 h-3.5" /> },
    { key: 'desktop', label: 'Escritorio (DebtManager / POO)', icon: <FiCpu className="w-3.5 h-3.5" /> },
    { key: 'architecture', label: 'Arquitectura & IA', icon: <FiLayers className="w-3.5 h-3.5" /> },
  ];

  return (
    <section id="projects" className="max-w-5xl mx-auto px-6 py-16">
      <hr className="luxury-divider" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs tracking-widest uppercase mb-2">
            <FiFolder className="w-4 h-4 text-yellow-400" />
            <span>Portafolio de Proyectos</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-light text-slate-100">
            Sistemas Institucionales & Proyectos Destacados
          </h2>
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
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Projects Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer border border-slate-800 hover:border-yellow-500/40"
            onClick={() => setSelectedProject(project)}
          >
            {/* Card Header & Image */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/40 to-transparent" />
              
              {/* Category & Badge */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="luxury-badge bg-slate-950/80 backdrop-blur-md">
                  {project.category.toUpperCase()}
                </span>
                {project.isFeatured && (
                  <span className="luxury-badge bg-yellow-500/20 text-yellow-300 border-yellow-500/40">
                    FEATURED
                  </span>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-mono font-semibold text-slate-100 group-hover:text-yellow-300 transition-colors">
                    {project.title}
                  </h3>
                </div>
                <p className="text-xs text-yellow-400/80 font-mono mb-2">
                  Cliente / Contexto: {project.client}
                </p>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-light">
                  {project.description}
                </p>
              </div>

              {/* Architecture Badges & Technologies */}
              <div className="space-y-3 pt-4 border-t border-slate-800/60">
                {project.architectureBadges && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.architectureBadges.map((badge, bIdx) => (
                      <span key={bIdx} className="luxury-badge-cyan text-[10px] py-0.5">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-yellow-400/90 font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ver detalles técnicos & arquitectura →
                  </span>
                  <div className="flex items-center gap-3 text-slate-400">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-yellow-300 transition-colors p-1"
                        title="Ver Repositorio"
                      >
                        <FiGithub className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Detail View */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#090d16] border border-yellow-500/30 rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs uppercase mb-2">
                <span>{selectedProject.category}</span>
                <span>•</span>
                <span>{selectedProject.client}</span>
              </div>

              <h3 className="text-2xl font-mono font-bold text-slate-100 mb-2">
                {selectedProject.title}
              </h3>

              <div className="w-full h-56 rounded-xl overflow-hidden mb-6 bg-slate-900">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-xs md:text-sm text-slate-300 font-light leading-relaxed">
                <div>
                  <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase mb-1">
                    Descripción del Sistema & Arquitectura
                  </h4>
                  <p>{selectedProject.longDescription || selectedProject.description}</p>
                </div>

                {selectedProject.architectureBadges && (
                  <div>
                    <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase mb-2">
                      Firma de Arquitectura & Patrones
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.architectureBadges.map((badge, idx) => (
                        <span key={idx} className="luxury-badge-cyan">
                          <FiCheckCircle className="w-3 h-3 text-cyan-400" />
                          <span>{badge}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase mb-2">
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

              <div className="flex flex-wrap gap-4 items-center pt-6 mt-6 border-t border-slate-800">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 rounded-full border border-slate-700 hover:border-yellow-400 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-2"
                  >
                    <FiGithub className="w-4 h-4 text-yellow-400" />
                    <span>Ver Código en GitHub</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="ml-auto px-5 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-mono"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
