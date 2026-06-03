import type { IPortfolioData } from '../types/portfolio.types';

export const portfolioData: IPortfolioData = {
  personal: {
    name: "Anthony Pilatasig",
    title: "Desarrollador Full Stack | Ingeniero de Software en Formación",
    email: "antpila3848@gmail.com", // Puedes cambiarlo
    github: "https://github.com/AnthonyPilatasig",
    linkedin: "https://linkedin.com/in/anthony-pilatasig"
  },
  experience: [
    {
      id: 1,
      role: "Desarrollador de Software",
      company: "ItspetDev (Instituto Superior Tecnológico Mayor Pedro Traversari)",
      period: "2022 - Presente",
      description: "Desarrollo e implementación de proyectos profesionales, análisis y optimización de procesos tecnológicos. Creación de arquitectura de sistemas enfocados en la gestión académica.",
      technologies: ["C#", ".NET 8", "Angular", "React Native", "SQL Server", "MySQL", "SQLite", "Microservicios"]
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
      institution: "Instituto Superior Tecnológico Mayor Pedro Traversari",
      status: "Completado"
    }
  ],
  skills: {
    frontend: ["Angular", "React / React Native", "TypeScript", "TailwindCSS"],
    backend: ["C# (.NET Core / .NET 8)", "Python", "Java", "Node.js"],
    databases: ["SQL Server", "MySQL", "SQLite", "PostgreSQL"],
    architecture: ["Microservicios", "Clean Architecture", "CQRS", "Docker"]
  },
  projects: [
    {
      id: 1,
      title: "AMMI Online (Plataforma Educativa)",
      client: "Instituto Superior Tecnológico Traversari",
      description: "Plataforma educativa modular de alto rendimiento. Backend construido bajo Clean Architecture y CQRS usando .NET 8 y APIs RESTful. Frontend modular desarrollado en Angular.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
      technologies: ["C#", ".NET 8", "Angular", "Clean Architecture", "CQRS", "MySQL"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev"
    },
    {
      id: 2,
      title: "Sistema de Gestión Académica (ISTPET)",
      client: "Instituto Superior Tecnológico Traversari",
      description: "Core administrativo para la gestión académica institucional. Maneja procesos complejos de estudiantes, matriculación y control académico bajo arquitectura robusta.",
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2074&auto=format&fit=crop",
      technologies: ["TypeScript", "C#", "Angular", ".NET", "SQL Server"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev"
    },
    {
      id: 3,
      title: "Mi ISTPET (Aplicación Móvil)",
      client: "Instituto Superior Tecnológico Traversari",
      description: "Aplicación móvil full-stack para la comunidad estudiantil. Permite la consulta de estados de cuenta, noticias, gestión académica y carnetización digital de los estudiantes.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",
      technologies: ["TypeScript", "React Native", "API REST", "Node/C#"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev"
    },
    {
      id: 4,
      title: "AVIALB (SIAT - Policía Nacional)",
      client: "Policía Nacional del Ecuador",
      description: "Desarrollo de software y sistema de gestión para el departamento del Servicio de Investigación de Accidentes de Tránsito (SIAT). Construido con altos estándares de seguridad y procesamiento de datos.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
      technologies: ["C#", ".NET Core", "TypeScript", "Bases de Datos Relacionales"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev"
    },
    {
      id: 5,
      title: "ERP Recursos Humanos (RRHH)",
      client: "Instituto Superior Tecnológico Traversari",
      description: "Sistema integral para el departamento de Recursos Humanos. Gestiona nóminas, perfiles, y administración de personal mediante un backend en C# y un frontend dedicado en TypeScript.",
      image: "https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=2070&auto=format&fit=crop",
      technologies: ["C#", "TypeScript", "Angular", "SQL Server"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev"
    },
    {
      id: 6,
      title: "ScoreCraft (Gestión Deportiva)",
      client: "Club Deportivo Miguel Ituralde",
      description: "Plataforma de gestión para el departamento de formativas del Instituto y el Club Deportivo. Controla métricas, administración de equipos y progreso de formativas.",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
      technologies: ["C#", "TypeScript", "Angular", "API REST"],
      liveUrl: "#",
      githubUrl: "https://github.com/ItspetDev"
    },
    {
      id: 7,
      title: "Proyecto Yui (Inteligencia Artificial)",
      client: "Proyecto Personal Privado",
      description: "Desarrollo de una Inteligencia Artificial conversacional enfocada en salud mental, inspirada en la funcionalidad de Yui. Incorpora procesamiento de lenguaje natural y modelos de IA.",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop",
      technologies: ["Python", "Inteligencia Artificial", "Machine Learning"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig"
    },
    {
      id: 8,
      title: "Arquitectura Microservicios Educación",
      client: "Proyecto Personal Avanzado",
      description: "Arquitectura backend de alto rendimiento construida con .NET 8. Implementa patrones avanzados como CQRS, Event Sourcing y Domain-Driven Design (DDD). Incluye servicios de analítica y motor adaptativo con Machine Learning.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
      technologies: ["C#", ".NET 8", "Microservicios", "Docker", "CQRS", "DDD"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/net8-education-microservices"
    },
    {
      id: 9,
      title: "Optimización de Inventarios (Prog. Dinámica)",
      client: "Proyecto Académico / Algorítmico",
      description: "Sistema diseñado para la optimización de inventarios empresariales utilizando programación dinámica. Implementa y compara tres enfoques matemáticos (recursivo, bottom-up, top-down) para resolver el problema de la mochila.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      technologies: ["Java", "Algoritmos", "Estructura de Datos"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/Sistema_Optimazacion_Inventario_Algoritmos-y-Estructura-de-Datos-"
    },
    {
      id: 10,
      title: "Motor de Lógica: Buscaminas (POO)",
      client: "Proyecto Personal",
      description: "Desarrollo completo del clásico juego Buscaminas utilizando el paradigma de Programación Orientada a Objetos puro. Demuestra un fuerte dominio de la lógica de programación algorítmica y manejo de matrices bidimensionales complejas.",
      image: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=2070&auto=format&fit=crop",
      technologies: ["Java", "POO", "Lógica Matemática"],
      liveUrl: "#",
      githubUrl: "https://github.com/AnthonyPilatasig/ExamenPractico_POO"
    }
  ]
};
