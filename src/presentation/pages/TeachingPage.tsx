import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiGlobe, FiUsers, FiZap, FiGithub, FiArrowRight, FiBookOpen, FiCheckCircle,
} from 'react-icons/fi';
import { getPortfolioData } from '@application/useCases/portfolio/getPortfolioData';
import { SEO } from '@presentation/components/ui/SEO';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 90, damping: 18 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const PRINCIPLES = [
  {
    icon: <FiGlobe className="w-5 h-5" />,
    title: 'Ejemplos del mundo real',
    desc: 'Antes de escribir código, explico el tema con situaciones cotidianas para que el concepto tenga sentido.',
  },
  {
    icon: <FiUsers className="w-5 h-5" />,
    title: 'Casos del trabajo diario',
    desc: 'Llevo al aula lo que vivo como desarrollador: trabajar en equipo, entender código heredado y resolver errores reales.',
  },
  {
    icon: <FiZap className="w-5 h-5" />,
    title: 'Ideas propias, con la IA como apoyo',
    desc: 'Los proyectos dejan espacio para que cada estudiante proponga su idea. La IA se usa para aprender y avanzar, no para reemplazar el razonamiento.',
  },
  {
    icon: <FiGithub className="w-5 h-5" />,
    title: 'GitHub como espacio de trabajo',
    desc: 'Los proyectos viven en repositorios, así que practican ramas, commits y colaboración como en un equipo profesional.',
  },
];

const CLASS_FLOW = [
  { step: '01', title: 'Un problema real', desc: 'Empezamos con una situación concreta que el tema ayuda a resolver.' },
  { step: '02', title: 'El concepto', desc: 'Explico la idea con ejemplos y, cuando ayuda, con código en vivo.' },
  { step: '03', title: 'Práctica guiada', desc: 'Resolvemos juntos un ejercicio y comentamos los errores comunes.' },
  { step: '04', title: 'Proyecto propio', desc: 'Cada estudiante o equipo aplica el tema en una idea creativa suya.' },
  { step: '05', title: 'Revisión en GitHub', desc: 'Reviso el repositorio: avance, commits y cómo se repartió el trabajo.' },
];

// Public class repositories on Anthony's GitHub, used as teaching material.
const CLASS_REPOS = [
  {
    name: 'Fundamentos de Programación',
    desc: 'Ejercicios de lógica y estructuras de control trabajados en clase.',
    url: 'https://github.com/AnthonyPilatasig/fundamentos_programacion_ISTPET_25-26',
  },
  {
    name: 'Programación Orientada a Objetos',
    desc: 'Clases, herencia, polimorfismo e interfaces paso a paso.',
    url: 'https://github.com/AnthonyPilatasig/Programacion_Orienta_Objetos',
  },
  {
    name: 'Examen práctico: Buscaminas en consola',
    desc: 'Ejemplo de proyecto evaluado: lógica de matrices y recursión en Java.',
    url: 'https://github.com/AnthonyPilatasig/ExamenPractico_POO',
  },
];

export const TeachingPage: React.FC = () => {
  const { teachingHighlights } = getPortfolioData();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 md:pt-36 pb-24">
      <SEO
        title="Docencia — Anthony Pilatasig"
        description="Cómo enseño programación: ejemplos del mundo real, casos del trabajo diario y proyectos creativos en GitHub. Docente de la carrera de Desarrollo de Software en el ISTPET."
      />

      {/* ─── Header ─── */}
      <motion.header initial="hidden" animate="show" variants={stagger} className="max-w-3xl mb-16">
        <motion.span variants={fadeUp} className="section-index">Docencia</motion.span>
        <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--theme-ink)]">
          Enseño a programar con casos reales.
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 text-base text-[var(--theme-ink-muted)] leading-relaxed">
          Desde hace un año y medio soy docente de la carrera de Desarrollo de Software en el ISTPET. Las materias
          cambian cada período —desde fundamentos y lógica hasta sistemas completos con frontend, backend y base de
          datos— pero la idea es la misma: que lo aprendido se parezca a lo que harán en un equipo de desarrollo.
        </motion.p>
      </motion.header>

      {/* ─── Principles ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mb-20"
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold text-[var(--theme-ink)] mb-6">Cómo enseño</motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRINCIPLES.map((p) => (
            <motion.div key={p.title} variants={fadeUp} className="glass-card p-6 space-y-2">
              <span className="text-[var(--theme-accent)]">{p.icon}</span>
              <h3 className="text-base font-semibold text-[var(--theme-ink)]">{p.title}</h3>
              <p className="text-sm text-[var(--theme-ink-muted)] leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── A typical class ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mb-20"
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold text-[var(--theme-ink)] mb-6">Así es una clase</motion.h2>
        <ol className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {CLASS_FLOW.map((s) => (
            <motion.li key={s.step} variants={fadeUp} className="glass-card p-5 space-y-2">
              <span className="font-mono text-xs font-semibold text-[var(--theme-accent)]">{s.step}</span>
              <h3 className="text-sm font-semibold text-[var(--theme-ink)]">{s.title}</h3>
              <p className="text-sm text-[var(--theme-ink-muted)] leading-relaxed">{s.desc}</p>
            </motion.li>
          ))}
        </ol>
      </motion.section>

      {/* ─── Subjects ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mb-20"
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold text-[var(--theme-ink)] mb-2">Qué enseño</motion.h2>
        <motion.p variants={fadeUp} className="text-sm text-[var(--theme-ink-muted)] mb-6 max-w-2xl">
          Los materiales de cada materia se comparten en el EVA institucional. Estos son los ejes que más se repiten.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teachingHighlights.map((th) => (
            <motion.div key={th.subject} variants={fadeUp} className="glass-card p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[var(--theme-accent)]">
                <FiBookOpen className="w-4 h-4" />
                <span className="font-mono text-[11px] font-semibold uppercase">{th.studentsCount}</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--theme-ink)]">{th.subject}</h3>
              <p className="text-sm text-[var(--theme-ink-muted)] leading-relaxed flex-1">{th.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {th.focus.map((f) => (
                  <span key={f} className="badge text-[11px]">{f}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── Evaluation ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
      >
        <motion.div variants={fadeUp}>
          <h2 className="text-2xl font-semibold text-[var(--theme-ink)] mb-4">Cómo evalúo</h2>
          <p className="text-sm text-[var(--theme-ink-muted)] leading-relaxed">
            Prefiero proyectos pequeños y creativos a los exámenes de memoria. Cada proyecto tiene que hacer pensar:
            no hay una única respuesta correcta, y el estudiante decide qué construir dentro del tema.
          </p>
        </motion.div>
        <motion.ul variants={fadeUp} className="glass-card p-6 space-y-3">
          {[
            'El proyecto resuelve el problema planteado y funciona.',
            'La idea es propia; la IA se usa como apoyo y se explica cómo.',
            'El historial en GitHub muestra trabajo constante y en equipo.',
            'El estudiante puede explicar su código y sus decisiones.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[var(--theme-ink)]">
              <FiCheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>
      </motion.section>

      {/* ─── Class repositories ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mb-20"
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold text-[var(--theme-ink)] mb-2">Repositorios de clase</motion.h2>
        <motion.p variants={fadeUp} className="text-sm text-[var(--theme-ink-muted)] mb-6 max-w-2xl">
          Material público que uso en clase. Los proyectos de los estudiantes viven en sus propios repositorios,
          donde practican el trabajo en equipo.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CLASS_REPOS.map((r) => (
            <motion.a
              key={r.url}
              variants={fadeUp}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card group p-6 flex flex-col gap-2"
            >
              <FiGithub className="w-5 h-5 text-[var(--theme-ink)]" />
              <h3 className="text-base font-semibold text-[var(--theme-ink)] group-hover:text-[var(--theme-accent)] transition-colors">
                {r.name}
              </h3>
              <p className="text-sm text-[var(--theme-ink-muted)] leading-relaxed">{r.desc}</p>
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* ─── CTA ─── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h2 className="text-2xl font-semibold text-[var(--theme-ink)]">¿Buscas un docente, un taller o una mentoría?</h2>
          <p className="text-sm text-[var(--theme-ink-muted)] mt-2 max-w-xl">
            Puedo dar clases de programación, talleres de Git y GitHub o acompañar a un equipo en su proyecto.
          </p>
        </div>
        <Link to="/contacto" className="btn-primary shrink-0">
          Escribirme <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.section>
    </div>
  );
};
