import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-800/50 text-center text-slate-400">
      <p>© {new Date().getFullYear()} Anthony Pilatasig. {t('footer.rights')}</p>
    </footer>
  );
};
