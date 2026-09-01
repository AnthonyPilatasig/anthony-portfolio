import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiMail, FiGithub, FiLinkedin, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { portfolioData } from '../data/portfolio';
import { RevealText } from '../components/common/RevealText';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const { personal } = portfolioData;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    try {
      // NOTA: Reemplaza 'YOUR_FORM_ID' con tu ID real de formspree.io
      // Crear cuenta gratis en https://formspree.io y obtener el endpoint
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });
      if (response.ok) {
        setFormSubmitted(true);
      } else {
        const data = await response.json();
        setFormError(data?.error || 'Error al enviar. Intenta de nuevo.');
      }
    } catch {
      // Fallback: abrir mailto si Formspree falla
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(`De: ${formData.name} (${formData.email})\n\n${formData.message}`);
      window.open(`mailto:${personal.email}?subject=${subject}&body=${body}`, '_blank');
      setFormSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14 border-b border-[var(--theme-border)] pb-8"
      >
        <div>
          <span className="section-index">05 / {t('contact.badge')}</span>
          <h1 className="text-4xl md:text-6xl font-sans font-semibold text-[var(--theme-ink)] tracking-tight">
            <RevealText text={t('contact.title')} />
          </h1>
          <p className="text-sm font-mono text-[var(--theme-ink-muted)] mt-2">
            {t('contact.subtitle')}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Contact Form */}
        <motion.div 
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}
          className="md:col-span-2 editorial-card p-6 md:p-8 rounded-lg space-y-6"
        >
          <h2 className="text-lg font-semibold text-[var(--theme-ink)] flex items-center gap-2">
            <FiSend className="w-5 h-5 text-[var(--theme-accent)]" />
            <span>{t('contact.formTitle')}</span>
          </h2>

          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center space-y-2"
            >
              <FiCheckCircle className="w-10 h-10 mx-auto text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-mono font-bold text-emerald-800 dark:text-emerald-300">{t('contact.successTitle')}</h3>
              <p className="text-xs font-light text-emerald-700 dark:text-emerald-400">
                {t('contact.successDesc')} <span className="font-bold">{formData.email}</span>.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold hover:bg-emerald-600 transition-colors"
              >
                {t('contact.sendAnother')}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[var(--theme-ink-muted)] uppercase mb-1">{t('contact.name')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('contact.namePlaceholder')}
                    className="bg-[var(--theme-bg)] border border-[var(--theme-border)] focus:border-[var(--theme-accent)] text-[var(--theme-ink)] font-mono text-sm rounded-lg px-4 py-2.5 outline-none transition-colors w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--theme-ink-muted)] uppercase mb-1">{t('contact.email')}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('contact.emailPlaceholder')}
                    className="bg-[var(--theme-bg)] border border-[var(--theme-border)] focus:border-[var(--theme-accent)] text-[var(--theme-ink)] font-mono text-sm rounded-lg px-4 py-2.5 outline-none transition-colors w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--theme-ink-muted)] uppercase mb-1">{t('contact.subject')}</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={t('contact.subjectPlaceholder')}
                  className="bg-[var(--theme-bg)] border border-[var(--theme-border)] focus:border-[var(--theme-accent)] text-[var(--theme-ink)] font-mono text-sm rounded-lg px-4 py-2.5 outline-none transition-colors w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--theme-ink-muted)] uppercase mb-1">{t('contact.message')}</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('contact.messagePlaceholder')}
                  className="bg-[var(--theme-bg)] border border-[var(--theme-border)] focus:border-[var(--theme-accent)] text-[var(--theme-ink)] font-mono text-sm rounded-lg px-4 py-2.5 outline-none transition-colors w-full resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`btn-primary w-full justify-center py-3 flex items-center gap-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    <span>{t('contact.sending')}</span>
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    <span>{t('contact.sendBtn')}</span>
                  </>
                )}
              </button>
              {formError && (
                <p className="text-red-500 text-xs font-mono text-center">{formError}</p>
              )}
            </form>
          )}
        </motion.div>

        {/* Sidebar Direct Connections */}
        <motion.div 
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}
          className="space-y-4"
        >
          <span className="section-index block mb-1">
            {t('contact.directLinks')}
          </span>

          <a
            href={personal.github}
            target="_blank"
            rel="noreferrer"
            className="editorial-card p-4 rounded-lg flex items-center justify-between group"
          >
            <span className="flex items-center gap-3">
              <FiGithub className="w-5 h-5 text-[var(--theme-accent)]" />
              <span className="text-sm font-mono text-[var(--theme-ink)]">GitHub Profile</span>
            </span>
            <span className="text-[var(--theme-ink-muted)] group-hover:text-[var(--theme-accent)] transition-colors">↗</span>
          </a>

          <a
            href={personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="editorial-card p-4 rounded-lg flex items-center justify-between group"
          >
            <span className="flex items-center gap-3">
              <FiLinkedin className="w-5 h-5 text-[var(--theme-accent)]" />
              <span className="text-sm font-mono text-[var(--theme-ink)]">LinkedIn</span>
            </span>
            <span className="text-[var(--theme-ink-muted)] group-hover:text-[var(--theme-accent)] transition-colors">↗</span>
          </a>

          <a
            href={`mailto:${personal.email}`}
            className="editorial-card p-4 rounded-lg flex items-center justify-between group"
          >
            <span className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-[var(--theme-accent)]" />
              <span className="text-sm font-mono text-[var(--theme-ink)]">{personal.email}</span>
            </span>
            <span className="text-[var(--theme-ink-muted)] group-hover:text-[var(--theme-accent)] transition-colors">✉</span>
          </a>

          <div className="editorial-card p-4 rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-[var(--theme-accent)]" />
              <span className="text-sm font-mono text-[var(--theme-ink)]">Quito, Ecuador</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--theme-ink-muted)]">UTC-5</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
