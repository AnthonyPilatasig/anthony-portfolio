import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiChevronDown } from 'react-icons/fi';
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
            Anthony<span className="text-gradient">.dev</span>
          </span>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#about" className="hover:text-neon-cyan transition-colors">Sobre Mí</a>
            <a href="#experience" className="hover:text-neon-cyan transition-colors">Experiencia</a>
            <a href="#projects" className="hover:text-neon-cyan transition-colors">Proyectos</a>
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
          <FiChevronDown size={32} />
        </motion.div>
      </main>
    </div>
  );
}

export default App;
