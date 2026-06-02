import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiChevronDown, FiBriefcase, FiBookOpen, FiExternalLink } from 'react-icons/fi';
import { portfolioData } from './data/portfolio';
import './index.css';

function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-neon-cyan selection:text-dark-bg">
      {/* Background gradients */}
      <div className="fixed inset-0 z-[-1] bg-dark-bg overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-neon-purple opacity-20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-neon-cyan opacity-10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-6xl mx-auto glass-panel px-6 py-4 flex justify-between items-center">
          <span className="text-xl font-bold tracking-tighter">
            {portfolioData.personal.name.split(' ')[0]}<span className="text-gradient">.dev</span>
          </span>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#about" className="hover:text-neon-cyan transition-colors">Sobre Mí</a>
            <a href="#experience" className="hover:text-neon-cyan transition-colors">Experiencia</a>
            <a href="#skills" className="hover:text-neon-cyan transition-colors">Habilidades</a>
            <a href="#contact" className="hover:text-neon-cyan transition-colors">Contacto</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-40 pb-20 flex flex-col justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className="text-neon-cyan font-mono mb-4 text-lg">Hola, mi nombre es</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            Anthony Pilatasig.
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-400 mb-8">
            Construyo soluciones digitales.
          </h2>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            Soy un <span className="text-gradient font-semibold">Desarrollador Full Stack</span> y estudiante de Ingeniería de Software. 
            Me especializo en diseñar e implementar arquitecturas robustas y experiencias web excepcionales.
            Actualmente trabajo en el equipo de desarrollo de <span className="text-white font-semibold">ItspetDev</span>.
          </p>
          
          <div className="flex gap-6 items-center">
            <a 
              href="#projects" 
              className="glass-panel px-8 py-3 text-neon-cyan font-semibold hover:bg-neon-cyan/10 transition-all hover:-translate-y-1"
            >
              Ver mis proyectos
            </a>
            
            <div className="flex gap-4">
              <a href="https://github.com/AnthonyPilatasig" target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white transition-colors">
                <FiGithub size={24} />
              </a>
              <a href="https://linkedin.com/in/anthony-pilatasig" target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white transition-colors">
                <FiLinkedin size={24} />
              </a>
              <a href="mailto:tu-correo@ejemplo.com" className="p-2 text-slate-400 hover:text-white transition-colors">
                <FiMail size={24} />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <a href="#experience" aria-label="Scroll down">
            <FiChevronDown size={32} className="hover:text-neon-cyan transition-colors" />
          </a>
        </motion.div>
      </main>

      {/* Experience & Education Section */}
      <section id="experience" className="max-w-6xl mx-auto px-6 py-20">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-12 flex items-center gap-4"
        >
          <FiBriefcase className="text-neon-cyan" /> Trayectoria
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Experience */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-slate-300">Experiencia</h3>
            <div className="space-y-8">
              {portfolioData.experience.map((exp) => (
                <motion.div 
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-panel p-6 hover:border-neon-cyan/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                    <span className="text-sm font-mono text-neon-cyan bg-neon-cyan/10 px-3 py-1 rounded-full">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-slate-400 font-medium mb-4">{exp.company}</p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map(tech => (
                      <span key={tech} className="text-xs font-mono text-slate-400 bg-dark-bg px-2 py-1 rounded border border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-slate-300 flex items-center gap-3">
              <FiBookOpen className="text-neon-purple" /> Formación
            </h3>
            <div className="space-y-6">
              {portfolioData.education.map((edu) => (
                <motion.div 
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-panel p-6 border-l-4 border-l-neon-purple"
                >
                  <h4 className="text-lg font-bold text-white">{edu.degree}</h4>
                  <p className="text-slate-400 mb-2">{edu.institution}</p>
                  <span className="text-xs font-semibold uppercase tracking-wider text-neon-purple">
                    {edu.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/50">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-12"
        >
          Stack <span className="text-gradient">Tecnológico</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(portfolioData.skills).map(([category, skills], index) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-6"
            >
              <h3 className="text-xl font-semibold text-white capitalize mb-4 border-b border-slate-700 pb-2">
                {category}
              </h3>
              <ul className="space-y-2">
                {skills.map(skill => (
                  <li key={skill} className="flex items-center gap-2 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/50">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-12"
        >
          Proyectos <span className="text-gradient">Destacados</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {portfolioData.projects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-panel overflow-hidden group"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-dark-bg/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <p className="text-neon-purple font-mono text-sm mb-2">{project.client}</p>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-300 mb-6 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map(tech => (
                    <span key={tech} className="text-xs font-medium text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                    <FiGithub size={18} /> Código
                  </a>
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                    <FiExternalLink size={18} /> Ver Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-800/50 py-8 text-center text-slate-400">
        <p className="mb-2">Diseñado y desarrollado por <span className="text-neon-cyan font-semibold">Anthony Pilatasig</span></p>
        <p className="text-sm">© {new Date().getFullYear()} Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
