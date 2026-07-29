import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiMail, FiGithub, FiLinkedin, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { portfolioData } from '../data/portfolio';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const { personal } = portfolioData;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(`De: ${formData.name} (${formData.email})\n\n${formData.message}`);
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-300 dark:border-yellow-500/20 pb-8"
      >
        <div>
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-mono text-xs tracking-widest uppercase mb-2">
            <FiMail className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span>{t('contact.badge')}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extralight text-gold-gradient uppercase tracking-tight">
            {t('contact.title')}
          </h1>
          <p className="text-xs md:text-sm font-mono text-slate-600 dark:text-slate-400 mt-2">
            {t('contact.subtitle')}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Contact Form */}
        <motion.div 
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}
          className="md:col-span-2 luxury-card p-6 md:p-8 rounded-2xl border border-slate-300 dark:border-slate-800 space-y-6"
        >
          <h2 className="text-xl font-mono font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiSend className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span>{t('contact.formTitle')}</span>
          </h2>

          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl border border-emerald-400 dark:border-emerald-500/40 bg-emerald-100/60 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 space-y-2 text-center"
            >
              <FiCheckCircle className="w-10 h-10 mx-auto text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-mono font-bold">{t('contact.successTitle')}</h3>
              <p className="text-xs font-light text-slate-700 dark:text-slate-300">
                {t('contact.successDesc')} <span className="text-yellow-700 dark:text-yellow-300 font-bold">{formData.email}</span>.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-mono text-xs font-bold hover:bg-emerald-400 transition-colors"
              >
                {t('contact.sendAnother')}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">{t('contact.name')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('contact.namePlaceholder')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-200 focus:border-yellow-500 dark:focus:border-yellow-400 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">{t('contact.email')}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('contact.emailPlaceholder')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-200 focus:border-yellow-500 dark:focus:border-yellow-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">{t('contact.subject')}</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={t('contact.subjectPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-200 focus:border-yellow-500 dark:focus:border-yellow-400 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 uppercase mb-1">{t('contact.message')}</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('contact.messagePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-200 focus:border-yellow-500 dark:focus:border-yellow-400 outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-950 font-bold text-xs font-mono tracking-wider uppercase transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <FiSend className="w-4 h-4" />
                <span>{t('contact.sendBtn')}</span>
              </button>
            </form>
          )}
        </motion.div>

        {/* Sidebar Direct Connections */}
        <motion.div 
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}
          className="space-y-4"
        >
          <span className="text-[11px] font-mono text-yellow-700 dark:text-yellow-400 tracking-widest uppercase block mb-1">
            {t('contact.directLinks')}
          </span>

          <a
            href={personal.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-yellow-500/40 transition-all text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white group"
          >
            <span className="flex items-center gap-3">
              <FiGithub className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span>GitHub Profile</span>
            </span>
            <span className="text-slate-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">↗</span>
          </a>

          <a
            href={personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-yellow-500/40 transition-all text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white group"
          >
            <span className="flex items-center gap-3">
              <FiLinkedin className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>LinkedIn</span>
            </span>
            <span className="text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">↗</span>
          </a>

          <a
            href={`mailto:${personal.email}`}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-yellow-500/40 transition-all text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white group"
          >
            <span className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span>{personal.email}</span>
            </span>
            <span className="text-slate-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">✉</span>
          </a>

          <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-200/60 dark:bg-slate-950/60 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Quito, Ecuador</span>
            </span>
            <span className="text-[10px] text-slate-500">UTC-5</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
