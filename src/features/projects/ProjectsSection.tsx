import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '../../data/portfolio';
import { SectionHeading } from '../../components/common/SectionHeading';
import { GlassCard } from '../../components/common/GlassCard';

export const ProjectsSection = () => {
  const { t } = useTranslation();
  const { projects } = portfolioData;

  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/50">
      <SectionHeading highlight={t('sections.projectsHighlight')}>
        {t('sections.projects')}
      </SectionHeading>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="overflow-hidden group h-full flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-dark-bg/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={project.image} 
                  alt={project.title} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <span className="text-neon-purple font-mono text-sm mb-2">{project.client}</span>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-neon-cyan transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 mb-6 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map(tech => (
                    <span key={tech} className="text-xs font-mono px-2 py-1 bg-slate-800 rounded text-neon-cyan">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 mt-auto">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                    <FiGithub /> Código
                  </a>
                  {project.liveUrl !== "#" && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                      <FiExternalLink /> Ver Demo
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
