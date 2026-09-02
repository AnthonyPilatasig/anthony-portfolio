import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '../../data/portfolio';
import { SnakeGame } from './SnakeGame';
import { Game2048 } from './Game2048';
import type { IProject, IExperience, IEducation } from '../../types/portfolio.types';

type OSTheme = 'macos' | 'windows' | 'linux';

const OS_LABELS: Record<OSTheme, string> = { macos: 'macOS', windows: 'Windows', linux: 'Linux' };

// Each simulated OS gets its own prompt convention, font stack and body tint —
// the window chrome alone doesn't read as "really" macOS/Windows/Linux without these.
const PROMPT_FULL: Record<OSTheme, string> = {
  macos: 'anthony@MacBook-Pro ~ %',
  windows: 'PS C:\\Users\\anthony>',
  linux: 'anthony@ubuntu:~$',
};
const PROMPT_SHORT: Record<OSTheme, string> = { macos: '%', windows: '>', linux: '$' };
const OS_FONT: Record<OSTheme, string> = {
  macos: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
  windows: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
  linux: "'Ubuntu Mono', 'DejaVu Sans Mono', monospace",
};
const OS_BODY_CLASS: Record<OSTheme, string> = {
  macos: 'bg-[#0d1117]/90',
  windows: 'bg-[#0c0c0c]/95',
  linux: 'bg-[#2c0e37]/90',
};
const OS_BORDER_CLASS: Record<OSTheme, string> = {
  macos: 'border-[var(--theme-border-strong)]',
  windows: 'border-slate-700',
  linux: 'border-[#5c2a54]',
};

interface CommandOutput {
  id: string;
  command: string;
  output: React.ReactNode;
}

interface TerminalConsoleProps {
  fullHeight?: boolean;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ fullHeight = false }) => {
  const { t } = useTranslation();

  const translatedProjects = t('projectsData', { returnObjects: true }) as Partial<IProject>[];
  const projects: IProject[] = portfolioData.projects.map(p => {
    const tr = (Array.isArray(translatedProjects) ? translatedProjects : []).find((tItem) => tItem.id === p.id) || {};
    return { ...p, ...tr };
  });

  const translatedExp = t('experienceData', { returnObjects: true }) as Partial<IExperience>[];
  const experience: IExperience[] = portfolioData.experience.map(e => {
    const tr = (Array.isArray(translatedExp) ? translatedExp : []).find((tItem) => tItem.id === e.id) || {};
    return { ...e, ...tr };
  });

  const translatedEdu = t('educationData', { returnObjects: true }) as Partial<IEducation>[];
  const education: IEducation[] = portfolioData.education.map(e => {
    const tr = (Array.isArray(translatedEdu) ? translatedEdu : []).find((tItem) => tItem.id === e.id) || {};
    return { ...e, ...tr };
  });

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<CommandOutput[]>([
    {
      id: 'welcome',
      command: 'neofetch',
      output: (
        <div className="text-xs leading-relaxed space-y-1 font-mono text-slate-300">
          <p className="text-yellow-400 font-bold">--------------------------------------------------</p>
          <p className="text-yellow-300 font-semibold">ANTHONY PILATASIG — UNIX VIRTUAL TERMINAL v2.5</p>
          <p className="text-slate-400">Desarrollador Full-Stack & Ingeniero de Software en Formación</p>
          <p className="text-slate-400">Especializado en .NET 8, Clean Architecture, CQRS, Angular, React Native y Apps Nativas de Escritorio</p>
          <p className="text-slate-500">Ubicación: Quito, Ecuador | ISTPET Dev Lead & UPS Software Eng.</p>
          <p className="text-yellow-400 font-bold">--------------------------------------------------</p>
          <p className="text-cyan-400">Escribe <code className="bg-slate-800 text-yellow-300 px-1 py-0.5 rounded">help</code> para listar comandos disponibles.</p>
        </div>
      )
    }
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [matrixActive, setMatrixActive] = useState(false);
  const [ctfStage, setCtfStage] = useState(0); // 0=inactive, 1=base64 puzzle, 2=caesar puzzle, 3=solved
  const [activeGame, setActiveGame] = useState<'snake' | '2048' | null>(null);
  const [osTheme, setOsTheme] = useState<OSTheme>('macos');

  useEffect(() => {
    if (!matrixActive) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let animationId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const chars = 'アカサタナハマヤラワ01ANTHONYAP0123456789';
    let drops = new Array(Math.floor(canvas.width / fontSize)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(8, 12, 20, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#22c55e';
      ctx.font = `${fontSize}px monospace`;
      drops = drops.map((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        const next = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
        return next;
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [matrixActive]);

  useEffect(() => {
    if (logs.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const lower = trimmed.toLowerCase();
    let outputNode: React.ReactNode;

    if (lower.startsWith('echo ')) {
      outputNode = <div className="text-xs font-mono text-slate-300">{trimmed.substring(5)}</div>;
    } else if (lower.startsWith('os ')) {
      const target = lower.substring(3).trim() as OSTheme;
      if (target === 'macos' || target === 'windows' || target === 'linux') {
        setOsTheme(target);
        outputNode = <p className="text-xs font-mono text-emerald-400">Chrome de ventana cambiado a {OS_LABELS[target]}.</p>;
      } else {
        outputNode = <p className="text-xs font-mono text-red-400">Opciones válidas: macos, windows, linux.</p>;
      }
    } else if (lower.startsWith('decode ') && (ctfStage === 1 || ctfStage === 2)) {
      const answer = trimmed.substring(7).trim().toLowerCase();
      if (ctfStage === 1 && answer === 'root') {
        setCtfStage(2);
        outputNode = (
          <div className="text-xs space-y-1.5 font-mono">
            <p className="text-emerald-400 font-bold">✓ Correcto. Nivel 1 superado.</p>
            <p className="text-slate-300">Nivel 2 — Cifrado César (desplazamiento +3). Descifra y responde con <span className="text-cyan-300">decode &lt;respuesta&gt;</span>:</p>
            <p className="text-yellow-300 tracking-widest text-sm">lvwshw</p>
          </div>
        );
      } else if (ctfStage === 2 && answer === 'istpet') {
        setCtfStage(3);
        outputNode = (
          <div className="text-xs space-y-1 font-mono">
            <p className="text-emerald-400 font-bold">[ACCESS GRANTED] Firewall perimetral evadido.</p>
            <p className="text-yellow-300 tracking-wider">FLAG&#123;ISTPET_DEV_2026&#125;</p>
            <p className="text-slate-400">Bien jugado. Escribe <span className="text-cyan-300 underline cursor-pointer" onClick={() => handleCommand('hack')}>hack</span> para reiniciar el reto.</p>
          </div>
        );
      } else {
        outputNode = <p className="text-xs text-red-400 font-mono">✗ Respuesta incorrecta. Sigue intentando.</p>;
      }
    } else {
      switch (lower) {
        case 'matrix':
          setMatrixActive((prev) => !prev);
          outputNode = (
            <p className="text-xs font-mono text-emerald-400">
              {matrixActive ? 'Saliendo de la Matrix...' : 'Wake up, Anthony... Sigue al conejo blanco.'}
            </p>
          );
          break;

        case 'play':
        case 'snake':
        case 'play snake':
          setActiveGame('snake');
          outputNode = (
            <p className="text-xs font-mono text-cyan-300">Cargando snake.exe... usa las flechas del teclado, ESC para salir.</p>
          );
          break;

        case '2048':
        case 'play 2048':
          setActiveGame('2048');
          outputNode = (
            <p className="text-xs font-mono text-cyan-300">Cargando 2048.exe... usa las flechas del teclado, ESC para salir.</p>
          );
          break;

        case 'hack':
        case 'ctf':
          setCtfStage(1);
          outputNode = (
            <div className="text-xs space-y-1.5 font-mono">
              <p className="text-red-400 font-bold">[!] Intrusión simulada iniciada — reto CTF de 2 niveles.</p>
              <p className="text-slate-300">Nivel 1 — Base64. Decodifica y responde con <span className="text-cyan-300">decode &lt;respuesta&gt;</span>:</p>
              <p className="text-yellow-300 tracking-widest text-sm">cm9vdA==</p>
            </div>
          );
          break;

        case 'help':
        case 'ls':
        case 'dir':
          outputNode = (
            <div className="text-xs space-y-1.5 font-mono text-slate-300">
              <p className="text-yellow-400 font-semibold">Comandos disponibles:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                <div><span className="text-cyan-400 font-bold">about</span> : Resumen profesional & biografía</div>
                <div><span className="text-cyan-400 font-bold">projects</span> : Lista de todos los proyectos institucionales y personales</div>
                <div><span className="text-cyan-400 font-bold">gacad</span> : Detalles del Core Académico Gacad</div>
                <div><span className="text-cyan-400 font-bold">istpet</span> : Detalles de la App Móvil Mi ISTPET</div>
                <div><span className="text-cyan-400 font-bold">desktop</span> : Proyectos de escritorio nativos (DebtManager, Buscaminas Java, etc.)</div>
                <div><span className="text-cyan-400 font-bold">skills</span> : Desglose del Stack Tecnológico & Arquitectura</div>
                <div><span className="text-cyan-400 font-bold">experience</span> : Trayectoria laboral y formación académica</div>
                <div><span className="text-cyan-400 font-bold">contact</span> : Canales de contacto y redes sociales</div>
                <div><span className="text-cyan-400 font-bold">neofetch</span> : Información del sistema y desarrollador</div>
                <div><span className="text-cyan-400 font-bold">sudo</span> : Permiso concedido de administrador</div>
                <div><span className="text-cyan-400 font-bold">matrix</span> : Activa/desactiva la lluvia de código</div>
                <div><span className="text-cyan-400 font-bold">hack</span> : Inicia un mini reto CTF de 2 niveles</div>
                <div><span className="text-cyan-400 font-bold">play</span> : Juega Snake sin salir de la terminal</div>
                <div><span className="text-cyan-400 font-bold">2048</span> : Juega 2048 sin salir de la terminal</div>
                <div><span className="text-cyan-400 font-bold">os &lt;macos|windows|linux&gt;</span> : Cambia el chrome de la ventana</div>
                <div><span className="text-cyan-400 font-bold">clear / cls</span> : Limpiar la pantalla de la consola</div>
                <div><span className="text-cyan-400 font-bold">ls / dir</span> : Listar comandos (alias de help)</div>
                <div><span className="text-cyan-400 font-bold">whoami</span> : Mostrar usuario actual</div>
                <div><span className="text-cyan-400 font-bold">date</span> : Mostrar fecha y hora del sistema</div>
                <div><span className="text-cyan-400 font-bold">pwd</span> : Imprimir directorio de trabajo</div>
                <div><span className="text-cyan-400 font-bold">echo [texto]</span> : Imprimir texto en pantalla</div>
              </div>
            </div>
          );
          break;

        case 'about':
          outputNode = (
            <div className="text-xs space-y-2 font-mono text-slate-300">
              <p className="text-yellow-300 font-bold">{portfolioData.personal.name}</p>
              <p className="text-slate-300">{portfolioData.personal.bio}</p>
              <p className="text-slate-400">📍 Location: {portfolioData.personal.location}</p>
              <p className="text-emerald-400">⚡ Status: {portfolioData.personal.status}</p>
            </div>
          );
          break;

        case 'projects':
          outputNode = (
            <div className="text-xs space-y-2 font-mono text-slate-300">
              <p className="text-yellow-400 font-bold">Proyectos Destacados:</p>
              {projects.map((p) => (
                <div key={p.id} className="border-l-2 border-yellow-500/40 pl-2">
                  <p className="text-cyan-300 font-semibold">{p.title} <span className="text-slate-500 text-[10px]">[{p.category.toUpperCase()}]</span></p>
                  <p className="text-slate-400">{p.description}</p>
                  <p className="text-slate-500 text-[11px]">Stack: {p.technologies.join(', ')}</p>
                </div>
              ))}
            </div>
          );
          break;

        case 'gacad':
          outputNode = (
            <div className="text-xs space-y-1.5 font-mono text-slate-300 border-l-2 border-cyan-400 pl-3">
              <p className="text-yellow-300 font-bold">Gacad — Sistema de Gestión Académica Institutional</p>
              <p className="text-slate-300">Core administrativo integral para el Instituto Superior Tecnológico Mayor Pedro Traversari.</p>
              <p className="text-slate-400">• Frontend: Angular & TypeScript con arquitectura modular.</p>
              <p className="text-slate-400">• Backend: C# .NET 8 con Clean Architecture y soporte multi-rol.</p>
              <p className="text-slate-400">• Base de datos: SQL Server optimizado para miles de registros.</p>
            </div>
          );
          break;

        case 'istpet':
        case 'mi istpet':
          outputNode = (
            <div className="text-xs space-y-1.5 font-mono text-slate-300 border-l-2 border-emerald-400 pl-3">
              <p className="text-emerald-300 font-bold">Mi ISTPET — App Móvil Institucional Oficial</p>
              <p className="text-slate-300">Aplicación nativa móvil multiplataforma desarrollada en React Native.</p>
              <p className="text-slate-400">• Módulos: Carnetización Digital QR, estado de cuenta, notas, asistencias y avisos.</p>
              <p className="text-slate-400">• Backend: API RESTful en .NET 8 + MySQL con tokens JWT seguros.</p>
            </div>
          );
          break;

        case 'desktop':
          outputNode = (
            <div className="text-xs space-y-2 font-mono text-slate-300">
              <p className="text-yellow-400 font-bold">Proyectos Nativos de Escritorio & Algoritmos:</p>
              <div className="space-y-2">
                <div>
                  <p className="text-cyan-300 font-bold">1. DebtManager (C# .NET Desktop)</p>
                  <p className="text-slate-400">Software de escritorio para gestión financiera personal, préstamos y persistencia local SQLite.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold">2. Buscaminas POO (Java Desktop)</p>
                  <p className="text-slate-400">Juego de lógica matemática con matrices bidimensionales y destape recursivo en Java puro.</p>
                </div>
                <div>
                  <p className="text-cyan-300 font-bold">3. Optimización de Inventarios (Java)</p>
                  <p className="text-slate-400">Implementación de Programación Dinámica (Knapsack 0/1) con memoización top-down y bottom-up.</p>
                </div>
              </div>
            </div>
          );
          break;

        case 'skills':
          outputNode = (
            <div className="text-xs space-y-2 font-mono text-slate-300">
              <p className="text-yellow-400 font-bold">Stack Tecnológico & Patrones de Arquitectura:</p>
              <p><span className="text-cyan-400 font-semibold">Frontend & Mobile:</span> {portfolioData.skills.frontend.join(' • ')}</p>
              <p><span className="text-cyan-400 font-semibold">Backend & Server:</span> {portfolioData.skills.backend.join(' • ')}</p>
              <p><span className="text-cyan-400 font-semibold">Escritorio Nativo:</span> {portfolioData.skills.desktop.join(' • ')}</p>
              <p><span className="text-cyan-400 font-semibold">Bases de Datos:</span> {portfolioData.skills.databases.join(' • ')}</p>
              <p><span className="text-cyan-400 font-semibold">Arquitectura & Cloud:</span> {portfolioData.skills.architecture.join(' • ')}</p>
            </div>
          );
          break;

        case 'experience':
          outputNode = (
            <div className="text-xs space-y-2 font-mono text-slate-300">
              <p className="text-yellow-400 font-bold">Experiencia & Educación:</p>
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-yellow-500/40 pl-2 mb-2">
                  <p className="text-cyan-300 font-bold">{exp.role} @ {exp.company}</p>
                  <p className="text-slate-500 text-[10px]">{exp.period}</p>
                  <p className="text-slate-400">{exp.description}</p>
                </div>
              ))}
              <p className="text-yellow-400 font-bold mt-2">Formación Académica:</p>
              {education.map((edu) => (
                <div key={edu.id} className="pl-2">
                  <p className="text-slate-200 font-semibold">• {edu.degree}</p>
                  <p className="text-slate-400 text-[11px]">{edu.institution} ({edu.status})</p>
                </div>
              ))}
            </div>
          );
          break;

        case 'contact':
          outputNode = (
            <div className="text-xs space-y-1.5 font-mono text-slate-300">
              <p className="text-yellow-400 font-bold">Canales de Contacto:</p>
              <p>📧 Email: <a href={`mailto:${portfolioData.personal.email}`} className="text-cyan-300 underline">{portfolioData.personal.email}</a></p>
              <p>🐙 GitHub: <a href={portfolioData.personal.github} target="_blank" rel="noreferrer" className="text-cyan-300 underline">{portfolioData.personal.github}</a></p>
              <p>💼 LinkedIn: <a href={portfolioData.personal.linkedin} target="_blank" rel="noreferrer" className="text-cyan-300 underline">{portfolioData.personal.linkedin}</a></p>
            </div>
          );
          break;

        case 'neofetch':
          outputNode = (
            <div className="text-xs space-y-1 font-mono text-slate-300">
              <p className="text-yellow-400 font-bold">anthony@dev-shell</p>
              <p className="text-slate-500">------------------</p>
              <p><span className="text-cyan-400 font-bold">OS:</span> Windows / Linux Dev Shell</p>
              <p><span className="text-cyan-400 font-bold">Host:</span> Anthony Pilatasig Portfolio System</p>
              <p><span className="text-cyan-400 font-bold">Kernel:</span> .NET 8 / Clean Architecture Core</p>
              <p><span className="text-cyan-400 font-bold">Uptime:</span> 100% Availability</p>
              <p><span className="text-cyan-400 font-bold">Shell:</span> Bash / zsh CLI v2.5</p>
              <p><span className="text-cyan-400 font-bold">Languages:</span> C#, TypeScript, Java, Python, SQL</p>
            </div>
          );
          break;

        case 'sudo':
          outputNode = (
            <div className="text-xs font-mono text-emerald-400">
              [ACCESS GRANTED] Permisos de Administrador activados. ¡Bienvenido al núcleo de desarrollo de Anthony Pilatasig!
            </div>
          );
          break;

        case 'clear':
        case 'cls':
          setLogs([]);
          setInput('');
          return;

        case 'whoami':
          outputNode = <div className="text-xs font-mono text-slate-300">anthony</div>;
          break;

        case 'pwd':
          outputNode = <div className="text-xs font-mono text-slate-300">/home/anthony</div>;
          break;

        case 'date':
          outputNode = <div className="text-xs font-mono text-slate-300">{new Date().toString()}</div>;
          break;

        default:
          outputNode = (
            <p className="text-xs text-red-400 font-mono">
              Comando no reconocido: '{trimmed}'. Escribe <span className="text-yellow-300 underline cursor-pointer" onClick={() => handleCommand('help')}>help</span> para ver la lista de comandos.
            </p>
          );
          break;
      }
    }

    setLogs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        command: trimmed,
        output: outputNode
      }
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* OS chrome selector */}
      <div className="flex justify-end gap-1.5 mb-2 pr-1">
        {(['macos', 'windows', 'linux'] as OSTheme[]).map((os) => (
          <button
            key={os}
            onClick={() => setOsTheme(os)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-all ${osTheme === os
              ? 'bg-yellow-500 text-slate-950 border-yellow-400 font-bold'
              : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
              }`}
          >
            {OS_LABELS[os]}
          </button>
        ))}
      </div>

      <div
        className={`relative w-full border shadow-2xl p-4 sm:p-6 text-sm overflow-hidden backdrop-blur-xl ${OS_BODY_CLASS[osTheme]} ${OS_BORDER_CLASS[osTheme]} ${fullHeight ? 'min-h-[60vh] sm:min-h-[75vh] flex flex-col justify-between' : ''
          } ${osTheme === 'windows' ? 'rounded-lg' : 'rounded-2xl'}`}
        style={{ fontFamily: OS_FONT[osTheme] }}
        onClick={() => inputRef.current?.focus()}
      >
        {matrixActive && (
          <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none opacity-70" />
        )}

        {/* Header bar — chrome varies per simulated OS */}
        {osTheme === 'macos' && (
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-yellow-500/20 text-xs select-none">
            <div className="flex gap-[7px] shrink-0">
              <span className="w-[13px] h-[13px] rounded-full bg-gradient-to-b from-red-400 to-red-600 inline-block"></span>
              <span className="w-[13px] h-[13px] rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 inline-block"></span>
              <span className="w-[13px] h-[13px] rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 inline-block"></span>
            </div>
            <div className="hidden sm:block text-slate-300 text-[11px] tracking-wide truncate px-2">
              anthony — zsh — 80×24
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] text-slate-400 tracking-widest uppercase">online</span>
            </div>
          </div>
        )}

        {osTheme === 'windows' && (
          <div className="flex justify-between items-center pb-0 mb-4 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 pl-3 sm:pl-4 bg-[#1f1f1f] border-b border-slate-700 text-xs select-none">
            <div className="flex items-center gap-2 text-slate-300 text-[11px] min-w-0 truncate py-2.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600 inline-block shrink-0"></span>
              <span className="truncate">Windows PowerShell</span>
            </div>
            <div className="flex items-center shrink-0 text-slate-300 text-sm font-sans h-full">
              <span className="px-3.5 py-2.5 hover:bg-white/10 cursor-default">─</span>
              <span className="px-3.5 py-2.5 hover:bg-white/10 cursor-default text-[10px]">▢</span>
              <span className="px-3.5 py-2.5 hover:bg-red-600 hover:text-white cursor-default">✕</span>
            </div>
          </div>
        )}

        {osTheme === 'linux' && (
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#5c2a54] text-xs select-none">
            <span className="text-[10px] text-purple-300/60 tracking-widest uppercase shrink-0">Terminal</span>
            <div className="hidden sm:block text-purple-100 text-[11px] tracking-wider truncate px-2">
              anthony@ubuntu: ~
            </div>
            <span className="w-3 h-3 rounded-full border border-purple-300/40 hover:border-red-400 inline-block shrink-0"></span>
          </div>
        )}

        {/* Terminal log output */}
        <div className={`overflow-y-auto pr-2 space-y-4 text-slate-300 scrollbar-thin scrollbar-thumb-slate-700 ${fullHeight ? 'flex-1 mb-4' : 'max-h-[420px]'}`}>
          {logs.map((log) => (
            <div key={log.id} className="space-y-1">
              <div className="flex items-center text-xs text-yellow-400 font-semibold">
                <span className="text-cyan-400 mr-2 shrink-0">
                  <span className="sm:hidden">{PROMPT_SHORT[osTheme]}</span>
                  <span className="hidden sm:inline">{PROMPT_FULL[osTheme]}</span>
                </span>
                <span className="break-all">{log.command}</span>
              </div>
              <div className="pl-4">{log.output}</div>
            </div>
          ))}
          {activeGame === 'snake' && (
            <SnakeGame onExit={() => { setActiveGame(null); inputRef.current?.focus(); }} />
          )}
          {activeGame === '2048' && (
            <Game2048 onExit={() => { setActiveGame(null); inputRef.current?.focus(); }} />
          )}
          <div ref={bottomRef} />
        </div>

        {/* Terminal input form */}
        {!activeGame && (
        <div className="flex items-center border-t border-yellow-500/20 pt-4 mt-2">
        <span className="text-cyan-400 font-semibold text-xs mr-2 select-none shrink-0">
          <span className="sm:hidden">{PROMPT_SHORT[osTheme]}</span>
          <span className="hidden sm:inline">{PROMPT_FULL[osTheme]}</span>
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="help, hack, matrix, play..."
          className="flex-1 min-w-0 bg-transparent text-slate-100 border-none outline-none focus:ring-0 font-mono text-xs placeholder-slate-600"
          autoFocus={fullHeight}
        />
        </div>
        )}
      </div>
    </div>
  );
};
