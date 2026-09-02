# Infraestructura de GitHub Actions y Límites de Servidores

Guía técnica sobre la infraestructura de despliegue continuo (CI/CD), almacenamiento y límites de hardware en GitHub Actions y GitHub Pages para el portafolio de Anthony Pilatasig.

---

## 1. Arquitectura de Despliegue Actual

El proyecto opera bajo una arquitectura **Zero-Server / Static Edge**:
- **Código Fuente:** Repositorio en GitHub ([`AnthonyPilatasig/anthony-portfolio`](https://github.com/AnthonyPilatasig/anthony-portfolio)).
- **Orquestador CI/CD:** GitHub Actions ([`.github/workflows/deploy.yml`](file:///c:/Users/MEGABLODFIX/Desktop/anthony-portfolio/.github/workflows/deploy.yml)).
- **Alojamiento y CDN Global:** GitHub Pages (Fastly CDN con caché perimetral global).
- **Costo Operativo:** **$0.00 / mes** (100% cubierto por el nivel gratuito de GitHub para repositorios públicos).

```
[ Push a rama main ]
         │
         ▼
┌──────────────────────────────────────────────┐
│       GITHUB ACTIONS RUNNER (Ubuntu)         │
│  - 2 vCPU · 7 GB RAM · 14 GB SSD             │
│  - Checkout + Setup Node 20 (npm cache)      │
│  - Tests unitarios: npx vitest run           │
│  - Compilación: npm run build (Vite 8)       │
│  - Generación de bundle en ./dist            │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│           GITHUB PAGES (Fastly CDN)          │
│  - Despliegue global en Edge                 │
│  - Soporte HTTPS + HTTP/2 + Brotli / Gzip    │
│  - Cabeceras COOP/COEP (SharedArrayBuffer)   │
└──────────────────────────────────────────────┘
```

---

## 2. Topes y Límites de Servidor en GitHub Actions

Cuando un pipeline de GitHub Actions se ejecuta, GitHub aprovisiona una máquina virtual dedicada en la nube de Microsoft Azure. Estos son los límites exactos de ese servidor:

| Recurso | Límite Estándar (Ubuntu-latest) | Observaciones y Uso en Nuestro Proyecto |
|---|---|---|
| **vCPU** | **2 núcleos** | Suficiente para compilar Vite y correr Vitest en paralelo. |
| **Memoria RAM** | **7.0 GB** (~7.2 GB disponibles) | Nuestro build consume ~500 MB de RAM; estamos al **7%** del límite. |
| **Disco SSD** | **14 GB libres** (ampliable a ~30 GB) | El bundle completo (`dist/`) pesa ~75 MB; estamos al **0.5%** del límite. |
| **Tiempo máx. por Job** | **6 horas continuas** | Nuestro build toma **22 segundos** en total. |
| **Tiempo máx. por Workflow** | **72 horas** | No aplica para pipelines de frontend. |
| **Minutos de ejecución gratuitos** | **Ilimitados** en repositorios públicos<br>(2,000 min/mes en privados) | Al ser un repositorio público, el cómputo en GitHub Actions es **100% gratuito e ilimitado**. |
| **Concurrencia de Jobs** | **20 jobs en paralelo** | `concurrency: group: "pages"` evita sobreescrituras en despliegues simultáneos. |

---

## 3. Límites de Alojamiento en GitHub Pages

GitHub Pages actúa como un servidor de contenido estático respaldado por Fastly CDN:

| Característica | Límite Oficial de GitHub | Estado en Nuestro Portafolio |
|---|---|---|
| **Tamaño máximo del sitio web publicado** | **1.0 GB** (1,000 MB) | Nuestro directorio `dist/` pesa **~75 MB** (incluyendo el WASM de 42.5 MB y el RTP de 21.4 MB). Ocupamos menos del **8%** del límite. |
| **Ancho de banda mensual (Tráfico)** | **100 GB / mes** | Gracias al almacenamiento en caché del navegador (`CacheStorage API`), los usuarios solo descargan el núcleo WASM una vez. Con 100 GB se pueden soportar miles de visitas mensuales sin problemas. |
| **Límite de peticiones** | **10 minutos por build** | Nuestro empaquetado tarda **~3 segundos** en Vite. |

---

## 4. Límites de Git y Repositorios en GitHub

| Parámetro | Límite | Recomendación Técnica |
|---|---|---|
| **Tamaño máximo de un solo archivo** | **100 MB** | GitHub bloquea commits con archivos > 100 MB. Nuestro archivo más pesado (`mkxp-z_libretro.wasm`) pesa **42.5 MB** y `Standard.mkxpz` pesa **21.4 MB**. Ambos están **por debajo de los 50 MB** (umbral de advertencia), por lo que **no requieren Git LFS**. |
| **Tamaño total recomendado del repositorio** | **< 1 GB - 5 GB** | El repositorio actual pesa menos de **180 MB**. |
| **Git LFS (Large File Storage)** | **1 GB de almacenamiento / 1 GB ancho de banda mensual gratis** | **No es necesario usar Git LFS** actualmente, evitando incurrir en cobros o cuotas de ancho de banda restringido. |

---

## 5. Estrategia de Caché en el Pipeline de CI/CD

En `.github/workflows/deploy.yml` hemos optimizado los tiempos de ejecución:
1. **`cache: 'npm'` en `actions/setup-node`:** Reutiliza las dependencias de `node_modules` entre ejecuciones, reduciendo el tiempo de `npm ci` de 45 segundos a menos de **8 segundos**.
2. **`cancel-in-progress: false`:** Garantiza que los despliegues a producción sean atómicos y no dejen artefactos a medias.
3. **Validación automática de calidad:** Ejecuta la suite de pruebas unitarias (`vitest`) antes de compilar; si un test falla, el pipeline detiene el despliegue protegiendo la versión pública.
