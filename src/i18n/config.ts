import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esTranslation from './locales/es.json';
import enTranslation from './locales/en.json';

const STORAGE_KEY = 'lang';
const SUPPORTED = ['es', 'en'];

const storedLang = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && SUPPORTED.includes(saved) ? saved : null;
  } catch {
    return null;
  }
})();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: esTranslation },
      en: { translation: enTranslation }
    },
    lng: storedLang ?? 'es', // recuerda la elección del visitante; español por defecto
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React ya hace un escape seguro
    }
  });

// Keep <html lang="..."> and localStorage in sync with the active language, so a
// reload doesn't silently reset to Spanish and screen readers/SEO see the right lang.
const syncDocumentLanguage = (lng: string) => {
  document.documentElement.lang = lng;
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch { /* localStorage unavailable (private mode, etc.) — non-fatal */ }
};

syncDocumentLanguage(i18n.language);
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
