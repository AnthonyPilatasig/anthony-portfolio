import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome, FiFolder, FiBriefcase, FiUser, FiTerminal, FiMail, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.classList.remove('dark');
    else root.classList.add('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/proyectos', label: t('nav.projects') },
    { path: '/trayectoria', label: t('nav.experience') },
    { path: '/sobre-mi', label: t('nav.about') },
    { path: '/terminal', label: t('nav.terminal') },
    { path: '/contacto', label: t('nav.contact') },
  ];

  return (
    <header
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--theme-border)] bg-[var(--theme-bg)]/95 backdrop-blur-md'
          : 'bg-[var(--theme-bg)]'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Brand */}
        <NavLink
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 group"
        >
          <span className="font-mono font-bold text-sm text-[var(--theme-ink)] group-hover:text-[var(--theme-accent)] transition-colors">
            AP
          </span>
          <span className="hidden sm:block text-xs font-mono text-[var(--theme-ink-muted)] group-hover:text-[var(--theme-ink)] transition-colors">
            Anthony Pilatasig
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                  isActive
                    ? 'text-[var(--theme-accent)] bg-[var(--theme-accent)]/8 font-medium'
                    : 'text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] hover:bg-[var(--theme-border)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 text-xs font-mono text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] border border-[var(--theme-border)] rounded-md transition-colors hover:border-[var(--theme-border-strong)]"
            aria-label="Cambiar idioma"
          >
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </button>

          <button
            onClick={toggleTheme}
            className="p-1.5 text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] border border-[var(--theme-border)] rounded-md transition-colors hover:border-[var(--theme-border-strong)]"
            aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark'
              ? <FiSun className="w-3.5 h-3.5" />
              : <FiMoon className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] border border-[var(--theme-border)] rounded-md transition-colors"
            aria-label="Menú"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--theme-border)] bg-[var(--theme-bg)] px-6 py-4 flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-md text-sm font-mono transition-colors ${
                  isActive
                    ? 'text-[var(--theme-accent)] bg-[var(--theme-accent)]/8 font-medium'
                    : 'text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)] hover:bg-[var(--theme-border)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};
