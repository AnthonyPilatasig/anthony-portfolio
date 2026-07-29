# 📐 System Architecture — Anthony Pilatasig Portfolio

Este documento describe las decisiones de diseño de software, patrones de desarrollo y estructura de componentes aplicados en el repositorio de portafolio de **Anthony Pilatasig**.

---

## 🎯 Principios de Arquitectura

El proyecto adopta los principios de **Clean Code**, **Design Tokens DTCG (W3C)** y **Modular Feature Architecture**:

1. **Separación de Responsabilidades:**
   - `src/data/`: Centraliza el catálogo de información (proyectos, experiencia, skills, datos personales).
   - `src/types/`: Interfaces TypeScript estrictas.
   - `src/features/`: Módulos de interfaz autocontenidos (Hero, Skills, Projects, Experience, Hub).
   - `src/components/common/`: Componentes universales independientes (TerminalConsole, SEO).

2. **Arquetipo Visual Dual:**
   - **Bento Grid + Linear Look:** Organización modular de información con tarjetas de vidrio (`luxury-glass`), bordes dorados de precisión y jerarquía tipográfica monospaciada.
   - **Virtual Unix CLI Shell:** Terminal embebida con interprete de comandos en tiempo real que simula una consola de comandos Unix.

3. **Optimización de Renderizado & Rendimiento:**
   - Transiciones declarativas con `framer-motion` para reducir recalculado de layout.
   - Assets gráficos locales optimizados en `public/assets/projects/`.
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
