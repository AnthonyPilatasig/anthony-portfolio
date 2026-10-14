import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FiFolder, FiGithub, FiMonitor, FiSmartphone, FiCpu, FiX, FiExternalLink,
  FiChevronLeft, FiChevronRight, FiUser, FiTarget, FiCheckCircle,
  FiTrendingUp, FiLock, FiImage, FiLayers,
} from 'react-icons/fi';
import { getPortfolioData } from '@application/useCases/portfolio/getPortfolioData';
import { mergeLocalizedEntries } from '@application/useCases/portfolio/mergeLocalizedEntries';
import { SEO } from '@presentation/components/ui/SEO';
import type { IProject, IProjectScreenshot, ProjectCategory } from '@domain/entities/portfolio.entity';

type Gallery = { shots: IProjectScreenshot[]; index: number };

const screenshotsOf = (p: IProject): IProjectScreenshot[] =>
  p.screenshots && p.screenshots.length > 0
    ? p.screenshots
    : [{ url: p.image, title: p.title, caption: p.description }];

const hasLink = (url?: string) => !!url && url !== '#';

// ─── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox: React.FC<{ gallery: Gallery; onClose: () => void }> = ({ gallery, onClose }) => {
  const [index, setIndex] = useState(gallery.index);
  const touchX = useRef<number | null>(null);
  const shot = gallery.shots[index];
  const count = gallery.shots.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [go, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={shot.title}
      onClick={onClose}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="font-mono text-xs text-slate-300">{index + 1} / {count}</span>
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20" aria-label="Cerrar">
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-2 sm:px-16 min-h-0">
        <img
          src={shot.url}
          alt={shot.title}
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        {count > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="hidden sm:flex absolute left-3 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label="Anterior"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="hidden sm:flex absolute right-3 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label="Siguiente"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      <div className="px-4 py-4 text-center text-white" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm font-semibold">{shot.title}</p>
        <p className="text-xs text-slate-300 mt-1">{shot.caption}</p>
        {count > 1 && <p className="sm:hidden text-[11px] text-slate-400 mt-2">Desliza para ver más</p>}
      </div>
    </motion.div>
  );
};

// ─── Details panel (modal on desktop, bottom sheet on phones) ────────────────
const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <section className="space-y-1.5">
    <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--theme-ink)]">{icon}{title}</h3>
    <div className="text-sm text-[var(--theme-ink-muted)] leading-relaxed">{children}</div>
  </section>
);

const ProjectDetails: React.FC<{ project: IProject; onClose: () => void; onOpen: (g: Gallery) => void }> = ({ project, onClose, onOpen }) => {
  const shots = screenshotsOf(project);
  const flow = project.architectureFlow;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl max-h-[88vh] overflow-y-auto overscroll-contain rounded-t-3xl sm:rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg-solid)] shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--glass-border)] bg-[var(--glass-bg-solid)] px-5 py-4">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--theme-accent)] truncate">{project.client}</p>
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--theme-ink)]">{project.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--theme-border)] text-[var(--theme-ink-muted)]" aria-label="Cerrar">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          {shots.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {shots.map((s, i) => (
                <button
                  key={s.url}
                  onClick={() => onOpen({ shots, index: i })}
                  className={`shrink-0 overflow-hidden rounded-lg border border-[var(--glass-border)] ${project.category === 'mobile' ? 'w-20 aspect-[9/19.5]' : 'w-36 aspect-[16/10]'}`}
                  aria-label={`Ampliar: ${s.title}`}
                >
                  <img src={s.url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}

          {project.role && <Section icon={<FiUser className="w-4 h-4 text-[var(--theme-accent)]" />} title="Mi rol">{project.role}</Section>}
          {project.problem && <Section icon={<FiTarget className="w-4 h-4 text-amber-500" />} title="El reto">{project.problem}</Section>}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <Section icon={<FiCheckCircle className="w-4 h-4 text-emerald-500" />} title="Qué incluye">
              <ul className="list-disc pl-5 space-y-1">
                {project.keyFeatures.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </Section>
          )}
          {project.impact && <Section icon={<FiTrendingUp className="w-4 h-4 text-sky-500" />} title="Resultado">{project.impact}</Section>}

          {(flow || project.decision) && (
            <Section icon={<FiLayers className="w-4 h-4 text-violet-500" />} title="Cómo está construido">
              {flow && (
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {flow.nodes.map((n, i) => (
                    <React.Fragment key={n.id}>
                      {i > 0 && <FiChevronRight className="w-3.5 h-3.5" />}
                      <span className="rounded-md border border-[var(--glass-border)] px-2 py-1 text-xs text-[var(--theme-ink)]">{n.label}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
              {project.decision && <p>{project.decision}</p>}
            </Section>
          )}

          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => <span key={tech} className="badge text-[11px] normal-case">{tech}</span>)}
          </div>

          {project.ndaDisclaimer && (
            <p className="flex items-start gap-2 text-xs text-[var(--theme-ink-muted)]">
              <FiLock className="w-3.5 h-3.5 mt-0.5 shrink-0" />{project.ndaDisclaimer}
            </p>
          )}

          <ProjectLinks project={project} />
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectLinks: React.FC<{ project: IProject }> = ({ project }) => (
  <div className="flex flex-wrap gap-2">
    {hasLink(project.liveUrl) && (
      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
        <FiExternalLink className="w-3.5 h-3.5" />
        {project.liveUrl!.includes('play.google.com') ? 'Google Play' : 'Ver en vivo'}
      </a>
    )}
    {hasLink(project.githubUrl) && (
      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
        <FiGithub className="w-3.5 h-3.5" />
        GitHub
      </a>
    )}
  </div>
);

// ─── Compact project card ────────────────────────────────────────────────────
const ProjectCard: React.FC<{ project: IProject; onOpen: (g: Gallery) => void; onDetails: () => void }> = ({ project, onOpen, onDetails }) => {
  const shots = screenshotsOf(project);
  return (
    <article className="glass-card flex flex-col overflow-hidden">
      <button
        onClick={() => onOpen({ shots, index: 0 })}
        className="relative block aspect-[16/9] overflow-hidden bg-[var(--theme-bg)]"
        aria-label={`Ver capturas de ${project.title}`}
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
        />
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[11px] text-white">
          <FiImage className="w-3 h-3" /> {shots.length}
        </span>
        {project.category === 'mobile' && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[11px] text-white">
            <FiSmartphone className="w-3 h-3" /> App móvil
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-snug text-[var(--theme-ink)]">{project.title}</h3>
          <p className="text-sm text-[var(--theme-ink-muted)] leading-relaxed line-clamp-2">{project.description}</p>
        </div>

        {project.role && (
          <p className="flex items-start gap-1.5 text-xs text-[var(--theme-ink)] line-clamp-2">
            <FiUser className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--theme-accent)]" />
            {project.role}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="badge text-[11px] normal-case">{tech}</span>
          ))}
          {project.technologies.length > 4 && <span className="badge text-[11px]">+{project.technologies.length - 4}</span>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <button onClick={onDetails} className="flex items-center gap-1 text-sm font-semibold text-[var(--theme-accent)] hover:underline">
            Ver detalles <FiChevronRight className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            {hasLink(project.liveUrl) && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-[var(--theme-border)] text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)]" aria-label="Ver proyecto publicado">
                <FiExternalLink className="w-4 h-4" />
              </a>
            )}
            {hasLink(project.githubUrl) && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-[var(--theme-border)] text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)]" aria-label="Ver en GitHub">
                <FiGithub className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────
export const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  const projects = mergeLocalizedEntries<IProject>(
    getPortfolioData().projects,
    t('projectsData', { returnObjects: true })
  );

  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [details, setDetails] = useState<IProject | null>(null);
  const closeDetails = useCallback(() => setDetails(null), []);
  const closeGallery = useCallback(() => setGallery(null), []);

  // Only offer filters that actually have projects behind them.
  const categories = useMemo(() => {
    const all: { key: ProjectCategory; label: string; icon: React.ReactNode }[] = [
      { key: 'all', label: t('projects.catAll'), icon: <FiFolder className="w-3.5 h-3.5" /> },
      { key: 'web', label: 'Web', icon: <FiMonitor className="w-3.5 h-3.5" /> },
      { key: 'mobile', label: 'Móvil', icon: <FiSmartphone className="w-3.5 h-3.5" /> },
      { key: 'desktop', label: 'Escritorio', icon: <FiCpu className="w-3.5 h-3.5" /> },
    ];
    return all.filter((c) => c.key === 'all' || projects.some((p) => p.category === c.key));
  }, [projects, t]);

  // Work projects with real (fake-data) screenshots first, then the rest.
  const visible = (activeCategory === 'all' ? projects : projects.filter((p) => p.category === activeCategory))
    .slice()
    .sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 md:pt-36 pb-24">
      <SEO
        title="Proyectos — Anthony Pilatasig"
        description="Sistemas institucionales, una app publicada en Google Play y proyectos personales: mi rol, lo que construí y el resultado."
      />

      <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="section-index">{t('projects.badge')}</span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--theme-ink)]">Lo que he construido</h1>
          <p className="mt-3 flex items-start gap-2 text-sm text-[var(--theme-ink-muted)]">
            <FiLock className="w-4 h-4 mt-0.5 shrink-0" />
            Los sistemas institucionales están bajo contrato: las capturas usan datos ficticios y no se muestra código.
          </p>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar proyectos">
          {categories.map((cat) => (
            <button
              key={cat.key}
              role="tab"
              aria-selected={activeCategory === cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors ${
                activeCategory === cat.key
                  ? 'bg-[var(--theme-accent)] text-white shadow-sm'
                  : 'glass-pill text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink)]'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {visible.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={setGallery} onDetails={() => setDetails(p)} />
        ))}
      </div>

      <AnimatePresence>
        {details && <ProjectDetails key={details.id} project={details} onClose={closeDetails} onOpen={setGallery} />}
      </AnimatePresence>
      <AnimatePresence>
        {gallery && <Lightbox key={gallery.shots[0].url + gallery.index} gallery={gallery} onClose={closeGallery} />}
      </AnimatePresence>
    </div>
  );
};
