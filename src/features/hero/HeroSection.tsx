import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiChevronDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '../../data/portfolio';

export const HeroSection = () => {
  const { t } = useTranslation();
  const { personal } = portfolioData;

  return (
    <section id="about" className="max-w-6xl mx-auto px-6 pt-40 pb-20 flex flex-col justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-neon-cyan font-mono mb-4 text-lg tracking-wide">{t('hero.greeting')}</p>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          {personal.name}.<br />
          <span className="text-slate-400 block mt-2 text-4xl md:text-6xl">{personal.title}</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          {personal.email}
        </p>

        <div className="flex flex-wrap gap-6 items-center">
          <a 
            href="#projects" 
            className="px-8 py-3 rounded-full bg-neon-cyan text-dark-bg font-bold hover:bg-white transition-colors"
          >
            {t('hero.cta')}
          </a>
          <a 
            href="#contact" 
            className="px-8 py-3 rounded-full border border-slate-700 hover:border-neon-cyan transition-colors"
          >
            {t('hero.contact')}
          </a>
          <div className="flex gap-4 ml-auto md:ml-4">
            <a href={personal.github} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white transition-colors">
              <FiGithub size={24} />
            </a>
            <a href={personal.linkedin} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white transition-colors">
              <FiLinkedin size={24} />
            </a>
            <a href={`mailto:${personal.email}`} className="p-2 text-slate-400 hover:text-white transition-colors">
              <FiMail size={24} />
            </a>
          </div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500"
      >
        <FiChevronDown size={32} />
      </motion.div>
    </section>
  );
};
