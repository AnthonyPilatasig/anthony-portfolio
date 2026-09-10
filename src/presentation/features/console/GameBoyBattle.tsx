import React, { useEffect, useRef, useState } from 'react';
import { FiShield, FiZap, FiCoffee, FiRotateCcw, FiAward, FiActivity } from 'react-icons/fi';
import { PixelSprite } from './PixelSprite';
import { makeCritterGrid, CRITTER_PALETTES } from './critterSprite';

const ENEMY_NAMES = ['NULL_POINTER_EXCEPTION', 'RACE_CONDITION', 'MEMORY_LEAK', 'DEADLOCK_MUTEX', 'STACK_OVERFLOW', 'SEGMENTATION_FAULT'];
const PLAYER_MAX_HP = 100;
const SPRITE_SIZE = 16;

interface Enemy {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  grid: number[][];
  paletteIdx: number;
}

const spawnEnemy = (level: number): Enemy => {
  const paletteIdx = Math.floor(Math.random() * CRITTER_PALETTES.length);
  const maxHp = 45 + level * 15;
  return {
    name: ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)],
    level,
    hp: maxHp,
    maxHp,
    grid: makeCritterGrid(SPRITE_SIZE, Math.floor(Math.random() * 1000)),
    paletteIdx,
  };
};

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export interface GameBoyBattleProps {
  onClose?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
}

export const GameBoyBattle: React.FC<GameBoyBattleProps> = ({ onClose, onBack, onComplete }) => {
  const handleExit = onBack || onClose || onComplete || (() => {});
  const [level, setLevel] = useState(1);
  const [enemy, setEnemy] = useState<Enemy>(() => spawnEnemy(1));
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [shield, setShield] = useState(25);
  const [message, setMessage] = useState(
    () => `¡Alerta de Sistema! Detectada anomalía: ${enemy.name} (Nivel ${enemy.level})`
  );
  const [phase, setPhase] = useState<'busy' | 'menu' | 'over'>('busy');
  const [wins, setWins] = useState(0);
  const [hitFlash, setHitFlash] = useState<'enemy' | 'player' | null>(null);
  const busyRef = useRef(false);

  // Mount-only: hold the opening "system alert" message before accepting input.
  // Later encounters announce themselves via `say()` inside nextEncounter, since
  // they're already triggered from an event handler rather than a render-driven effect.
  useEffect(() => {
    busyRef.current = true;
    const t = setTimeout(() => { busyRef.current = false; setPhase('menu'); }, 900);
    return () => clearTimeout(t);
  }, []);

  const say = (msg: string, holdMs: number, after?: () => void) => {
    setMessage(msg);
    busyRef.current = true;
    setPhase('busy');
    setTimeout(() => {
      busyRef.current = false;
      if (after) after();
      else setPhase('menu');
    }, holdMs);
  };

  const nextEncounter = (nextLevel: number) => {
    setLevel(nextLevel);
    const next = spawnEnemy(nextLevel);
    setEnemy(next);
    setShield(prev => Math.min(50, prev + 15));
    say(`¡Alerta de Sistema! Detectada anomalía: ${next.name} (Nivel ${next.level})`, 900);
  };

  const enemyCounterattack = () => {
    const dmg = rand(8 + level * 2, 16 + level * 2);
    setHitFlash('player');
    setTimeout(() => setHitFlash(null), 250);

    setPlayerHp((hp) => {
      let actualDmg = dmg;
      if (shield > 0) {
        const absorb = Math.min(shield, dmg);
        setShield(s => Math.max(0, s - absorb));
        actualDmg -= absorb;
      }
      const next = Math.max(0, hp - actualDmg);
      if (next <= 0) {
        say(`${enemy.name} ejecutó un ataque crítico. El sistema colapsó.`, 1300, () => setPhase('over'));
      } else {
        say(`${enemy.name} contraataca. Daño recibido: -${actualDmg} HP.`, 1100);
      }
      return next;
    });
  };

  const act = (action: 'refactor' | 'shield' | 'coffee' | 'deploy') => {
    if (phase !== 'menu' || busyRef.current) return;

    if (action === 'refactor') {
      const dmg = rand(18, 30) + level * 4;
      const crit = Math.random() < 0.25;
      const totalDmg = crit ? Math.floor(dmg * 1.6) : dmg;
      setHitFlash('enemy');
      setTimeout(() => setHitFlash(null), 250);

      setEnemy((prev) => {
        const nextHp = Math.max(0, prev.hp - totalDmg);
        if (nextHp <= 0) {
          const nextWins = wins + 1;
          setWins(nextWins);
          say(`¡${prev.name} fue depurado con éxito! (+${totalDmg} daño)`, 1200, () => {
            say(`Preparando siguiente hilo de ejecución...`, 900, () => nextEncounter(level + 1));
          });
        } else {
          say(`${crit ? '¡GOLPE CRÍTICO! ' : ''}Refactorización aplicada: -${totalDmg} HP a ${prev.name}.`, 1100, enemyCounterattack);
        }
        return { ...prev, hp: nextHp };
      });
    } else if (action === 'shield') {
      const addedShield = rand(20, 35);
      setShield(s => Math.min(60, s + addedShield));
      say(`Clean Architecture activada. Escudo aumentado en +${addedShield}.`, 1000, enemyCounterattack);
    } else if (action === 'coffee') {
      const heal = rand(25, 45);
      setPlayerHp(hp => Math.min(PLAYER_MAX_HP, hp + heal));
      say(`Café de especialidad consumido. Recuperados +${heal} HP.`, 1000, enemyCounterattack);
    } else if (action === 'deploy') {
      const chance = Math.random();
      if (chance > 0.4) {
        const dmg = rand(35, 55) + level * 6;
        setHitFlash('enemy');
        setTimeout(() => setHitFlash(null), 300);
        setEnemy((prev) => {
          const nextHp = Math.max(0, prev.hp - dmg);
          if (nextHp <= 0) {
            setWins(w => w + 1);
            say(`¡DEPLOY A PRODUCCIÓN EXITOSO! Bug eliminado (-${dmg} HP).`, 1300, () => nextEncounter(level + 1));
          } else {
            say(`Deploy a producción causó impacto masivo: -${dmg} HP.`, 1100, enemyCounterattack);
          }
          return { ...prev, hp: nextHp };
        });
      } else {
        say(`Pipeline de CI/CD falló en el despliegue. Turno perdido.`, 1100, enemyCounterattack);
      }
    }
  };

  const restart = () => {
    setPlayerHp(PLAYER_MAX_HP);
    setShield(25);
    setWins(0);
    setPhase('busy');
    nextEncounter(1);
  };

  const palette = CRITTER_PALETTES[enemy.paletteIdx];
  const enemyHpPct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const playerHpPct = Math.max(0, (playerHp / PLAYER_MAX_HP) * 100);
  const menuDisabled = phase !== 'menu';

  return (
    <div className="w-full h-full flex flex-col bg-[#050811] text-white select-none overflow-hidden relative">
      {/* Background Cyber Grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute inset-0 bg-radial from-transparent via-[#050811]/60 to-[#050811] pointer-events-none" />

      {/* Top Arena HUD Bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-3 bg-[#0A0E1A]/80 border-b border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-extrabold text-sm tracking-wider text-cyan-400">CYBER-ENCOUNTER: CLEAN ARCH ARENA</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-amber-400 flex items-center gap-1 font-bold">
            <FiAward className="w-3.5 h-3.5" /> BUGS DEPURADOS: {wins}
          </span>
          <span className="text-slate-400">NIVEL: {level}</span>
        </div>
      </div>

      {/* Main Battle Arena Stage */}
      <div className="flex-1 relative z-10 flex flex-col justify-between p-6 sm:p-10 max-w-5xl mx-auto w-full">
        {phase === 'over' ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <FiActivity className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-rose-400 tracking-tight">KERNEL PANIC / GAME OVER</h2>
            <p className="text-slate-400 text-sm max-w-md">El monolito de deuda técnica superó tus recursos del sistema. Lograste depurar <strong className="text-white">{wins} bugs</strong>.</p>
            <div className="flex gap-4 pt-2">
              <button
                onClick={restart}
                className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-transform active:scale-95 shadow-lg shadow-cyan-500/20"
              >
                Reiniciar Servidor
              </button>
              <button
                onClick={handleExit}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs tracking-wider uppercase transition-colors"
              >
                Volver
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Enemy Showcase Stage */}
            <div className="flex flex-col items-center justify-center pt-2">
              {/* Enemy Info Card */}
              <div className="w-full max-w-md bg-white/[0.04] border border-cyan-500/20 rounded-2xl p-4 backdrop-blur-md mb-6 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-cyan-300 font-mono tracking-wider">{enemy.name}</span>
                  <span className="text-xs font-bold text-rose-400 font-mono">Lv.{enemy.level} BOSS</span>
                </div>
                {/* Health Bar */}
                <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"
                    style={{ width: `${enemyHpPct}%` }}
                  />
                </div>
                <div className="flex justify-end text-[10px] font-mono text-slate-400 mt-1">
                  HP: {enemy.hp} / {enemy.maxHp}
                </div>
              </div>

              {/* Enemy Pixel Hologram */}
              <div
                className={`p-4 rounded-3xl transition-transform duration-200 ${hitFlash === 'enemy' ? 'scale-110 brightness-200' : 'hover:scale-105'}`}
                style={{
                  background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
                }}
              >
                <PixelSprite grid={enemy.grid} palette={palette} pixelSize={10} />
              </div>
            </div>

            {/* Bottom Section: Player Stats + Actions + Terminal Log */}
            <div className="space-y-4 pt-4">
              {/* Player Status HUD */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.04] border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-xs text-cyan-400">
                    DEV
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide">ANTHONY_ARCHITECT.TS</div>
                    <div className="text-[11px] text-slate-400 font-mono">Nivel {level} · TypeScript Runtime</div>
                  </div>
                </div>

                {/* Player Health & Shield */}
                <div className="flex items-center gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-bold">HP</span>
                      <span className="text-white">{playerHp}/{PLAYER_MAX_HP}</span>
                    </div>
                    <div className="w-32 sm:w-44 h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${playerHpPct}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-cyan-400 font-bold">ESCUDO</span>
                      <span className="text-cyan-300">{shield}/60</span>
                    </div>
                    <div className="w-24 sm:w-32 h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${(shield / 60) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  disabled={menuDisabled}
                  onClick={() => act('refactor')}
                  className="p-3.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 font-bold text-xs flex items-center gap-2.5 text-cyan-300 transition-all hover:scale-102 active:scale-98 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <FiZap className="w-4 h-4 text-cyan-400" />
                  <span>▸ REFACTORIZAR</span>
                </button>

                <button
                  disabled={menuDisabled}
                  onClick={() => act('shield')}
                  className="p-3.5 rounded-2xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 font-bold text-xs flex items-center gap-2.5 text-indigo-300 transition-all hover:scale-102 active:scale-98 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <FiShield className="w-4 h-4 text-indigo-400" />
                  <span>▸ ARQUITECTURA</span>
                </button>

                <button
                  disabled={menuDisabled}
                  onClick={() => act('coffee')}
                  className="p-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 font-bold text-xs flex items-center gap-2.5 text-amber-300 transition-all hover:scale-102 active:scale-98 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <FiCoffee className="w-4 h-4 text-amber-400" />
                  <span>▸ RECARGAR CAFÉ</span>
                </button>

                <button
                  disabled={menuDisabled}
                  onClick={() => act('deploy')}
                  className="p-3.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 font-bold text-xs flex items-center gap-2.5 text-rose-300 transition-all hover:scale-102 active:scale-98 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <FiRotateCcw className="w-4 h-4 text-rose-400" />
                  <span>▸ DEPLOY PROD</span>
                </button>
              </div>

              {/* Battle Terminal Log */}
              <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 font-mono text-xs text-slate-300 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">LOG:</span>
                <span className="truncate">{message}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
