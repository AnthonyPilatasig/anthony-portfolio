import type { IPortfolioData } from '../types/portfolio.types';

// BrowserRouter puts each page on its own URL path, so plain relative paths ("./assets/...")
// resolve differently per route. import.meta.env.BASE_URL is absolute and always correct.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const portfolioData: IPortfolioData = {
  personal: {
    name: "Anthony David Pilatasig Macas",
    title: "Full Stack Developer & Mobile Lead",
    subtitle: "Especializado en .NET 8, Angular, React Native y bases de datos relacionales",
    bio: "Desarrollador Full Stack con +3 años de experiencia construyendo aplicaciones web, móviles y de escritorio en el ecosistema .NET (C#), Angular y React Native. En el ISTPET lidero el desarrollo de la app oficial 'Mi ISTPET' (publicada en Google Play) y la modernización de los sistemas académicos y de recursos humanos. Además, imparto clases prácticas de programación y comparto mi afición por la lógica de videojuegos, el anime y el streaming en Twitch.",
    tagline: "Desarrollando software institucional que resuelve problemas reales; explorando lógica de videojuegos, código limpio y streaming.",
    location: "Quito, Ecuador (UTC-5)",
    email: "antpila3848@gmail.com",
    phone: "+593 98 358 8715",
    github: "https://github.com/AnthonyPilatasig",
    linkedin: "https://linkedin.com/in/anthony-pilatasig",
    twitch: "https://twitch.tv/anthony_pilatasig",
    status: "Disponible para Proyectos & Desafíos Full Stack",
    avatar: asset("assets/anthony_profile.png"),
    avatarReal: asset("assets/anthony_real.jpg"),
  },
  manifesto: [
    {
      number: "01",
      title: "Código con Sentido Práctico",
      description: "La mejor arquitectura es la que resuelve el problema real de forma simple y mantenible, sin sobreingeniería innecesaria ni complicaciones artificiales."
    },
    {
      number: "02",
      title: "Rendimiento & Experiencia de Usuario",
      description: "En web y móvil, cada milisegundo cuenta. Optimizar consultas, reducir re-renders y prever el funcionamiento offline cuando falla la conexión."
    },
    {
      number: "03",
      title: "Pasión por la Lógica y los Detalles",
      description: "Tanto al programar un motor de combate RPG en Java como al diseñar un módulo de inscripciones en .NET 8, la clave está en el control estricto de estados y excepciones."
    },
    {
      number: "04",
      title: "Aprender y Compartir en Comunidad",
      description: "Dar clases de programación refuerza los fundamentos y el hábito de escribir código limpio y legible para que cualquier compañero de equipo pueda entenderlo."
    }
  ],
  teachingHighlights: [
    {
      subject: "Paradigmas & Programación Orientada a Objetos",
      studentsCount: "Cátedra ISTPET",
      description: "Clases prácticas sobre modelado de clases, herencia, polimorfismo, interfaces y diseño desacoplado en Java y C#.",
      focus: ["POO", "Polimorfismo", "Interfaces", "Clean Code"]
    },
    {
      subject: "Algoritmos & Estructuras de Datos",
      studentsCount: "Laboratorios Prácticos",
      description: "Ejercicios de lógica computacional, matrices bidimensionales, recursividad y estructuras de datos aplicadas.",
      focus: ["Matrices 2D", "Recursión", "Lógica Algorítmica"]
    },
    {
      subject: "Buenas Prácticas & Repositorios GitHub",
      studentsCount: "Mentoría de Proyectos",
      description: "Guía a estudiantes en el uso de control de versiones con Git, trabajo colaborativo y estructura limpia de proyectos.",
      focus: ["Git / GitHub", "Code Review", "Estructura Modular"]
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
      role: "Desarrollador Full Stack & Mobile Lead",
      company: "Instituto Superior Tecnológico Mayor Pedro Traversari (ISTPET)",
      period: "Mayo 2024 - Presente",
      description: "Lidero el desarrollo de las aplicaciones institucionales clave, incluyendo la app móvil oficial y la modernización de los sistemas core de la institución.",
      achievements: [
        "Desarrollé y publiqué en Google Play Store la app móvil 'Mi ISTPET' (React Native Expo | .NET 8), digitalizando al 100% el carnet estudiantil con código QR y consultas en vivo.",
        "Modernicé el ERP Académico Institucional (Gacad) con C#, Angular y Clean Architecture/CQRS sobre bases de datos legacy para matrículas y distributivos docentes.",
        "Implementé el Sistema Integrado de Recursos Humanos en Angular y .NET 8 con MySQL para contratos y expedientes digitales.",
        "Desarrollé la Bolsa de Empleo institucional, AMMI Online y la automatización del reglamento de becas (Bienestar Institucional).",
        "Configuré pipelines CI/CD en Azure DevOps con Git Flow y especificación de APIs RESTful en Swagger."
      ],
      technologies: [".NET 8", "C#", "Angular", "React Native", "Expo", "Clean Architecture", "CQRS", "MySQL", "Azure DevOps"]
    },
    {
      id: 2,
      role: "Docente Técnico Superior — Área de Desarrollo de Software",
      company: "Instituto Superior Tecnológico Mayor Pedro Traversari",
      period: "Octubre 2025 - Presente",
      description: "Imparto cátedras prácticas sobre algoritmos, programación orientada a objetos y evaluación de proyectos de software en Git y GitHub.",
      achievements: [
        "Instrucción práctica sobre diseño e implementación de paradigmas algorítmicos y POO.",
        "Fomento de buenas prácticas de ingeniería evaluando proyectos y repositorios en GitHub.",
        "Mentoría técnica para proyectos estudiantiles de fin de ciclo."
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
        "Scorecraft (CDMI): Creé de forma integral la plataforma en C# y Angular para centralizar métricas deportivas, inscripciones y fichas médicas.",
        "AvialB / SIAT: Diseñé un ecosistema offline-first (Ionic, Angular, C#) con sincronización asíncrona local-servidor para levantamiento de accidentes en campo sin internet."
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
      title: "Mi ISTPET — App Móvil Estudiantil (Play Store)",
      client: "Instituto Superior Tecnológico Traversari",
      category: "mobile",
      description: "Aplicación móvil oficial publicada en Google Play Store. Digitalizó el carnet estudiantil con código QR e incluye horarios, notas y pagos en vivo.",
      longDescription: "Plataforma móvil oficial desarrollada en React Native Expo y backend en .NET 8. Provee a la comunidad estudiantil de un carnet digital con validación biométrica/QR, consulta de notas, horarios en tiempo real y trámites administrativos.",
      problem: "Dependencia de carnets plásticos físicos susceptibles a pérdida o falsificación, y ausencia de un canal móvil institucional para que los estudiantes consulten calificaciones y cronogramas académicos en vivo.",
      decision: "Desarrollé la aplicación en React Native Expo con consumo de microservicios RESTful en ASP.NET Core (.NET 8). Implementé renderizado de carnet dinámico con código QR con firma temporal para validación física en porterías y eventos.",
      tradeoff: "Se optó por React Native con TypeScript sobre desarrollo nativo dual para asegurar paridad de características y reducir a la mitad el tiempo de despliegue y mantenimiento.",
      impact: "Publicación exitosa en Google Play Store; digitalización del 100% de carnets estudiantiles con reducción total del gasto de impresión física.",
      architectureOverview: "Clean Architecture con API Gateway ligera en ASP.NET Core (.NET 8), autenticación JWT segura con renovación automática de tokens y almacenamiento local protegido mediante SecureStore.",
      securityAndCompliance: "Criptografía simétrica con ventana de validez temporal en el QR para impedir clonación por captura de pantalla. Cumplimiento con políticas de Google Play Store y directivas institucionales de privacidad de datos.",
      keyFeatures: [
        "Carnet estudiantil digital con código QR dinámico y verificación de estado en portería",
        "Consulta de récord académico, notas parciales y distributivo de materias en tiempo real",
        "Módulo de notificaciones push institucionales y avisos de bienestar estudiantil",
        "Autenticación segura con JWT y persistencia en almacenamiento cifrado del dispositivo"
      ],
      ndaDisclaimer: "Esta ficha documenta exclusivamente los patrones de arquitectura y tecnologías públicas. No se divulgan credenciales, llaves de API ni registros confidenciales de estudiantes.",
      metrics: ["Google Play Store", "Carnet QR Digital", ".NET 8 + Expo", "100% Digitalizado"],
      image: asset("assets/projects/mi_istpet_preview.jpg"),
      technologies: ["React Native", "Expo", "TypeScript", ".NET 8", "C#", "MySQL", "JWT", "Google Play"],
      architectureBadges: ["Mobile App", "Google Play Store", "QR Criptográfico", "Clean Architecture"],
      liveUrl: "https://play.google.com/store/apps",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true
    },
    {
      id: 2,
      title: "Gacad — ERP Académico Institucional (Core ISTPET)",
      client: "Instituto Superior Tecnológico Traversari",
      category: "web",
      description: "Sistema web core para la gestión integral de matrículas, distributivos docentes, asignación de aulas y actas de calificaciones.",
      longDescription: "Modernización del sistema académico institucional. Diseñado sobre una arquitectura desacoplada con Clean Architecture y patrón CQRS, integrándose eficazmente con bases de datos relacionales históricas.",
      problem: "Cuellos de botella durante los periodos de matriculación masiva, lentitud en la generación de actas de notas y alto acoplamiento en módulos legados.",
      decision: "Implementé la modernización del backend en C# .NET 8 aplicando el patrón CQRS con MediatR y frontend SPA modular en Angular 17, desacoplando totalmente las operaciones de lectura optimizada de las escrituras transaccionales.",
      tradeoff: "Mayor cantidad de clases (Commands, Queries, Handlers, DTOs) a cambio de estabilidad garantizada, ausencia de bloqueos de tabla y velocidad en consultas masivas.",
      impact: "Reducción del tiempo de respuesta en consultas de notas de 1.8s a <95ms; automatización del 100% de distributivos docentes y actas de calificaciones.",
      architectureOverview: "Clean Architecture en 4 capas (Presentación, Aplicación con CQRS/MediatR, Dominio y Persistencia con Entity Framework Core).",
      securityAndCompliance: "Control de acceso basado en roles (RBAC) con permisos granulares para docentes, secretaría y directores de carrera; auditoría inmutable de calificaciones.",
      keyFeatures: [
        "Motor de matriculación en línea con validación de prerrequisitos y cupos por aula",
        "Generador y gestor de distributivos docentes con cálculo automático de horas clase",
        "Emisión y firma de actas de calificaciones con trazabilidad de cambios",
        "Integración transparente con esquemas de base de datos relacional heredados"
      ],
      ndaDisclaimer: "La documentación se centra en la arquitectura de software (CQRS, Clean Architecture). Los nombres de esquemas y datos sensibles han sido protegidos.",
      metrics: ["Clean Architecture", "CQRS Pattern", "< 95ms Respuesta", "Concurrencia Alta"],
      image: asset("assets/projects/gacad_preview.jpg"),
      technologies: ["Angular 17", "TypeScript", "C#", ".NET 8", "SQL Server", "Clean Architecture", "CQRS", "MediatR"],
      architectureBadges: ["Core Académico", "Clean Architecture", "CQRS Pattern", "High Concurrency"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true
    },
    {
      id: 3,
      title: "Sistema Integrado de Recursos Humanos (ISTPET)",
      client: "Instituto Superior Tecnológico Traversari",
      category: "web",
      description: "Plataforma web para control de contratos laborales, expediente digital del personal, evaluaciones de desempeño y gestión docente.",
      longDescription: "Módulo administrativo integral desarrollado en Angular y .NET 8 con base de datos MySQL. Unifica el ciclo de vida del personal administrativo y docente con control de roles y expediente digital.",
      problem: "Gestión dispersa de contratos semestrales, expedientes físicos de docentes y dificultad para consolidar evaluaciones de desempeño institucionales.",
      decision: "Diseñé una plataforma web en Angular y C# .NET 8 con repositorio seguro de documentos, autenticación JWT, control de accesos RBAC y generación parametrizada de contratos.",
      tradeoff: "Flujos de validación documental más estrictos para garantizar la validez legal e institucional de cada expediente digital.",
      impact: "Reducción de 15 días a 24 horas en la consolidación de contratos docentes; digitalización y trazabilidad total del personal institucional.",
      architectureOverview: "Arquitectura multicapa con servicios RESTful en .NET 8, capas de persistencia en MySQL y frontend modular con componentes desacoplados.",
      securityAndCompliance: "Protección de datos personales conforme a la LOPDP; control estricto de roles administrativos y pistas de auditoría para cada expediente.",
      keyFeatures: [
        "Generación automática y parametrizada de contratos de trabajo semestrales",
        "Expediente digital centralizado con almacenamiento seguro y versionado de documentos",
        "Módulo de evaluación docente por rúbricas 360° (autoevaluación, pares y estudiantes)",
        "Panel de control y reportería para Dirección de Talento Humano"
      ],
      ndaDisclaimer: "Información tratada bajo principios de confidencialidad y LOPDP. Solo se describen componentes de software y diseño arquitectónico.",
      metrics: ["Trazabilidad 100%", "Expediente Digital", "MySQL + .NET 8", "LOPDP Compliant"],
      image: asset("assets/projects/microservices_preview.jpg"),
      technologies: ["Angular", "TypeScript", "C#", ".NET 8", "MySQL", "JWT", "RESTful APIs"],
      architectureBadges: ["Enterprise RRHH", "Digital Records", "RBAC Security", "LOPDP"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true
    },
    {
      id: 4,
      title: "Scorecraft — Plataforma Deportiva & Médica CDMI",
      client: "Club Deportivo Miguel Iturralde",
      category: "web",
      description: "Plataforma web integral para gestión de métricas deportivas, inscripciones de jugadores y seguimiento de fichas médicas.",
      longDescription: "Sistema desarrollado de inicio a fin (análisis de dominio, base de datos relacional, C# y Angular) para centralizar la información deportiva, control de entrenamientos y fichas de salud de los deportistas.",
      problem: "Uso de planillas en papel y falta de centralización entre el cuerpo técnico, preparadores físicos y departamento médico para monitorear el estado de los futbolistas.",
      decision: "Construí un panel web reactivo en Angular con backend .NET y base de datos relacional para seguimiento antropométrico, historial de lesiones y estadísticas de partidos.",
      tradeoff: "Capacitación requerida para el equipo técnico para reemplazar planillas analógicas por registros digitales en tiempo real.",
      impact: "Centralización integral de las fichas médicas y deportivas de los jugadores del club con reportería automatizada.",
      architectureOverview: "SPA interactiva en Angular consumiendo APIs seguras en .NET Core con almacenamiento relacional estructurado.",
      securityAndCompliance: "Aislamiento de fichas médicas confidenciales con acceso restringido exclusivamente al personal de salud deportivo.",
      keyFeatures: [
        "Ficha médica digital con control de lesiones, tratamientos y aptitud física",
        "Registro de métricas antropométricas y seguimiento del rendimiento en entrenamientos",
        "Gestión de fichajes, categorías deportivas y actas de partidos",
        "Módulo de reportes gráficos para directores técnicos"
      ],
      ndaDisclaimer: "Estructura de arquitectura descrita sin revelar identidades médicas ni contratos de atletas.",
      metrics: ["Gestión Deportiva", "Fichas Médicas", "C# + Angular", "Analítica Deportiva"],
      image: asset("assets/projects/gacad_preview.jpg"),
      technologies: ["Angular", "TypeScript", "C#", ".NET Core", "SQL Server", "Chart.js"],
      architectureBadges: ["Sports Analytics", "Health Records", "Full Stack", "Medical Data"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig",
      isFeatured: true
    },
    {
      id: 5,
      title: "DebtManager — Software Financiero C# Desktop",
      client: "Proyecto de Ingeniería Personal",
      category: "desktop",
      description: "Aplicación nativa de escritorio en C# .NET con SQLite cifrado local para control financiero, préstamos y amortizaciones sin internet.",
      longDescription: "Herramienta de escritorio nativa enfocada en la privacidad absoluta y respuesta ultrarrápida. Incluye simuladores de tablas de amortización (método francés y alemán), gráficos financieros y persistencia local.",
      problem: "Dependencia constante de conexión a internet y preocupaciones de privacidad en plataformas financieras en la nube para control de cuentas por cobrar.",
      decision: "Implementé una solución nativa en C# con motor de base de datos SQLite embebido y consultas LINQ optimizadas para ejecución en menos de 5ms.",
      tradeoff: "Software de escritorio sin sincronización en la nube, priorizando velocidad instantánea, cero latencia y soberanía de datos del usuario.",
      impact: "Cálculos financieros instantáneos, portabilidad completa en un ejecutable ligero y control de deudas 100% offline.",
      architectureOverview: "Arquitectura en 3 capas nativa en .NET (Presentación WinForms, Lógica de Negocio Financiera y Repositorio SQLite).",
      securityAndCompliance: "Base de datos local con cifrado de archivo y cero telemetría externa para garantizar total privacidad.",
      keyFeatures: [
        "Generador de tablas de amortización con métodos francés, alemán y directo",
        "Control de cobros, vencimientos y cálculo automático de intereses",
        "Exportación de reportes a PDF y Excel con un solo clic",
        "Módulo de respaldo y restauración integral de la base de datos local"
      ],
      ndaDisclaimer: "Software desarrollado de forma autónoma con código disponible en GitHub.",
      metrics: ["< 5ms Respuesta", "100% Offline", "Cifrado SQLite", "Cero Dependencias"],
      image: asset("assets/projects/debtmanager_preview.jpg"),
      technologies: ["C#", ".NET Desktop", "SQLite", "LINQ", "Windows Forms"],
      architectureBadges: ["Desktop Native", "Local DB Persistence", "Finance Engine", "100% Offline"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/DebtManager",
      isFeatured: true
    },
    {
      id: 6,
      title: "AvialB / SIAT — Peritaje Vial Offline-First",
      client: "Consultoría / Peritaje Vial",
      category: "mobile",
      description: "Ecosistema móvil y web offline-first para levantamiento de accidentes de tránsito en campo con sincronización asíncrona.",
      longDescription: "Aplicación híbrida desarrollada en Ionic, Angular y C# diseñada para peritos e investigadores viales que deben levantar información técnica en zonas rurales o carreteras sin cobertura móvil.",
      problem: "Pérdida de conectividad celular en sitios de siniestros viales y lentitud en la transcripción de partes periciales tomados en papel.",
      decision: "Diseñé una arquitectura Offline-First con base de datos local en el dispositivo y sincronización en segundo plano mediante colas de trabajo cuando se detecta conexión.",
      tradeoff: "Desarrollo de lógica personalizada de resolución de conflictos y encolamiento asíncrono para garantizar la integridad de las evidencias periciales.",
      impact: "Digitalización de informes periciales directamente en el lugar del siniestro con georreferenciación y reducción del 70% en tiempos de entrega.",
      architectureOverview: "Cliente híbrido Ionic/Angular con SQLite local y backend de sincronización asíncrona en C# .NET.",
      securityAndCompliance: "Inmutabilidad de marcas de tiempo y coordenadas GPS para asegurar la cadena de custodia legal de las pruebas periciales.",
      keyFeatures: [
        "Modo de trabajo 100% desconectado con persistencia local garantizada",
        "Captura de fotografías de daños vehiculares con geolocalización y marcas temporales",
        "Calculadora de velocidades de impacto y trayectorias basada en huellas de frenado",
        "Sincronización automática por lotes al restablecerse la conectividad"
      ],
      ndaDisclaimer: "Metodologías de inspección y arquitectura documentadas sin exponer casos judiciales ni datos personales de involucrados.",
      metrics: ["Offline-First", "Ionic + Angular", "Sync Asíncrona", "Cadena de Custodia"],
      image: asset("assets/projects/gacad_preview.jpg"),
      technologies: ["Ionic", "Angular", "TypeScript", "C#", ".NET Core", "SQL Server", "SQLite"],
      architectureBadges: ["Offline-First", "Field Operations", "Async Sync", "Forensics"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: false
    },
    {
      id: 7,
      title: "RPG Journey — Motor de Juego Java POO (Swing)",
      client: "Proyecto de Lógica & Game Dev",
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
      image: asset("assets/projects/buscaminas_preview.jpg"),
      technologies: ["Java", "Swing", "POO Avanzada", "Polimorfismo", "Estructuras de Datos"],
      architectureBadges: ["Game Dev POO", "Decoupled Architecture", "Java Swing", "FSM Engine"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig",
      isFeatured: false
    },
    {
      id: 8,
      title: "Buscaminas POO Recursivo (Java Desktop)",
      client: "Proyecto Algorítmico",
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
      metrics: ["< 1ms Latencia", "Recursión en Matrices", "Swing Nativo", "Zero-Dependency"],
      image: asset("assets/projects/buscaminas_preview.jpg"),
      technologies: ["Java", "Swing", "Recursividad", "Matrices 2D", "Event-Driven"],
      architectureBadges: ["Algorithmic Engine", "Recursion", "Zero-Dependency", "Matrix 2D"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig",
      isFeatured: false
    }
  ]
};

