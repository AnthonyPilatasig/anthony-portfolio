import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const HomePage = React.lazy(() => import('@presentation/pages/HomePage').then(m => ({ default: m.HomePage })));
const ProjectsPage = React.lazy(() => import('@presentation/pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ExperiencePage = React.lazy(() => import('@presentation/pages/ExperiencePage').then(m => ({ default: m.ExperiencePage })));
const AboutPage = React.lazy(() => import('@presentation/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const TerminalPage = React.lazy(() => import('@presentation/pages/TerminalPage').then(m => ({ default: m.TerminalPage })));
const LabPage = React.lazy(() => import('@presentation/pages/LabPage').then(m => ({ default: m.LabPage })));
const ContactPage = React.lazy(() => import('@presentation/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const ConsolePage = React.lazy(() => import('@presentation/pages/ConsolePage').then(m => ({ default: m.ConsolePage })));

export const AppRouter: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--theme-accent)] border-t-transparent animate-spin" />
        </div>
      }>
        <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
        <Route
          path="/proyectos"
          element={
            <PageWrapper>
              <ProjectsPage />
            </PageWrapper>
          }
        />
        <Route
          path="/trayectoria"
          element={
            <PageWrapper>
              <ExperiencePage />
            </PageWrapper>
          }
        />
        <Route
          path="/sobre-mi"
          element={
            <PageWrapper>
              <AboutPage />
            </PageWrapper>
          }
        />
        <Route
          path="/terminal"
          element={
            <PageWrapper>
              <TerminalPage />
            </PageWrapper>
          }
        />
        <Route
          path="/laboratorio"
          element={
            <PageWrapper>
              <LabPage />
            </PageWrapper>
          }
        />
        <Route
          path="/lab"
          element={
            <PageWrapper>
              <LabPage />
            </PageWrapper>
          }
        />
        <Route
          path="/contacto"
          element={
            <PageWrapper>
              <ContactPage />
            </PageWrapper>
          }
        />
        <Route
          path="/console"
          element={<ConsolePage />}
        />
        <Route
          path="*"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
      </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);
