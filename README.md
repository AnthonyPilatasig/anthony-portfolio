# 💎 Anthony Pilatasig — Senior Portfolio & CV Repository

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4.3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![.NET 8 Core](https://img.shields.io/badge/.NET_8-Clean_Architecture-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Bienvenido al repositorio oficial del portafolio profesional y resumen curricular de **Anthony David Pilatasig Macas** — **Desarrollador Full Stack & Ingeniero de Software en Formación**.

Este repositorio almacena una aplicación web interactiva diseñada bajo un arquetipo visual **Linear Look / Bento Grid + Cyber Obsidian & Gold Amber**, inspirada en la arquitectura de portafolios de ingenieros Senior (`portfolio.jorgedoicela.com` / `jorgedoicela.com`).

---

## 👤 Perfil del Desarrollador

- **Nombre:** Anthony David Pilatasig Macas
- **Rol:** Lead Software Developer @ ItspetDev | Full-Stack & Software Architect
- **Ubicación:** Quito, Ecuador (UTC-5)
- **Formación Académica:**
  - **Ingeniería de Software:** Universidad Politécnica Salesiana (UPS, Quito) — *5to Semestre*
  - **Tecnólogo Superior en Desarrollo de Software:** Instituto Superior Tecnológico Mayor Pedro Traversari (ISTPET) — *Egresado / Graduado*
- **Especialización:** Backend .NET 8 (Clean Architecture, CQRS, DDD, Microservicios), Frontend en Angular / React, Apps Móviles en React Native y Software Nativo de Escritorio en C# & Java.

---

## 🏛️ Proyectos Institucionales & Nativos Destacados

### 1. 🎓 Gacad — Sistema de Gestión Académica (Core Institucional ISTPET)

- **Descripción:** Core administrativo web integral para la gestión de miles de estudiantes, inscripciones, expedientes académicos y ofertas educativas.
- **Stack:** Angular, TypeScript, C# .NET 8, Clean Architecture, SQL Server.
- **Impacto:** Digitalización total del ciclo académico institucional.

### 2. 📱 Mi ISTPET — App Móvil Estudiantil

- **Descripción:** Aplicación móvil oficial en tiempo real para la comunidad estudiantil.
- **Funcionalidades:** Carnet digital QR verificado, estados financieros, horarios, notificaciones y consulta de notas.
- **Stack:** React Native, TypeScript, API REST .NET 8, MySQL.

### 3. 🖥️ DebtManager — App Nativa de Escritorio (C# .NET)

- **Descripción:** Software ejecutable de escritorio para la gestión de deudas, préstamos y finanzas personales con almacenamiento seguro fuera de línea.
- **Stack:** C# .NET Desktop, SQLite Relacional, LINQ.

### 4. ⚙️ Arquitectura Microservicios Educación (.NET 8 & K8s)

- **Descripción:** Plataforma backend distribuida para aprendizaje adaptativo e IA.
- **Stack:** .NET 8, CQRS, Event Sourcing, Domain-Driven Design (DDD), Docker & Kubernetes.

### 5. 🎮 Motor de Lógica: Buscaminas POO (Java Desktop)

- **Descripción:** Juego nativo de escritorio aplicando Programación Orientada a Objetos pura y destape recursivo en matrices bidimensionales.
- **Stack:** Java Swing, POO, Recursividad.

### 6. 🎒 Optimización de Inventarios (Programación Dinámica)

- **Descripción:** Aplicación algorítmica resolviendo el problema de la mochila (Knapsack 0/1) con memoización top-down y bottom-up.
- **Stack:** Java, Algoritmos Avanzados.

### 7. 🚑 AVIALB / SIAT (Policía Nacional del Ecuador)

- **Descripción:** Sistema de investigación de accidentes de tránsito y recolección de evidencias viales.
- **Stack:** C# .NET Core, TypeScript, SQL Server.

---

## 🌟 Características de la Aplicación

- **Selector de Vista Tri-Modo:**
  - **Vista Ejecutiva (Default):** Presentación Bento Grid con biografía, stack por capas, proyectos filtrables y línea de tiempo profesional.
  - **Modo Consola Virtual CLI (`anthony@dev-shell:~$`):** Terminal UNIX interactiva con historial de comandos (`help`, `projects`, `gacad`, `istpet`, `desktop`, `skills`, `sudo`, `neofetch`).
  - **Hub Launchpad:** Lanzador de módulos estilo `jorgedoicela.com`.
- **Internacionalización (i18n):** Soporte bilingüe completo Español / Inglés.
- **Design Tokens A11y:** Paleta de contraste validada WCAG 2.2 AA y animaciones aceleradas por GPU (`Framer Motion`).

---

## 🛠️ Instalación & Ejecución Local

### Requisitos Previos

- **Node.js:** v18.0 o superior
- **npm:** v9.0 o superior

### Pasos

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/AnthonyPilatasig/anthony-portfolio.git
   cd anthony-portfolio
   ```
2. **Instalar dependencias:**

   ```bash
   npm install
   ```
3. **Ejecutar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.
4. **Compilar para Producción:**

   ```bash
   npm run build
   ```
5. **Previsualizar la build de producción:**

   ```bash
   npm run preview
   ```

---

## 📂 Estructura del Proyecto

```text
anthony-portfolio/
├── public/
│   └── assets/
│       └── projects/       # Previsualizaciones locales de UI de proyectos
├── src/
│   ├── components/
│   │   ├── common/         # Componentes reutilizables (TerminalConsole, SEO)
│   │   └── layout/         # Componentes de navegación (Navbar, Footer)
│   ├── data/
│   │   └── portfolio.ts    # Fuente de verdad de proyectos, experiencia y datos
│   ├── features/
│   │   ├── hero/           # Banner Bento principal y biografía
│   │   ├── skills/         # Firma técnica y capas de arquitectura
│   │   ├── projects/       # Galería filtrable de proyectos y modal técnico
│   │   ├── experience/     # Timeline laboral y formación académica
│   │   └── hub/            # Lanzador Hub Launchpad
│   ├── i18n/               # Diccionarios de traducción (ES / EN)
│   ├── types/              # Definición de interfaces TypeScript
│   ├── App.tsx             # Orquestador principal de vistas
│   └── index.css           # Design tokens, utilidades CSS luxury y animaciones
├── ARCHITECTURE.md         # Documentación detallada de arquitectura
├── package.json
└── vite.config.ts
```

---

## 📧 Contacto & Redes

- **Email:** [antpila3848@gmail.com](mailto:antpila3848@gmail.com)
- **LinkedIn:** [linkedin.com/in/anthony-pilatasig](https://linkedin.com/in/anthony-pilatasig)
- **GitHub:** [github.com/AnthonyPilatasig](https://github.com/AnthonyPilatasig)

---

*Desarrollado por Anthony Pilatasig • Quito, Ecuador*
