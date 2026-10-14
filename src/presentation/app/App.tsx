import { useEffect, type FC } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { prefersRichMotion } from '@presentation/utils/motion';
import { Navbar } from '@presentation/layout/Navbar';
import { Footer } from '@presentation/layout/Footer';
import { SEO } from '@presentation/components/ui/SEO';
import { ScrollToTop } from '@presentation/components/ui/ScrollToTop';
import { GlobalAudioPlayer } from '@presentation/features/audio-player/GlobalAudioPlayer';
import { AppRouter } from './routes/AppRouter';

// /console needs a cross-origin-isolated document for its WASM cores, but that same
// isolation makes Spotify's embed fail. Isolation only changes on a real page load, so
// leaving /console through client-side navigation (e.g. the Back button) reloads once.
const ConsoleIsolationGuard: FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.crossOriginIsolated || pathname === '/console') return;
    // Guard against a reload loop if the host itself isolates every route.
    const key = `ap_isolation_reload:${pathname}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      return;
    }
    window.location.reload();
  }, [pathname]);
  return null;
};

// The music player lives outside /console: that route is isolated (see above) and
// covers the whole screen anyway.
const PlayerOutsideConsole: FC = () => {
  const { pathname } = useLocation();
  return pathname === '/console' ? null : <GlobalAudioPlayer />;
};

// Phones and low-end CPUs keep fades but skip slide/scale entrance animations, which
// otherwise rewrite styles on every frame while scrolling.
const motionMode = prefersRichMotion() ? 'user' : 'always';

function App() {
  return (
    <MotionConfig reducedMotion={motionMode}>
      <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <ScrollToTop />
        <ConsoleIsolationGuard />
        <div className="min-h-screen relative selection:bg-blue-500/15 selection:text-blue-900 font-sans overflow-x-clip transition-colors duration-500">
          <SEO />
          
          {/* Aurora background (CSS only, see index.css). */}
          <div className="aurora" aria-hidden="true">
            <div className="aurora__layer" />
            <div className="aurora__layer aurora__layer--b" />
          </div>

          {/* Global Navigation Header */}
          <Navbar />

          {/* Multi-Page Routes */}
          <main>
            <AppRouter />
          </main>

          {/* Global persistent music player (Spotify) */}
          <PlayerOutsideConsole />

          {/* Global Footer */}
          <Footer />
        </div>
      </Router>
    </MotionConfig>
  );
}

export default App;
