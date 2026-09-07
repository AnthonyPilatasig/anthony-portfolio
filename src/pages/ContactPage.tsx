import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiMail, FiGithub, FiLinkedin, FiMapPin, FiSend, FiCheckCircle, FiPhone, FiCopy, FiCheck } from 'react-icons/fi';
import { SiTwitch, SiWhatsapp } from 'react-icons/si';
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
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleCopyPhone = async () => {
    if (!personal.phone) return;
    try {
      await navigator.clipboard.writeText(personal.phone);
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 2500);
    } catch { /* silent */ }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2500);
    } catch { /* silent */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    try {
      const subject = encodeURIComponent(formData.subject || 'Contacto desde Portafolio');
      const body = encodeURIComponent(`Hola Anthony,\n\nDe: ${formData.name} (${formData.email})\n\nMensaje:\n${formData.message}`);
      window.open(`mailto:${personal.email}?subject=${subject}&body=${body}`, '_blank');
      setFormSubmitted(true);
    } catch {
      setFormError('Error al abrir el cliente de correo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 md:pt-36 pb-24">
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
          className="space-y-3"
        >
          <span className="section-index block mb-1">
            {t('contact.directLinks')}
          </span>

          {/* WhatsApp Direct Chat */}
          <a
            href={`https://wa.me/593983588715?text=${encodeURIComponent('Hola Anthony, vi tu portafolio y me gustaría conversar contigo sobre una oportunidad laboral / proyecto.')}`}
            target="_blank"
            rel="noreferrer"
            className="editorial-card p-3.5 rounded-lg flex items-center justify-between group hover:border-emerald-500/50 transition-colors"
          >
            <span className="flex items-center gap-3">
              <SiWhatsapp className="w-5 h-5 text-emerald-500" />
              <div>
                <span className="text-xs font-mono font-bold text-[var(--theme-ink)] block">WhatsApp Directo</span>
                <span className="text-[10px] text-[var(--theme-ink-muted)]">Respuesta rápida</span>
              </div>
            </span>
            <span className="text-xs font-mono text-emerald-500 group-hover:translate-x-0.5 transition-transform">↗</span>
          </a>

          {/* Phone Copy */}
          <div className="editorial-card p-3.5 rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-3">
              <FiPhone className="w-5 h-5 text-[var(--theme-accent)]" />
              <div>
                <span className="text-xs font-mono font-bold text-[var(--theme-ink)] block">{personal.phone}</span>
                <span className="text-[10px] text-[var(--theme-ink-muted)]">Móvil / WhatsApp</span>
              </div>
            </span>
            <button
              onClick={handleCopyPhone}
              className="px-2.5 py-1 text-[10px] font-mono rounded bg-[var(--theme-bg)] hover:bg-[var(--theme-border)] text-[var(--theme-ink)] transition-colors border border-[var(--theme-border)] flex items-center gap-1"
            >
              {phoneCopied ? <FiCheck className="w-3 h-3 text-emerald-500" /> : <FiCopy className="w-3 h-3" />}
              <span>{phoneCopied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {/* Email Copy */}
          <div className="editorial-card p-3.5 rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-3 min-w-0">
              <FiMail className="w-5 h-5 text-[var(--theme-accent)] shrink-0" />
              <div className="truncate">
                <span className="text-xs font-mono font-bold text-[var(--theme-ink)] block truncate">{personal.email}</span>
                <span className="text-[10px] text-[var(--theme-ink-muted)]">Correo Principal</span>
              </div>
            </span>
            <button
              onClick={handleCopyEmail}
              className="px-2.5 py-1 text-[10px] font-mono rounded bg-[var(--theme-bg)] hover:bg-[var(--theme-border)] text-[var(--theme-ink)] transition-colors border border-[var(--theme-border)] shrink-0 flex items-center gap-1"
            >
              {emailCopied ? <FiCheck className="w-3 h-3 text-emerald-500" /> : <FiCopy className="w-3 h-3" />}
              <span>{emailCopied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          <a
            href={personal.github}
            target="_blank"
            rel="noreferrer"
            className="editorial-card p-3.5 rounded-lg flex items-center justify-between group"
          >
            <span className="flex items-center gap-3">
              <FiGithub className="w-5 h-5 text-[var(--theme-accent)]" />
              <span className="text-xs font-mono text-[var(--theme-ink)]">GitHub (AnthonyPilatasig)</span>
            </span>
            <span className="text-[var(--theme-ink-muted)] group-hover:text-[var(--theme-accent)] transition-colors">↗</span>
          </a>

          <a
            href={personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="editorial-card p-3.5 rounded-lg flex items-center justify-between group"
          >
            <span className="flex items-center gap-3">
              <FiLinkedin className="w-5 h-5 text-[var(--theme-accent)]" />
              <span className="text-xs font-mono text-[var(--theme-ink)]">LinkedIn Profile</span>
            </span>
            <span className="text-[var(--theme-ink-muted)] group-hover:text-[var(--theme-accent)] transition-colors">↗</span>
          </a>

          <a
            href={personal.twitch}
            target="_blank"
            rel="noreferrer"
            className="editorial-card p-3.5 rounded-lg flex items-center justify-between group"
          >
            <span className="flex items-center gap-3">
              <SiTwitch className="w-5 h-5 text-[#9146FF]" />
              <span className="text-xs font-mono text-[var(--theme-ink)]">Twitch Streams</span>
            </span>
            <span className="text-[var(--theme-ink-muted)] group-hover:text-[#9146FF] transition-colors">↗</span>
          </a>

          <div className="editorial-card p-3.5 rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-[var(--theme-accent)]" />
              <span className="text-xs font-mono text-[var(--theme-ink)]">Quito, Ecuador</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--theme-ink-muted)]">UTC-5</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
