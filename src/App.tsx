import { HashRouter as Router } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SEO } from './components/common/SEO';
import { MouseSpotlight } from './components/common/MouseSpotlight';
import { ScrollToTop } from './components/common/ScrollToTop';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen relative selection:bg-yellow-500/20 selection:text-yellow-200 font-sans overflow-x-hidden transition-colors duration-500">
        <SEO />
        <MouseSpotlight />
        
        {/* Background Ambient Glows */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full mix-blend-screen filter blur-[140px] animate-pulse"></div>
          <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[140px]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[550px] h-[550px] bg-emerald-500/10 rounded-full mix-blend-screen filter blur-[160px]"></div>
        </div>

        {/* Global Navigation Header */}
        <Navbar />

        {/* Multi-Page Routes */}
        <main>
          <AppRouter />
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
