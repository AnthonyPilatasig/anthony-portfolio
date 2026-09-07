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
      longDescription: "Plataforma móvil nativa/híbrida construida en React Native Expo y backend en .NET 8. Eliminó por completo el carnet físico institucional y conecta a miles de estudiantes con sus registros académicos.",
      problem: "Dependencia de carnets plásticos físicos y falta de un canal móvil directo para que los estudiantes consulten horarios, notas y estados de pago.",
      decision: "Desarrollé la app en React Native Expo consumiendo APIs seguras en .NET 8 con JWT y renderizado dinámico de carnet digital con código QR validable en portería.",
      tradeoff: "Ajuste de tiempos de bundling y persistencia local para asegurar apertura fluida en teléfonos de gama de entrada.",
      impact: "Publicada exitosamente en Google Play Store; digitalización del 100% de carnets estudiantiles institucionales.",
      metrics: ["Google Play Store", "Carnet QR Digital", ".NET 8 + Expo"],
      image: asset("assets/projects/mi_istpet_preview.jpg"),
      technologies: ["React Native", "Expo", "TypeScript", ".NET 8", "MySQL", "JWT"],
      architectureBadges: ["Mobile App", "Google Play", "QR Verification"],
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
      longDescription: "Modernización del sistema académico institucional. Diseñado sobre una arquitectura desacoplada con Clean Architecture y patrón CQRS, integrándose eficazmente con bases de datos legacy.",
      problem: "Sistemas dispersos y lentitud en procesos de matriculación y asignación de distributivos docentes sobre bases de datos históricas.",
      decision: "Implementé la solución Full Stack con Angular y C# .NET 8 bajo Clean Architecture y CQRS, separando consultas de comandos y preservando la integridad de datos históricos.",
      tradeoff: "Mayor tiempo inicial de modelado de handlers y DTOs a cambio de estabilidad total durante los periodos de matrícula.",
      impact: "Centralización digital de todos los procesos académicos institucionales con consultas rápidas y seguras.",
      metrics: ["Clean Architecture", "CQRS Pattern", "Legacy DB Integration"],
      image: asset("assets/projects/gacad_preview.jpg"),
      technologies: ["Angular", "TypeScript", "C#", ".NET 8", "SQL Server", "Clean Architecture", "CQRS"],
      architectureBadges: ["Core Académico", "Clean Architecture", "CQRS Pattern"],
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
      longDescription: "Módulo administrativo integral desarrollado en Angular y .NET 8 con base de datos MySQL. Unifica el ciclo de vida del personal administrativo y docente con control de roles.",
      problem: "Control manual y disperso de contratos semestrales, expedientes de docentes y evaluaciones de desempeño.",
      decision: "Diseñé una arquitectura web en C# y Angular con SharePoint/almacenamiento seguro, autenticación JWT y control de accesos RBAC.",
      tradeoff: "Validaciones más estrictas en la subida y firma de documentos para garantizar validez y auditoría interna.",
      impact: "Trazabilidad unificada del 100% de expedientes y contratos del personal de la institución.",
      metrics: ["Trazabilidad 100%", "Expediente Digital", "MySQL + .NET 8"],
      image: asset("assets/projects/microservices_preview.jpg"),
      technologies: ["Angular", "TypeScript", "C#", ".NET 8", "MySQL", "JWT", "SharePoint"],
      architectureBadges: ["Enterprise RRHH", "Digital Records", "RBAC Security"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true
    },
    {
      id: 4,
      title: "Scorecraft — Plataforma Deportiva CDMI",
      client: "Club Deportivo Miguel Iturralde",
      category: "web",
      description: "Plataforma web integral para gestión de métricas deportivas, inscripciones de jugadores y seguimiento de fichas médicas.",
      longDescription: "Sistema desarrollado de inicio a fin (análisis, base de datos relacional, C# y Angular) para centralizar la información deportiva, control de entrenamientos y fichas de salud de los deportistas.",
      problem: "Registros en papel de fichas médicas e inscripciones dispersas que dificultaban el seguimiento del rendimiento deportivo.",
      decision: "Construí un panel web reactivo en Angular con backend .NET y SQL Server para registro centralizado y reportes automáticos.",
      tradeoff: "Requirió capacitación a los entrenadores para digitalizar datos en lugar de formularios físicos.",
      impact: "Centralización total de expedientes deportivos y fichas de salud de los jugadores del club.",
      metrics: ["Gestión Deportiva", "Fichas Médicas", "C# + Angular"],
      image: asset("assets/projects/gacad_preview.jpg"),
      technologies: ["Angular", "TypeScript", "C#", ".NET Core", "SQL Server"],
      architectureBadges: ["Sports Analytics", "Health Records", "Full Stack"],
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
      longDescription: "Herramienta de escritorio enfocada en el rendimiento instantáneo y la privacidad. Incluye calculadoras financieras (método francés y alemán), gráficos interactivos y persistencia relacional local.",
      problem: "Dependencia de internet y falta de privacidad en apps comerciales para gestión de deudas personales.",
      decision: "Implementé una aplicación nativa en C# con SQLite local y consultas LINQ optimizadas para respuesta en menos de 5ms.",
      tradeoff: "Software de escritorio sin sincronización en la nube, priorizando la privacidad total y cero latencia.",
      impact: "Cálculos financieros instantáneos y control completo de amortizaciones 100% offline.",
      metrics: ["< 5ms Respuesta", "100% Offline", "Cifrado SQLite"],
      image: asset("assets/projects/debtmanager_preview.jpg"),
      technologies: ["C#", ".NET Desktop", "SQLite", "LINQ", "UI Design"],
      architectureBadges: ["Desktop Native", "Local DB Persistence", "Finance Engine"],
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
      longDescription: "Aplicación desarrollada en Ionic, Angular y C# diseñada para peritos e investigadores que deben registrar evidencias viales en zonas rurales sin cobertura de internet.",
      problem: "Pérdida de conectividad en carreteras y levantamiento manual de partes periciales en papel.",
      decision: "Diseñé una arquitectura Offline-First con base de datos local en el dispositivo y sincronización en segundo plano al recuperar red.",
      tradeoff: "Lógica compleja de resolución de conflictos durante la sincronización de partes policiales.",
      impact: "Digitalización de partes periciales directamente en el lugar del siniestro con validez formal.",
      metrics: ["Offline-First", "Ionic + Angular", "Sync Asíncrona"],
      image: asset("assets/projects/gacad_preview.jpg"),
      technologies: ["Ionic", "Angular", "TypeScript", "C#", ".NET Core", "SQL Server"],
      architectureBadges: ["Offline-First", "Field Operations", "Async Sync"],
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
      metrics: ["POO Pura & Swing", "Polimorfismo Dinámico", "Custom Painting"],
      image: asset("assets/projects/buscaminas_preview.jpg"),
      technologies: ["Java", "Swing", "POO Avanzada", "Polimorfismo", "Estructuras de Datos"],
      architectureBadges: ["Game Dev POO", "Decoupled Architecture", "Java Swing"],
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
      metrics: ["< 1ms Latencia", "Recursión en Matrices", "Swing Nativo"],
      image: asset("assets/projects/buscaminas_preview.jpg"),
      technologies: ["Java", "Swing", "Recursividad", "Matrices 2D", "Event-Driven"],
      architectureBadges: ["Algorithmic Engine", "Recursion", "Zero-Dependency"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig",
      isFeatured: false
    }
  ]
};

