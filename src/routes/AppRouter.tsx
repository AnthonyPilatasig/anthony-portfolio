import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HomePage } from '../pages/HomePage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ExperiencePage } from '../pages/ExperiencePage';
import { AboutPage } from '../pages/AboutPage';
import { TerminalPage } from '../pages/TerminalPage';
import { ContactPage } from '../pages/ContactPage';

export const AppRouter: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
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
          path="/contacto"
          element={
            <PageWrapper>
              <ContactPage />
            </PageWrapper>
          }
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
