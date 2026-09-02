# Comparativa de Frameworks y Optimización para Dispositivos de Bajos Recursos

Análisis arquitectónico sobre la elección de tecnologías para el portafolio interactivo y el laboratorio de emulación WebAssembly de Anthony Pilatasig, junto con la estrategia de optimización para móviles y computadoras de bajos recursos.

---

## 1. ¿Daría lo mismo haberlo hecho en Angular o en Laravel?

La respuesta corta y directa es **NO**. Cada framework tiene un paradigma y propósito completamente diferente. Para un proyecto con **ejecución nativa de videojuegos en WebAssembly, manipulación de Canvas WebGL y despliegue estático gratuito**, la elección del stack tiene implicaciones críticas.

---

### A. Comparativa frente a Laravel (PHP)

| Criterio | React + Vite (Stack Actual) | Laravel (PHP) |
|---|---|---|
| **Paradigma** | **Client-Side SPA / Jamstack** (Se ejecuta en el navegador del usuario). | **Server-Side Rendering (SSR) / MVC** (El servidor genera el HTML con PHP en cada petición). |
| **Alojamiento y Costo** | **$0.00 / mes** en GitHub Pages / Vercel / Cloudflare Pages. | **Requiere VPS / Servidor Dedicado** ($5 a $20/mes en DigitalOcean, Hetzner, AWS) para correr PHP-FPM + Nginx. **NO se puede alojar en GitHub Pages**. |
| **Ejecución de Juegos (WASM)** | Los juegos corren directamente en la CPU/GPU del cliente mediante WebAssembly y WebGL. Cero carga para el servidor. | Si se quisiera usar Laravel, el backend PHP no aporta ningún valor a la ejecución de WebAssembly. Serviría únicamente como un servidor de archivos estáticos muy costoso e innecesario. |
| **Latencia en Redes Móviles (3G/4G)** | **Cero latencia:** Una vez cargada la SPA, cambiar de página (/proyectos, /laboratorio, /consola) es instantáneo sin peticiones HTTP. | Cada navegación o interacción con Livewire requiere un viaje de ida y vuelta al servidor (Round-Trip HTTP), provocando pantallas en blanco o tirones en conexiones móviles lentas. |
| **Veredicto para este proyecto** | **Ideal y óptimo.** | **Inadecuado:** Incrementa costos mensuales, requiere mantenimiento de servidores de bases de datos y no aporta ventajas a motores WebAssembly en cliente. |

---

### B. Comparativa frente a Angular (TypeScript)

| Criterio | React 19 + Vite (Stack Actual) | Angular 18+ |
|---|---|---|
| **Peso base del runtime (Bundle Size)** | **~40 KB** (React + ReactDOM minificado y comprimido). | **~130 - 200 KB** (El framework base incluye router, DI, RxJS y Zone.js). En móviles lentos, esto aumenta el tiempo de descarga y parseo de JavaScript. |
| **Rendimiento con Canvas y 60 FPS** | React permite manipular directamente el elemento `<canvas>` mediante `useRef` sin pasar por el ciclo de reconciliación de componentes. | En Angular clásico, `Zone.js` intercepta cada evento del DOM, `requestAnimationFrame` y temporizador. Si no se aísla con `NgZone.runOutsideAngular`, Angular intentará disparar detección de cambios 60 veces por segundo, provocando lag severo. |
| **Ecosistema de Emulación y Audio** | Bibliotecas modernas como `nostalgist`, integraciones con Web Audio API y bibliotecas de animación (`framer-motion`) tienen soporte nativo y directo para React. | Menor cantidad de bibliotecas especializadas en emulación y microinteracciones fluidas preparadas para Angular. |
| **Velocidad de compilación (HMR)** | **Sub-segundo** con Vite y Rolldown. | Mayor tiempo de compilación con Angular CLI / Webpack o esbuild. |
| **Veredicto para este proyecto** | **Excelente:** Control fino sobre el ciclo de vida de WebGL y menor sobrecarga en CPU móvil. | **Viable pero más pesado:** Requiere ingeniería adicional para evitar que la detección de cambios afecte los 60 FPS del juego. |

---

### C. Comparativa frente a Astro / Svelte

*   **Astro:** Excelente para blogs estáticos con cero JavaScript. Sin embargo, dado que el 80% de este portafolio es interactivo (AP-Deck OS, emuladores, cambio de temas, animaciones complejas), la arquitectura de "islas" de Astro terminaría hidratando casi toda la página de todos modos.
*   **Svelte:** Genera bundles de JS muy pequeños. Sin embargo, el ecosistema de librerías para emulación (como `nostalgist` y soporte de Canvas interactivos) está primordialmente diseñado para la API de React / Vanilla JS.

---

## 2. Estrategia de Optimización para PCs y Móviles de Bajos Recursos

Para garantizar que el portafolio y el laboratorio funcionen a **60 FPS estables sin tirones ni calentamiento de batería en teléfonos económicos**, implementamos las siguientes técnicas arquitectónicas:

### 1. Eliminación de filtros pesados en GPU (`Backdrop Filter / Blur`)
*   **El problema en móviles:** La propiedad CSS `backdrop-filter: blur(...)` (efecto de vidrio/glassmorphism) obliga a la GPU móvil (Mali o Adreno básica) a recalcular un mapa de desenfoque gaussianos en tiempo real cada vez que el usuario hace scroll, reduciendo la tasa de refresco de 60 FPS a 15-20 FPS.
*   **Nuestra solución:** Implementamos un diseño **editorial limpio** con fondos sólidos o sutilmente translúcidos mediante `background: var(--theme-surface)` y bordes nítidos (`border: 1px solid var(--theme-border)`), logrando una estética sumamente premium sin exigir cálculos pesados a la GPU.

### 2. Aceleración por Hardware y Renderizado de Capas
*   Uso de `transform: translateY(...)` y `opacity` para animaciones, las cuales son procesadas directamente por el Compositor de la GPU sin disparar reflows ni repaints en el árbol DOM.
*   Inclusión de `will-change: transform` exclusivamente durante transiciones activas.

### 3. Aislamiento del Canvas durante la Ejecución de Juegos
*   Cuando la consola (`ConsoleDashboard` / `RpgMakerPlayer`) inicia un juego, los elementos secundarios de la interfaz (carrusel de juegos, listas de exploración y decoraciones de fondo) se ocultan o quedan en reposo (`inert`).
*   Esto asegura que el hilo de renderizado de la GPU y la CPU dediquen el **100% de los recursos al WebGL Canvas del juego**.

### 4. Soporte Accesible para Rendimiento Reducido (`prefers-reduced-motion`)
*   En `index.css` se respeta la preferencia del sistema operativo:
```css
@media (prefers-reduced-motion: reduce) {
  .project-reel-track { animation: none; }
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```
*   Si un teléfono entra en modo de ahorro de batería o el usuario tiene configuradas animaciones reducidas, el sitio apaga automáticamente los efectos continuos para ahorrar energía y CPU.

### 5. Caché Local Inmediata con `CacheStorage API`
*   Al abrir el laboratorio o el motor de RPG Maker, los binarios compilados de WebAssembly (64 MB) se almacenan en el almacenamiento local del dispositivo. En visitas posteriores, el arranque es instantáneo (~200ms) sin consumir datos móviles ni batería descargando archivos repetidos.
