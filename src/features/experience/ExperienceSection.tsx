import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '../../data/portfolio';
import { SectionHeading } from '../../components/common/SectionHeading';
import { GlassCard } from '../../components/common/GlassCard';

export const ExperienceSection = () => {
  const { t } = useTranslation();
  const { experience, education } = portfolioData;

  return (
    <section id="experience" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/50">
      <div className="grid md:grid-cols-2 gap-12">
        
        {/* Experience Column */}
        <div>
          <SectionHeading highlight={t('sections.experienceHighlight')}>
            {t('sections.experience')}
          </SectionHeading>
          
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <GlassCard className="p-8 group hover:border-neon-cyan/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors">{exp.role}</h3>
                    <span className="text-neon-cyan font-mono text-sm bg-neon-cyan/10 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">{exp.period}</span>
                  </div>
                  <p className="text-slate-300 font-medium mb-4">{exp.company}</p>
                  <p className="text-slate-400 mb-6">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map(tech => (
                      <span key={tech} className="text-xs font-mono px-2 py-1 rounded border border-slate-700 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education Column */}
        <div>
          <SectionHeading icon={<span>📖</span>}>
            {t('sections.education')}
          </SectionHeading>
          
          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div 
                key={edu.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <GlassCard className="p-6 border-l-4 border-l-neon-purple">
                  <h3 className="text-lg font-bold text-white mb-2">{edu.degree}</h3>
                  <p className="text-slate-400 mb-4">{edu.institution}</p>
                  <span className="text-xs font-bold tracking-widest uppercase text-neon-purple">
                    {edu.status}
                  </span>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
