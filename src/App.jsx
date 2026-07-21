import React, { useState, useEffect } from 'react';
import MatrixBackground from './components/MatrixBackground';
import Dashboard from './components/Dashboard';
import Terminal from './components/Terminal';
import ProjectModal from './components/ProjectModal';
import { SoundEffects } from './utils/SoundEffects';
import { Terminal as TerminalIcon, Layout, Volume2, VolumeX, Cpu } from 'lucide-react';

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
    <div className={`crt-scanlines ${crtActive ? 'crt-overlay' : ''}`}>
      <MatrixBackground />
      <div className="bg-grid" />
      <div className="bg-radial" />

      <div className="hud-container">
        {/* HEADER */}
        <header className="hud-header">
          <div className="hud-logo" onClick={() => handleTabChange('dashboard')}>
            <Cpu size={18} className="spinning" />
            ALI ABDULLAH
            <span>4.0 GPA</span>
          </div>

          {/* Section Navigation Links */}
          <div className="hud-controls" style={{ flexWrap: 'wrap' }}>
            <button 
              className={`hud-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('dashboard')}
            >
              <Layout size={14} /> DASHBOARD
            </button>
            <button 
              className={`hud-button ${activeTab === 'terminal' ? 'active' : ''}`}
              onClick={() => handleTabChange('terminal')}
            >
              <TerminalIcon size={14} /> DECKER SHELL
            </button>

            {activeTab === 'dashboard' && (
              <>
                <a href="#about" className="hud-button" onClick={() => SoundEffects.playToggle()}>ABOUT</a>
                <a href="#experience" className="hud-button" onClick={() => SoundEffects.playToggle()}>EXPERIENCE</a>
                <a href="#projects" className="hud-button" onClick={() => SoundEffects.playToggle()}>PROJECTS</a>
                <a href="#skills" className="hud-button" onClick={() => SoundEffects.playToggle()}>SKILLS</a>
                <a href="#contact" className="hud-button" onClick={() => SoundEffects.playToggle()}>CONTACT</a>
              </>
            )}
          </div>

          {/* Audio & CRT Switches */}
          <div className="hud-controls">
            <button 
              className={`hud-button ${isMuted ? 'accent' : ''}`} 
              onClick={handleMuteToggle}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span className="switch-label" style={{ color: 'inherit' }}>
                {isMuted ? 'MUTED' : 'AUDIO'}
              </span>
            </button>

            <div className="switch-group">
              <span className="switch-label">CRT FX</span>
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
