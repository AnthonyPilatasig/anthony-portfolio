import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="fixed w-full z-50 top-0 px-6 py-4">
      <div className="max-w-6xl mx-auto glass-panel rounded-full px-6 py-3 flex justify-between items-center">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
          Anthony P.
        </span>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#about" className="hover:text-neon-cyan transition-colors">{t('nav.about')}</a>
          <a href="#experience" className="hover:text-neon-cyan transition-colors">{t('nav.experience')}</a>
          <a href="#projects" className="hover:text-neon-cyan transition-colors">{t('nav.projects')}</a>
          <a href="#contact" className="hover:text-neon-cyan transition-colors">{t('nav.contact')}</a>
        </div>
        <button 
          onClick={toggleLanguage}
          className="px-4 py-1.5 rounded-full border border-slate-700 hover:border-neon-cyan transition-colors text-xs font-bold uppercase tracking-wider"
        >
          {i18n.language === 'es' ? 'EN' : 'ES'}
        </button>
      </div>
    </nav>
  );
};
