import React, { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../../data/portfolio';

interface CommandOutput {
  id: string;
  command: string;
  output: React.ReactNode;
}

interface TerminalConsoleProps {
  onSelectCategory?: (category: any) => void;
  fullHeight?: boolean;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ fullHeight = false }) => {
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
          <p className="text-slate-400">Desarrollador Full-Stack & Arquitecto de Software en Formación</p>
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    } else {
      switch (lower) {
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
            {portfolioData.projects.map((p) => (
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
            {portfolioData.experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-yellow-500/40 pl-2 mb-2">
                <p className="text-cyan-300 font-bold">{exp.role} @ {exp.company}</p>
                <p className="text-slate-500 text-[10px]">{exp.period}</p>
                <p className="text-slate-400">{exp.description}</p>
              </div>
            ))}
            <p className="text-yellow-400 font-bold mt-2">Formación Académica:</p>
            {portfolioData.education.map((edu) => (
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
    <div 
      className={`w-full max-w-5xl mx-auto rounded-2xl bg-[#090d16]/90 border border-yellow-500/20 shadow-2xl p-6 font-mono text-sm overflow-hidden backdrop-blur-xl ${
        fullHeight ? 'min-h-[75vh] flex flex-col justify-between' : ''
      }`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header bar */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-yellow-500/20 text-xs select-none">
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
        </div>
        <div className="text-yellow-400/80 font-mono text-[11px] tracking-wider uppercase">
          anthony@dev-shell: ~/portfolio
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] text-slate-400 tracking-widest uppercase">online</span>
        </div>
      </div>

      {/* Terminal log output */}
      <div className={`overflow-y-auto pr-2 space-y-4 text-slate-300 scrollbar-thin scrollbar-thumb-slate-700 ${fullHeight ? 'flex-1 mb-4' : 'max-h-[420px]'}`}>
        {logs.map((log) => (
          <div key={log.id} className="space-y-1">
            <div className="flex items-center text-xs text-yellow-400 font-semibold">
              <span className="text-cyan-400 mr-2">anthony@dev-shell:~$</span>
              <span>{log.command}</span>
            </div>
            <div className="pl-4">{log.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal input form */}
      <div className="flex items-center border-t border-yellow-500/20 pt-4 mt-2">
        <span className="text-cyan-400 font-semibold text-xs mr-2 select-none">anthony@dev-shell:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe 'help', 'projects', 'gacad' o 'desktop'..."
          className="flex-1 bg-transparent text-slate-100 border-none outline-none focus:ring-0 font-mono text-xs placeholder-slate-600"
          autoFocus
        />
      </div>
    </div>
  );
};
