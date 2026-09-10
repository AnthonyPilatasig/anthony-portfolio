# 📐 System Architecture — Anthony Pilatasig Portfolio

Este documento describe las decisiones de diseño de software, patrones de desarrollo y estructura de componentes aplicados en el repositorio de portafolio de **Anthony Pilatasig**.

---

## 🎯 Principios de Arquitectura

El código en `src/` está organizado en capas al estilo **Clean Architecture**, adaptado a un frontend React/Vite. La regla de dependencia va en un solo sentido — hacia adentro — y se aplica con alias de import dedicados (`@domain`, `@application`, `@infrastructure`, `@presentation`, configurados en `vite.config.ts` y `tsconfig.app.json`):

```
presentation  →  application  →  domain
      ↓               ↓
infrastructure ───────┘
```

1. **`src/domain/`** — Entidades y tipos puros, sin dependencias de React ni de ninguna librería externa (`entities/portfolio.entity.ts`, `entities/github.entity.ts`, `entities/music-preview.entity.ts`). Es el núcleo: nada aquí sabe que existe la UI ni la red.

2. **`src/application/useCases/`** — Casos de uso: orquestan lógica de negocio framework-agnostic y dependen de `domain/` y de los puertos definidos en `infrastructure/`, nunca de React directamente. Ejemplos: `portfolio/mergeLocalizedEntries.ts` (fusiona el contenido en español con los overrides de i18n — antes reimplementado en 4 páginas distintas), `github/getRecentGithubActivity.ts`, `music/getMusicPreviewTracks.ts`.

3. **`src/infrastructure/`** — Adaptadores hacia el mundo exterior: `api/` (clientes HTTP crudos a GitHub e iTunes), `i18n/` (configuración de i18next y los locales), `data/` (el catálogo de datos del portafolio y de la consola, hoy estático pero aislado como si fuera un repositorio), `emulator/` (adaptador sobre el paquete `nostalgist`, para que solo un archivo conozca esa librería).

4. **`src/presentation/`** — Todo lo específico de React: `pages/` (una por ruta), `layout/` (Navbar, Footer), `app/` (composición de la app y el router), `components/ui/` (átomos reutilizables sin dueño de feature: `RevealText`, `SEO`, `CountUp`, etc.) y `features/` (componentes que pertenecen a una sola sección: `about/`, `projects/`, `console/`, `terminal/`).

> **Nota:** el reproductor de audio (`src/components/player/` y `src/components/common/GlobalAudioPlayer.tsx`) quedó fuera de este reordenamiento a propósito — está en desarrollo activo en paralelo y se migrará a `presentation/features/audio-player/` en un pase posterior para no chocar con esos cambios.

5. **Arquetipo Visual Dual:**
   - **Bento Grid + Linear Look:** Organización modular de información con tarjetas de vidrio (`luxury-glass`), bordes dorados de precisión y jerarquía tipográfica monospaciada.
   - **Virtual Unix CLI Shell:** Terminal embebida con interprete de comandos en tiempo real que simula una consola de comandos Unix.

6. **Optimización de Renderizado & Rendimiento:**
   - Transiciones declarativas con `framer-motion` para reducir recalculado de layout.
   - Cada página se carga con `React.lazy`; imágenes grandes convertidas a WebP y con `loading="lazy"`.
   - Bundle split y minificación con Rollup / Vite.

---

## 🎨 Sistema de Design Tokens (`src/index.css`)

```css
@theme {
  --color-neon-purple: #9d4edd;
  --color-neon-cyan: #06b6d4;
  --color-gold-400: #facc15;
  --color-gold-500: #eab308;
  --color-dark-bg: #080c14;
  --color-surface: #0f172a;
  --color-glass-bg: rgba(15, 23, 42, 0.75);
}
```

### Componentes de Utilidad:
- `.luxury-glass`: Panel de vidrio translúcido con filtro de desenfoque (`backdrop-filter: blur(16px)`).
- `.luxury-card`: Tarjeta con gradiente sutil y animación al pasar el cursor.
- `.luxury-badge`: Etiqueta en formato monospaciado con borde brillante para tecnologías y estados.
- `.text-gold-gradient`: Gradiente de texto metálico dorado.

---

## 💻 Consola Virtual CLI (`TerminalConsole.tsx`)

La consola virtual interpreta los comandos ingresados por el usuario mediante un ciclo `event-loop` local en React:

```typescript
const handleCommand = (cmd: string) => {
  switch (cmd.toLowerCase()) {
    case 'help': // Muestra comandos disponibles
    case 'about': // Biografía y estado
    case 'projects': // Muestra proyectos
    case 'gacad': // Detalle del sistema Gacad
    case 'istpet': // Detalle de la app Mi ISTPET
    case 'desktop': // Proyectos nativos en C# y Java
    case 'skills': // Firma técnica
    case 'sudo': // Concede permisos de administrador
    case 'neofetch': // Resumen del sistema
    case 'clear': // Limpia la terminal
  }
}
```

---

## 🚀 Despliegue en GitHub Pages

El proyecto está configurado para desplegarse automáticamente en GitHub Pages.

```typescript
// vite.config.ts
export default defineConfig({
  base: '/anthony-portfolio/',
  plugins: [react(), tailwindcss()],
});
```

Comando de compilación:
```bash
npm run build
```
Genera la carpeta `dist/` optimizada para producción.
