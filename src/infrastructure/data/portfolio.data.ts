import type { IPortfolioData } from '@domain/entities/portfolio.entity';

// BrowserRouter puts each page on its own URL path, so plain relative paths ("./assets/...")
// resolve differently per route. import.meta.env.BASE_URL is absolute and always correct.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const portfolioData: IPortfolioData = {
  personal: {
    name: "Anthony David Pilatasig Macas",
    title: "Desarrollador Full Stack & Docente",
    subtitle: "Angular, React, Ionic y .NET — del análisis a la base de datos",
    bio: "Desarrollador Full Stack en el equipo de software del ISTPET: paso por análisis, base de datos, backend y frontend según lo que necesite el proyecto. Ahí construí la app «Mi ISTPET», publicada en Google Play, y participo en los sistemas académicos, de titulación, bienestar y talento humano. También soy docente de la carrera de Desarrollo de Software, y sigo experimentando con tecnologías nuevas en proyectos personales.",
    tagline: "Construyo software que la gente usa a diario, y enseño a construirlo con casos reales.",
    location: "Quito, Ecuador (UTC-5)",
    email: "antpila3848@gmail.com",
    phone: "+593 98 358 8715",
    github: "https://github.com/AnthonyPilatasig",
    linkedin: "https://linkedin.com/in/anthony-pilatasig",
    twitch: "https://twitch.tv/anthony_pilatasig",
    status: "Abierto a proyectos, clases y consultorías",
    avatar: asset("assets/anthony_profile.webp"),
    avatarReal: asset("assets/anthony_real.webp"),
  },
  manifesto: [
    {
      number: "01",
      title: "Código con Sentido Práctico",
      description: "La mejor arquitectura es la que resuelve el problema real de forma simple y mantenible, sin añadir complejidad que nadie pidió."
    },
    {
      number: "02",
      title: "Rendimiento & Experiencia de Usuario",
      description: "En web y móvil, la fluidez se nota. Cuido las consultas, los re-renders y el comportamiento cuando falla la conexión."
    },
    {
      number: "03",
      title: "Atención a la Lógica y los Detalles",
      description: "Tanto en un motor de combate RPG en Java como en un módulo de inscripciones en .NET 8, cuido el control de estados y excepciones con el mismo criterio."
    },
    {
      number: "04",
      title: "Aprender siempre y compartirlo",
      description: "Experimento con tecnologías nuevas y lo llevo al aula. Enseñar me obliga a volver a los fundamentos y a escribir código que cualquier compañero pueda entender."
    }
  ],
  teachingHighlights: [
    {
      subject: "Fundamentos y lógica de programación",
      studentsCount: "Primeros niveles",
      description: "Algoritmos, estructuras de control y resolución de problemas, explicados con ejemplos del mundo real antes de escribir código.",
      focus: ["Lógica", "Algoritmos", "Java"]
    },
    {
      subject: "POO y sistemas completos",
      studentsCount: "Niveles intermedios y avanzados",
      description: "Desde clases e interfaces hasta sistemas con frontend, backend y base de datos, usando casos reales como código heredado y trabajo en equipo.",
      focus: ["POO", "Frontend", "Backend", "Bases de datos"]
    },
    {
      subject: "Proyectos creativos en GitHub",
      studentsCount: "Evaluación",
      description: "Proyectos pequeños pensados para que cada estudiante proponga sus propias ideas, apoyándose en la IA y colaborando en repositorios de GitHub.",
      focus: ["Git / GitHub", "Trabajo en equipo", "IA como apoyo"]
    }
  ],
  certifications: [
    {
      title: "CCNAv7: Introduction to Networks / Switching & Routing / Enterprise Automation",
      issuer: "Cisco Networking Academy",
      category: "Redes & Infraestructura"
    },
    {
      title: "Fundamentos de Python (Nivel 1 y 2)",
      issuer: "Cisco / Python Institute",
      category: "Programación"
    }
  ],
  experience: [
    {
      id: 1,
      role: "Desarrollador Full Stack",
      company: "Instituto Superior Tecnológico Mayor Pedro Traversari (ISTPET)",
      period: "Mayo 2024 - Presente",
      description: "Formo parte del equipo de desarrollo de software: trabajo en análisis, base de datos, backend y frontend de las aplicaciones institucionales, incluida la app móvil oficial.",
      achievements: [
        "Desarrollé y publiqué en Google Play Store la app móvil «Mi ISTPET» (React Native Expo | .NET 8), que digitalizó el carnet estudiantil con código QR y consultas en vivo.",
        "Modernicé el ERP Académico Institucional (Gacad) con C#, Angular y Clean Architecture/CQRS sobre bases de datos heredadas, para matrículas y distributivos docentes.",
        "Implementé el Sistema Integrado de Recursos Humanos en Angular y .NET 8 con MySQL, para contratos y expedientes digitales.",
        "Desarrollé la Bolsa de Empleo institucional, AMMI Online y la automatización del reglamento de becas (Bienestar Institucional).",
        "Configuré pipelines CI/CD en Azure DevOps con Git Flow y documenté las APIs RESTful con Swagger."
      ],
      technologies: [".NET 8", "C#", "Angular", "React Native", "Expo", "Clean Architecture", "CQRS", "MySQL", "Azure DevOps"]
    },
    {
      id: 2,
      role: "Docente — Carrera de Desarrollo de Software",
      company: "Instituto Superior Tecnológico Mayor Pedro Traversari",
      period: "2025 - Presente",
      description: "Docente colaborador en la carrera de Desarrollo de Software. Las materias varían por período: desde fundamentos y lógica hasta sistemas completos con frontend, backend y base de datos.",
      achievements: [
        "Explico cada tema con ejemplos del mundo real y casos del trabajo diario (equipos, código heredado).",
        "Evalúo con proyectos pequeños y creativos que los estudiantes desarrollan en equipo en GitHub, con la IA como apoyo.",
        "Acompaño proyectos de fin de ciclo; los materiales de clase se comparten en el EVA institucional."
      ],
      technologies: ["POO", "Java", "C#", "Algoritmos", "Git / GitHub", "Clean Code"]
    },
    {
      id: 3,
      role: "Desarrollador Full Stack (Proyectos Sectoriales)",
      company: "Club Deportivo Miguel Iturralde (CDMI) & SIAT / AvialB",
      period: "2023 - 2024",
      description: "Desarrollo de soluciones web y móviles para gestión deportiva y peritaje vial de campo.",
      achievements: [
        "Scorecraft (CDMI): Diseñé y desarrollé la plataforma en C# y Angular para centralizar métricas deportivas, inscripciones y fichas médicas.",
        "AvialB / SIAT: Diseñé un ecosistema offline-first (Ionic, Angular, C#) con sincronización asíncrona local-servidor para el levantamiento de accidentes en campo sin conexión."
      ],
      technologies: ["C#", ".NET Core", "Angular", "Ionic", "Offline-First", "SQL Server"]
    },
    {
      id: 4,
      role: "Pasante Desarrollador Móvil",
      company: "Universidad de Especialidades Turísticas (UDET)",
      period: "Marzo 2022 - Marzo 2023",
      description: "Desarrollo de aplicación móvil multiplataforma en Xamarin e integración de servicios RESTful institucionales.",
      achievements: [
        "Construcción de módulos móviles multiplataforma en Xamarin.",
        "Integración de endpoints RESTful para consulta de trámites universitarios."
      ],
      technologies: ["Xamarin", "C#", ".NET", "RESTful APIs"]
    }
  ],
  education: [
    {
      id: 1,
      degree: "Ingeniería en Software",
      institution: "Universidad Politécnica Salesiana (UPS, Quito)",
      status: "En curso"
    },
    {
      id: 2,
      degree: "Tecnólogo Superior en Desarrollo de Software",
      institution: "Instituto Superior Tecnológico Mayor Pedro Traversari (ISTPET)",
      status: "Graduado / Título Profesional"
    }
  ],
  skills: {
    frontend: ["Angular 17+", "React", "React Native (Expo)", "Ionic", "TypeScript", "JavaScript", "Tailwind CSS"],
    backend: [".NET 8 / C#", "CQRS & Clean Architecture", "RESTful APIs", "Java (Spring/Core)", "Python", "Microservicios"],
    desktop: ["C# .NET Desktop", "Java Swing (POO)", "SQLite Local Storage", "LINQ"],
    databases: ["MySQL", "SQL Server", "SQLite", "PostgreSQL"],
    architecture: ["Azure DevOps", "CI/CD Pipelines", "Docker", "Git & Git Flow", "Scrum", "OpenAPI (Swagger)"]
  },
  projects: [
    {
      id: 1,
      title: "Mi ISTPET — App Móvil Estudiantil (Google Play)",
      client: "Instituto Superior Tecnológico Traversari",
      role: "Desarrollé la app móvil y su API en .NET, y la publiqué en Google Play.",
      category: "mobile",
      description: "Aplicación móvil oficial publicada en Google Play Store. Digitalizó el carnet estudiantil con código QR dinámico e incluye horarios, notas y notificaciones push en tiempo real.",
      longDescription: "Plataforma académica móvil oficial construida en React Native Expo (New Architecture - Fabric) y backend en .NET 8 con Clean Architecture y CQRS. Da a la comunidad estudiantil y docente acceso a su carnet digital seguro mediante firmas criptográficas HMAC-SHA256 offline, calificaciones y cronogramas.",
      problem: "Uso de credenciales de PVC propensas a falsificación/deterioro, gasto recurrente en impresión física y falta de un canal móvil oficial para consultar horarios y calificaciones en vivo con validación offline en accesos de portería.",
      decision: "Desarrollé la aplicación con Expo SDK 54 / React Native y .NET 8 Web API. Diseñé un algoritmo de carnet con token QR temporal firmado con HMAC-SHA256, permitiendo validación en portería sin depender de conectividad constante a internet.",
      tradeoff: "Implementar validación offline requirió sincronización de llaves simétricas y timestamps con ventana de tolerancia en el escáner de portería.",
      impact: "Publicada en Google Play Store como canal móvil oficial: el carnet digital es una alternativa al carnet físico de PVC y las notas y horarios se consultan desde el teléfono.",
      architectureOverview: "Clean Architecture en .NET 8 con CQRS (MediatR), autenticación JWT, sincronización local y cifrado de llaves en SecureStore.",
      securityAndCompliance: "Firmas criptográficas HMAC-SHA256 para códigos QR que expiran periódicamente, dificultando el uso de capturas de pantalla estáticas. Diseñado considerando la LOPDP y las políticas de Google Play.",
      keyFeatures: [
        "Carnet estudiantil digital con código QR dinámico y validación biométrica/PIN",
        "Consulta de récord de calificaciones parciales y distributivo de materias en vivo",
        "Módulo de avisos institucionales, notificaciones push y eventos de bienestar",
        "Persistencia segura en almacenamiento cifrado del dispositivo (SecureStore)"
      ],
      ndaDisclaimer: "Documentación basada exclusivamente en arquitectura pública y tecnologías implementadas. No se exponen credenciales ni datos privados de estudiantes.",
      metrics: ["Google Play Store", "Carnet QR Offline", ".NET 8 + Expo", "Carnet Digital"],
      image: asset("assets/projects/evidencias/mi_home.webp"),
      technologies: ["React Native", "Expo SDK 54", "TypeScript", ".NET 8", "C#", "CQRS", "MediatR", "HMAC-SHA256", "Google Play"],
      architectureBadges: ["Mobile App", "Google Play Store", "QR Criptográfico", "Clean Architecture", "CQRS"],
      liveUrl: "https://play.google.com/store/apps/details?id=com.istpet.miistpet",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true,
      screenshots: [
        { url: asset("assets/projects/evidencias/mi_home.webp"), title: "Inicio del estudiante", caption: "Captura con datos ficticios: saludo, período vigente y avance en la carrera" },
        { url: asset("assets/projects/evidencias/mi_calificaciones.webp"), title: "Calificaciones por nivel", caption: "Captura con datos ficticios: notas por asignatura y promedio general" },
        { url: asset("assets/projects/mi_istpet_app_login.webp"), title: "Inicio de sesión", caption: "Acceso con cédula o usuario institucional" }
      ],
      architectureFlow: {
        title: "Flujo de Autenticación & Validación de Carnet QR Offline",
        description: "El cliente móvil solicita un token criptográfico HMAC-SHA256 que se genera en .NET 8 y se valida localmente en portería sin necesidad de conexión permanente.",
        pattern: "Clean Architecture + CQRS + HMAC-SHA256 Offline Token Generator",
        nodes: [
          { id: "mobile", label: "📱 Expo React Native", sub: "New Architecture (Fabric)", tag: "Cliente Móvil" },
          { id: "api", label: "⚙️ .NET 8 API Gateway", sub: "Controllers & JWT Auth", tag: "Backend" },
          { id: "mediatr", label: "🔀 MediatR Pipeline", sub: "CQRS Handlers & Validation", tag: "Application" },
          { id: "qrEngine", label: "🔐 HMAC-SHA256 Engine", sub: "Generador de QR Seguro", tag: "Criptografía" },
          { id: "db", label: "🗄️ MySQL sigafi_es", sub: "EF Core 8 Pomelo", tag: "Persistencia" }
        ],
        connections: [
          { from: "mobile", to: "api", label: "HTTPS / JWT" },
          { from: "api", to: "mediatr", label: "Send(Query)" },
          { from: "mediatr", to: "qrEngine", label: "Firmar Payload" },
          { from: "mediatr", to: "db", label: "Consultar Alumno" }
        ]
      }
    },
    {
      id: 2,
      title: "Sistema de Titulación ISTPET — Gestión de Defensas & Actas",
      client: "Instituto Superior Tecnológico Traversari",
      role: "Desarrollador Full Stack del equipo: backend en .NET y frontend en Angular.",
      category: "web",
      description: "Plataforma para postulaciones de grado, asignación de tribunales docentes, calendario de defensas y actas con Angular 22 y .NET 8.",
      longDescription: "Sistema desarrollado con Clean Architecture en .NET 8 y frontend desacoplado en Angular 22 (Zoneless con Signals y arquitectura Hexagonal por Ports & Adapters). Controla todo el ciclo de graduación, desde la validación de prerrequisitos académicos hasta la calificación y emisión del acta de grado.",
      problem: "Proceso manual de asignación de tribunales con frecuentes conflictos de horarios de docentes, demoras en la validación de requisitos y falta de trazabilidad en las actas de defensa de grado.",
      decision: "Implementé una arquitectura limpia con separación estricta de capas: Backend con CQRS, MediatR, FluentValidation y autorización basada en permisos `[HasPermission]`; Frontend con stores reactivos basados en Signals y puertos desacoplados de HTTP.",
      tradeoff: "Curva inicial de implementación de arquitectura hexagonal en frontend, compensada por tests unitarios aislados y bajo acoplamiento entre capas.",
      impact: "Centraliza las postulaciones de grado en una sola bandeja, ayuda a asignar tribunales sin cruces de horario y genera las actas automáticamente.",
      architectureOverview: "Clean Architecture en backend (.NET 8 WebApi, Application, Domain, Infrastructure con Pomelo MySQL) y Hexagonal en Frontend (Domain Ports, Application Signal Stores, Infrastructure HTTP Adapters, Presentation OnPush).",
      securityAndCompliance: "Autorización RBAC granular a nivel de permisos específicos (ej. `titulacion:tribunal:asignar`), validación de cédulas ecuatorianas y hashing de contraseñas.",
      keyFeatures: [
        "Bandeja de postulantes con control de estados (Revisión, Asignación Tribunal, Programado, Calificado)",
        "Motor de asignación de docentes a tribunales con detección automática de cruces de horario",
        "Generador de actas de grado en PDF y registro de notas de sustentación",
        "Frontend en Angular 22 sin Zone.js, con estado basado en Signals"
      ],
      ndaDisclaimer: "Estructura arquitectónica y patrones presentados respetando la privacidad institucional y los estándares de seguridad.",
      metrics: ["Angular 22 Zoneless", ".NET 8 Clean Arch", "CQRS & MediatR", "RBAC Granular"],
      image: asset("assets/projects/evidencias/tit_dashboard.webp"),
      technologies: ["Angular 22", "Signals", "TypeScript", ".NET 8", "C#", "Clean Architecture", "CQRS", "MediatR", "FluentValidation", "MySQL 5.7"],
      architectureBadges: ["Clean Architecture", "Hexagonal Frontend", "CQRS Pattern", "Signals Reactive"],
      liveUrl: "#",
      githubUrl: "https://github.com/JosephBano/titulacion-istpet",
      isFeatured: true,
      screenshots: [
        { url: asset("assets/projects/evidencias/tit_dashboard.webp"), title: "Vista general del proceso", caption: "Captura con datos ficticios: totales de postulaciones, aprobadas y en revisión" },
        { url: asset("assets/projects/evidencias/tit_bandeja.webp"), title: "Bandeja de postulaciones", caption: "Captura con datos ficticios: estado y requisitos cumplidos por estudiante" },
        { url: asset("assets/projects/evidencias/tit_alumnos.webp"), title: "Estudiantes aptos para titulación", caption: "Captura con datos ficticios: filtro por modalidad, período y estado" }
      ],
      architectureFlow: {
        title: "Arquitectura Hexagonal & Clean Architecture (.NET 8 + Angular 22)",
        description: "El frontend desacopla la lógica de negocio mediante puertos e inyección de dependencias, mientras el backend implementa CQRS con MediatR sobre MySQL legacy.",
        pattern: "Clean Architecture (WebApi -> Application -> Domain <- Infrastructure)",
        nodes: [
          { id: "feDomain", label: "📦 Angular Domain Ports", sub: "InjectionTokens & Interfaces", tag: "Frontend" },
          { id: "feStore", label: "⚡ Signal Stores", sub: "Application State (Zoneless)", tag: "Frontend" },
          { id: "api", label: "🛡️ WebApi [HasPermission]", sub: "REST Controllers /auth, /titulacion", tag: "Backend" },
          { id: "cqrs", label: "🔄 MediatR CQRS", sub: "Commands, Handlers, FluentValidation", tag: "Backend" },
          { id: "db", label: "🗄️ SigafiDbContext", sub: "Pomelo EF Core / MySQL 5.7", tag: "Persistencia" }
        ],
        connections: [
          { from: "feStore", to: "feDomain", label: "Invoca Puerto" },
          { from: "feStore", to: "api", label: "HTTP / JWT" },
          { from: "api", to: "cqrs", label: "Send(Command)" },
          { from: "cqrs", to: "db", label: "Persiste Estado" }
        ]
      }
    },
    {
      id: 3,
      title: "Bienestar Institucional — Sistema de Becas & Convenios",
      client: "Instituto Superior Tecnológico Traversari",
      role: "Desarrollador Full Stack del equipo: backend en .NET, frontend en Angular y generación de documentos.",
      category: "web",
      description: "Plataforma para digitalizar becas, convenios de pago y seguimiento académico con Angular 21, .NET 8 y generación de documentos Word/PDF.",
      longDescription: "Sistema web institucional desarrollado en Angular 21 (Signals, standalone components) y ASP.NET Core 8 Web API sobre MySQL 5.7 (SIGAFI). Automatiza la evaluación baremada de solicitudes de beca, convenios de pago por cuotas y generación dinámica de resoluciones oficiales con MiniWord y QuestPDF.",
      problem: "Evaluación manual de postulaciones a becas con expedientes físicos, retrasos en la redacción de resoluciones oficiales y falta de seguimiento a convenios de pago.",
      decision: "Diseñé un motor algorítmico de baremación socioeconómica (ponderación 60% vulnerabilidad / 40% mérito académico) con generación automatizada de documentos `.docx` y `.pdf` a partir de plantillas institucionales.",
      tradeoff: "Generar documentos en el servidor con MiniWord y QuestPDF en lugar de hacerlo en el cliente para garantizar la inmutabilidad de sellos y formatos legales.",
      impact: "El trámite de becas pasa de expedientes físicos a un flujo digital, y las resoluciones oficiales se generan desde plantillas en lugar de redactarse a mano.",
      architectureOverview: "Arquitectura por servicios e interfaces en .NET 8, middleware de auditoría de transacciones, integración directa con `sigafi_esContext` y frontend reactivo con Angular Signals.",
      securityAndCompliance: "Control de acceso basado en roles (Bienestar, Secretaría, Rectorado), auditoría de cambios en resoluciones y tratamiento de datos socioeconómicos considerando la LOPDP.",
      keyFeatures: [
        "Motor de puntuación algorítmica para asignación transparente de becas",
        "Generador de resoluciones oficiales en `.docx` con MiniWord desde plantillas",
        "Emisión de convenios de pago en PDF de alta fidelidad compilados por código con QuestPDF",
        "Módulo de seguimiento y alertas tempranas para estudiantes con riesgo académico"
      ],
      ndaDisclaimer: "Datos socioeconómicos de alumnos protegidos. La documentación detalla exclusivamente los componentes técnicos y la arquitectura de software.",
      metrics: ["Angular 21 Signals", ".NET 8 Web API", "MiniWord + QuestPDF", "Baremación Auto"],
      image: asset("assets/projects/evidencias/bien_catalogo.webp"),
      technologies: ["Angular 21", "Signals", "TypeScript", ".NET 8", "C#", "Entity Framework Core", "Pomelo MySQL", "MiniWord", "QuestPDF", "MailKit"],
      architectureBadges: ["Document Automation", "Algorithmic Scoring", "Angular Signals", ".NET 8 Web API"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true,
      screenshots: [
        { url: asset("assets/projects/evidencias/bien_catalogo.webp"), title: "Catálogos de becas", caption: "Captura con datos ficticios: motivos, porcentajes y requisitos asociados" },
        { url: asset("assets/projects/evidencias/bien_convocatorias.webp"), title: "Cronograma de la convocatoria", caption: "Captura con datos ficticios: etapas del proceso con sus fechas" },
        { url: asset("assets/projects/evidencias/bien_solicitudes.webp"), title: "Solicitudes de becas", caption: "Captura con datos ficticios: bandeja filtrable por estado" },
        { url: asset("assets/projects/evidencias/bien_jurado.webp"), title: "Revisión del tribunal", caption: "Captura con datos ficticios: votos emitidos y avance de cada expediente" }
      ],
      architectureFlow: {
        title: "Pipeline de Baremación & Generación de Documentos Oficiales",
        description: "El estudiante postula en Angular 21; el backend calcula el score algorítmico y compila resoluciones oficiales Word y PDF sin depender de software ofimático en el servidor.",
        pattern: "Service + Interface Pattern con Document Generation Pipeline",
        nodes: [
          { id: "fe", label: "🅰️ Angular 21 SPA", sub: "Standalone + Signals", tag: "Frontend" },
          { id: "api", label: "⚙️ BecasController", sub: "ASP.NET Core 8 Web API", tag: "Backend" },
          { id: "scoring", label: "🧮 BaremacionService", sub: "Ponderación Socioeconómica", tag: "Lógica Negocio" },
          { id: "docs", label: "📄 MiniWord & QuestPDF", sub: "Generador de Docx / PDF", tag: "Documentos" },
          { id: "db", label: "🗄️ MySQL sigafi_es", sub: "Pomelo EF Core 8", tag: "Base de Datos" }
        ],
        connections: [
          { from: "fe", to: "api", label: "POST /postulacion" },
          { from: "api", to: "scoring", label: "Calcular Puntaje" },
          { from: "scoring", to: "docs", label: "Renderizar Resolución" },
          { from: "api", to: "db", label: "Guardar Resolución" }
        ]
      }
    },
    {
      id: 4,
      title: "GAcad — ERP de Gestión Académica & Horarios ISTPET",
      client: "Instituto Superior Tecnológico Traversari",
      role: "Desarrollador Full Stack del equipo: validación de horarios y panel de control.",
      category: "web",
      description: "Sistema web para cronogramas institucionales, distributivos docentes y detección automática de conflictos en horarios de clase.",
      longDescription: "Modernización del sistema académico institucional desarrollada en Angular 21 y .NET 8 Web API con soporte para tareas en segundo plano mediante Hangfire y autenticación centralizada mediante llaves públicas RSA (AuthGlobal).",
      problem: "Cruce de horarios docentes y saturación de aulas durante la planificación semestral, además de demoras en la validación de horas de dedicación de profesores.",
      decision: "Desarrollé un motor de validación matricial en C# .NET 8 que comprueba en tiempo real colisiones entre profesores, grupos de estudiantes y aulas físicas.",
      tradeoff: "Validación matricial en tiempo de ejecución en memoria para mantener una respuesta rápida frente a consultas recurrentes.",
      impact: "Detecta los cruces de horario antes de guardarlos y da a la coordinación una vista clara de cobertura docente y vacantes por carrera.",
      architectureOverview: "Arquitectura basada en Service + Interface Pattern con inyección de dependencias, base de datos MySQL 5.7 heredada y background workers con Hangfire.",
      securityAndCompliance: "Autenticación RSA asimétrica con tokens JWT validados contra AuthGlobal; almacenamiento seguro de sesiones exclusivamente en memoria.",
      keyFeatures: [
        "Planificación de cronogramas académicos con seguimiento de hitos institucionales",
        "Matriz interactiva de horarios con detección automática de conflictos en aulas y docentes",
        "Cálculo y control de límites de dedicación docente (Tiempo Completo / Tiempo Parcial)",
        "Integración transparente con esquemas relacionales históricos de SIGAFI"
      ],
      ndaDisclaimer: "Se documentan algoritmos de detección de colisiones y diseño de software sin divulgar datos de la planta docente ni credenciales.",
      metrics: ["Angular 21", ".NET 8 Web API", "Hangfire Worker", "Detección de Cruces"],
      image: asset("assets/projects/evidencias/gacad_admin.webp"),
      technologies: ["Angular 21", "TypeScript", ".NET 8", "C#", "MySQL 5.7", "Hangfire", "Serilog", "RSA JWT"],
      architectureBadges: ["ERP Académico", "Conflict Detection", "Hangfire Jobs", "RSA Security"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true,
      screenshots: [
        { url: asset("assets/projects/evidencias/gacad_admin.webp"), title: "Panel de control académico", caption: "Captura con datos ficticios: docentes, asignaciones, horarios y cobertura por carrera" },
        { url: asset("assets/projects/evidencias/gacad_admin_full.webp"), title: "Panel completo con alertas de planificación", caption: "Captura con datos ficticios: carga horaria y cursos con vacantes" }
      ],
      architectureFlow: {
        title: "Motor de Detección de Conflictos & Hangfire Workers",
        description: "Cada asignación de bloque horario se valida contra docente, aula y grupo antes de persistirse en la base de datos.",
        pattern: "Service Interface Pattern + Background Sync Worker",
        nodes: [
          { id: "fe", label: "🅰️ Angular 21 Frontend", sub: "Signals & Drag-Drop Grid", tag: "Frontend" },
          { id: "api", label: "⚙️ HorariosController", sub: ".NET 8 Web API", tag: "Backend" },
          { id: "conflict", label: "🛡️ ConflictValidationEngine", sub: "Docente · Aula · Grupo", tag: "Algoritmo" },
          { id: "hangfire", label: "⏱️ Hangfire Jobs", sub: "Procesamiento Asíncrono", tag: "Worker" },
          { id: "db", label: "🗄️ MySQL sigafi_es", sub: "GAcadDbContext", tag: "Persistencia" }
        ],
        connections: [
          { from: "fe", to: "api", label: "POST /horarios/asignar" },
          { from: "api", to: "conflict", label: "Validar Cruces" },
          { from: "conflict", to: "db", label: "Commit Transacción" },
          { from: "api", to: "hangfire", label: "Encolar Notificación" }
        ]
      }
    },
    {
      id: 5,
      title: "GRECUH — Sistema de Recursos Humanos & Credencialización",
      client: "Instituto Superior Tecnológico Traversari",
      role: "Desarrollador Full Stack del equipo: contratos, expediente digital y credenciales.",
      category: "web",
      description: "Plataforma web para contratos laborales, expediente digital, credenciales docentes en alta resolución con SkiaSharp e integración con SharePoint.",
      longDescription: "Sistema integral de talento humano construido en Angular 20 (PrimeNG + TailwindCSS) y backend .NET 8 con Entity Framework Core Code First. Gestiona contratos docentes semestrales, archivo digital en la nube institucional de SharePoint y renderizado de carnets de PVC con SkiaSharp.",
      problem: "Gestión dispersa de contratos físicos de profesores, demora en la generación manual de carnets institucionales y falta de repositorio digital seguro para expedientes docentes.",
      decision: "Implementé una solución que automatiza la redacción de contratos, conecta con Microsoft SharePoint para archivo documental y utiliza la librería SkiaSharp en .NET 8 para generar carnets a 300 DPI con código de barras.",
      tradeoff: "Uso de renderizado gráfico nativo en servidor (SkiaSharp) que requiere calibración de píxeles exacta pero produce carnets listos para impresión en PVC sin software de diseño adicional.",
      impact: "Reúne contratos, expedientes y alertas de documentos por vencer en un solo sistema, y automatiza la emisión de credenciales.",
      architectureOverview: "Frontend Angular 20 con PrimeNG, Backend RESTful en .NET 8 (Code First), motor de imágenes SkiaSharp y conector para SharePoint.",
      securityAndCompliance: "Control estricto de accesos RBAC, protección de datos personales considerando la LOPDP y almacenamiento seguro con pistas de auditoría para cada expediente.",
      keyFeatures: [
        "Generador de credenciales de PVC a 300 DPI con SkiaSharp y códigos de barras",
        "Generación parametrizada de contratos laborales semestrales",
        "Integración con SharePoint para almacenamiento seguro y versionado de expedientes",
        "Módulo de evaluación docente por rúbricas 360°"
      ],
      ndaDisclaimer: "Los expedientes y remuneraciones docentes se mantienen confidenciales. Solo se describe la arquitectura de software y capacidades técnicas.",
      metrics: ["Angular 20 + PrimeNG", "SkiaSharp 300 DPI", "SharePoint Cloud", "Contratos Auto"],
      image: asset("assets/projects/evidencias/rrhh_dashboard.webp"),
      technologies: ["Angular 20", "PrimeNG", "Tailwind CSS", ".NET 8", "C#", "EF Core", "SkiaSharp", "SharePoint API", "PDFMake"],
      architectureBadges: ["Talento Humano", "SkiaSharp 2D", "SharePoint Cloud", "PrimeNG UI"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true,
      screenshots: [
        { url: asset("assets/projects/evidencias/rrhh_dashboard.webp"), title: "Panel de talento humano", caption: "Captura con datos ficticios: departamentos por sede y fichas completas" },
        { url: asset("assets/projects/evidencias/rrhh_docentes.webp"), title: "Gestión de personal", caption: "Captura con datos ficticios: filtros por institución, dedicación y cargo" }
      ],
      architectureFlow: {
        title: "Pipeline de Generación de Credenciales & Archivo en SharePoint",
        description: "El backend compone la imagen del carnet en alta resolución mediante SkiaSharp y sincroniza los contratos firmados con Microsoft SharePoint.",
        pattern: "REST API + SkiaSharp 2D Rendering Engine + SharePoint Connector",
        nodes: [
          { id: "fe", label: "🅰️ Angular 20 + PrimeNG", sub: "Expedientes & UI Rica", tag: "Frontend" },
          { id: "api", label: "⚙️ RRHH API .NET 8", sub: "EF Core Code First", tag: "Backend" },
          { id: "skia", label: "🎨 SkiaSharp Engine", sub: "Renderizado PVC a 300 DPI", tag: "Gráficos" },
          { id: "sp", label: "☁️ Microsoft SharePoint", sub: "Almacenamiento Cloud", tag: "Almacenamiento" },
          { id: "db", label: "🗄️ Base de Datos Relacional", sub: "Modelado Code First", tag: "Persistencia" }
        ],
        connections: [
          { from: "fe", to: "api", label: "Solicitar Carnet" },
          { from: "api", to: "skia", label: "Componer Canvas 2D" },
          { from: "api", to: "sp", label: "Archivar Contrato" },
          { from: "api", to: "db", label: "Registrar Emisión" }
        ]
      }
    },
    {
      id: 6,
      title: "Scorecraft — Plataforma Deportiva & Médica CDMI",
      client: "Club Deportivo Miguel Iturralde",
      role: "Diseñé y desarrollé la plataforma con Angular y C#.",
      category: "web",
      description: "Plataforma web para monitoreo físico, historial de lesiones, pliegues antropométricos y estadísticas de futbolistas.",
      longDescription: "Sistema integral desarrollado en Angular y .NET Core para centralizar los registros del cuerpo técnico, preparadores físicos y departamento médico del club deportivo.",
      problem: "Dispersión de registros médicos en planillas físicas, falta de correlación entre fatiga física y rendimiento en partidos oficiales.",
      decision: "Construí un panel web reactivo en Angular con backend en C# y base de datos relacional con cálculo automatizado de índices antropométricos y gráficos con Chart.js.",
      tradeoff: "Digitalización estricta de fichas médicas previa a cada jornada competitiva.",
      impact: "Centralizó el plantel de jugadores con fichas médicas y seguimiento de lesiones en un solo lugar.",
      architectureOverview: "SPA en Angular consumiendo APIs seguras en .NET con base de datos relacional y gráficos interactivos.",
      securityAndCompliance: "Aislamiento de fichas médicas confidenciales con acceso restringido exclusivamente al personal de salud.",
      keyFeatures: [
        "Ficha médica digital con control de lesiones y tratamientos",
        "Registro de métricas antropométricas (VO2 Max, porcentaje de grasa)",
        "Gestión de convocatorias, categorías deportivas y actas de partido",
        "Radares de rendimiento físico por posición táctica"
      ],
      ndaDisclaimer: "Estructura de arquitectura descrita sin revelar identidades médicas ni contratos de atletas.",
      metrics: ["Gestión Deportiva", "Fichas Médicas", "C# + Angular", "Analítica Deportiva"],
      image: asset("assets/projects/scorecraft_preview.svg"),
      technologies: ["Angular", "TypeScript", "C#", ".NET Core", "SQL Server", "Chart.js"],
      architectureBadges: ["Sports Analytics", "Health Records", "Full Stack", "Medical Data"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig",
      isFeatured: true,
      screenshots: [
        { url: asset("assets/projects/scorecraft_preview.svg"), title: "Dashboard de Monitoreo Físico", caption: "Seguimiento antropométrico, historial de lesiones y estadísticas de futbolistas" }
      ]
    },
    {
      id: 7,
      title: "DebtManager — Software Financiero C# Desktop",
      client: "Proyecto de Ingeniería Personal",
      role: "Proyecto personal: diseño y desarrollo completos.",
      category: "desktop",
      description: "Aplicación nativa de escritorio en C# .NET con SQLite cifrado local para control financiero, préstamos y amortizaciones, totalmente offline.",
      longDescription: "Herramienta de escritorio nativa enfocada en la privacidad del usuario y en una respuesta rápida. Incluye simuladores de tablas de amortización (método francés y alemán), gráficos financieros y persistencia local.",
      problem: "Dependencia constante de internet y preocupaciones de privacidad en plataformas financieras en la nube para control de cobros.",
      decision: "Implementé una solución nativa en C# con motor de base de datos SQLite embebido y consultas LINQ optimizadas para una respuesta prácticamente instantánea.",
      tradeoff: "Software de escritorio sin nube, priorizando velocidad y soberanía de los datos del usuario sobre la conveniencia de sincronizar en la nube.",
      impact: "Cálculos financieros ágiles, portabilidad en un ejecutable ligero y control de deudas totalmente offline.",
      architectureOverview: "Arquitectura en 3 capas nativa en .NET (Presentación WinForms, Lógica de Negocio Financiera y Repositorio SQLite).",
      securityAndCompliance: "Base de datos local con cifrado de archivo y sin telemetría externa, priorizando la privacidad del usuario.",
      keyFeatures: [
        "Generador de tablas de amortización con métodos francés, alemán y directo",
        "Control de cobros, vencimientos y cálculo automático de intereses",
        "Exportación de reportes a PDF y Excel con un solo clic",
        "Módulo de respaldo y restauración integral de la base de datos local"
      ],
      ndaDisclaimer: "Software desarrollado de forma autónoma con código disponible en GitHub.",
      metrics: ["Respuesta Instantánea", "Totalmente Offline", "Cifrado SQLite", "Cero Dependencias"],
      image: asset("assets/projects/debtmanager_preview.webp"),
      technologies: ["C#", ".NET Desktop", "SQLite", "LINQ", "Windows Forms"],
      architectureBadges: ["Desktop Native", "Local DB Persistence", "Finance Engine", "Totalmente Offline"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/DebtManager",
      isFeatured: true,
      screenshots: [
        { url: asset("assets/projects/debtmanager_preview.webp"), title: "Interfaz Financiera Desktop", caption: "Simulación de tablas de amortización, cobros y balances en C# nativo" }
      ]
    },
    {
      id: 8,
      title: "AvialB / SIAT — Peritaje Vial Offline-First",
      client: "Consultoría / Peritaje Vial",
      role: "Diseñé la arquitectura offline-first y desarrollé la app con Ionic, Angular y C#.",
      category: "mobile",
      description: "Ecosistema móvil y web offline-first para levantamiento de accidentes de tránsito en campo con sincronización asíncrona.",
      longDescription: "Aplicación híbrida desarrollada en Ionic, Angular y C# diseñada para peritos e investigadores viales que deben levantar información técnica en zonas rurales o carreteras sin cobertura móvil.",
      problem: "Pérdida de conectividad celular en sitios de siniestros viales y lentitud en la transcripción de partes periciales tomados en papel.",
      decision: "Diseñé una arquitectura Offline-First con base de datos local en el dispositivo y sincronización en segundo plano mediante colas de trabajo cuando se detecta conexión.",
      tradeoff: "Desarrollo de lógica personalizada de resolución de conflictos y encolamiento asíncrono para garantizar la integridad de las evidencias periciales.",
      impact: "Los informes periciales se levantan en el lugar del siniestro, con georreferenciación, aunque no haya señal.",
      architectureOverview: "Cliente híbrido Ionic/Angular con SQLite local y backend de sincronización asíncrona en C# .NET.",
      securityAndCompliance: "Inmutabilidad de marcas de tiempo y coordenadas GPS para asegurar la cadena de custodia legal de las pruebas periciales.",
      keyFeatures: [
        "Modo de trabajo totalmente desconectado, con persistencia local",
        "Captura de fotografías de daños vehiculares con geolocalización y marcas temporales",
        "Calculadora de velocidades de impacto y trayectorias basada en huellas de frenado",
        "Sincronización automática por lotes al restablecerse la conectividad"
      ],
      ndaDisclaimer: "Metodologías de inspección y arquitectura documentadas sin exponer casos judiciales ni datos personales de involucrados.",
      metrics: ["Offline-First", "Ionic + Angular", "Sync Asíncrona", "Cadena de Custodia"],
      image: asset("assets/projects/siat_preview.svg"),
      technologies: ["Ionic", "Angular", "TypeScript", "C#", ".NET Core", "SQL Server", "SQLite"],
      architectureBadges: ["Offline-First", "Field Operations", "Async Sync", "Forensics"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: false,
      screenshots: [
        { url: asset("assets/projects/siat_preview.svg"), title: "App Móvil de Peritaje Vial", caption: "Levantamiento de siniestros, fotografías georreferenciadas y colas offline" }
      ]
    },
    {
      id: 9,
      title: "RPG Journey — Motor de Juego Java POO (Swing)",
      client: "Proyecto de Lógica & Game Dev",
      role: "Proyecto personal de práctica en POO.",
      category: "desktop",
      description: "Juego de rol interactivo por turnos desarrollado en Java puro con Swing, demostrando herencia, polimorfismo, interfaces y colecciones.",
      longDescription: "Diseño desacoplado entre el modelo de lógica (`com.rpg.logica`) y la presentación gráfica (`com.rpg.gui`). Incluye clases como Guerrero, Mago, Asesino, Tanque, Soporte, Curandero con polimorfismo dinámico y custom painting para las barras de estado.",
      problem: "Diseñar un motor de combate por turnos extensible sin acoplar la interfaz visual con las fórmulas matemáticas de daño.",
      decision: "Apliqué la interfaz `AccionEspecial`, clases abstractas para los personajes y estructuras LIFO (`Stack`) para el inventario de botín.",
      tradeoff: "Mayor estructuración de clases a cambio de poder añadir nuevas clases de personajes sin modificar la interfaz gráfica.",
      impact: "Proyecto didáctico y funcional que ilustra los principios de POO pura en Java.",
      architectureOverview: "Patrón Modelo-Vista desacoplado con máquina de estados finitos (FSM) para la secuencia de turnos y polimorfismo para cálculo de habilidades.",
      securityAndCompliance: "Código abierto con fines formativos y de demostración de algoritmos en Java.",
      keyFeatures: [
        "Motor de combate por turnos con sistema de iniciativa y buffs/debuffs",
        "Jerarquía de clases polimórficas (Guerrero, Mago, Curandero, Asesino, Tanque)",
        "Manejo de inventario y pila de botín mediante estructuras LIFO (Stack)",
        "Renderizado custom de gráficos 2D y barras de vida en Java Swing"
      ],
      ndaDisclaimer: "Proyecto personal de código abierto con demostración algorítmica.",
      metrics: ["POO Pura & Swing", "Polimorfismo Dinámico", "Custom Painting", "LIFO Stacks"],
      image: asset("assets/projects/buscaminas_preview.webp"),
      technologies: ["Java", "Swing", "POO Avanzada", "Polimorfismo", "Estructuras de Datos"],
      architectureBadges: ["Game Dev POO", "Decoupled Architecture", "Java Swing", "FSM Engine"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig",
      isFeatured: false,
      screenshots: [
        { url: asset("assets/projects/buscaminas_preview.webp"), title: "Motor Gráfico Swing", caption: "Pantalla de combate por turnos y control de estados en Java" }
      ]
    },
    {
      id: 10,
      title: "Buscaminas POO Recursivo (Java Desktop)",
      client: "Proyecto Algorítmico",
      role: "Proyecto personal; lo uso como ejemplo en clases de algoritmos.",
      category: "desktop",
      description: "Juego nativo de escritorio aplicando POO y algoritmo de destape recursivo en matrices bidimensionales con control de estados.",
      longDescription: "Implementación matemática del clásico Buscaminas que gestiona la dispersión aleatoria de minas, el cálculo de casillas adyacentes y el destape en cascada mediante llamadas recursivas.",
      problem: "Manejar la expansión de casillas vacías en el tablero sin congelar la interfaz de usuario.",
      decision: "Estructuré la lógica en matrices 2D con un algoritmo recursivo de búsqueda en profundidad acotada y eventos de Swing.",
      tradeoff: "Interfaz gráfica nativa de Swing sin librerías externas para máxima portabilidad.",
      impact: "Respuesta instantánea y código limpio para fines didácticos en algoritmos.",
      architectureOverview: "Matriz bidimensional de celdas con algoritmo recursivo de inundación (Flood Fill) y despacho de eventos en Swing.",
      securityAndCompliance: "Código abierto para demostración en cátedras de algoritmos.",
      keyFeatures: [
        "Algoritmo de expansión recursiva (Flood Fill) para despeje de casillas",
        "Generación pseudoaleatoria con distribución uniforme de minas",
        "Control de cronómetro y banderas con detección de victoria/derrota",
        "Cero dependencias externas: corre en cualquier JVM estándar"
      ],
      ndaDisclaimer: "Código didáctico libre de dependencias propietarias.",
      metrics: ["Respuesta Instantánea", "Recursión en Matrices", "Swing Nativo", "Zero-Dependency"],
      image: asset("assets/projects/buscaminas_preview.webp"),
      technologies: ["Java", "Swing", "Recursividad", "Matrices 2D", "Event-Driven"],
      architectureBadges: ["Algorithmic Engine", "Recursion", "Zero-Dependency", "Matrix 2D"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig",
      isFeatured: false,
      screenshots: [
        { url: asset("assets/projects/buscaminas_preview.webp"), title: "Tablero Recursivo en Swing", caption: "Destape algorítmico de casillas en matriz 2D" }
      ]
    },
    {
      id: 11,
      title: "Bolsa de Empleo ISTPET — Portal de Ofertas Laborales",
      client: "Instituto Superior Tecnológico Traversari",
      role: "Desarrollador Full Stack del equipo: portal de estudiantes, CV y ofertas.",
      category: "web",
      description: "Portal que conecta a estudiantes y egresados con empresas: ofertas por carrera, currículum en línea y postulaciones.",
      longDescription: "Aplicación web en Angular con backend en .NET 8 (Clean Architecture, CQRS con MediatR) sobre MySQL. Los estudiantes mantienen su hoja de vida y se postulan; las empresas publican ofertas filtradas por carrera.",
      problem: "Las ofertas laborales llegaban por correo o redes sociales, sin filtro por carrera ni seguimiento de quién se postulaba.",
      decision: "Separé el portal por rol (estudiante/egresado, empresa, administrador) con autenticación JWT, y modelé ofertas con requisitos, habilidades y carreras asociadas.",
      tradeoff: "Un catálogo de habilidades y carreras centralizado exige mantenimiento, pero permite filtrar y emparejar ofertas con perfiles de forma consistente.",
      impact: "Las ofertas quedan en un solo lugar, filtrables por carrera y ciudad, y cada estudiante puede seguir el estado de sus postulaciones.",
      architectureOverview: ".NET 8 Web API con Clean Architecture, CQRS (MediatR), FluentValidation y EF Core (Pomelo MySQL); frontend Angular con rutas protegidas por rol.",
      securityAndCompliance: "Autenticación JWT separada para usuarios y empresas, contraseñas con BCrypt y datos personales tratados considerando la LOPDP.",
      keyFeatures: [
        "Buscador de ofertas con filtros por carrera, ciudad y texto",
        "Currículum en línea: formación, experiencia, referencias y habilidades",
        "Registro de empresas y publicación de ofertas con requisitos",
        "Seguimiento de postulaciones por parte del estudiante"
      ],
      ndaDisclaimer: "Las capturas usan datos ficticios. No se muestran datos reales de estudiantes ni de empresas.",
      metrics: ["Angular", ".NET 8 + CQRS", "JWT por rol", "MySQL"],
      image: asset("assets/projects/evidencias/bolsa_ofertas.webp"),
      technologies: ["Angular", "TypeScript", ".NET 8", "C#", "MediatR", "FluentValidation", "EF Core", "MySQL", "JWT"],
      architectureBadges: ["Portal Web", "Clean Architecture", "CQRS", "Roles"],
      liveUrl: "#",
      isFeatured: true,
      screenshots: [
        { url: asset("assets/projects/evidencias/bolsa_home.webp"), title: "Inicio del portal", caption: "Ofertas laborales agrupadas por carrera" },
        { url: asset("assets/projects/evidencias/bolsa_ofertas.webp"), title: "Buscador de empleo", caption: "Captura con datos ficticios: ofertas con ciudad, vacantes y salario" },
        { url: asset("assets/projects/evidencias/bolsa_perfil.webp"), title: "Currículum del estudiante", caption: "Captura con datos ficticios: datos personales y secciones del CV" }
      ]
    }
  ]
};
