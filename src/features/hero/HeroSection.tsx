import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiCpu, FiTerminal, FiChevronDown, FiShield, FiCode } from 'react-icons/fi';
import { portfolioData } from '../../data/portfolio';

interface HeroSectionProps {
  onOpenTerminal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTerminal }) => {
  const { personal } = portfolioData;

  return (
    <section id="about" className="relative max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-16 flex flex-col justify-center">
      {/* Upper Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-yellow-500/20 pb-8 mb-12"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs tracking-widest uppercase">
            <FiCpu className="w-4 h-4 text-yellow-400" />
            <span>Perfil Profesional & Arquitectura</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extralight tracking-tight text-gold-gradient uppercase">
            {personal.name}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm tracking-wider font-mono">
            {personal.title}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <span className="luxury-badge">
            <FiShield className="w-3.5 h-3.5 text-yellow-400" />
            <span>Clean Architecture & CQRS</span>
          </span>
          <span className="luxury-badge luxury-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1"></span>
            <span>{personal.status}</span>
          </span>
        </div>
      </motion.div>

      {/* Main Grid: Bio + Connections */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start"
      >
        {/* Left Column: Bio & Core Pitch */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <h2 className="text-2xl md:text-3xl font-light text-slate-100">
            Ingeniería de Software, Sistemas Académicos & Aplicaciones Nativas
          </h2>
          <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-light">
            <p>
              Desarrollador de software con sede en <strong className="text-yellow-300 font-normal">Quito, Ecuador</strong>. 
              Especializado en el diseño e implementación de sistemas de gran escala como el <strong className="text-cyan-300 font-normal">Core Académico Gacad</strong>, 
              la aplicación móvil institucional <strong className="text-cyan-300 font-normal">Mi ISTPET</strong> y módulos de <strong className="text-cyan-300 font-normal">ERP / RRHH</strong> para el 
              Instituto Superior Tecnológico Mayor Pedro Traversari.
            </p>
            <p>
              Mi enfoque combina el desarrollo Full-Stack con patrones de diseño avanzados (<strong className="text-slate-200">Clean Architecture, CQRS, DDD y Microservicios</strong> en .NET 8) 
              junto con la construcción de aplicaciones nativas de escritorio (<strong className="text-slate-200">DebtManager C#, Buscaminas Java POO, Optimización de Inventarios</strong>). 
              Cursando actualmente el 5to Semestre de Ingeniería de Software en la Universidad Politécnica Salesiana (UPS).
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 items-center pt-4">
            <a 
              href="#projects" 
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-950 font-semibold text-xs tracking-wider uppercase hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2"
            >
              <FiCode className="w-4 h-4" />
              <span>Explorar Proyectos</span>
            </a>
            
            {onOpenTerminal && (
              <button 
                onClick={onOpenTerminal}
                className="px-6 py-2.5 rounded-full border border-yellow-500/30 hover:border-yellow-400 bg-slate-900/60 hover:bg-slate-800 text-yellow-300 font-mono text-xs tracking-wider uppercase transition-all flex items-center gap-2"
              >
                <FiTerminal className="w-4 h-4 text-cyan-400" />
                <span>Modo Consola CLI</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Connection Cards */}
        <div className="flex flex-col gap-3.5 md:pl-6 md:border-l border-slate-800">
          <span className="text-[11px] font-mono text-yellow-400 tracking-widest uppercase mb-1">
            Conexiones & Contacto
          </span>

          <a 
            href={personal.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 hover:border-yellow-500/40 transition-all text-xs font-mono text-slate-300 hover:text-white group"
          >
            <span className="flex items-center gap-2.5">
              <FiGithub className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
              <span>GitHub Profile</span>
            </span>
            <span className="text-[10px] text-slate-500 group-hover:text-yellow-400">↗</span>
          </a>

          <a 
            href={personal.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 hover:border-yellow-500/40 transition-all text-xs font-mono text-slate-300 hover:text-white group"
          >
            <span className="flex items-center gap-2.5">
              <FiLinkedin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>LinkedIn</span>
            </span>
            <span className="text-[10px] text-slate-500 group-hover:text-cyan-400">↗</span>
          </a>

          <a 
            href={`mailto:${personal.email}`} 
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 hover:border-yellow-500/40 transition-all text-xs font-mono text-slate-300 hover:text-white group"
          >
            <span className="flex items-center gap-2.5">
              <FiMail className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
              <span>{personal.email}</span>
            </span>
            <span className="text-[10px] text-slate-500 group-hover:text-yellow-400">✉</span>
          </a>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/20 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2.5">
              <FiMapPin className="w-4 h-4 text-emerald-400" />
              <span>Quito, Ecuador</span>
            </span>
            <span className="text-[10px] text-slate-500">UTC-5</span>
          </div>
        </div>
      </motion.div>

      {/* Down Scroll Indicator */}
      <div className="mt-16 flex justify-center text-slate-600">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <FiChevronDown className="w-6 h-6 text-yellow-500/50" />
        </motion.div>
      </div>
    </section>
  );
};
