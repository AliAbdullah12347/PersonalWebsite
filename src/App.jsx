import React, { useState, useEffect } from 'react';
import MatrixBackground from './components/MatrixBackground';
import Dashboard from './components/Dashboard';
import Terminal from './components/Terminal';
import ProjectModal from './components/ProjectModal';
import { SoundEffects } from './utils/SoundEffects';
import { resumeData } from './data/resumeData';
import { Terminal as TerminalIcon, Layout, Volume2, VolumeX, Cpu } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';


// Dashboard sections, in document order — drives both the nav strip and the
// scroll-spy highlight below.
const SECTIONS = [
  { id: 'about', label: 'ABOUT' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'hobbies', label: 'HOBBIES' },
  { id: 'contact', label: 'CONTACT' },
];

const SPY_IDS = ['hero', ...SECTIONS.map((s) => s.id)];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [crtActive, setCrtActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    SoundEffects.setMuted(false);
    SoundEffects.playBoot();
  }, []);

  // Highlight whichever section the reader is actually looking at. Throttled
  // to one rAF per scroll burst so this stays off the critical path.
  useEffect(() => {
    if (activeTab !== 'dashboard') return undefined;

    let queued = false;

    const update = () => {
      queued = false;
      const marker = window.innerHeight * 0.3;
      let current = SPY_IDS[0];
      for (const id of SPY_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= marker) current = id;
      }

      // The final section is shorter than the scroll runway left below it, so
      // its top never reaches the marker. Treat "scrolled to the bottom" as
      // being in the last section.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = SPY_IDS[SPY_IDS.length - 1];

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    SoundEffects.playToggle();
    setActiveTab(tab);
  };

  const scrollToSection = (sectionId) => {
    SoundEffects.playToggle();
    
    const executeScroll = () => {
      const elem = document.getElementById(sectionId);
      if (elem) {
        const headerOffset = 70;
        const elementPosition = elem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    if (activeTab !== 'dashboard') {
      setActiveTab('dashboard');
      setTimeout(executeScroll, 120);
    } else {
      executeScroll();
    }
  };

  const handleCrtToggle = () => {
    SoundEffects.playToggle();
    setCrtActive(!crtActive);
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    SoundEffects.setMuted(nextMuted);
    if (!nextMuted) {
      SoundEffects.playToggle();
    }
  };

  return (
    <div className="app-root">
      <Analytics />
      <a className="skip-link" href="#main-content">Skip to content</a>
      {/* Standalone CRT screen scanline overlay - DOES NOT WRAP DOM */}
      {crtActive && <div className="crt-overlay" />}

      {/* Canvas Matrix Overlay & Grids */}
      <MatrixBackground />
      <div className="bg-grid" />
      <div className="bg-radial" />

      <div className="hud-container">
        {/* STICKY SINGLE LINE HEADER */}
        <header className="hud-header">
          {/* Logo on Left */}
          <div className="hud-logo" onClick={() => scrollToSection('hero')}>
            <Cpu size={16} className="spinning" />
            ALI ABDULLAH
            <span>COLGATE</span>
          </div>

          {/* Navigation Links in Center (Strictly Single Line) */}
          <div className="hud-nav-center">
            <button 
              className={`hud-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('dashboard')}
            >
              <Layout size={13} /> DASHBOARD
            </button>

            {SECTIONS.map((section) => {
              const isCurrent = activeTab === 'dashboard' && activeSection === section.id;
              return (
                <button
                  key={section.id}
                  className={`hud-button ${isCurrent ? 'current' : ''}`}
                  aria-current={isCurrent ? 'true' : undefined}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.label}
                </button>
              );
            })}

            <button 
              className={`hud-button ${activeTab === 'terminal' ? 'active' : ''}`}
              onClick={() => handleTabChange('terminal')}
            >
              <TerminalIcon size={13} /> SHELL
            </button>
          </div>

          {/* Audio & CRT Switches on Right */}
          <div className="hud-controls-right">
            <button 
              className={`hud-button ${isMuted ? 'accent' : ''}`} 
              onClick={handleMuteToggle}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span className="switch-label" style={{ color: 'inherit' }}>
                {isMuted ? 'MUTED' : 'AUDIO'}
              </span>
            </button>

            <div className="switch-group">
              <span className="switch-label">CRT</span>
              <label className="cyber-switch">
                <input 
                  type="checkbox" 
                  checked={crtActive} 
                  onChange={handleCrtToggle}
                  aria-label="CRT Screen scanlines toggle"
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>
        </header>

        {/* MAINFRAME */}
        <main className="hud-mainframe" id="main-content">
          {activeTab === 'dashboard' ? (
            <Dashboard onSelectProject={(project) => {
              SoundEffects.playToggle();
              setSelectedProject(project);
            }} />
          ) : (
            <Terminal />
          )}
        </main>

        {/* FOOTER */}
        <footer className="hud-footer">
          <div>SYS STATUS: ONLINE // OPEN TO SUMMER {resumeData.targetSummer} ROLES</div>
          <div>© {new Date().getFullYear()} ALI ABDULLAH</div>
          <div>COLGATE UNIVERSITY CS &amp; APPLIED MATH</div>
        </footer>
      </div>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => {
            SoundEffects.playToggle();
            setSelectedProject(null);
          }} 
        />
      )}
    </div>
  );
}

export default App;
