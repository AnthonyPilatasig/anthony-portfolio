import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLayers, FiPlay, FiCheckCircle, FiCpu, FiSmartphone, FiDatabase, FiCode } from 'react-icons/fi';
import confetti from 'canvas-confetti';

interface LayerInfo {
  id: string;
  name: string;
  badge: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  techs: string[];
  sampleCode: string;
  responsibilities: string[];
}

const LAYERS: LayerInfo[] = [
  {
    id: 'presentation',
    name: '1. Capa de Presentación & Clientes',
    badge: 'Presentation Layer',
    icon: <FiSmartphone className="w-5 h-5" />,
    color: '#38bdf8',
    description: 'Interfaces de usuario y puntos de entrada HTTP. Desacopladas de la lógica de negocio mediante DTOs.',
    techs: ['React Native (Expo)', 'Angular 17+ / TypeScript', 'ASP.NET Core Web API Controllers'],
    responsibilities: [
      'Renderizado UI y validación de entrada del cliente',
      'Despacho de comandos/queries hacia la API mediante HTTPS y JWT',
      'Consumo y cacheo de DTOs en el dispositivo móvil/navegador'
    ],
    sampleCode: `// [Controllers/MatriculasController.cs]
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class MatriculasController : ControllerBase
{
    private readonly IMediator _mediator;
    public MatriculasController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> MatricularEstudiante([FromBody] InscribirEstudianteCommand command)
    {
        var result = await _mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }
}`
  },
  {
    id: 'application',
    name: '2. Capa de Aplicación (CQRS & MediatR)',
    badge: 'Application Layer / CQRS',
    icon: <FiCpu className="w-5 h-5" />,
    color: '#a855f7',
    description: 'Orquesta los casos de uso del sistema. Separa estrictamente operaciones de lectura (Queries) de operaciones de escritura (Commands).',
    techs: ['CQRS Pattern', 'MediatR (IRequest/IRequestHandler)', 'FluentValidation', 'Automapper'],
    responsibilities: [
      'Definición de Commands (InscribirEstudiante, GenerarCarnetQR)',
      'Definición de Queries optimizadas (ObtenerRecordAcademicoQuery)',
      'Validación de reglas de aplicación y pipelines de autorización'
    ],
    sampleCode: `// [Application/Commands/InscribirEstudianteCommandHandler.cs]
public record InscribirEstudianteCommand(Guid EstudianteId, Guid PeriodoId, List<Guid> MateriaIds) 
    : IRequest<Result<MatriculaDto>>;

public class InscribirEstudianteHandler : IRequestHandler<InscribirEstudianteCommand, Result<MatriculaDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEstudianteRepository _estudianteRepo;

    public async Task<Result<MatriculaDto>> Handle(InscribirEstudianteCommand req, CancellationToken ct)
    {
        var estudiante = await _estudianteRepo.GetByIdAsync(req.EstudianteId, ct);
        if (estudiante == null) return Result.Failure<MatriculaDto>("Estudiante no encontrado.");

        var matricula = estudiante.InscribirEnPeriodo(req.PeriodoId, req.MateriaIds);
        await _unitOfWork.CommitAsync(ct);

        return Result.Success(matricula.ToDto());
    }
}`
  },
  {
    id: 'domain',
    name: '3. Capa de Dominio (Core Institucional)',
    badge: 'Domain Layer (Pure C#)',
    icon: <FiLayers className="w-5 h-5" />,
    color: '#ec4899',
    description: 'El corazón del software. Reglas de negocio puras sin dependencias de frameworks ni librerías externas.',
    techs: ['Entidades & Agregados', 'Value Objects (Cedula, Email)', 'Domain Events', 'Domain Exceptions'],
    responsibilities: [
      'Invariantes de negocio (ej. cupos máximos por aula, prerrequisitos aprobados)',
      'Generación de eventos de dominio (MatriculaCompletadaEvent)',
      'Encapsulación estricta del estado para evitar mutaciones inválidas'
    ],
    sampleCode: `// [Domain/Entities/Estudiante.cs]
public class Estudiante : AggregateRoot<Guid>
{
    public CedulaEcuador Cedula { get; private set; }
    public string Nombres { get; private set; }
    public EstadoAcademico Estado { get; private set; }

    public Matricula InscribirEnPeriodo(Guid periodoId, List<Guid> materias)
    {
        if (Estado != EstadoAcademico.Activo)
            throw new DomainException("El estudiante no se encuentra en estado activo.");

        var matricula = new Matricula(Id, periodoId, materias);
        AddDomainEvent(new EstudianteMatriculadoEvent(Id, matricula.Id));
        return matricula;
    }
}`
  },
  {
    id: 'infrastructure',
    name: '4. Capa de Infraestructura & Datos',
    badge: 'Infrastructure & DB',
    icon: <FiDatabase className="w-5 h-5" />,
    color: '#10b981',
    description: 'Implementación técnica de acceso a bases de datos relacionales, servicios de correo, tokens JWT y almacenamiento.',
    techs: ['Entity Framework Core', 'SQL Server / MySQL', 'JWT Token Provider', 'Docker & CI/CD'],
    responsibilities: [
      'Mapeo relacional con DbContext y migraciones automáticas',
      'Consultas de lectura de alto rendimiento indexadas',
      'Integración con sistemas legacy y servicios externos de verificación'
    ],
    sampleCode: `// [Infrastructure/Persistence/Repositories/EstudianteRepository.cs]
public class EstudianteRepository : IEstudianteRepository
{
    private readonly GacadDbContext _context;
    public EstudianteRepository(GacadDbContext context) => _context = context;

    public async Task<Estudiante?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _context.Estudiantes
            .Include(e => e.MatriculasHistoricas)
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, ct);
    }
}`
  }
];

export const ArchitectureDiagram: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<string>('application');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(-1);

  const currentLayer = LAYERS.find(l => l.id === activeLayer) || LAYERS[1];

  const handleSimulateFlow = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(0);

    const stepIntervals = [0, 1, 2, 3, 4];
    stepIntervals.forEach((step, idx) => {
      setTimeout(() => {
        setSimStep(step);
        if (step < 4) {
          setActiveLayer(LAYERS[step].id);
        } else {
          setIsSimulating(false);
          setSimStep(-1);
          try {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#a855f7', '#38bdf8', '#10b981']
            });
          } catch { /* silent */ }
        }
      }, idx * 1100);
    });
  };

  return (
    <div className="editorial-card p-6 md:p-8 rounded-2xl border border-[var(--theme-border-strong)] space-y-6">
      
      {/* Header & Flow Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--theme-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-accent py-0.5 text-[10px]">Clean Architecture &amp; CQRS</span>
            <span className="badge py-0.5 text-[10px]">.NET 8 + Angular / React Native</span>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-[var(--theme-ink)] tracking-tight">
            Esquema de Arquitectura por Capas en Producción
          </h3>
          <p className="text-xs font-mono text-[var(--theme-ink-muted)] mt-1">
            Patrón desacoplado implementado en <strong>Gacad</strong> y <strong>Mi ISTPET</strong> para garantizar estabilidad y rendimiento.
          </p>
        </div>

        <button
          onClick={handleSimulateFlow}
          disabled={isSimulating}
          className={`btn-primary text-xs flex items-center gap-2 self-start md:self-auto shrink-0 ${
            isSimulating ? 'opacity-80 animate-pulse' : ''
          }`}
        >
          <FiPlay className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? `Ejecutando Flujo (Paso ${simStep + 1}/4)...` : 'Simular Ciclo de Petición (Request)'}</span>
        </button>
      </div>

      {/* Layer Navigation Tabs / Visual Stack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LAYERS.map((layer, idx) => {
          const isActive = activeLayer === layer.id;
          const isSimCurrent = isSimulating && simStep === idx;

          return (
            <button
              key={layer.id}
              onClick={() => {
                if (!isSimulating) setActiveLayer(layer.id);
              }}
              className={`p-4 rounded-xl text-left transition-all duration-300 border relative overflow-hidden flex flex-col justify-between min-h-[110px] ${
                isActive
                  ? 'bg-[var(--theme-surface)] border-[var(--theme-accent)] shadow-lg'
                  : 'bg-[var(--theme-bg)] border-[var(--theme-border)] hover:border-[var(--theme-border-strong)]'
              }`}
            >
              {isSimCurrent && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--theme-accent)] animate-pulse" />
              )}
              <div className="flex items-center justify-between gap-2">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: `${layer.color}15`,
                    color: layer.color
                  }}
                >
                  {layer.icon}
                </div>
                <span className="font-mono text-[9px] text-[var(--theme-ink-muted)]">
                  Capa 0{idx + 1}
                </span>
              </div>

              <div>
                <span className="font-mono text-xs font-bold text-[var(--theme-ink)] block mt-2">
                  {layer.name.split('.')[1] || layer.name}
                </span>
                <span className="text-[10px] text-[var(--theme-ink-muted)] truncate block mt-0.5">
                  {layer.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Layer Deep Dive View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLayer.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[var(--theme-bg)] p-5 md:p-6 rounded-xl border border-[var(--theme-border)]"
        >
          {/* Layer Details & Responsibilities */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentLayer.color }}
              />
              <span className="font-mono text-xs font-bold text-[var(--theme-ink)] uppercase">
                {currentLayer.badge}
              </span>
            </div>

            <p className="text-xs md:text-sm text-[var(--theme-ink-muted)] leading-relaxed font-light">
              {currentLayer.description}
            </p>

            <div>
              <h4 className="font-mono text-xs font-semibold text-[var(--theme-ink)] mb-2 flex items-center gap-1.5">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Responsabilidades Clave:</span>
              </h4>
              <ul className="space-y-1.5">
                {currentLayer.responsibilities.map((resp, rIdx) => (
                  <li key={rIdx} className="text-xs text-[var(--theme-ink-muted)] font-light flex items-start gap-2">
                    <span className="text-[var(--theme-accent)] mt-0.5">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <span className="font-mono text-[10px] text-[var(--theme-ink-muted)] uppercase block mb-1.5">
                Tecnologías &amp; Patrones Aplicados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentLayer.techs.map((tech, tIdx) => (
                  <span key={tIdx} className="badge text-[10px] py-0.5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Real C# Code Block */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="rounded-xl overflow-hidden border border-[var(--theme-border-strong)] bg-[#0d1117] text-slate-200">
              <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between text-[11px] font-mono bg-black/40">
                <span className="flex items-center gap-2 text-slate-300">
                  <FiCode className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                  <span>Implementación C# .NET 8</span>
                </span>
                <span className="text-[10px] text-slate-400">CQRS &amp; Clean Architecture</span>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-slate-300 max-h-72">
                <code>{currentLayer.sampleCode}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Live Request Flow Simulation Bar */}
      <div className="p-4 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[var(--theme-ink)]">
            {isSimulating
              ? `Procesando: ${LAYERS[simStep]?.badge || 'Respuesta generada'}`
              : 'Arquitectura validada para alta concurrencia institucional'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[var(--theme-accent)]">
          <span>Tiempo de Respuesta Objetivo:</span>
          <span className="px-2 py-0.5 rounded bg-[var(--theme-accent)]/10 font-bold">
            &lt; 95ms
          </span>
        </div>
      </div>
    </div>
  );
};
