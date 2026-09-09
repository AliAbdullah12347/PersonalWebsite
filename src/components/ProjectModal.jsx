import React, { useEffect } from 'react';
import { X, ShieldAlert, Cpu, Database, Eye, Terminal } from 'lucide-react';
import { SoundEffects } from '../utils/SoundEffects';

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    if (project) {
      SoundEffects.playAlert();
    }
  }, [project]);

  // Escape closes the dossier, and the page behind it stays put while it is open
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;

  const threatModel = project.threatModel || {
    spoofing: 2,
    tampering: 3,
    repudiation: 2,
    infoDisclosure: 4,
    dos: 3,
    elevationOfPrivilege: 4
  };

  const getThreatLabel = (score) => {
    if (score >= 4) return { text: 'HIGH RISK', class: 'high' };
    if (score >= 3) return { text: 'MEDIUM RISK', class: 'med' };
    return { text: 'LOW RISK', class: 'low' };
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div
        className="threat-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Project dossier: ${project.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header-sec">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={20} color="var(--color-neon-magenta)" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-neon-cyan)', textTransform: 'uppercase' }}>
                PROJECT-FILE // {project.title}
              </h2>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                SYSTEM CLASSIFICATION: CONFIDENTIAL // ACCESS LEVEL: DECKER
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="threat-level-badge">{project.github ? 'VERIFIED REPO' : 'PRIVATE BUILD'}</span>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-sec">
          {/* Metadata Block */}
          <div className="project-meta-strip">
            <div className="sys-stat-item">
              <span className="sys-stat-label">Core Category</span>
              <span className="sys-stat-value" style={{ color: 'var(--color-neon-cyan)' }}>{project.category}</span>
            </div>
            <div className="sys-stat-item">
              <span className="sys-stat-label">GitHub Repository</span>
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-neon-green)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-body)', textDecoration: 'none' }}
                >
                  {project.github.replace('https://github.com/', '')}
                </a>
              ) : (
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-body)' }}>
                  {project.repoNote || 'Source not public'}
                </span>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', color: 'var(--color-neon-cyan)', marginBottom: '8px', textTransform: 'uppercase' }}>
              // System Overview
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: '1.6' }}>
              {project.longDesc || project.desc}
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', color: 'var(--color-neon-cyan)', marginBottom: '8px', textTransform: 'uppercase' }}>
              // Deployed Stack
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {project.tech.map((t) => (
                <span key={t} className="modal-tech-tag">{t}</span>
              ))}
            </div>
          </div>

          {/* Technical Specs & STRIDE Threat Analysis */}
          <div className="threat-model-sec">
            <h3 className="threat-model-title">// STRIDE Threat Intelligence Assessment</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
              Analysis of key security threat vectors and built-in architectural mitigations:
            </p>
            
            <div className="threat-score-grid">
              {Object.entries(threatModel).map(([key, score]) => {
                const label = getThreatLabel(score);
                const formatLabel = key.replace(/([A-Z])/g, ' $1').toUpperCase();
                
                return (
                  <div className="threat-score-item" key={key}>
                    <div className="threat-score-header">
                      <span className="threat-score-name">{formatLabel}</span>
                      <span className={`threat-score-val ${label.class}`}>{score}/5 ({label.text})</span>
                    </div>
                    <div className="threat-score-bar-outer">
                      <div 
                        className={`threat-score-bar-inner ${label.class}`}
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Architecture Block Diagram */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', color: 'var(--color-neon-cyan)', marginBottom: '8px', textTransform: 'uppercase' }}>
              // System Architecture Block Flow
            </h3>
            <div className="architecture-box">
              <div className="arch-flow">
                <div className="arch-node active">
                  <Terminal size={14} style={{ marginBottom: '4px', display: 'block', margin: '0 auto 4px auto' }} />
                  Secure Client <br />(Guard Layer)
                </div>
                <div className="arch-connector">&gt;&gt;</div>
                <div className="arch-node active" style={{ borderColor: 'var(--color-neon-magenta)' }}>
                  <Cpu size={14} style={{ color: 'var(--color-neon-magenta)', marginBottom: '4px', display: 'block', margin: '0 auto 4px auto' }} />
                  {project.category.includes('AI') ? 'AI Inference Core' : 'Security Engine'}
                </div>
                <div className="arch-connector">&gt;&gt;</div>
                <div className="arch-node">
                  <Database size={14} style={{ marginBottom: '4px', display: 'block', margin: '0 auto 4px auto' }} />
                  Secured Hash <br />Data Vault
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer-sec">
          {project.github && (
            <button
              className="hud-button"
              onClick={() => {
                SoundEffects.playToggle();
                window.open(project.github, '_blank', 'noopener,noreferrer');
              }}
            >
              &lt;/&gt; SOURCE CODE
            </button>
          )}

          {/* Only render Live Node button if liveUrl is valid */}
          {project.liveUrl && (
            <button 
              className="hud-button active" 
              onClick={() => {
                SoundEffects.playSuccess();
                window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              <Eye size={14} /> LIVE NODE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
