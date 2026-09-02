# Arquitectura del Motor WebAssembly: RPG Maker XP y Pokémon Essentials

Documentación técnica detallada del subsistema de ejecución nativa en navegador para juegos desarrollados en **RPG Maker XP (RGSS1/2/3)** y **Pokémon Essentials**.

---

## 1. Visión General del Sistema

El objetivo de esta integración es permitir la **ejecución directa y 100% nativa en el navegador** de cualquier juego comprimido en formato `.zip` creado en RPG Maker XP o Pokémon Essentials (como *Pokémon Reminiscencia*), **sin recrear el juego**, sin servidores intermedios y sin simulación estática en Canvas.

```
┌─────────────────────────────────────────────────────────────┐
│                       NAVEGADOR WEB                         │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                 React UI Layer                      │   │
│   │   (ConsoleDashboard.tsx / RpgMakerPlayer.tsx)       │   │
│   │   - Virtual Touch D-Pad / Buttons                   │   │
│   │   - File Upload & RAM Extraction                    │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│   ┌──────────────────────────▼──────────────────────────┐   │
│   │              Nostalgist.js (Orquestador)            │   │
│   │   - Canvas WebGL Context Binding                    │   │
│   │   - Web Audio / OpenAL Streaming                    │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│   ┌──────────────────────────▼──────────────────────────┐   │
│   │           mkxp-z Libretro Core (WASM 42.5MB)        │   │
│   │   - Full CRuby 3.x Virtual Machine                  │   │
│   │   - RGSS / PhysFS Virtual File System               │   │
│   │   - Fluidsynth / SDL2 Audio & Graphics Pipeline     │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│   ┌──────────────────────────▼──────────────────────────┐   │
│   │                RTP Standard (21.4MB)                │   │
│   │   - Audio, Graphics, System assets                  │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Bases Técnicas y Repositorios de Referencia

Para lograr esta implementación en tiempo récord, nos basamos en la investigación del estado del arte de la emulación de RGSS y motores de juego compilados a WebAssembly:

### A. Repositorios de Referencia Principales

1. **`mkxp-z` ([github.com/mkxp-z/mkxp-z](https://github.com/mkxp-z/mkxp-z))**:
   - Proyecto base de código abierto creado por la comunidad de Pokémon Essentials / RGSS.
   - Es una bifurcación moderna de `mkxp` (de Ancurio) optimizada para soportar bindings de Ruby, extensiones de Pokémon Essentials, renderizado a 60 FPS y compatibilidad multiplataforma.

2. **`white-axe/mkxp-z-libretro-emscripten` ([github.com/white-axe/mkxp-z-libretro-emscripten](https://github.com/white-axe/mkxp-z-libretro-emscripten)) / PR #255 en `mkxp-z`**:
   - **La base fundamental:** Este proyecto logró portar `mkxp-z` a la API de **Libretro** y compilarlo con **Emscripten** a WebAssembly (`mkxp-z_libretro.wasm`).
   - A diferencia de implementaciones anteriores (como `pulsejet/mkxp-web`) que usaban `mruby 2.1.2` (incompatible con Pokémon Essentials por carecer de Win32API y fibras de Ruby), el núcleo de `white-axe` incluye el **Ruby VM completo (CRuby)**.

3. **`nostalgist` ([github.com/vnglst/nostalgist](https://github.com/vnglst/nostalgist))**:
   - Biblioteca de TypeScript que actúa como pegamento entre Emscripten/Libretro y la API moderna de los navegadores (WebGL, Web Audio API, Web Workers, Gamepad API).
   - Nos permite inicializar el núcleo WASM sin cargar iframes pesados ni frontends estáticos.

---

## 3. Desafíos Técnicos y Soluciones Desarrolladas (Ingeniería Propia)

El binario de referencia presentaba varios bloqueos críticos al ejecutarse en un entorno web de producción moderno. A continuación se detallan los problemas resueltos:

### Desafío 1: Content Security Policy (CSP) y Aislamiento de Origen Cruzado (COOP/COEP)
* **Problema:** Los navegadores modernos bloquean la compilación de WebAssembly dinámico (`WebAssembly.instantiateStreaming`) a menos que el CSP lo permita expresamente. Además, el uso de `SharedArrayBuffer` para audio multihilo requiere aislamiento cross-origin.
* **Solución:**
  - Se añadieron directivas en `<meta http-equiv="Content-Security-Policy">`: `'unsafe-eval' 'wasm-unsafe-eval' blob: worker-src 'self' blob:`.
  - Se configuraron cabeceras `Cross-Origin-Opener-Policy: same-origin` y `Cross-Origin-Embedder-Policy: require-corp` tanto en `vite.config.ts` como en `public/_headers` (para despliegue en producción).
  - Se integró `coi-serviceworker.min.js` para habilitar `SharedArrayBuffer` de forma transparente en navegadores sin soporte nativo de cabeceras locales.

### Desafío 2: Fallo de Creación de Directorios en WASMFS (`mkdirTree` Roto)
* **Problema:** El núcleo WASM fue compilado con `WASMFS` (`HAVE_WASMFS=1`). La biblioteca `nostalgist` intentaba usar `fs.mkdirTree()` para crear la ruta del RTP (`/home/web_user/retroarch/userdata/system/mkxp-z/RTP`). Como `WASMFS` no expone `mkdirTree` en `Module.FS`, lanzaba una excepción silenciosa y el motor nunca encontraba el archivo `Standard.mkxpz`, quedando en pantalla negra.
* **Solución:**
  - En el hook `beforeLaunch`, implementamos la creación recursiva manual de carpetas usando `fs.mkdir()` elemento por elemento.
  - Se movió el archivo del RTP precargado directamente a `/home/web_user/retroarch/userdata/system/mkxp-z/RTP/Standard.mkxpz`.

### Desafío 3: Estructura de Subcarpetas en el ZIP del Usuario (`Errno::ENOENT`)
* **Problema:** Los juegos distribuidos por la comunidad (como `ReminiscenciaV2_3.zip`) suelen contener una carpeta raíz interna (por ejemplo `Reminiscencia V2.3/Data/Scripts.rxdata`). El motor `mkxp-z` monta el paquete y busca `Data/Scripts.rxdata` en la raíz absoluta. Al no encontrarlo, arrojaba:
  ```text
  [mkxp-z exception] : No such file or directory @ rb_sysopen - Data/Scripts.rxdata (Errno::ENOENT)
  ```
* **Solución:**
  - Usando `JSZip`, el cargador analiza la tabla de archivos del ZIP antes de pasárselo al motor.
  - Si detecta que `Game.ini` o `Scripts.rxdata` están dentro de un subdirectorio, extrae y aplana dinámicamente toda la jerarquía en memoria RAM (`compression: 'STORE'`), garantizando que `Data/Scripts.rxdata`, `Graphics/` y `Audio/` queden en la raíz exacta del paquete virtual `game.mkxpz`.

### Desafío 4: Incompatibilidad de Ruby 3.2+ (`File.exists?` Deprecado)
* **Problema:** Pokémon Essentials v19/v20 fue escrito pensando en Ruby 1.8 - 2.x, donde existía el método `File.exists?` (con 's'). En Ruby 3.2+ (la versión compilada en el WASM), este método fue eliminado en favor de `File.exist?` (sin 's'). Durante la carga de la pantalla de inicio (`PScreen_Load_NEW.rb`), el juego invocaba `File.exists?` en `SpriteWindow_MK.rb`, generando:
  ```text
  [mkxp-z msgbox] Excepción: NoMethodError
  [mkxp-z msgbox] Mensaje: undefined method `exists?' for class File
  ```
  Esto provocaba que el juego escribiera en `errorlog.txt` y llamara a `Kernel.exit`.
* **Solución:**
  1. Durante el desempaquetado en memoria, todos los scripts `.rb` son analizados y parcheados automáticamente sustituyendo `File.exists?` por `File.exist?` y `Dir.exists?` por `Dir.exist?`.
  2. Se inyecta un polyfill de arranque prioritario (`Data/export/0000_ruby3_shim.rb` y `Data/0000_ruby3_shim.rb`):
     ```ruby
     class File
       class << self
         def exists?(path); exist?(path); end unless method_defined?(:exists?)
       end
     end
     class Dir
       class << self
         def exists?(path); exist?(path); end unless method_defined?(:exists?)
       end
     end
     Object.const_set(:Fixnum, Integer) unless defined?(Fixnum)
     Object.const_set(:Bignum, Integer) unless defined?(Bignum)
     ```

### Desafío 5: Optimización de Rendimiento y Supresión de Logs WASI
* **Problema:** Durante la ejecución, el subsistema WASI registraba cada lectura de bloque de 1024 bytes en la consola del navegador (`wasi:io/streams@0.2.0::input-stream.blocking-read`), saturando la consola con más de **28,000 líneas por segundo** y consumiendo CPU en serialización de cadenas.
* **Solución:**
  - Se configuró `log_verbosity: false`, `libretro_log_level: 1` y `frontend_log_level: 1`.
  - Se activó `mkxp-z_enableBlitting: 'enabled'` (renderizado acelerado de framebuffer WebGL).
  - Se activó `mkxp-z_threadedAudio: 'enabled'` (desacoplamiento de síntesis de audio fluidsynth del hilo de renderizado).
  - Se habilitó `video_vsync: true` y `video_threaded: true`.

### Desafío 6: Experiencia de Usuario (UI/UX) y Soporte Móvil
* **Problema:** En pantallas grandes existían barras duplicadas ("Menú Principal" apilado dos veces). En pantallas móviles en orientación horizontal, las barras de herramientas ocupaban el 50% de la pantalla tapando los gráficos del juego.
* **Solución:**
  - Se eliminó la barra exterior redundante en `ConsoleDashboard.tsx` cuando `RpgMakerPlayer` está activo.
  - La barra flotante del emulador multi-consola (`cartridge/index.html`) se transformó en una píldora flotante compacta en la esquina superior que oculta etiquetas de texto en móviles.
  - Se añadió una **cruceta táctil virtual (D-Pad)** y botones de acción (Confirmar/Atrás) directamente en el overlay para jugar cómodamente en smartphones y tablets.

---

## 4. Archivos Clave del Módulo

| Archivo | Función |
|---|---|
| [`src/components/common/RpgMakerPlayer.tsx`](file:///c:/Users/MEGABLODFIX/Desktop/anthony-portfolio/src/components/common/RpgMakerPlayer.tsx) | Componente React principal: descompresión, parcheo de scripts, montaje Nostalgist y controles táctiles. |
| [`src/components/common/ConsoleDashboard.tsx`](file:///c:/Users/MEGABLODFIX/Desktop/anthony-portfolio/src/components/common/ConsoleDashboard.tsx) | Tablero AP-DECK OS e integrador de consolas. |
| [`public/mkxp/mkxp-z_libretro.wasm`](file:///c:/Users/MEGABLODFIX/Desktop/anthony-portfolio/public/mkxp/mkxp-z_libretro.wasm) | Núcleo WebAssembly de 42.5 MB con la máquina virtual CRuby compilada. |
| [`public/mkxp/Standard.mkxpz`](file:///c:/Users/MEGABLODFIX/Desktop/anthony-portfolio/public/mkxp/Standard.mkxpz) | Run-Time Package (RTP) estándar de RPG Maker XP (21.4 MB). |
| [`public/games/cartridge/index.html`](file:///c:/Users/MEGABLODFIX/Desktop/anthony-portfolio/public/games/cartridge/index.html) | Emulador universal multi-consola (GBA, NDS, PS1, N64, SNES, Genesis). |

---

## 5. Licencias y Reconocimientos

- **mkxp-z**: Desarrollado por Ancurio y el equipo de mkxp-z bajo licencia GPLv2 / zlib.
- **Port Libretro Emscripten**: Desarrollado por `white-axe` bajo licencia GPLv2.
- **Nostalgist.js**: Desarrollado por `vnglst` bajo licencia MIT.
- **Pokémon Essentials**: Creado por Maruno, Flameguru y Poccil con base en RPG Maker XP de Enterbrain.
