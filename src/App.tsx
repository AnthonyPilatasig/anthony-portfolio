import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './features/hero/HeroSection';
import { ExperienceSection } from './features/experience/ExperienceSection';
import { SkillsSection } from './features/skills/SkillsSection';
import { ProjectsSection } from './features/projects/ProjectsSection';
import { Footer } from './components/layout/Footer';

function App() {
  return (
    <div className="min-h-screen relative selection:bg-neon-cyan/30 selection:text-neon-cyan text-slate-300 font-sans">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-[-1] bg-dark-bg">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-neon-purple rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-neon-cyan rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />

      <main>
        <HeroSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
