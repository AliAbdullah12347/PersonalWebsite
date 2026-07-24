import React, { useState, useEffect } from 'react';
import MatrixBackground from './components/MatrixBackground';
import Dashboard from './components/Dashboard';
import Terminal from './components/Terminal';
import ProjectModal from './components/ProjectModal';
import { SoundEffects } from './utils/SoundEffects';
import { Terminal as TerminalIcon, Layout, Volume2, VolumeX, Cpu } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';


function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [crtActive, setCrtActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    SoundEffects.setMuted(false);
    SoundEffects.playBoot();
  }, []);

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

            <button className="hud-button" onClick={() => scrollToSection('about')}>ABOUT</button>
            <button className="hud-button" onClick={() => scrollToSection('experience')}>EXPERIENCE</button>
            <button className="hud-button" onClick={() => scrollToSection('projects')}>PROJECTS</button>
            <button className="hud-button" onClick={() => scrollToSection('skills')}>SKILLS</button>
            <button className="hud-button" onClick={() => scrollToSection('contact')}>CONTACT</button>

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
        <main className="hud-mainframe">
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
        <footer 
          style={{ 
            marginTop: 'auto', 
            paddingTop: '24px', 
            textAlign: 'center', 
            fontSize: '0.7rem', 
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--color-border)'
          }}
        >
          <div>SYS STATUS: SECURED // VERCEL READY</div>
          <div>© {new Date().getFullYear()} ALI ABDULLAH // ALL RIGHTS RESERVED</div>
          <div>COLGATE UNIVERSITY CS & APPLIED MATH</div>
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
