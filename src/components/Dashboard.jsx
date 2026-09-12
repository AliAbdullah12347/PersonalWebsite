import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '../data/projectsData';
import { resumeData } from '../data/resumeData';
import { SoundEffects } from '../utils/SoundEffects';
import { 
  Cpu, Award, RefreshCw, Layers,
  Mail, Linkedin, Github, GraduationCap, Briefcase, 
  Send, User, Code, Heart, Copy, Check, CircleDot, Feather
} from 'lucide-react';


// Reveals each panel as it scrolls in.
//
// Content visibility must never depend on this working. IntersectionObserver
// does not fire in a background tab, so a visitor who middle-clicks the link
// would otherwise focus the tab to a completely blank page. Anything that
// might stop the observer running reveals everything up front instead:
// reduced-motion, no IO support, mounting while hidden, or a 3s dead-man
// timer for cases none of those catch.
const useScrollReveal = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const targets = Array.from(root.querySelectorAll('.reveal'));
    if (!targets.length) return undefined;

    const revealAll = () => targets.forEach((el) => el.classList.add('revealed'));

    const cannotObserve =
      typeof IntersectionObserver === 'undefined' ||
      document.hidden ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (cannotObserve) {
      revealAll();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // reveal once, never re-hide
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );

    targets.forEach((el) => observer.observe(el));

    // Dead-man switch: if nothing has been revealed by now the observer is not
    // working, and a visible page beats an animated one.
    const failsafe = setTimeout(() => {
      if (!targets.some((el) => el.classList.contains('revealed'))) revealAll();
    }, 3000);

    return () => {
      clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return rootRef;
};

const Dashboard = ({ onSelectProject }) => {
  const revealRoot = useScrollReveal();
  const [filter, setFilter] = useState('ALL');
  const [emailForm, setEmailForm] = useState({ email: '', subject: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  // The form has no backend: it hands the draft to the visitor's own mail
  // client. Navigating the current tab is what mailto: expects — window.open
  // gets eaten by popup blockers and can strand an empty tab. The draft is
  // deliberately left in the fields in case no mail handler is registered.
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!emailForm.email || !emailForm.message) return;

    SoundEffects.playSuccess();
    setFormSent(true);

    const mailtoUrl = `mailto:${resumeData.email}?subject=${encodeURIComponent(emailForm.subject || 'Portfolio Contact')}&body=${encodeURIComponent(`From: ${emailForm.email}

${emailForm.message}`)}`;
    window.location.href = mailtoUrl;

    setTimeout(() => setFormSent(false), 5000);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(resumeData.email);
      SoundEffects.playSuccess();
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2500);
    } catch {
      // Clipboard blocked (insecure context or denied) — the address is
      // already on screen as a mailto link, so there is nothing to recover.
    }
  };

  const scrollToSection = (id) => {
    SoundEffects.playToggle();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tableTennis = resumeData.hobbies.find((h) => h.name === 'Table Tennis');
  const urduPoetry = resumeData.hobbies.find((h) => h.name === 'Urdu Poetry');

  const filteredProjects = filter === 'ALL' 
    ? projectsData 
    : projectsData.filter((p) => p.category.toUpperCase().includes(filter));

  return (
    <div ref={revealRoot} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="cyber-panel cut-corners hud-brackets reveal" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--color-neon-cyan)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>
            <Cpu size={16} className="spinning" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>ALUMNI MEMORIAL SCHOLAR ’28 // COLGATE CS & APPLIED MATH</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-hero)', color: 'var(--color-text)', lineHeight: '1.2' }}>
            Hello, I'm <span style={{ color: 'var(--color-neon-cyan)', textShadow: 'var(--glow-cyan)' }}>Ali Abdullah</span>
          </h1>

          <p className="hero-lead" style={{ fontSize: 'var(--text-lead)', color: 'var(--color-text)', lineHeight: '1.7' }}>
            {resumeData.heroIntro}
          </p>

          {/* Quick CTA Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <button 
              className="hud-button active lg"
              onClick={() => scrollToSection('contact')}
            >
              <Mail size={16} /> Get in Touch!
            </button>
            <a 
              href={resumeData.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hud-button accent lg"
              onClick={() => SoundEffects.playToggle()}
            >
              <Linkedin size={16} /> Check out my Linkedin!
            </a>
          </div>

          {/* Key Stats Counter Strip */}
          <div className="hero-stats">
            {resumeData.stats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <span className="sys-stat-label">{stat.label}</span>
                <span className="hero-stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ABOUT ME SECTION */}
      <section id="about" className="cyber-panel cut-corners reveal">
        <div className="panel-header">
          <div className="title">
            <User size={16} />
            <span>About Me</span>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neon-green)' }}>COLGATE CS & APPLIED MATH</span>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <p style={{ fontSize: 'var(--text-base)', lineHeight: '1.7', color: 'var(--color-text)' }}>
            {resumeData.aboutText}
          </p>

          <div className="summary-callout">
            <strong>Executive Summary:</strong> {resumeData.summaryText}
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCE SECTION */}
      <section id="experience" className="cyber-panel cut-corners reveal">
        <div className="panel-header">
          <div className="title">
            <Briefcase size={16} />
            <span>Professional Experience</span>
          </div>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {resumeData.experience.map((org, idx) => (
            <div key={idx} style={{ borderBottom: idx < resumeData.experience.length - 1 ? '1px solid var(--color-border)' : 'none', paddingBottom: 'var(--space-md)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', color: 'var(--color-neon-cyan)', marginBottom: 'var(--space-sm)' }}>
                {org.company}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {org.roles.map((role, rIdx) => (
                  <div key={rIdx} style={{ paddingLeft: 'var(--space-md)', borderLeft: '2px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--color-text)', fontSize: 'var(--text-base)' }}>
                        {role.title}
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neon-green)', fontFamily: 'var(--font-body)' }}>
                        {role.period}
                      </span>
                    </div>

                    <ul className="hud-list" style={{ marginTop: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
      <section id="projects" className="cyber-panel cut-corners reveal">
        <div className="panel-header">
          <div className="title">
            <Layers size={16} />
            <span>My Projects</span>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            RECORDS: {filteredProjects.length}/{projectsData.length}
          </span>
        </div>
        <div className="panel-body">
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
              <RefreshCw size={12} className="spinning" />
              <span>DYNAMIC NODE VIEW</span>
            </div>
          </div>

          <div className="project-grid-bento">
            {filteredProjects.map((p) => (
              <div
                className="project-card"
                key={p.id}
                role="button"
                tabIndex={0}
                aria-label={`Open project dossier: ${p.title}`}
                onClick={() => onSelectProject(p)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProject(p);
                  }
                }}
              >
                <div className="project-img-wrapper">
                  <img
                    src={p.image}
                    alt={`${p.title} — project artwork`}
                    className="project-img"
                    loading="lazy"
                    decoding="async"
                    width="900"
                    height="502"
                    onError={(e) => {
                      // Leave the wrapper's fallback glyph visible instead of a black box
                      e.target.style.visibility = 'hidden';
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
      <div className="info-triptych">
        
        <section id="skills" className="cyber-panel cut-corners reveal">
          <div className="panel-header">
            <div className="title">
              <Code size={16} />
              <span>Skills</span>
            </div>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {resumeData.skills.map((skill) => (
              <span key={skill} className="skill-chip">{skill}</span>
            ))}
          </div>
        </section>

        <section className="cyber-panel cut-corners reveal">
          <div className="panel-header">
            <div className="title">
              <GraduationCap size={16} />
              <span>Education</span>
            </div>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} style={{ borderLeft: '2px solid var(--color-neon-green)', paddingLeft: 'var(--space-sm)' }}>
                <div style={{ fontWeight: '700', color: 'var(--color-text)', fontSize: 'var(--text-base)' }}>
                  {edu.institution}
                </div>
                {edu.degree && (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neon-cyan)' }}>
                    {edu.degree}
                  </div>
                )}
                {edu.details && (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neon-green)' }}>
                    {edu.details}
                  </div>
                )}
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)' }}>
                  {edu.period}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cyber-panel cut-corners reveal">
          <div className="panel-header">
            <div className="title">
              <Award size={16} color="var(--color-neon-magenta)" />
              <span style={{ color: 'var(--color-neon-magenta)' }}>Certifications & Honors</span>
            </div>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Certifications
              </h4>
              <ul className="hud-list" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                {resumeData.certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Honors & Awards
              </h4>
              <ul className="hud-list" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neon-cyan)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {resumeData.honors.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Languages
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {resumeData.languages.map((l) => (
                  <span key={l.name} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', padding: '2px 6px' }}>
                    {l.name} ({l.level})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* HOBBIES SECTION */}
      <section id="hobbies" className="cyber-panel cut-corners reveal">
        <div className="panel-header">
          <div className="title">
            <Heart size={16} color="var(--color-neon-magenta)" />
            <span>Hobbies & Passions</span>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neon-cyan)' }}>PERSONAL DIRECTORY</span>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'var(--space-md)' }}>
            
            {/* Table Tennis */}
            <div className="hobby-card">
              <h3 className="hobby-title" style={{ color: 'var(--color-neon-cyan)' }}>
                <CircleDot size={16} /> Table Tennis
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: '1.6' }}>
                {tableTennis.description}
              </p>
            </div>

            {/* Urdu Poetry */}
            <div className="hobby-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 className="hobby-title" style={{ color: 'var(--color-neon-magenta)' }}>
                  <Feather size={16} /> Urdu Poetry &amp; Ghazals
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: '1.6', marginBottom: '12px' }}>
                  {urduPoetry.description}
                </p>
              </div>

              <figure style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '12px' }}>
                <blockquote className="urdu-couplet" lang="ur" dir="rtl">
                  {urduPoetry.couplet.map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </blockquote>
                <figcaption className="urdu-caption">
                  <span style={{ color: 'var(--color-text-muted)' }}>&mdash; {urduPoetry.coupletPoet}</span>
                  <span className="urdu-translation">&ldquo;{urduPoetry.coupletTranslation}&rdquo;</span>
                </figcaption>
              </figure>
            </div>

          </div>

          {/* Other Passions */}
          <div>
            <h4 style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>
              Other Core Passions
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {resumeData.hobbies.filter(h => !h.focus).map((hobby) => (
                <span key={hobby.name} className="skill-chip accent">{hobby.name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="cyber-panel cut-corners reveal">
        <div className="panel-header">
          <div className="title">
            <Mail size={16} />
            <span>Let's Connect</span>
          </div>
        </div>
        <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'var(--space-xl)' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', color: 'var(--color-neon-cyan)' }}>
              Open for Opportunities
            </h3>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: '1.6' }}>
              I'm currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <a
                  href={`mailto:${resumeData.email}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}
                >
                  <Mail size={16} color="var(--color-neon-cyan)" />
                  {resumeData.email}
                </a>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address to clipboard"
                >
                  {emailCopied ? <Check size={12} /> : <Copy size={12} />}
                  {emailCopied ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <a 
                href={resumeData.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}
              >
                <Linkedin size={16} color="var(--color-neon-cyan)" />
                linkedin.com/in/{resumeData.linkedinHandle}
              </a>
              <a 
                href={resumeData.github} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}
              >
                <Github size={16} color="var(--color-neon-cyan)" />
                github.com/{resumeData.githubHandle}
              </a>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="sys-stat-item">
              <label className="sys-stat-label" htmlFor="user-email">Your Email</label>
              <input 
                id="user-email"
                type="email"
                required
                placeholder="jacob@google.com"
                className="input"
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
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
              />
            </div>

            <button type="submit" className="hud-button active" style={{ justifyContent: 'center', padding: '12px' }}>
              <Send size={16} /> {formSent ? 'OPENING MAIL CLIENT…' : 'Compose Message'}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
