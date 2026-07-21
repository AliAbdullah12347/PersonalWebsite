import React, { useEffect } from 'react';
import { X, ShieldAlert, Cpu, Database, Eye, Terminal } from 'lucide-react';
import { SoundEffects } from '../utils/SoundEffects';

const ProjectModal = ({ project, onClose }) => {
  // Play alert sound on open
  useEffect(() => {
    if (project) {
      SoundEffects.playAlert();
    }
  }, [project]);

  if (!project) return null;

  // Mock STRIDE threat model data based on project type
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
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'glitch-skew 0.3s ease-out' }}
      >
        {/* Modal Header */}
        <div className="modal-header-sec">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={20} color="var(--color-neon-magenta)" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase' }}>
                PROJECT-FILE // {project.title}
              </h2>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                SYSTEM CLASSIFICATION: CONFIDENTIAL // ACCESS LEVEL: DECKER
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="threat-level-badge">THREAT RATING: EXTREME</span>
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
              <span className="sys-stat-label">System Architecture</span>
              <span className="sys-stat-value">Neural Network / Encrypted Hub</span>
            </div>
            <div className="sys-stat-item">
              <span className="sys-stat-label">Deployment Hash</span>
              <span className="sys-stat-value" style={{ fontSize: '0.7rem', fontFamily: 'var(--font-body)' }}>SHA256::0x4f...8a9c</span>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--color-neon-cyan)', marginBottom: '8px', textTransform: 'uppercase' }}>
              // System Overview
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: '1.6' }}>
              {project.longDesc || project.desc}
            </p>
          </div>

          {/* Technical Specs & STRIDE Threat Analysis */}
          <div className="threat-model-sec">
            <h3 className="threat-model-title">// STRIDE Threat Intelligence Assessment</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
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

          {/* Architecture Block Diagram (CSS Flexbox boxes) */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--color-neon-cyan)', marginBottom: '8px', textTransform: 'uppercase' }}>
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
                  {project.category === 'AI' ? 'AI Inference Core' : 'Decryption Engine'}
                </div>
                <div className="arch-connector">&gt;&gt;</div>
                <div className="arch-node">
                  <Database size={14} style={{ marginBottom: '4px', display: 'block', margin: '0 auto 4px auto' }} />
                  Secured Hash <br />Data Vault
                </div>
              </div>
            </div>
          </div>

          {/* Mitigation Details */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--color-neon-green)', marginBottom: '8px', textTransform: 'uppercase' }}>
              // Implemented Mitigations
            </h3>
            <ul style={{ paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Zero-Trust Architecture:</strong> Enforces continuous authentication on every node endpoint.</li>
              <li><strong>AES-GCM-256 Envelope Encryption:</strong> Data encrypted locally before socket transportation.</li>
              <li><strong>Model Evasion Protections:</strong> Adversarial noise injection checks protect input vectors from AI exploitation.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer-sec">
          <button 
            className="hud-button" 
            onClick={() => {
              SoundEffects.playToggle();
              window.open(project.github || 'https://github.', '_blank');
            }}
          >
            &lt;/&gt; SOURCE CODE
          </button>
          <button 
            className="hud-button active" 
            onClick={() => {
              SoundEffects.playSuccess();
              alert(`Initializing simulated sandbox node for ${project.title}... Sandbox active!`);
            }}
          >
            <Eye size={14} /> LIVE NODE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
