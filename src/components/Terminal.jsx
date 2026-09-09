import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '../data/projectsData';
import { resumeData } from '../data/resumeData';
import { SoundEffects } from '../utils/SoundEffects';

// Single source of truth for the shell: drives `help`, tab-completion and the
// "did you mean" hint, so adding a command here wires up all three.
const COMMAND_HELP = [
  ['help', 'List these commands.'],
  ['about', 'Display student profile and research focus.'],
  ['whoami', 'Print the current identity in one line.'],
  ['experience', 'List professional and research experience.'],
  ['education', 'List institutions and degrees.'],
  ['honors', 'List honors, awards and certifications.'],
  ['skills', 'List programming languages, tools and platforms.'],
  ['hobbies', 'List interests outside the terminal.'],
  ['projects', 'List all projects.'],
  ['view <id>', 'View detailed dossier for a project (e.g. "view 1").'],
  ['open <id>', 'Open a project’s live build or repository in a new tab.'],
  ['contact', 'Print email, LinkedIn and GitHub.'],
  ['scan', 'Run security scan simulation on local network.'],
  ['decrypt', 'Decrypt contact info & credentials.'],
  ['history', 'Show this session’s command history.'],
  ['clear', 'Clear screen buffer.'],
];

const COMMANDS = COMMAND_HELP.map(([sig]) => sig.split(' ')[0]);
const ID_COMMANDS = ['view', 'open'];
const RULE = '==================================================';

// Levenshtein distance, so a typo suggests the command it actually resembles
// rather than the first one sharing a leading letter.
const editDistance = (a, b) => {
  const rows = Array.from({ length: b.length + 1 }, (_, i) => [i, ...Array(a.length).fill(0)]);
  for (let j = 1; j <= a.length; j++) rows[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[j - 1] === b[i - 1] ? 0 : 1)
      );
    }
  }
  return rows[b.length][a.length];
};

const suggestCommand = (input) => {
  const ranked = COMMANDS
    .map((c) => ({ c, d: editDistance(input, c) }))
    .sort((x, y) => x.d - y.d);
  // Only offer a correction when it is genuinely close to what was typed
  return ranked[0] && ranked[0].d <= Math.max(2, Math.floor(input.length / 2)) ? ranked[0].c : null;
};

const Terminal = () => {
  const [history, setHistory] = useState([
    { text: 'SEC-OPS CORE COMMAND SHELL // VER 4.9.0', type: 'accent' },
    { text: `COLGATE UNIVERSITY DECKER SESSION: ${resumeData.name.toUpperCase()}`, type: 'info' },
    { text: 'STATUS: ALUMNI MEMORIAL SCHOLAR ’28', type: 'info' },
    { text: 'Type "help" for commands. TAB completes, ↑/↓ recalls, CTRL+L clears.', type: 'output' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isScanning, setIsScanning] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);

  const print = (lines) => setHistory((prev) => [...prev, ...lines]);

  const handleKeyDown = (e) => {
    // Only click for keys that actually produce output; modifiers stay silent
    if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace') {
      SoundEffects.playKeystroke();
    }

    if (e.key === 'Enter') {
      const command = inputVal.trim();
      if (!command) return;

      const newCmdHistory = [...cmdHistory, command];
      setCmdHistory(newCmdHistory);
      setHistoryIndex(newCmdHistory.length);

      setHistory((prev) => [...prev, { text: `decker@colgate-node:~$ ${command}`, type: 'prompt' }]);
      executeCommand(command);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputVal(cmdHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputVal(cmdHistory[newIndex]);
      } else if (historyIndex === cmdHistory.length - 1) {
        setHistoryIndex(cmdHistory.length);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleCompletion();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  // Completes the command word. Once a full command is typed, the two commands
  // that take an argument list the ids that are actually valid.
  const handleCompletion = () => {
    const value = inputVal.trimStart();
    const parts = value.split(' ');
    const word = parts[0].toLowerCase();

    if (parts.length === 1) {
      const matches = COMMANDS.filter((c) => c.startsWith(word));
      if (matches.length === 1) {
        setInputVal(matches[0] + (ID_COMMANDS.includes(matches[0]) ? ' ' : ''));
        SoundEffects.playToggle();
      } else if (matches.length > 1) {
        print([
          { text: `decker@colgate-node:~$ ${value}`, type: 'prompt' },
          { text: matches.join('   '), type: 'info' },
        ]);
      }
      return;
    }

    if (ID_COMMANDS.includes(word)) {
      print([{ text: `Valid ids: ${projectsData.map((p) => p.id).join(', ')}`, type: 'info' }]);
    }
  };

  // Shared id parsing for `view` and `open`. Prints its own error and returns
  // null so callers can simply bail.
  const resolveProject = (rawId) => {
    const id = parseInt(rawId, 10);
    if (!rawId || Number.isNaN(id)) {
      print([{ text: 'ERROR: Specify a valid ID. Example: "view 1"', type: 'error' }]);
      return null;
    }
    const proj = projectsData.find((p) => p.id === id);
    if (!proj) {
      print([
        {
          text: `ERROR: Project ID ${id} not found. Valid ids: ${projectsData.map((p) => p.id).join(', ')}`,
          type: 'error',
        },
      ]);
      return null;
    }
    return proj;
  };

  const executeCommand = (cmdText) => {
    if (isScanning || isDecrypting) {
      print([{ text: 'ERROR: Shell process locked.', type: 'error' }]);
      return;
    }

    const args = cmdText.split(' ').filter(Boolean);
    const command = args[0].toLowerCase();

    switch (command) {
      case 'help': {
        print([
          { text: RULE, type: 'output' },
          { text: 'AVAILABLE COMMANDS:', type: 'accent' },
          ...COMMAND_HELP.map(([sig, desc]) => ({
            text: `  ${sig.padEnd(12)} ${desc}`,
            type: 'output',
          })),
          { text: RULE, type: 'output' },
          { text: 'TAB completes • ↑/↓ recalls history • CTRL+L clears', type: 'info' },
        ]);
        break;
      }

      case 'about': {
        print([
          { text: `--- DOSSIER: ${resumeData.name.toUpperCase()} ---`, type: 'accent' },
          { text: 'EDUCATION: Colgate University (BA Computer Science & Applied Math)', type: 'output' },
          { text: 'ACADEMICS: Alumni Memorial Scholar ’28', type: 'info' },
          { text: 'EXPERIENCE: Immersive Visualization Dev @ Colgate // TA Python // Alterea Inc Intern // Polygence AI Ethics Researcher', type: 'output' },
          { text: 'HONORS: SIMO Bronze, AMO Gold, Cambridge High Achievement Award', type: 'output' },
          { text: `SUMMARY: ${resumeData.summaryText}`, type: 'output' },
        ]);
        break;
      }

      case 'whoami': {
        print([
          { text: `${resumeData.name} — ${resumeData.title}`, type: 'accent' },
          { text: resumeData.location, type: 'output' },
        ]);
        break;
      }

      case 'experience': {
        const lines = [{ text: '--- PROFESSIONAL EXPERIENCE ---', type: 'accent' }];
        resumeData.experience.forEach((org) => {
          lines.push({ text: `[${org.company}]`, type: 'info' });
          org.roles.forEach((role) => {
            lines.push({ text: `  ${role.title}  (${role.period})`, type: 'output' });
            role.bullets.forEach((b) => lines.push({ text: `    - ${b}`, type: 'output' }));
          });
        });
        print(lines);
        break;
      }

      case 'education': {
        print([
          { text: '--- EDUCATION ---', type: 'accent' },
          ...resumeData.education.map((e) => ({
            text: `${e.institution}${e.degree ? ` — ${e.degree}` : ''} (${e.period})${e.details ? ` [${e.details}]` : ''}`,
            type: 'output',
          })),
        ]);
        break;
      }

      case 'honors': {
        print([
          { text: '--- HONORS & AWARDS ---', type: 'accent' },
          ...resumeData.honors.map((h) => ({ text: `  * ${h}`, type: 'output' })),
          { text: '--- CERTIFICATIONS ---', type: 'accent' },
          ...resumeData.certifications.map((c) => ({ text: `  * ${c}`, type: 'output' })),
        ]);
        break;
      }

      case 'skills': {
        print([
          { text: '--- TECHNICAL SKILLS MATRIX ---', type: 'accent' },
          { text: `SKILLS: ${resumeData.skills.join(', ')}`, type: 'output' },
          { text: `LANGUAGES: ${resumeData.languages.map((l) => `${l.name} (${l.level})`).join(' | ')}`, type: 'info' },
        ]);
        break;
      }

      case 'hobbies': {
        print([
          { text: '--- PERSONAL DIRECTORY ---', type: 'accent' },
          ...resumeData.hobbies.map((h) => ({
            text: h.focus ? `  ${h.name} — ${h.description}` : `  ${h.name}`,
            type: h.focus ? 'output' : 'info',
          })),
        ]);
        break;
      }

      case 'projects': {
        print([
          { text: '--- PROJECTS CATALOG ---', type: 'accent' },
          ...projectsData.map((p) => ({
            text: `[ID: ${p.id}] ${p.title} (${p.category}) - ${p.desc}`,
            type: 'output',
          })),
          { text: 'Type "view <id>" for full details, or "open <id>" to launch it.', type: 'info' },
        ]);
        break;
      }

      case 'view': {
        const proj = resolveProject(args[1]);
        if (!proj) break;
        print([
          { text: `=== PROJECT: ${proj.title.toUpperCase()} ===`, type: 'accent' },
          { text: `CATEGORY: ${proj.category}`, type: 'output' },
          { text: `TECH STACK: ${proj.tech.join(' // ')}`, type: 'info' },
          { text: `DETAILS: ${proj.longDesc}`, type: 'output' },
          { text: `REPOSITORY: ${proj.github || proj.repoNote || 'Source not public'}`, type: 'output' },
          ...(proj.liveUrl ? [{ text: `LIVE NODE: ${proj.liveUrl}`, type: 'info' }] : []),
        ]);
        break;
      }

      case 'open': {
        const proj = resolveProject(args[1]);
        if (!proj) break;
        const target = proj.liveUrl || proj.github;
        if (!target) {
          print([{ text: `No public build or repository for "${proj.title}".`, type: 'warn' }]);
          break;
        }
        print([{ text: `Launching ${target} ...`, type: 'info' }]);
        window.open(target, '_blank', 'noopener,noreferrer');
        SoundEffects.playSuccess();
        break;
      }

      case 'contact': {
        print([
          { text: '--- CONTACT ---', type: 'accent' },
          { text: `EMAIL:    ${resumeData.email}`, type: 'output' },
          { text: `LINKEDIN: ${resumeData.linkedin}`, type: 'output' },
          { text: 'GITHUB:   https://github.com/AliAbdullah12347', type: 'output' },
          { text: 'Open to Summer 2026 software engineering and AI/security internships.', type: 'info' },
        ]);
        break;
      }

      case 'history': {
        if (cmdHistory.length === 0) {
          print([{ text: 'No commands in this session yet.', type: 'info' }]);
          break;
        }
        print(cmdHistory.map((c, i) => ({ text: `  ${String(i + 1).padStart(3)}  ${c}`, type: 'output' })));
        break;
      }

      case 'scan':
        runSimulatedScan();
        break;

      case 'decrypt':
        runSimulatedDecryption();
        break;

      case 'clear':
        setHistory([]);
        break;

      // Easter eggs
      case 'sudo': {
        print([{ text: 'decker is not in the sudoers file. This incident has been reported.', type: 'error' }]);
        break;
      }

      case 'ls': {
        print([{ text: 'about  experience  education  projects/  skills  hobbies  contact', type: 'output' }]);
        break;
      }

      case 'exit': {
        print([{ text: 'Session persists. Use the DASHBOARD tab to return to the HUD.', type: 'warn' }]);
        break;
      }

      default: {
        const suggestion = suggestCommand(command);
        print([
          { text: `ERROR: Command "${command}" not recognized. Type "help".`, type: 'error' },
          ...(suggestion ? [{ text: `Did you mean "${suggestion}"?`, type: 'info' }] : []),
        ]);
        break;
      }
    }
  };

  const runSimulatedScan = () => {
    setIsScanning(true);
    SoundEffects.playScan();

    let step = 0;
    const targets = [
      'Scanning local network nodes...',
      'Target: colgate.edu academic server cluster...',
      'Port 80/tcp  [OPEN]   - HTTP Web server',
      'Port 443/tcp [OPEN]   - SSL Encrypted socket active',
      'Port 3000/tcp[OPEN]   - Vite React development server',
      'Verifying SHA-256 signatures...',
      'Scan result: Zero security vulnerabilities identified. Site ready for Vercel deployment.',
    ];

    const runStep = () => {
      if (step < targets.length) {
        setHistory((prev) => [
          ...prev,
          {
            text: targets[step],
            type: step === 2 || step === 4 ? 'warn' : step === 6 ? 'accent' : 'output',
          },
        ]);
        step++;
        setTimeout(runStep, 400);
      } else {
        setIsScanning(false);
        SoundEffects.playSuccess();
      }
    };

    runStep();
  };

  const runSimulatedDecryption = () => {
    setIsDecrypting(true);
    setHistory((prev) => [...prev, { text: 'DECRYPTING ALUMNI SCHOLAR DATA NODE...', type: 'error' }]);

    let ticks = 0;
    const maxTicks = 8;

    const decryptLoop = () => {
      if (ticks < maxTicks) {
        const scramble = Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
        setHistory((prev) => {
          const updated = [...prev];
          if (ticks > 0) updated.pop();
          updated.push({ text: `RESOLVING VECTOR: 0x${scramble}... [${ticks}/${maxTicks}]`, type: 'warn' });
          return updated;
        });
        SoundEffects.playKeystroke();
        ticks++;
        setTimeout(decryptLoop, 150);
      } else {
        setHistory((prev) => {
          const updated = [...prev];
          updated.pop();
          return [
            ...updated,
            { text: RULE, type: 'accent' },
            { text: 'DECRYPTION SUCCESSFUL', type: 'accent' },
            { text: `EMAIL: ${resumeData.email}`, type: 'output' },
            { text: `LINKEDIN: ${resumeData.linkedin}`, type: 'output' },
            { text: `VERCEL HOST: ${resumeData.vercelUrl}`, type: 'output' },
            { text: RULE, type: 'accent' },
          ];
        });
        setIsDecrypting(false);
        SoundEffects.playSuccess();
      }
    };

    setTimeout(decryptLoop, 200);
  };

  return (
    <div className="terminal-container" onClick={focusInput}>
      <div className="terminal-header">
        <div className="terminal-window-buttons">
          <span className="win-dot red"></span>
          <span className="win-dot yellow"></span>
          <span className="win-dot green"></span>
        </div>
        <div className="terminal-window-title">&lt; DECKER SHELL // COLGATE NODE &gt;</div>
        <div style={{ color: 'var(--color-neon-cyan)', fontSize: '0.7rem' }}>ACTIVE</div>
      </div>
      <div className="terminal-body">
        {history.map((line, idx) => {
          let lineClass = 'terminal-line output';
          if (line.type === 'prompt') lineClass = 'terminal-line prompt';
          if (line.type === 'accent') lineClass = 'terminal-line accent';
          if (line.type === 'error') lineClass = 'terminal-line error';
          if (line.type === 'warn') lineClass = 'terminal-line warn';

          return (
            <div key={idx} className={lineClass}>
              {line.text}
            </div>
          );
        })}

        {isScanning && <div className="terminal-line warn">SCANNING... &#11044;</div>}
        {isDecrypting && <div className="terminal-line error">DECRYPTING... &#11044;</div>}

        {!isScanning && !isDecrypting && (
          <div className="terminal-input-row">
            <span className="terminal-prompt">decker@colgate-node:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isScanning || isDecrypting}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              aria-label="Terminal command input"
            />
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};

export default Terminal;
