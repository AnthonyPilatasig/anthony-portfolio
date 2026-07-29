import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome, FiFolder, FiBriefcase, FiUser, FiTerminal, FiMail, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { path: '/', label: t('nav.home'), icon: <FiHome className="w-3.5 h-3.5" /> },
    { path: '/proyectos', label: t('nav.projects'), icon: <FiFolder className="w-3.5 h-3.5" /> },
    { path: '/trayectoria', label: t('nav.experience'), icon: <FiBriefcase className="w-3.5 h-3.5" /> },
    { path: '/sobre-mi', label: t('nav.about'), icon: <FiUser className="w-3.5 h-3.5" /> },
    { path: '/terminal', label: t('nav.terminal'), icon: <FiTerminal className="w-3.5 h-3.5 text-cyan-400" /> },
    { path: '/contacto', label: t('nav.contact'), icon: <FiMail className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 px-4 md:px-8 py-4">
      <div className="max-w-6xl mx-auto luxury-glass rounded-full px-5 py-3 flex justify-between items-center shadow-2xl border border-yellow-500/20">
        
        {/* Brand Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-mono font-bold text-slate-950 text-xs shadow-md group-hover:scale-105 transition-transform">
            AP
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-gold-gradient">
              Anthony Pilatasig
            </span>
            <span className="text-[9px] font-mono text-slate-600 dark:text-slate-400 hidden sm:block">
              Software Developer & Architect
            </span>
          </div>
        </NavLink>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 bg-white/70 dark:bg-slate-950/70 p-1.5 rounded-full border border-slate-300 dark:border-slate-800">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-yellow-500 text-slate-950 font-bold shadow-md shadow-yellow-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-900/60'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right Section: Theme Toggle, Language Toggle & Mobile Menu */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-slate-300 dark:border-slate-700 hover:border-yellow-500 dark:hover:border-yellow-400 text-yellow-600 dark:text-yellow-400 bg-slate-100/60 dark:bg-slate-900/60 transition-all hover:scale-110"
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {theme === 'dark' ? <FiSun className="w-4 h-4 text-yellow-300" /> : <FiMoon className="w-4 h-4 text-cyan-500" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 hover:border-yellow-500 dark:hover:border-yellow-400 text-xs font-mono font-bold text-yellow-600 dark:text-yellow-300 uppercase tracking-wider transition-all bg-slate-100/60 dark:bg-slate-900/60"
          >
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800"
          >
            {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 max-w-6xl mx-auto luxury-glass rounded-2xl p-4 border border-yellow-500/20 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-yellow-500 text-slate-950 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-900/60'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};
