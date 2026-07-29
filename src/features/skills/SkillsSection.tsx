import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiServer, FiMonitor, FiDatabase, FiLayers, FiShield, FiCpu, FiGitBranch } from 'react-icons/fi';
import { portfolioData } from '../../data/portfolio';

export const SkillsSection: React.FC = () => {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="max-w-5xl mx-auto px-6 py-16">
      <hr className="luxury-divider" />
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs tracking-widest uppercase">
          <FiCode className="w-4 h-4 text-yellow-400" />
          <span>Firma Técnica & Capacidades</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-light text-slate-100">
          Tecnologías, Stack & Patrones de Arquitectura
        </h2>
        <p className="text-slate-400 text-xs md:text-sm max-w-3xl leading-relaxed font-light">
          Dominio de stacks modernos para desarrollo web de alto tráfico, aplicaciones móviles híbridas y multiplataforma, 
          software nativo de escritorio y backend distribuido bajo Clean Architecture.
        </p>
      </div>

      {/* Grid: 4 Layer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Layer 1: Client & Frontend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="luxury-card p-6 rounded-2xl flex flex-col gap-4"
        >
          <div className="flex items-center gap-2.5 text-yellow-300 border-b border-slate-800 pb-3">
            <FiMonitor className="w-4 h-4 text-yellow-400" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Frontend & Mobile
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.frontend.map((item, idx) => (
              <span key={idx} className="luxury-badge hover:border-yellow-400/60">
                {item}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-light mt-auto pt-2 border-t border-slate-800/60">
            Interfaces modulares en Angular, aplicaciones móviles híbridas en React Native y portales web institucionales.
          </p>
        </motion.div>

        {/* Layer 2: Server & Backend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="luxury-card p-6 rounded-2xl flex flex-col gap-4"
        >
          <div className="flex items-center gap-2.5 text-cyan-300 border-b border-slate-800 pb-3">
            <FiServer className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Server & Backend
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.backend.map((item, idx) => (
              <span key={idx} className="luxury-badge-cyan">
                {item}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-light mt-auto pt-2 border-t border-slate-800/60">
            Desarrollo de REST APIs robustas en .NET 8, Node.js y Python con autenticación segura JWT y microservicios.
          </p>
        </motion.div>

        {/* Layer 3: Desktop & Nativas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="luxury-card p-6 rounded-2xl flex flex-col gap-4"
        >
          <div className="flex items-center gap-2.5 text-yellow-300 border-b border-slate-800 pb-3">
            <FiCpu className="w-4 h-4 text-yellow-400" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Escritorio & Algoritmos
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.desktop.map((item, idx) => (
              <span key={idx} className="luxury-badge">
                {item}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-light mt-auto pt-2 border-t border-slate-800/60">
            Aplicaciones nativas C# (DebtManager), motores POO Java (Buscaminas) y resolución de problemas algorítmicos.
          </p>
        </motion.div>

        {/* Layer 4: Architecture & DB */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="luxury-card p-6 rounded-2xl flex flex-col gap-4"
        >
          <div className="flex items-center gap-2.5 text-emerald-300 border-b border-slate-800 pb-3">
            <FiLayers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Arquitectura & Data
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.architecture.concat(skills.databases).map((item, idx) => (
              <span key={idx} className="luxury-badge-cyan">
                {item}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-light mt-auto pt-2 border-t border-slate-800/60">
            Arquitecturas desacopladas (Clean Architecture, CQRS, DDD), SQL Server/MySQL y despliegues con Docker & Kubernetes.
          </p>
        </motion.div>
      </div>

      {/* Engineering Pillars Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-start gap-3">
          <FiShield className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase mb-1">Clean Architecture & CQRS</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Separación estricta de capas (Domain, Application, Infrastructure, Presentation) para máxima mantenibilidad y prueba de código.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:px-4 md:border-x border-slate-800">
          <FiGitBranch className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase mb-1">Microservicios .NET 8</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Servicios desacoplados escalables con comunicación asíncrona por eventos y contenedores Docker / Kubernetes.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FiDatabase className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase mb-1">Optimización Relacional</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Modelado e indexación de alta eficiencia para motores SQL Server, MySQL y PostgreSQL procesando gran volumen institucional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
