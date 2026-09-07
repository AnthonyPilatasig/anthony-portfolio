import type { IPortfolioData } from '../types/portfolio.types';

// BrowserRouter puts each page on its own URL path, so plain relative paths ("./assets/...")
// resolve differently per route. import.meta.env.BASE_URL is absolute and always correct.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const portfolioData: IPortfolioData = {
  personal: {
    name: "Anthony David Pilatasig Macas",
    title: "Lead Software Developer & Architect",
    subtitle: "Diseño y construyo sistemas empresariales, núcleos académicos y aplicaciones multiplataforma con .NET 8, Clean Architecture, CQRS y React.",
    bio: "Ingeniero de software, docente técnico y apasionado de la lógica de videojuegos. Lidero el diseño arquitectónico de ecosistemas institucionales de alta concurrencia (.NET 8, Clean Architecture, CQRS, Angular y React Native) y formo a nuevas generaciones de ingenieros en paradigmas de POO y calidad de código.",
    tagline: "Construyo sistemas empresariales de misión crítica de día; diseño motores lógicos de videojuegos y arquitecturas de alto rendimiento de noche.",
    location: "Quito, Ecuador (UTC-5)",
    email: "antpila3848@gmail.com",
    github: "https://github.com/AnthonyPilatasig",
    linkedin: "https://linkedin.com/in/anthony-pilatasig",
    twitch: "https://twitch.tv/anthony_pilatasig",
    status: "Disponible para Desafíos Lead & Full Stack",
    avatar: asset("assets/anthony_profile.png"),
    avatarAlt: asset("assets/anthony_avatar_alt.png"),
  },
  manifesto: [
    {
      number: "01",
      title: "Cero Latencia Innecesaria (Sub-100ms)",
      description: "Cada consulta SQL, índice relacional y handler CQRS debe justificarse por su rendimiento. La velocidad de respuesta es una característica esencial de la experiencia de usuario y la eficiencia de costos en la nube."
    },
    {
      number: "02",
      title: "Clean Architecture con Propósito",
      description: "La arquitectura por capas desacopladas no es un dogma decorativo; es el escudo que protege las reglas de negocio contra la obsolescencia y los cambios de infraestructura o librerías externas."
    },
    {
      number: "03",
      title: "De la Lógica de Videojuegos a Sistemas Críticos",
      description: "La prevención de estados inconsistentes, la concurrencia en bucles de juego y la encapsulación estricta en un RPG son los mismos cimientos matemáticos que hacen indestructible a un core transaccional empresarial."
    },
    {
      number: "04",
      title: "Enseñar es la Prueba Suprema de Dominio",
      description: "Como docente universitario de ingeniería, defiendo que el código Senior debe ser autoexplicativo, auditable y testeable. Si no puedes guiar a un estudiante a entenderlo y refactorizarlo, tu diseño aún no es simple."
    }
  ],
  teachingHighlights: [
    {
      subject: "Programación Orientada a Objetos & SOLID",
      studentsCount: "+120 Alumnos",
      description: "Cátedra práctica de modelado de dominio, herencia vs composición, polimorfismo estricto y diseño desacoplado en Java y C#.",
      focus: ["POO Pura", "Interfaces", "SOLID", "Patrones GoF", "Clean Code"]
    },
    {
      subject: "Estructuras de Datos & Complejidad Algorítmica",
      studentsCount: "3 Ciclos Lectivos",
      description: "Laboratorios de análisis computacional O(n), gestión de memoria, programación dinámica (Knapsack) y estructuras recursivas.",
      focus: ["Big-O Analysis", "Recursividad", "Matrices 2D", "Dynamic Programming"]
    },
    {
      subject: "Mentoría de Proyectos Integradores",
      studentsCount: "15+ Equipos",
      description: "Dirección técnica de proyectos reales de software: pipelines de pruebas unitarias, diseño de base de datos relacional y control de versiones Git.",
      focus: ["Code Review", "Unit Testing", "Git Flow", "Refactorización"]
    }
  ],
  experience: [
    {
      id: 1,
      role: "Software Developer Lead & Architect",
      company: "ItspetDev (Instituto Superior Tecnológico Mayor Pedro Traversari)",
      period: "2022 - Presente",
      description: "Lidero la arquitectura e implementación del ecosistema digital institucional completo: Core Académico (Gacad), la App Móvil oficial (Mi ISTPET) y el ERP de Recursos Humanos.",
      achievements: [
        "Diseñé e implementé la arquitectura backend distribuida con Clean Architecture & CQRS en .NET 8, reduciendo latencias de consulta a sub-100ms.",
        "Desarrollé desde cero la App Móvil oficial 'Mi ISTPET' en React Native, conectando a +2,500 estudiantes activos con notificaciones en tiempo real y carnet digital QR.",
        "Optimicé modelos de datos relacionales en SQL Server y MySQL, logrando un 35% de mejora en la eficiencia de índices de inscripciones y notas.",
        "Integré protocolos de seguridad JWT, firmas digitales para contratos laborales y módulos transaccionales bancarios."
      ],
      technologies: ["C#", ".NET 8", "Angular", "React Native", "Clean Architecture", "CQRS", "SQL Server", "MySQL", "Docker"]
    },
    {
      id: 2,
      role: "Docente Universitario de Ingeniería de Software (Tiempo Parcial)",
      company: "Instituto Superior Tecnológico Mayor Pedro Traversari",
      period: "2024 - Presente",
      description: "Imparto cátedras avanzadas de programación, estructuras de datos y paradigmas de arquitectura, formando a más de 120 futuros desarrolladores.",
      achievements: [
        "Diseñé e instruí planes de estudio prácticos sobre Programación Orientada a Objetos (POO), Clean Code y patrones de diseño empresariales.",
        "Mentorée 15+ proyectos integradores estudiantiles con enfoque en refactorización, pruebas unitarias y calidad de código.",
        "Implementé laboratorios prácticos de análisis algorítmico y optimización de complejidad O(n)."
      ],
      technologies: ["Clean Code", "POO", "Algoritmos", "Mentoring Técnico", "Arquitectura de Software", "SOLID"]
    },
    {
      id: 3,
      role: "Consultor & Software Engineer Backend",
      company: "Proyectos de Consultoría Externa / Sector Público",
      period: "2023 - Presente",
      description: "Desarrollo de soluciones backend de misión crítica y sistemas de procesamiento de datos para el sector público y privado en Ecuador.",
      achievements: [
        "Construí los módulos de investigación y procesamiento vial SIAT / AVIALB para la Policía Nacional del Ecuador.",
        "Diseñé una arquitectura de microservicios en .NET 8, Docker y Kubernetes para entornos educativos de evaluación masiva."
      ],
      technologies: ["C#", ".NET Core", "TypeScript", "Microservicios", "Docker", "PostgreSQL", "Security Protocols"]
    }
  ],
  education: [
    {
      id: 1,
      degree: "Ingeniería de Software",
      institution: "Universidad Politécnica Salesiana (Quito, Ecuador)",
      status: "5to Semestre en curso"
    },
    {
      id: 2,
      degree: "Tecnólogo Superior en Desarrollo de Software",
      institution: "Instituto Superior Tecnológico Mayor Pedro Traversari (ISTPET)",
      status: "Graduado / Título Profesional"
    }
  ],
  skills: {
    frontend: ["Angular", "React", "React Native", "TypeScript", "Tailwind CSS", "RxJS", "State Management (Redux/Context)"],
    backend: ["C# (.NET 8 / .NET Core)", "Node.js / Express", "Java (Spring/Core)", "Python", "RESTful APIs", "JWT Auth", "Entity Framework Core"],
    desktop: ["C# WinForms / WPF", "Java Desktop (Swing)", "Game Loops & POO", "SQLite Local Storage"],
    databases: ["SQL Server", "MySQL", "PostgreSQL", "SQLite", "MongoDB"],
    architecture: ["Clean Architecture", "CQRS", "Domain-Driven Design (DDD)", "Microservicios", "Docker", "Kubernetes", "Git & CI/CD"]
  },
  projects: [
    {
      id: 1,
      title: "Gacad — Core Académico Institucional",
      client: "Instituto Superior Tecnológico Traversari",
      category: "web",
      description: "Núcleo web administrativo de alta disponibilidad para la gestión académica completa: admisiones, expedientes, matrículas y actas de calificaciones.",
      longDescription: "Sistema centralizado que digitalizó al 100% las operaciones académicas institucionales. Diseñado sobre una arquitectura desacoplada para garantizar alta concurrencia durante los periodos de matriculación masiva.",
      problem: "Procesos académicos manuales y cuellos de botella en inscripciones simultáneas que provocaban caídas del servidor.",
      decision: "Adopté Clean Architecture y CQRS en C# .NET 8 con Angular, separando estrictamente la lectura (Queries) de la escritura (Commands) con handlers MediatR independientes.",
      tradeoff: "Mayor tiempo de desarrollo inicial y sobrecosto conceptual en la definición de DTOs y Handlers a cambio de escalabilidad y aislamiento de errores.",
      impact: "Tiempos de respuesta sub-100ms en consultas de notas y 100% de digitalización sin caídas del sistema en los últimos 4 periodos lectivos.",
      metrics: ["Sub-100ms Latencia", "+2,500 Usuarios Activos", "100% Uptime Lectivo"],
      image: asset("assets/projects/gacad_preview.jpg"),
      technologies: ["Angular", "TypeScript", "C#", ".NET 8", "SQL Server", "Clean Architecture", "CQRS"],
      architectureBadges: ["Core Académico", "Clean Architecture", "CQRS Pattern"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true
    },
    {
      id: 2,
      title: "Mi ISTPET — App Móvil Estudiantil",
      client: "Instituto Superior Tecnológico Traversari",
      category: "mobile",
      description: "Aplicación móvil oficial full-stack para la comunidad universitaria con horario, notas en vivo, pagos y carnet digital QR.",
      longDescription: "Plataforma móvil nativa/híbrida que brinda acceso inmediato a los registros estudiantiles, verificación de carnet digital por código QR e integración con pasarelas de pago.",
      problem: "Falta de un canal directo de comunicación y consulta académica en movilidad para los estudiantes.",
      decision: "Construí la aplicación en React Native con TypeScript, consumiendo la API RESTful securizada en .NET 8 con caché local de sesiones.",
      tradeoff: "Compatibilidad entre versiones iOS/Android requirió optimización rigurosa de re-renders y bundling de assets.",
      impact: "+2,500 descargas activas y reducción del 70% en consultas presenciales en ventanilla de secretaría.",
      metrics: ["+2,500 Estudiantes", "-70% Trámites Presenciales", "QR Validado"],
      image: asset("assets/projects/mi_istpet_preview.jpg"),
      technologies: ["React Native", "TypeScript", "API REST", ".NET 8", "MySQL", "JWT"],
      architectureBadges: ["Mobile Native", "Offline Persistence", "QR Security"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true
    },
    {
      id: 3,
      title: "ERP Recursos Humanos ISTPET (Talento Humano)",
      client: "Instituto Superior Tecnológico Traversari",
      category: "web",
      description: "Ecosistema integral de gestión de personal institucional: nóminas, expedientes docentes, firmas digitales de contratos y control de asistencia biométrica.",
      longDescription: "Módulo administrativo de alta confidencialidad para el departamento de Recursos Humanos. Integra flujos de aprobación de permisos, cálculo automático de aportes y firmado electrónico.",
      problem: "Firma manual de cientos de contratos semestrales y dispersión de registros de asistencia docente.",
      decision: "Estructuré una arquitectura por capas en .NET 8 con autenticación RBAC, cifrado de documentos y frontend reactivo en Angular.",
      tradeoff: "Flujos de validación criptográfica más estrictos para contratos a cambio de validez legal plena y auditoría inmutable.",
      impact: "Reducción de 2 semanas a 24 horas en el proceso de contratación y renovación docente semestral.",
      metrics: ["Firma Digital p12", "Cero Pérdida Documental", "Automatización RRHH"],
      image: asset("assets/projects/microservices_preview.jpg"),
      technologies: ["C#", ".NET 8", "Angular", "TypeScript", "MySQL", "JWT", "Firma Digital"],
      architectureBadges: ["Enterprise ERP", "Digital Signatures", "RBAC Security"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true
    },
    {
      id: 4,
      title: "DebtManager — Motor Financiero C# Desktop",
      client: "Proyecto de Ingeniería Personal",
      category: "desktop",
      description: "Aplicación nativa de escritorio en C# para control financiero personal, seguimiento de amortizaciones y gestión de deudas fuera de línea.",
      longDescription: "Herramienta de escritorio enfocada en el rendimiento sin dependencia de red. Incluye calculadoras de cuotas con métodos francés y alemán, gráficos interactivos y persistencia relacional local.",
      problem: "Inseguridad de privacidad y dependencia de conexión a internet en aplicaciones de gestión financiera existentes.",
      decision: "Implementé una aplicación nativa C# .NET Desktop con motor de persistencia en SQLite cifrado localmente y LINQ.",
      tradeoff: "Limitación al entorno de escritorio a cambio de cero latencia de red y privacidad total del usuario.",
      impact: "Cálculo instantáneo de cuotas y reportes financieros exportables con tiempo de respuesta < 5ms.",
      metrics: ["< 5ms Respuesta", "100% Offline", "Cifrado SQLite"],
      image: asset("assets/projects/debtmanager_preview.jpg"),
      technologies: ["C#", ".NET Desktop", "SQLite", "LINQ", "UI Design"],
      architectureBadges: ["Desktop Native", "Local DB Persistence", "Finance Engine"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/DebtManager",
      isFeatured: true
    },
    {
      id: 5,
      title: "RPG Journey — Motor POO & Combate por Turnos",
      client: "Proyecto de Lógica & Game Dev en Java",
      category: "desktop",
      description: "Motor de juego de rol interactivo por turnos desarrollado en Java puro con Swing, demostrando herencia, polimorfismo, contratos de interfaces y colas LIFO.",
      longDescription: "Diseño desacoplado entre el modelo de dominio (paquete `com.rpg.logica`) y la interfaz visual (`com.rpg.gui`). Incluye clases como Guerrero, Mago, Asesino, Tanque, Soporte, Curandero con progresión de estadísticas y renderizado personalizado de barras de vida.",
      problem: "Crear una arquitectura limpia y extensible para reglas de combate y progresión sin acoplar la UI con las fórmulas matemáticas de daño.",
      decision: "Apliqué la interfaz `AccionEspecial` y clases abstractas para asegurar polimorfismo estricto, junto a un `Stack` LIFO para inventario y `HashSet` para el Códice de ítems únicos.",
      tradeoff: "Mayor volumen de clases y diseño previo de jerarquías a cambio de poder añadir nuevas clases de personajes en minutos sin tocar la UI.",
      impact: "Arquitectura 100% desacoplada que sirvió como caso de estudio práctico para cátedras de Programación Orientada a Objetos.",
      metrics: ["POO Pura & Swing", "Polimorfismo Dinámico", "Custom UI Painting"],
      image: asset("assets/projects/buscaminas_preview.jpg"),
      technologies: ["Java", "Swing", "POO Avanzada", "Polimorfismo", "Data Structures"],
      architectureBadges: ["Game Dev POO", "Decoupled Architecture", "Java Swing"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig",
      isFeatured: true
    },
    {
      id: 6,
      title: "Buscaminas POO Recursivo (Java Desktop)",
      client: "Proyecto de Algoritmos & POO",
      category: "desktop",
      description: "Juego nativo de escritorio aplicando POO y algoritmo de destape recursivo en matrices bidimensionales con control de estados y temporizadores.",
      longDescription: "Implementación matemática del clásico Buscaminas que gestiona la dispersión aleatoria de minas, el cálculo de casillas adyacentes y el destape en cascada mediante llamadas recursivas controladas.",
      problem: "Manejar la expansión del tablero en áreas vacías sin causar desbordamientos de pila (StackOverflow) ni congelar el hilo de la interfaz de usuario.",
      decision: "Estructuré la lógica en una matriz bidimensional con un algoritmo de búsqueda recursiva en profundidad acotada y eventos de Swing.",
      tradeoff: "Uso de Swing nativo para asegurar compatibilidad universal en cualquier sistema operativo sin dependencias externas.",
      impact: "Respuesta instantánea < 1ms por clic y caso de estudio de recursividad para estudiantes de ingeniería.",
      metrics: ["< 1ms Latencia", "Recursión Bidimensional", "Zero Dependencias"],
      image: asset("assets/projects/buscaminas_preview.jpg"),
      technologies: ["Java", "Swing", "Recursividad", "Matrices 2D", "Event-Driven"],
      architectureBadges: ["Algorithmic Engine", "Recursion Depth", "Zero-Dependency"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig",
      isFeatured: false
    },
    {
      id: 7,
      title: "Arquitectura Microservicios Educación (.NET 8)",
      client: "Proyecto Avanzado de Arquitectura",
      category: "architecture",
      description: "Ecosistema distribuido backend en .NET 8 con comunicación por eventos, CQRS, DDD y despliegue en contenedores Docker y Kubernetes.",
      longDescription: "Diseño de arquitectura distribuida para plataformas de aprendizaje masivo. Separa la analítica de estudiantes, los exámenes adaptativos y el catálogo de contenidos en servicios independientes.",
      problem: "Monolitos educativos que colapsan ante picos de demanda durante exámenes de fin de ciclo.",
      decision: "Estructuré microservicios independientes en .NET 8 orquestados en Kubernetes con arquitectura hexagonales y contratos gRPC / REST.",
      tradeoff: "Mayor complejidad operacional y necesidad de tracing distribuido a cambio de aislamiento total de fallos.",
      impact: "Aislamiento completo de fallos: un fallo en analítica no interrumpe la toma de exámenes.",
      metrics: ["Fault Isolation", "Zero-Downtime K8s", "CQRS / DDD"],
      image: asset("assets/projects/microservices_preview.jpg"),
      technologies: ["C#", ".NET 8", "CQRS", "DDD", "Docker", "Kubernetes", "gRPC"],
      architectureBadges: ["Microservices", "Event-Driven", "K8s Distributed"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/net8-education-microservices",
      isFeatured: false
    },
    {
      id: 8,
      title: "SIAT / AVIALB — Policía Nacional del Ecuador",
      client: "Policía Nacional del Ecuador",
      category: "web",
      description: "Sistema especializado para la recolección, auditoría y análisis de accidentes de tránsito del Servicio de Investigación de Accidentes de Tránsito.",
      longDescription: "Aplicación gubernamental para estandarización de parte policial, levantamiento de evidencias viales y generación de informes periciales oficiales con trazabilidad auditables.",
      problem: "Formatos físicos dispersos y falta de trazabilidad forense en investigaciones de accidentes viales.",
      decision: "Implementé módulos en .NET Core y SQL Server con pistas de auditoría inmutables y control de acceso basado en roles (RBAC).",
      tradeoff: "Estrictos requisitos de validación previa que incrementan la longitud de los formularios a cambio de seguridad legal.",
      impact: "Estandarización del 100% de partes de peritaje vial institucional con validez jurídica.",
      metrics: ["100% Estándar Pericial", "RBAC Security", "Audit Trail"],
      image: asset("assets/projects/gacad_preview.jpg"),
      technologies: ["C#", ".NET Core", "TypeScript", "SQL Server", "Security Protocols"],
      architectureBadges: ["Public Security", "Audit Trails", "Enterprise .NET"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: false
    }
  ]
};
