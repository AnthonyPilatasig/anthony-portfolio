import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiAward, FiCheck } from 'react-icons/fi';
import { portfolioData } from '../../data/portfolio';

export const ExperienceSection: React.FC = () => {
  const { experience, education } = portfolioData;

  return (
    <section id="experience" className="max-w-5xl mx-auto px-6 py-16">
      <hr className="luxury-divider" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        {/* Left Column: Experience Timeline */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs tracking-widest uppercase">
            <FiBriefcase className="w-4 h-4 text-yellow-400" />
            <span>Trayectoria Profesional</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-slate-100">
            Experiencia Reciente en Desarrollo
          </h2>

          <div className="space-y-8 mt-2">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-l-2 border-yellow-500/40 pl-5 relative"
              >
                <div className="absolute w-3 h-3 rounded-full bg-yellow-400 -left-[7px] top-1.5 luxury-pulse" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-2">
                  <h3 className="text-base font-mono font-bold text-slate-100">
                    {exp.role}
                  </h3>
                  <span className="text-[11px] font-mono text-yellow-400 bg-yellow-500/10 px-2.5 py-0.5 rounded border border-yellow-500/20">
                    {exp.period}
                  </span>
                </div>

                <p className="text-xs font-mono text-cyan-400 mb-2">
                  {exp.company}
                </p>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light mb-3">
                  {exp.description}
                </p>

                {exp.achievements && (
                  <div className="space-y-1.5 mb-3">
                    {exp.achievements.map((ach, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-2 text-xs text-slate-400 font-light">
                        <FiCheck className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
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

        {/* Right Column: Education & Certifications */}
        <div className="flex flex-col gap-6 md:pl-6 md:border-l border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
            <FiAward className="w-4 h-4 text-cyan-400" />
            <span>Formación & Estudios</span>
          </div>
          <h2 className="text-2xl font-light text-slate-100">
            Educación
          </h2>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1.5"
              >
                <h3 className="text-xs md:text-sm font-mono font-bold text-slate-100">
                  {edu.degree}
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  {edu.institution}
                </p>
                <p className="text-[10px] font-mono text-yellow-400 font-semibold pt-1">
                  Status: {edu.status}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 space-y-2 mt-4">
            <h4 className="text-xs font-mono font-bold text-yellow-300 uppercase">
              Compromiso Profesional
            </h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Enfocado en la continua evolución tecnológica, patrones de diseño limpios y arquitecturas resilientes preparadas para alta concurrencia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
