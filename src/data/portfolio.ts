import type { IPortfolioData } from '../types/portfolio.types';

// BrowserRouter puts each page on its own URL path, so plain relative paths ("./assets/...")
// resolve differently per route. import.meta.env.BASE_URL is absolute and always correct.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const portfolioData: IPortfolioData = {
  personal: {
    name: "Anthony David Pilatasig Macas",
    title: "Lead Software Developer & Architect",
    subtitle: "Diseño y construyo sistemas empresariales, núcleos académicos y aplicaciones multiplataforma con .NET 8, Clean Architecture, CQRS y React.",
    bio: "Diseño e implemento arquitecturas de software resilientes, desde cores de gestión académica de alta concurrencia hasta soluciones móviles y nativas de escritorio. Mi trabajo combina rigor arquitectónico en backend (.NET 8, Clean Architecture, CQRS) con interfaces web y móviles ágiles y accesibles.",
    location: "Quito, Ecuador (UTC-5)",
    email: "antpila3848@gmail.com",
    github: "https://github.com/AnthonyPilatasig",
    linkedin: "https://linkedin.com/in/anthony-pilatasig",
    status: "Disponible para Desafíos Lead & Full Stack"
  },
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
      technologies: ["Clean Code", "POO", "Algoritmos", "Mentoring Técnico", "Arquitectura de Software"]
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
    backend: ["C# (.NET 8 / .NET Core)", "Node.js / Express", "Python", "RESTful APIs", "JWT Auth", "Entity Framework Core"],
    desktop: ["C# WinForms / WPF", "Java Desktop (Swing)", "Algoritmos & POO", "SQLite Local Storage"],
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
      decision: "Adopté Clean Architecture y CQRS en C# .NET 8 con Angular, separando estrictamente la lectura (Queries) de la escritura (Commands).",
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
      id: 4,
      title: "Arquitectura Microservicios Educación",
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
      isFeatured: true
    },
    {
      id: 5,
      title: "Optimización de Inventarios (Knapsack 0/1)",
      client: "Investigación Algorítmica",
      category: "desktop",
      description: "Sistema algorítmico en Java para la resolución del problema de la mochila (Knapsack 0/1) con programación dinámica comparando 3 enfoques.",
      longDescription: "Benchmark de rendimiento computacional que analiza algoritmos recursivos puros, memorización (top-down) y tabulación (bottom-up) sobre grandes volúmenes de datos.",
      problem: "Lentitud exponencial O(2^n) al calcular combinaciones óptimas de inventario logístico.",
      decision: "Diseñé un motor de programación dinámica en Java reduciendo la complejidad temporal a O(n*W).",
      tradeoff: "Mayor consumo de memoria espacial O(n*W) a cambio de pasar de ejecución en minutos a milisegundos.",
      impact: "Optimización de tiempo de ejecución de ~45 segundos a 12 milisegundos en pruebas de volumen alto.",
      metrics: ["O(n*W) Eficiencia", "12ms Tiempo Ejecución", "Dynamic Prog."],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      technologies: ["Java", "Dynamic Programming", "Algoritmos Avanzados"],
      architectureBadges: ["Dynamic Prog.", "Knapsack 0/1", "Algorithm Benchmarking"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/Sistema_Optimazacion_Inventario_Algoritmos-y-Estructura-de-Datos-",
      isFeatured: false
    },
    {
      id: 6,
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
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
      technologies: ["C#", ".NET Core", "TypeScript", "SQL Server", "Security Protocols"],
      architectureBadges: ["Public Security", "Audit Trails", "Enterprise .NET"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev",
      isFeatured: false
    }
  ]
};
