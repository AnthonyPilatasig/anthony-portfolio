import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from '@presentation/layout/Navbar';
import { Footer } from '@presentation/layout/Footer';
import { SEO } from '@presentation/components/ui/SEO';
import { MouseSpotlight } from '@presentation/components/ui/MouseSpotlight';
import { CustomCursor } from '@presentation/components/ui/CustomCursor';
import { ScrollToTop } from '@presentation/components/ui/ScrollToTop';
// The audio player is being actively reworked outside this refactor, so it's left
// in its original location for now instead of moving into presentation/features.
import { GlobalAudioPlayer } from '../../components/common/GlobalAudioPlayer';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ScrollToTop />
      <div className="min-h-screen relative selection:bg-blue-500/15 selection:text-blue-900 font-sans overflow-x-clip transition-colors duration-500">
        <SEO />
        <MouseSpotlight />
        <CustomCursor />
        
        {/* Background Ambient Glows — optimizado: sin animate-pulse para no dregar GPU */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)',
              filter: 'blur(80px)',
              willChange: 'auto',
            }}
          />
          <div
            className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
              filter: 'blur(80px)',
              willChange: 'auto',
            }}
          />
          <div
            className="absolute bottom-[-10%] left-[20%] w-[550px] h-[550px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
              filter: 'blur(100px)',
              willChange: 'auto',
            }}
          />
        </div>

        {/* Global Navigation Header */}
        <Navbar />

        {/* Multi-Page Routes */}
        <main>
          <AppRouter />
        </main>

        {/* Global Persistent Audio Player (Live Radio: Lofi, VGM, Chill) */}
        <GlobalAudioPlayer />

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
