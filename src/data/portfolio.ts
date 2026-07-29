import type { IPortfolioData } from '../types/portfolio.types';

export const portfolioData: IPortfolioData = {
  personal: {
    name: "Anthony David Pilatasig Macas",
    title: "Desarrollador Full Stack & Ingeniero de Software en Formación",
    subtitle: "Especializado en .NET 8, Clean Architecture, CQRS, Angular, React Native y Aplicaciones Nativas de Escritorio",
    bio: "Desarrollador de software con sólida trayectoria en el diseño e implementación de sistemas institucionales de alto impacto (Gacad, Mi ISTPET, ERP RRHH) y soluciones de escritorio y móviles. Apasionado por las arquitecturas limpias (Clean Architecture, CQRS, Microservicios), el modelado algorítmico y el desarrollo Full-Stack seguro e intuitivo.",
    location: "Quito, Ecuador (UTC-5)",
    email: "antpila3848@gmail.com",
    github: "https://github.com/AnthonyPilatasig",
    linkedin: "https://linkedin.com/in/anthony-pilatasig",
    status: "Disponible para proyectos & Desafíos Full Stack"
  },
  experience: [
    {
      id: 1,
      role: "Desarrollador de Software Lead / Architect",
      company: "ItspetDev (Instituto Superior Tecnológico Mayor Pedro Traversari)",
      period: "2022 - Presente",
      description: "Líder de desarrollo y arquitectura en proyectos de software institucional. Diseño e implementación del ecosistema digital completo incluyendo el Core Académico (Gacad), la App Móvil oficial (Mi ISTPET) y el ERP de Recursos Humanos.",
      achievements: [
        "Diseño e implementación de arquitectura Clean Architecture & CQRS en .NET 8 para el backend académico institucional.",
        "Desarrollo completo de la app móvil institucional 'Mi ISTPET' en React Native atendiendo a miles de estudiantes activos.",
        "Optimización de consultas SQL y migración de modelos de datos relacionales en SQL Server y MySQL.",
        "Manejo de seguridad, autenticación JWT, carnetización digital e integración de servicios bancarios/pagos."
      ],
      technologies: ["C#", ".NET 8", "Angular", "React Native", "Clean Architecture", "CQRS", "SQL Server", "MySQL", "Docker"]
    },
    {
      id: 2,
      role: "Docente Académico (Tiempo Parcial) - Desarrollo de Software",
      company: "Instituto Superior Tecnológico Mayor Pedro Traversari",
      period: "2024 - Presente",
      description: "Docente universitario impartiendo cátedras fundamentales y avanzadas de programación. Orientado a formar a la nueva generación de desarrolladores con bases sólidas en lógica computacional, paradigmas de ingeniería y buenas prácticas de escritura de código.",
      achievements: [
        "Instrucción técnica en el diseño de algoritmos, estructuras de datos y el paradigma de Programación Orientada a Objetos (POO).",
        "Diseño de planes de estudio, talleres prácticos y proyectos de evaluación enfocados en la resolución de problemas lógicos.",
        "Mentoría técnica y guía académica para estudiantes, promoviendo el Clean Code y el pensamiento estructurado."
      ],
      technologies: ["Docencia Superior", "Mentoring", "POO", "Lógica Algorítmica", "Liderazgo Académico"]
    },
    {
      id: 3,
      role: "Desarrollador Backend & Software Engineer",
      company: "Proyectos de Consultoría Externa / Colaboración Institucional",
      period: "2023 - Presente",
      description: "Desarrollo de soluciones especializadas para entidades del sector público y privado, incluyendo el sistema de gestión de accidentes SIAT para la Policía Nacional del Ecuador.",
      achievements: [
        "Desarrollo de módulos de procesamiento e investigación vial para la Policía Nacional del Ecuador (SIAT/AVIALB).",
        "Implementación de microservicios distribuidos con .NET 8, Docker y Kubernetes para entornos educativos avanzadas."
      ],
      technologies: ["C#", ".NET Core", "TypeScript", "Microservicios", "Docker", "PostgreSQL"]
    }
  ],
  education: [
    {
      id: 1,
      degree: "Ingeniería de Software",
      institution: "Universidad Politécnica Salesiana (Quito, Ecuador)",
      status: "Cursando actualmente 5to Semestre"
    },
    {
      id: 2,
      degree: "Tecnólogo Superior en Desarrollo de Software",
      institution: "Instituto Superior Tecnológico Mayor Pedro Traversari (ISTPET)",
      status: "Egresado / Graduado"
    }
  ],
  skills: {
    frontend: ["Angular", "React / React Native", "TypeScript", "TailwindCSS", "HTML5/CSS3", "RxJS", "Redux/Context API"],
    backend: ["C# (.NET 8 / .NET Core)", "Python", "Java", "Node.js / Express", "RESTful APIs", "JWT Auth"],
    desktop: ["C# WinForms / WPF", "Java Desktop (Swing/AWT)", "Procesamiento Matricial POO", "Persistencia Local SQLite"],
    databases: ["SQL Server", "MySQL", "PostgreSQL", "SQLite", "MongoDB"],
    architecture: ["Clean Architecture", "CQRS", "Microservicios", "Domain-Driven Design (DDD)", "Docker", "Kubernetes", "Git / GitHub Actions"]
  },
  projects: [
    {
      id: 1,
      title: "Gacad — Sistema de Gestión Académica",
      client: "Instituto Superior Tecnológico Traversari",
      category: "web",
      description: "Core administrativo web para la gestión académica institucional completa. Administra inscripciones, expedientes estudiantiles, ofertas académicas y control de calificaciones.",
      longDescription: "Sistema integral desarrollado para digitalizar los procesos administrativos del instituto. Implementa un frontend modular en Angular con una arquitectura backend robusta en C# .NET y SQL Server, optimizando el rendimiento de consultas y la experiencia de docentes y administradores.",
      image: "./assets/projects/gacad_preview.jpg",
      technologies: ["Angular", "TypeScript", "C#", ".NET 8", "SQL Server", "Clean Architecture"],
      architectureBadges: ["Core Administrativo", "Clean Architecture", "Enterprise Security"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true
    },
    {
      id: 2,
      title: "Mi ISTPET — App Móvil Estudiantil",
      client: "Instituto Superior Tecnológico Traversari",
      category: "mobile",
      description: "Aplicación móvil oficial full-stack para la comunidad estudiantil. Consulta de horarios, calificaciones, pagos, noticias y carnet estudiantil digitalizado.",
      longDescription: "Desarrollada en React Native, esta aplicación conecta a miles de estudiantes con sus registros académicos en tiempo real. Incluye autenticación segura, notificaciones push, carnet digital con código QR verificado y vista de estados financieros.",
      image: "./assets/projects/mi_istpet_preview.jpg",
      technologies: ["React Native", "TypeScript", "API REST", ".NET 8", "MySQL"],
      architectureBadges: ["Mobile Native", "Offline Persistence", "QR Security"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true
    },
    {
      id: 3,
      title: "DebtManager — App de Escritorio C#",
      client: "Proyecto de Escritorio Personal",
      category: "desktop",
      description: "Aplicación nativa de escritorio construida en C# .NET para la gestión de finanzas personales, seguimiento de deudas, cuotas y presupuestos con almacenamiento local.",
      longDescription: "Desarrollada para brindar un control financiero personal ágil y fuera de línea. Cuenta con paneles interactivos de amortización de préstamos, alertas de vencimiento, exportación de reportes y almacenamiento seguro en SQLite relacional.",
      image: "./assets/projects/debtmanager_preview.jpg",
      technologies: ["C#", ".NET Desktop", "SQLite", "LINQ", "Architecture Patterns"],
      architectureBadges: ["Desktop Native", "Local DB Persistence", "Finance Engine"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/DebtManager",
      isFeatured: true
    },
    {
      id: 4,
      title: "Arquitectura Microservicios Educación",
      client: "Proyecto Personal Avanzado",
      category: "architecture",
      description: "Arquitectura backend distribuida en .NET 8 implementando patrones CQRS, Event Sourcing, Domain-Driven Design (DDD), Docker y Kubernetes.",
      longDescription: "Ecosistema de microservicios diseñado para entornos de aprendizaje adaptativo. Incluye servicios independientes para evaluación adaptativa, analítica de estudiantes y recomendación inteligente de contenidos.",
      image: "./assets/projects/microservices_preview.jpg",
      technologies: ["C#", ".NET 8", "CQRS", "DDD", "Docker", "Kubernetes", "Event Sourcing"],
      architectureBadges: ["Microservices", "Event-Driven", "K8s Distributed"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/net8-education-microservices",
      isFeatured: true
    },
    {
      id: 5,
      title: "Motor de Lógica: Buscaminas POO Java",
      client: "Proyecto Algorítmico de Escritorio",
      category: "desktop",
      description: "Motor completo del juego Buscaminas desarrollado bajo el paradigma de Programación Orientada a Objetos en Java con manejo de matrices bidimensionales complejas.",
      longDescription: "Implementación que demuestra el dominio de conceptos fundamentales de la ciencia de la computación: encapsulamiento, polimorfismo, manejo recursivo del destape de celdas libres y gestión de matriz de minas.",
      image: "./assets/projects/buscaminas_preview.jpg",
      technologies: ["Java", "POO", "Algoritmos", "Matrices Bidimensionales"],
      architectureBadges: ["OOP Design", "Recursion", "Algorithm Engine"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/ExamenPractico_POO",
      isFeatured: false
    },
    {
      id: 6,
      title: "Optimización de Inventarios (Prog. Dinámica)",
      client: "Proyecto Algorítmico",
      category: "desktop",
      description: "Sistema en Java para la optimización de inventarios empresariales comparando enfoques recursivo, top-down (memoización) y bottom-up.",
      longDescription: "Aplicación algorítmica enfocada en la resolución del problema de la mochila (Knapsack Problem 0/1) aplicado a la logística e inventarios, analizando la complejidad temporal O(n*W) e identificando la eficiencia máxima de procesamiento.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      technologies: ["Java", "Dynamic Programming", "Algoritmos Avanzados"],
      architectureBadges: ["Dynamic Prog.", "Knapsack 0/1", "Algorithm Benchmarking"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/Sistema_Optimazacion_Inventario_Algoritmos-y-Estructura-de-Datos-",
      isFeatured: false
    },
    {
      id: 7,
      title: "AMMI Online — Plataforma Educativa",
      client: "Instituto Superior Tecnológico Traversari",
      category: "web",
      description: "Plataforma educativa modular de alto rendimiento. Backend estructurado con Clean Architecture y CQRS usando .NET 8 y frontend modular en Angular.",
      longDescription: "Ecosistema LMS diseñado para soportar alta concurrencia durante exámenes y entrega de tareas. Separa responsabilidades mediante comandos (Commands) y consultas (Queries), garantizando tiempo de respuesta sub-100ms.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      technologies: ["C#", ".NET 8", "Angular", "Clean Architecture", "CQRS", "MySQL"],
      architectureBadges: ["CQRS Pattern", "LMS Platform", "Clean Code"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: true
    },
    {
      id: 8,
      title: "AVIALB / SIAT — Policía Nacional del Ecuador",
      client: "Policía Nacional del Ecuador",
      category: "web",
      description: "Sistema de gestión e investigación de accidentes de tránsito para la Policía Nacional. Procesamiento seguro de partes policiales e historial delictivo/vial.",
      longDescription: "Herramienta desarrollada para el Servicio de Investigación de Accidentes de Tránsito (SIAT). Permite la recolección estandarizada de evidencias, cálculo de dinámicas viales y generación de informes oficiales blindados.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
      technologies: ["C#", ".NET Core", "TypeScript", "SQL Server", "Security Protocols"],
      architectureBadges: ["Public Security", "Audit Trails", "Enterprise .NET"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: false
    },
    {
      id: 9,
      title: "ERP Recursos Humanos (RRHH)",
      client: "Instituto Superior Tecnológico Traversari",
      category: "web",
      description: "Sistema integral para la administración de personal, control de nóminas, gestión de contratos y registros de asistencia docente.",
      longDescription: "Desarrollo completo del módulo de RRHH con reportes automatizados, cálculo de remuneraciones y gestión documental de contratos institucionales.",
      image: "https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=2070&auto=format&fit=crop",
      technologies: ["C#", "Angular", "SQL Server", "TypeScript"],
      architectureBadges: ["ERP Systems", "HR Tech", "Role Security"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: false
    },
    {
      id: 10,
      title: "Proyecto Yui — IA Salud Mental",
      client: "Proyecto Personal / Inteligencia Artificial",
      category: "architecture",
      description: "Asistente inteligente conversacional enfocado en el acompañamiento de salud mental desarrollado en Python con NLP y modelos de Machine Learning.",
      longDescription: "Prototipo de Inteligencia Artificial que explora el análisis de sentimiento, redes neuronales recurrentes y técnicas de NLP para interacción empática con el usuario.",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop",
      technologies: ["Python", "NLP", "Machine Learning", "PyTorch"],
      architectureBadges: ["Artificial Intelligence", "NLP Engine", "Python ML"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig",
      isFeatured: false
    }
  ]
};

