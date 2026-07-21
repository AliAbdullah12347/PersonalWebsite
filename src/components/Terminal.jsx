import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '../data/projectsData';
import { resumeData } from '../data/resumeData';
import { SoundEffects } from '../utils/SoundEffects';

const Terminal = () => {
  const [history, setHistory] = useState([
    { text: 'SEC-OPS CORE COMMAND SHELL // VER 4.9.0', type: 'accent' },
    { text: `COLGATE UNIVERSITY DECKER SESSION: ${resumeData.name.toUpperCase()}`, type: 'info' },
    { text: 'STATUS: ALUMNI MEMORIAL SCHOLAR ’28', type: 'info' },
    { text: 'Type "help" to view list of available shell commands.', type: 'output' },
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

  const handleKeyDown = (e) => {
    SoundEffects.playKeystroke();

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
    }
  };

  const executeCommand = (cmdText) => {
    if (isScanning || isDecrypting) {
      setHistory((prev) => [...prev, { text: 'ERROR: Shell process locked.', type: 'error' }]);
      return;
    }

    const args = cmdText.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
      case 'help':
        setHistory((prev) => [
          ...prev,
          { text: '==================================================', type: 'output' },
          { text: 'AVAILABLE COMMANDS:', type: 'accent' },
          { text: '  about        Display student profile and research focus.', type: 'output' },
          { text: '  projects     List all projects.', type: 'output' },
          { text: '  view <id>    View detailed dossier for a project (e.g. "view 1").', type: 'output' },
          { text: '  skills       List programming languages, tools, and platforms.', type: 'output' },
          { text: '  scan         Run security scan simulation on local network.', type: 'output' },
          { text: '  decrypt      Decrypt contact info & credentials.', type: 'output' },
          { text: '  clear        Clear screen buffer.', type: 'output' },
          { text: '==================================================', type: 'output' },
        ]);
        break;

      case 'about':
        setHistory((prev) => [
          ...prev,
          { text: `--- DOSSIER: ${resumeData.name.toUpperCase()} ---`, type: 'accent' },
          { text: `EDUCATION: Colgate University (BA Computer Science & Applied Math)`, type: 'output' },
          { text: `ACADEMICS: Alumni Memorial Scholar '28`, type: 'info' },
          { text: `EXPERIENCE: Immersive Visualization Dev @ Colgate // TA Python // Alterea Inc Intern // Polygence AI Ethics Researcher`, type: 'output' },
          { text: `HONORS: IMO Bronze, AMO Gold, Cambridge High Achievement Award`, type: 'output' },
          { text: `SUMMARY: ${resumeData.summaryText}`, type: 'output' },
        ]);
        break;

      case 'projects':
        setHistory((prev) => [
          ...prev,
          { text: '--- PROJECTS CATALOG ---', type: 'accent' },
          ...projectsData.map((p) => ({
            text: `[ID: ${p.id}] ${p.title} (${p.category}) - ${p.desc}`,
            type: 'output',
          })),
          { text: 'Type "view <id>" (e.g. "view 1") for full details.', type: 'info' },
        ]);
        break;

      case 'view':
        const id = parseInt(args[1]);
        if (!id || isNaN(id)) {
          setHistory((prev) => [...prev, { text: 'ERROR: Specify a valid ID. Example: "view 1"', type: 'error' }]);
          break;
        }
        const proj = projectsData.find((p) => p.id === id);
        if (!proj) {
          setHistory((prev) => [...prev, { text: `ERROR: Project ID ${id} not found.`, type: 'error' }]);
          break;
        }
        setHistory((prev) => [
          ...prev,
          { text: `=== PROJECT: ${proj.title.toUpperCase()} ===`, type: 'accent' },
          { text: `CATEGORY: ${proj.category}`, type: 'output' },
          { text: `TECH STACK: ${proj.tech.join(' // ')}`, type: 'info' },
          { text: `DETAILS: ${proj.longDesc}`, type: 'output' },
          { text: `REPOSITORY: ${proj.github}`, type: 'output' },
        ]);
        break;

      case 'skills':
        setHistory((prev) => [
          ...prev,
          { text: '--- TECHNICAL SKILLS MATRIX ---', type: 'accent' },
          { text: `SKILLS: ${resumeData.skills.join(', ')}`, type: 'output' },
          { text: `LANGUAGES: ${resumeData.languages.map((l) => `${l.name} (${l.level})`).join(' | ')}`, type: 'info' },
        ]);
        break;

      case 'scan':
        runSimulatedScan();
        break;

      case 'decrypt':
        runSimulatedDecryption();
        break;

      case 'clear':
        setHistory([]);
        break;

      default:
        setHistory((prev) => [
          ...prev,
          { text: `ERROR: Command "${command}" not recognized. Type "help".`, type: 'error' },
        ]);
        break;
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
      'Scan result: Zero security vulnerabilities identified. Site ready for Vercel deployment.'
    ];

    const runStep = () => {
      if (step < targets.length) {
        setHistory((prev) => [
          ...prev, 
          { 
            text: targets[step], 
            type: step === 2 || step === 4 ? 'warn' : step === 6 ? 'accent' : 'output' 
          }
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
            { text: '==================================================', type: 'accent' },
            { text: 'DECRYPTION SUCCESSFUL', type: 'accent' },
            { text: `EMAIL: ${resumeData.email}`, type: 'output' },
            { text: `LINKEDIN: ${resumeData.linkedin}`, type: 'output' },
            { text: `VERCEL HOST: ${resumeData.vercelUrl}`, type: 'output' },
            { text: '==================================================', type: 'accent' },
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
        
        {isScanning && <div className="terminal-line warn">SCANNING... ⬤</div>}
        {isDecrypting && <div className="terminal-line error">DECRYPTING... ⬤</div>}

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
