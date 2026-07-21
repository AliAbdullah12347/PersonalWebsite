import React, { useState, useEffect } from 'react';
import { projectsData } from '../data/projectsData';
import { resumeData } from '../data/resumeData';
import { SoundEffects } from '../utils/SoundEffects';
import { 
  Shield, Cpu, Award, RefreshCw, Layers, ExternalLink, 
  Mail, Linkedin, Github, BookOpen, GraduationCap, Briefcase, 
  Send, User, CheckCircle, Code, Globe
} from 'lucide-react';

const Dashboard = ({ onSelectProject }) => {
  const [filter, setFilter] = useState('ALL');
  const [logs, setLogs] = useState([]);
  const [cpuUsage, setCpuUsage] = useState(38);
  const [ramUsage, setRamUsage] = useState(58);

  // Form state for contact form
  const [emailForm, setEmailForm] = useState({ email: '', subject: '', message: '' });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const initialLogs = [
      { id: 1, time: '17:58:00', text: 'Colgate CS & Applied Math Core Node: ONLINE', type: 'normal' },
      { id: 2, time: '17:58:04', text: 'GPA 4.0 Verification Hash: 0x4000_COLGATE', type: 'normal' },
      { id: 3, time: '17:58:10', text: 'Stanford-affiliated Polygence AI Research indexed.', type: 'normal' },
      { id: 4, time: '17:58:15', text: 'Unreal Engine 5 3D Rendering Pipeline: 60 FPS', type: 'normal' },
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      setCpuUsage(Math.floor(25 + Math.random() * 35));
      setRamUsage(Math.floor(50 + Math.random() * 15));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!emailForm.email || !emailForm.message) return;
    
    SoundEffects.playSuccess();
    setFormSent(true);
    
    // Construct mailto fallback so user can actually send the message directly
    const mailtoUrl = `mailto:${resumeData.email}?subject=${encodeURIComponent(emailForm.subject || 'Portfolio Contact')}&body=${encodeURIComponent(`From: ${emailForm.email}\n\n${emailForm.message}`)}`;
    window.open(mailtoUrl, '_blank');

    setTimeout(() => {
      setFormSent(false);
      setEmailForm({ email: '', subject: '', message: '' });
    }, 5000);
  };

  const filteredProjects = filter === 'ALL' 
    ? projectsData 
    : projectsData.filter((p) => p.category.toUpperCase().includes(filter));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="cyber-panel cut-corners hud-brackets" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-neon-cyan)', fontSize: '0.85rem', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>
            <Cpu size={16} className="spinning" />
            <span>ALUMNI MEMORIAL SCHOLAR ’28 // GPA 4.0</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)', lineHeight: '1.2' }}>
            Hello, I'm <span style={{ color: 'var(--color-neon-cyan)', textShadow: 'var(--glow-cyan)' }}>Ali Abdullah</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--color-text)', maxWidth: '900px', lineHeight: '1.6' }}>
            {resumeData.heroIntro}
          </p>

          {/* Quick CTA Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <a 
              href="#contact" 
              className="hud-button active"
              onClick={() => SoundEffects.playToggle()}
            >
              <Mail size={16} /> Get in Touch!
            </a>
            <a 
              href={resumeData.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hud-button accent"
              onClick={() => SoundEffects.playToggle()}
            >
              <Linkedin size={16} /> Check out my Linkedin!
            </a>
          </div>

          {/* Key Stats Counter Strip */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
              gap: 'var(--space-md)', 
              marginTop: 'var(--space-lg)',
              borderTop: '1px solid var(--color-border)',
              paddingTop: 'var(--space-md)'
            }}
          >
            {resumeData.stats.map((stat) => (
              <div key={stat.label} className="sys-stat-item">
                <span className="sys-stat-label">{stat.label}</span>
                <span className="sys-stat-value" style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-neon-cyan)', fontFamily: 'var(--font-heading)' }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ABOUT ME SECTION */}
      <section id="about" className="cyber-panel cut-corners">
        <div className="panel-header">
          <div className="title">
            <User size={16} />
            <span>About Me</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-neon-green)' }}>COLGATE CS & APPLIED MATH</span>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--color-text)' }}>
            {resumeData.aboutText}
          </p>

          <div 
            style={{ 
              background: 'rgba(6, 6, 10, 0.6)', 
              borderLeft: '3px solid var(--color-neon-cyan)', 
              padding: 'var(--space-md)',
              fontSize: '0.88rem',
              color: 'var(--color-text)',
              lineHeight: '1.6'
            }}
          >
            <strong>Executive Summary:</strong> {resumeData.summaryText}
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCE SECTION */}
      <section id="experience" className="cyber-panel cut-corners">
        <div className="panel-header">
          <div className="title">
            <Briefcase size={16} />
            <span>Professional Experience</span>
          </div>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {resumeData.experience.map((org, idx) => (
            <div key={idx} style={{ borderBottom: idx < resumeData.experience.length - 1 ? '1px solid var(--color-border)' : 'none', paddingBottom: 'var(--space-md)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-neon-cyan)', marginBottom: 'var(--space-sm)' }}>
                {org.company}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {org.roles.map((role, rIdx) => (
                  <div key={rIdx} style={{ paddingLeft: 'var(--space-md)', borderLeft: '2px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--color-text)', fontSize: '0.95rem' }}>
                        {role.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-neon-green)', fontFamily: 'var(--font-body)' }}>
                        {role.period}
                      </span>
                    </div>

                    <ul style={{ marginTop: '8px', paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {role.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MY PROJECTS SECTION */}
      <section id="projects" className="cyber-panel">
        <div className="panel-header">
          <div className="title">
            <Layers size={16} />
            <span>My Projects</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            RECORDS: {filteredProjects.length}/{projectsData.length}
          </span>
        </div>
        <div className="panel-body">
          {/* Tag filters */}
          <div className="projects-header-controls">
            <div className="filter-tags">
              {['ALL', 'AI', 'FULL-STACK', 'GRAPHICS', 'SECURITY', 'WEB DEV'].map((cat) => (
                <button 
                  className={`filter-tag ${filter === cat ? 'active' : ''}`}
                  key={cat}
                  onClick={() => {
                    SoundEffects.playToggle();
                    setFilter(cat);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              <RefreshCw size={12} className="spinning" />
              <span>DYNAMIC NODE VIEW</span>
            </div>
          </div>

          {/* Project Bento Cards Grid */}
          <div className="project-grid-bento">
            {filteredProjects.map((p) => (
              <div 
                className="project-card"
                key={p.id}
                onClick={() => onSelectProject(p)}
              >
                <div className="project-img-wrapper">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="project-img" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="project-card-overlay" />
                  <span className="project-tag">{p.category}</span>
                </div>
                <div className="project-card-body">
                  <h4 className="project-card-title">{p.title}</h4>
                  <p className="project-card-desc">{p.desc}</p>
                  <div className="project-card-tech">
                    {p.tech.map((t) => (
                      <span className="tech-tag" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SKILLS, EDUCATION & CERTIFICATIONS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
        
        {/* SKILLS PANEL */}
        <section id="skills" className="cyber-panel cut-corners">
          <div className="panel-header">
            <div className="title">
              <Code size={16} />
              <span>Skills</span>
            </div>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {resumeData.skills.map((skill) => (
              <span 
                key={skill}
                style={{
                  border: '1px solid var(--color-border)',
                  background: 'rgba(0, 240, 255, 0.05)',
                  color: 'var(--color-neon-cyan)',
                  padding: '6px 12px',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-body)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* EDUCATION PANEL */}
        <section className="cyber-panel cut-corners">
          <div className="panel-header">
            <div className="title">
              <GraduationCap size={16} />
              <span>Education</span>
            </div>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} style={{ borderLeft: '2px solid var(--color-neon-green)', paddingLeft: 'var(--space-sm)' }}>
                <div style={{ fontWeight: '700', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  {edu.institution}
                </div>
                {edu.degree && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-neon-cyan)' }}>
                    {edu.degree}
                  </div>
                )}
                {edu.details && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-neon-green)' }}>
                    {edu.details}
                  </div>
                )}
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {edu.period}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CERTIFICATIONS & HONORS PANEL */}
        <section className="cyber-panel cut-corners">
          <div className="panel-header">
            <div className="title">
              <Award size={16} color="var(--color-neon-magenta)" />
              <span style={{ color: 'var(--color-neon-magenta)' }}>Certifications & Honors</span>
            </div>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Certifications
              </h4>
              <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--color-text)' }}>
                {resumeData.certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Honors & Awards
              </h4>
              <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--color-neon-cyan)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {resumeData.honors.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Languages
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {resumeData.languages.map((l) => (
                  <span key={l.name} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', padding: '2px 6px' }}>
                    {l.name} ({l.level})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="cyber-panel cut-corners">
        <div className="panel-header">
          <div className="title">
            <Mail size={16} />
            <span>Let's Connect</span>
          </div>
        </div>
        <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
          
          {/* Info Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-neon-cyan)' }}>
              Open for Opportunities
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: '1.6' }}>
              I'm currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
              <a 
                href={`mailto:${resumeData.email}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.88rem' }}
              >
                <Mail size={16} color="var(--color-neon-cyan)" />
                {resumeData.email}
              </a>
              <a 
                href={resumeData.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.88rem' }}
              >
                <Linkedin size={16} color="var(--color-neon-cyan)" />
                linkedin.com/in/{resumeData.linkedinHandle}
              </a>
              <a 
                href="https://github.com/aliabdullah12347" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.88rem' }}
              >
                <Github size={16} color="var(--color-neon-cyan)" />
                github.com/aliabdullah12347
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="sys-stat-item">
              <label className="sys-stat-label" htmlFor="user-email">Your Email</label>
              <input 
                id="user-email"
                type="email"
                required
                placeholder="jacob@google.com"
                className="input"
                style={{ width: '100%', background: 'var(--bg-void)', color: 'var(--color-text)' }}
                value={emailForm.email}
                onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
              />
            </div>

            <div className="sys-stat-item">
              <label className="sys-stat-label" htmlFor="user-subject">Subject</label>
              <input 
                id="user-subject"
                type="text"
                placeholder="Just saying hi"
                className="input"
                style={{ width: '100%', background: 'var(--bg-void)', color: 'var(--color-text)' }}
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              />
            </div>

            <div className="sys-stat-item">
              <label className="sys-stat-label" htmlFor="user-message">Message</label>
              <textarea 
                id="user-message"
                required
                rows={4}
                placeholder="Let's talk about..."
                className="input"
                style={{ width: '100%', background: 'var(--bg-void)', color: 'var(--color-text)', resize: 'vertical' }}
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
              />
            </div>

            <button type="submit" className="hud-button active" style={{ justifyContent: 'center', padding: '12px' }}>
              <Send size={16} /> {formSent ? 'MESSAGE DISPATCHED!' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
