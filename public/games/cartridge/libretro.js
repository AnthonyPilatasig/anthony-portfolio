/**
 * RetroArch / Libretro Virtual Web Player — Edge-to-Edge Widescreen Driver
 */

const defaultCore = "mgba";
var autoStart = true;

var BrowserFS = BrowserFS;
var afs;
var zipfs;
var xhrfs;
var initializationCount = 0;
var Module;
var currentCore;
var reloadTimeout;
var retroArchRunning = false;
var canvas = document.getElementById("canvas");

function showToast(msg) {
   $('#toastMsg').text(msg);
   $('#toastNotify').addClass('show');
   setTimeout(function() {
      $('#toastNotify').removeClass('show');
   }, 3500);
}

function modulePreRun(module) {
   module.ENV["LIBRARY_PATH"] = module.corePath;
}

var ModuleBase = {
   noInitialRun: true,
   retroArchSend: function(msg) {
      if (this.EmscriptenSendCommand) {
         this.EmscriptenSendCommand(msg);
      }
   },
   retroArchRecv: function() {
      if (this.EmscriptenReceiveCommandReply) {
         return this.EmscriptenReceiveCommandReply();
      }
      return "";
   },
   retroArchExit: function(core, content) {
      relaunch(core, content);
   },
   print: function(text) {
      console.log("stdout:", text);
   },
   printErr: function(text) {
      console.log("stderr:", text);
   },
   canvas: canvas
};

function cleanupStorage() {
   localStorage.clear();
   if (BrowserFS.FileSystem.IndexedDB.isAvailable()) {
      var req = indexedDB.deleteDatabase("RetroArch");
      req.onsuccess = function() {
         console.log("Deleted database successfully");
         showToast("Datos y partidas guardadas eliminados con éxito.");
      };
      req.onerror = function() {
         console.error("Couldn't delete database");
      };
   }
}

function idbfsInit() {
   var imfs = new BrowserFS.FileSystem.InMemory();
   if (BrowserFS.FileSystem.IndexedDB.isAvailable()) {
      BrowserFS.FileSystem.IndexedDB.Create({storeName: "RetroArch"}, function(e, idbfs) {
         if (e) {
            afs = new BrowserFS.FileSystem.InMemory();
            console.error("WEBPLAYER: error (idbfs): " + e + " falling back to in-memory filesystem");
            appInitialized();
         } else {
            BrowserFS.FileSystem.AsyncMirror.Create({sync: imfs, async: idbfs}, function(e, fs) {
               if (e) {
                  afs = new BrowserFS.FileSystem.InMemory();
                  console.error("WEBPLAYER: error (afs): " + e + " falling back to in-memory filesystem");
                  appInitialized();
               } else {
                  afs = fs;
                  console.log("WEBPLAYER: idbfs setup successful");
                  appInitialized();
               }
            });
         }
      });
   } else {
      afs = new BrowserFS.FileSystem.InMemory();
      console.error("WEBPLAYER: idbfs not available; falling back to in-memory filesystem");
      appInitialized();
   }
}

function zipfsInit() {
   let buffer = new ArrayBuffer(256 * 1024 * 1024);
   let bufferView = new Uint8Array(buffer);
   let idx = 0;
   Promise.all([
      fetch("assets/frontend/bundle.zip.aa"),
      fetch("assets/frontend/bundle.zip.ab"),
      fetch("assets/frontend/bundle.zip.ac"),
      fetch("assets/frontend/bundle.zip.ad"),
      fetch("assets/frontend/bundle.zip.ae")
   ]).then(function(resps) {
      Promise.all(resps.map((r) => r.arrayBuffer())).then(function(buffers) {
         for (let buf of buffers) {
            if (idx + buf.byteLength > buffer.maxByteLength) {
               console.error("WEBPLAYER: error: bundle.zip is too large");
            }
            bufferView.set(new Uint8Array(buf), idx, buf.byteLength);
            idx += buf.byteLength;
         }
         BrowserFS.FileSystem.ZipFS.Create({zipData: BrowserFS.BFSRequire('buffer').Buffer(new Uint8Array(buffer, 0, idx))}, function(e, fs) {
            if (e) {
               zipfs = new BrowserFS.FileSystem.InMemory();
               console.error("WEBPLAYER: error (zipfs): " + e + " falling back to in-memory filesystem");
               appInitialized();
            } else {
               zipfs = fs;
               console.log("WEBPLAYER: zipfs setup successful");
               appInitialized();
            }
         });
      });
   }).catch(function(err) {
      console.error("WEBPLAYER: bundle fetch error:", err);
      zipfs = new BrowserFS.FileSystem.InMemory();
      appInitialized();
   });
}

function xhrfsInit() {
   xhrfs = new BrowserFS.FileSystem.InMemory();
   appInitialized();
}

function appInitialized() {
   initializationCount++;
   if (initializationCount == 4) {
      finishFileSystemSetup();
      preLoadingComplete();
   }
}

function mountBrowserFS() {
   var BFS = new BrowserFS.EmscriptenFS(Module.FS, Module.PATH, Module.ERRNO_CODES);
   Module.FS.mount(BFS, {
      root: '/home'
   }, '/home');

   Module.FS.writeFile("/home/web_user/retroarch/cores/" + currentCore + "_libretro.core", new Uint8Array());
   for (let core of Object.keys(libretroCores)) {
      Module.FS.writeFile("/home/web_user/retroarch/cores/" + core + "_libretro.core", new Uint8Array());
   }
}

function finishFileSystemSetup() {
   var mfs = new BrowserFS.FileSystem.MountableFileSystem();
   mfs.mount('/home/web_user/retroarch', zipfs);
   mfs.mount('/home/web_user/retroarch/cores', new BrowserFS.FileSystem.InMemory());
   mfs.mount('/home/web_user/retroarch/userdata', afs);
   mfs.mount('/home/web_user/retroarch/userdata/content/downloads', xhrfs);
   BrowserFS.initialize(mfs);
   mountBrowserFS();

   console.log("WEBPLAYER: filesystem initialization successful");
}

function preLoadingComplete() {
   console.log("WEBPLAYER: Preload complete. Auto-starting RetroArch...");
   $('#initSplash').addClass('hidden');
   if (autoStart && !retroArchRunning) {
      startRetroArch();
   }
}

function detectCoreForFile(filename) {
   var ext = filename.split('.').pop().toLowerCase();
   if (ext === 'gba') return 'mgba';
   if (ext === 'gb' || ext === 'gbc') return 'gambatte';
   if (ext === 'nes') return 'fceumm';
   return currentCore || defaultCore;
}

function startRetroArch(contentPath) {
   $('#canvas').show();
   $('#initSplash').addClass('hidden');

   retroArchRunning = true;
   if (contentPath) {
      ModuleBase.arguments = ["-v", contentPath, "-c", "/home/web_user/retroarch/userdata/retroarch.cfg"];
   } else {
      ModuleBase.arguments = ["-v", "--menu", "-c", "/home/web_user/retroarch/userdata/retroarch.cfg"];
   }
   Module.arguments = ModuleBase.arguments;
   Module.callMain(Module.arguments);
   if (canvas) canvas.focus();
}

function selectFiles(files) {
   if (!files || files.length === 0) return;
   var file = files[0];
   showToast("Cargando: " + file.name + "...");

   var filereader = new FileReader();
   filereader.file_name = file.name;
   filereader.readAsArrayBuffer(file);
   filereader.onload = function() {
      uploadDataAndRun(this.result, this.file_name);
   };
}

async function uploadDataAndRun(data, name) {
   var dataView = new Uint8Array(data);
   Module.FS.createDataFile('/', name, dataView, true, false);

   var binData = Module.FS.readFile(name, {
      encoding: 'binary'
   });

   try {
      Module.FS.mkdirTree('/home/web_user/retroarch/userdata/content');
   } catch(e) {}

   var targetPath = '/home/web_user/retroarch/userdata/content/' + name;
   Module.FS.writeFile(targetPath, binData, {
      encoding: 'binary'
   });
   Module.FS.unlink(name);

   // Auto-detect core
   var targetCore = detectCoreForFile(name);
   console.log("WEBPLAYER: Launching game:", targetPath, "with core:", targetCore);
   showToast("Iniciando " + name + "...");

   await relaunch(targetCore, targetPath);
}

async function loadCoreFallback(currentCore) {
   if (currentCore == defaultCore) {
      console.error("Error: couldn't load default core!");
      return;
   }
   await loadCore(defaultCore);
}

async function loadCore(core, args) {
   ModuleBase.arguments = args || ["-v", "--menu", "-c", "/home/web_user/retroarch/userdata/retroarch.cfg"];
   ModuleBase.preRun = [modulePreRun];
   ModuleBase.canvas = canvas;
   ModuleBase.corePath = "/home/web_user/retroarch/cores/" + core + "_libretro.core";

   try {
      let script = await import("./" + core + "_libretro.js");
      try {
         Module = await script.default(Object.assign({}, ModuleBase));
      } catch (err) {
         console.error("Couldn't instantiate module", err);
         await loadCoreFallback(core);
         throw err;
      }
   } catch (err) {
      console.error("Couldn't load script", err);
      await loadCoreFallback(core);
      throw err;
   }
}

async function relaunch(core, content) {
   if (!core) core = ModuleBase.corePath || defaultCore;
   if (!content) content = "--menu";

   Module = null;
   if (reloadTimeout) {
      clearTimeout(reloadTimeout);
      reloadTimeout = null;
   }

   if (core.includes("_libretro.core")) {
      currentCore = core.slice(0, -14).split("/").slice(-1)[0];
   } else if (core.includes("/")) {
      currentCore = core.split("/").slice(-1)[0].replace("_libretro.js", "").replace("_libretro.core", "");
   } else {
      currentCore = core;
   }

   if (!currentCore) currentCore = defaultCore;

   localStorage.setItem("core", currentCore);
   await loadCore(currentCore, ["-v", content, "-c", "/home/web_user/retroarch/userdata/retroarch.cfg"]);
   mountBrowserFS();
   $('#canvas').show();
   $('#initSplash').addClass('hidden');
   retroArchRunning = true;
   Module.callMain(Module.arguments);
   if (canvas) canvas.focus();
}

// ─── DOM Events ─────────────────────────────────────────────────────────────
$(function() {
   // File input picker
   $('#btnPickFile').click(function(e) {
      e.stopPropagation();
      $('#btnRom').click();
   });

   $('#btnRom').change(function(e) {
      if (e.target.files && e.target.files.length > 0) {
         selectFiles(e.target.files);
      }
   });

   // Drag & Drop anywhere on screen
   $(window).on('dragover dragenter', function(e) {
      e.preventDefault();
      e.stopPropagation();
   });
   $(window).on('dragleave dragend drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'drop') {
         var dt = e.originalEvent ? e.originalEvent.dataTransfer : e.dataTransfer;
         if (dt && dt.files && dt.files.length > 0) {
            selectFiles(dt.files);
         }
      }
   });

   // In-Game HUD Actions
   $('#btnResetGame').click(function() {
      if (Module) {
         Module.retroArchSend("RESET");
         showToast("Partida reiniciada");
      }
   });

   $('#btnHudFullscreen').click(function() {
      if (!document.fullscreenElement) {
         document.documentElement.requestFullscreen().catch(() => {});
      } else {
         document.exitFullscreen().catch(() => {});
      }
   });

   $('#btnCleanStorage').click(function() {
      if (confirm("¿Deseas eliminar las partidas y estados guardados en memoria?")) {
         cleanupStorage();
      }
   });

   // Prevent default keyboard browser events when gaming
   window.addEventListener('keydown', function(e) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
         e.preventDefault();
      }
   });

   // Find core and initialize
   currentCore = localStorage.getItem("core") || defaultCore;
   loadCore(currentCore).then(function() {
      console.log("WEBPLAYER: wasm runtime initialized");
      appInitialized();
   });

   idbfsInit();
   zipfsInit();
   xhrfsInit();
});
