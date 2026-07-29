import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiTerminal, FiMonitor, FiCpu, FiLayers, FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { portfolioData } from '../../data/portfolio';
import type { PortfolioViewMode } from '../../components/layout/Navbar';

interface HubLaunchpadProps {
  onSelectMode: (mode: PortfolioViewMode) => void;
  onFilterCategory?: (category: string) => void;
}

export const HubLaunchpad: React.FC<HubLaunchpadProps> = ({ onSelectMode }) => {
  const launchpadItems = [
    {
      id: 'executive',
      title: 'Portafolio Ejecutivo Principal',
      description: 'Vista completa con diseño Bento Grid, firma técnica de arquitectura, trayectoria profesional y proyectos institucionales.',
      icon: <FiUser className="w-6 h-6 text-yellow-400" />,
      badge: 'Vista Principal',
      badgeColor: 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10',
      action: () => onSelectMode('executive')
    },
    {
      id: 'terminal',
      title: 'Consola Virtual UNIX CLI',
      description: 'Terminal interactiva en tiempo real con comandos como help, projects, gacad, desktop, sudo y neofetch.',
      icon: <FiTerminal className="w-6 h-6 text-cyan-400" />,
      badge: 'Módulo Interactivo',
      badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
      action: () => onSelectMode('terminal')
    },
    {
      id: 'gacad',
      title: 'Gacad & Mi ISTPET Showcase',
      description: 'Ecosistema de gestión académica institucional desarrollado para el Instituto Traversari en Angular, React Native y .NET 8.',
      icon: <FiMonitor className="w-6 h-6 text-emerald-400" />,
      badge: 'Core Institucional',
      badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
      action: () => onSelectMode('executive')
    },
    {
      id: 'desktop',
      title: 'Aplicaciones Nativas de Escritorio',
      description: 'DebtManager (C# .NET Desktop SQLite), Buscaminas POO (Java) y Algoritmo de Optimización de Inventarios.',
      icon: <FiCpu className="w-6 h-6 text-purple-400" />,
      badge: 'Escritorio & Algoritmos',
      badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
      action: () => onSelectMode('executive')
    },
    {
      id: 'microservices',
      title: 'Arquitectura Microservicios .NET 8',
      description: 'Plataforma backend distribuida implementando patrones CQRS, Event Sourcing, Domain-Driven Design (DDD) y Kubernetes.',
      icon: <FiLayers className="w-6 h-6 text-amber-400" />,
      badge: 'Backend & DDD',
      badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
      action: () => onSelectMode('executive')
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 pt-36 pb-20 flex flex-col justify-center min-h-[85vh]">
      {/* Header Launcher */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-14 space-y-3"
      >
        <span className="luxury-badge mb-2">
          Platform Launcher Hub v2.5
        </span>
        <h1 className="text-3xl md:text-5xl font-extralight text-gold-gradient uppercase tracking-tight">
          {portfolioData.personal.name}
        </h1>
        <p className="text-xs md:text-sm font-mono text-slate-400 leading-relaxed">
          Selecciona un módulo o interfaz para explorar mis proyectos institucionales, software de escritorio y arquitectura de sistemas.
        </p>
      </motion.div>

      {/* Grid of Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {launchpadItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={item.action}
            className="luxury-card p-6 rounded-2xl flex flex-col justify-between cursor-pointer group border border-slate-800 hover:border-yellow-500/40"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-mono font-bold text-slate-100 group-hover:text-yellow-300 transition-colors flex items-center justify-between">
                  <span>{item.title}</span>
                  <FiArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light mt-2">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-yellow-400/80 group-hover:text-yellow-300">
              <span>Acceder al módulo</span>
              <span>→</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Links Footer */}
      <div className="mt-14 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-400">
        <div>
          <span>Quito, Ecuador • ISTPET Dev Lead</span>
        </div>
        <div className="flex gap-4">
          <a href={portfolioData.personal.github} target="_blank" rel="noreferrer" className="hover:text-yellow-300 transition-colors flex items-center gap-1">
            <FiGithub /> GitHub
          </a>
          <a href={portfolioData.personal.linkedin} target="_blank" rel="noreferrer" className="hover:text-yellow-300 transition-colors flex items-center gap-1">
            <FiLinkedin /> LinkedIn
          </a>
          <a href={`mailto:${portfolioData.personal.email}`} className="hover:text-yellow-300 transition-colors flex items-center gap-1">
            <FiMail /> Email
          </a>
        </div>
      </div>
    </div>
  );
};
