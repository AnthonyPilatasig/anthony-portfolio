import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GameBoyShell } from './GameBoyShell';
import { PixelSprite, makeCritterGrid, CRITTER_PALETTES } from './PixelSprite';

const ENEMY_NAMES = ['NULLPTR', 'RACE.COND', 'MEMLEAK', 'OFF-BY-ONE', 'DEADLOCK', 'SEGFAULT', 'STK.OVRFLW'];
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
  const maxHp = 40 + level * 12;
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

/** Types text out character-by-character, Game-Boy-dialogue style. */
const useTypewriter = (text: string, speedMs = 16) => {
  const [shown, setShown] = useState('');
  useEffect(() => {
    setShown('');
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs]);
  return shown;
};

interface GameBoyBattleProps {
  onClose: () => void;
}

export const GameBoyBattle: React.FC<GameBoyBattleProps> = ({ onClose }) => {
  const [level, setLevel] = useState(1);
  const [enemy, setEnemy] = useState<Enemy>(() => spawnEnemy(1));
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [message, setMessage] = useState(`¡Un ${''} salvaje apareció!`);
  const [phase, setPhase] = useState<'busy' | 'menu' | 'over'>('busy');
  const [wins, setWins] = useState(0);
  const [hitFlash, setHitFlash] = useState<'enemy' | 'player' | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    setMessage(`¡Un ${enemy.name} salvaje apareció!`);
    busyRef.current = true;
    const t = setTimeout(() => { busyRef.current = false; setPhase('menu'); }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enemy]);

  const typed = useTypewriter(message);

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
    setEnemy(spawnEnemy(nextLevel));
  };

  const enemyCounterattack = () => {
    const dmg = rand(6 + level, 14 + level);
    setHitFlash('player');
    setTimeout(() => setHitFlash(null), 250);
    setPlayerHp((hp) => {
      const next = Math.max(0, hp - dmg);
      if (next <= 0) {
        say(`${enemy.name} te dejó fuera de servicio. HP -${dmg}.`, 1200, () => setPhase('over'));
      } else {
        say(`${enemy.name} contraataca. HP -${dmg}.`, 1100);
      }
      return next;
    });
  };

  const act = (action: 'fix' | 'refactor' | 'coffee' | 'run') => {
    if (busyRef.current) return;

    if (action === 'run') {
      say('Escapaste sin problema.', 800, () => nextEncounter(level));
      return;
    }

    if (action === 'coffee') {
      const heal = rand(15, 25);
      setPlayerHp((hp) => Math.min(PLAYER_MAX_HP, hp + heal));
      say(`Tomaste café. HP +${heal}.`, 900, () => enemyCounterattack());
      return;
    }

    const isRefactor = action === 'refactor';
    const dmg = isRefactor ? rand(30, 44) : rand(16, 26);
    setHitFlash('enemy');
    setTimeout(() => setHitFlash(null), 250);

    setEnemy((prevEnemy) => {
      const nextHp = Math.max(0, prevEnemy.hp - dmg);
      return { ...prevEnemy, hp: nextHp };
    });

    const verb = isRefactor ? 'REFACTOR' : 'FIX';
    const willDefeat = enemy.hp - dmg <= 0;

    if (willDefeat) {
      say(`¡Usaste ${verb}! ${enemy.name} fue depurado.`, 1100, () => {
        setWins((w) => w + 1);
        nextEncounter(level + 1);
      });
      return;
    }

    if (isRefactor && Math.random() < 0.3) {
      const recoil = 8;
      setPlayerHp((hp) => Math.max(0, hp - recoil));
      say(`¡Usaste REFACTOR! -${dmg} HP. Rompiste algo más en el camino (-${recoil} HP propio).`, 1300, () => enemyCounterattack());
    } else {
      say(`¡Usaste ${verb}! ${enemy.name} perdió ${dmg} HP.`, 1000, () => enemyCounterattack());
    }
  };

  const restart = () => {
    setPlayerHp(PLAYER_MAX_HP);
    setWins(0);
    setPhase('busy');
    nextEncounter(1);
  };

  const palette = CRITTER_PALETTES[enemy.paletteIdx];
  const enemyHpPct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const playerHpPct = Math.max(0, (playerHp / PLAYER_MAX_HP) * 100);

  const menuDisabled = phase !== 'menu';

  return (
    <GameBoyShell onClose={onClose} title={`DEV•BOY — DEPURADOS: ${wins}`}>
      <div className="w-full aspect-[10/9] bg-[#c8e0b0] relative overflow-hidden select-none">
        {phase === 'over' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0f380f] text-[#9bbc0f] font-mono">
            <p className="text-sm font-bold tracking-widest">GAME OVER</p>
            <p className="text-[10px]">Bugs depurados: {wins}</p>
            <button
              onClick={restart}
              className="mt-2 px-3 py-1.5 border-2 border-[#9bbc0f] text-[10px] tracking-widest hover:bg-[#9bbc0f] hover:text-[#0f380f] transition-colors"
            >
              REINICIAR
            </button>
          </div>
        ) : (
          <>
            {/* enemy */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="text-[9px] font-mono text-[#2b3a1f] mb-1 tracking-wider">
                {enemy.name} <span className="opacity-60">Lv.{enemy.level}</span>
              </div>
              <div className="w-20 h-2 border border-[#2b3a1f] bg-[#e4f0d4] mb-2">
                <div className="h-full bg-[#4a8a3a] transition-all duration-300" style={{ width: `${enemyHpPct}%` }} />
              </div>
              <div
                className={`transition-transform ${hitFlash === 'enemy' ? 'animate-[wiggle_0.25s_ease-in-out]' : ''}`}
                style={{ filter: hitFlash === 'enemy' ? 'brightness(2)' : undefined }}
              >
                <PixelSprite grid={enemy.grid} palette={palette} pixelSize={6} />
              </div>
            </div>

            {/* player status */}
            <div className={`absolute bottom-[68px] left-2 text-[8px] font-mono text-[#2b3a1f] bg-[#e4f0d4]/80 px-1.5 py-1 rounded ${hitFlash === 'player' ? 'animate-pulse' : ''}`}>
              <div className="tracking-wider mb-0.5">ANTHONY.EXE</div>
              <div className="w-16 h-1.5 border border-[#2b3a1f] bg-[#e4f0d4]">
                <div className="h-full bg-[#3a6ab0] transition-all duration-300" style={{ width: `${playerHpPct}%` }} />
              </div>
            </div>

            {/* dialogue box */}
            <div className="absolute bottom-0 left-0 right-0 h-[64px] bg-[#e4f0d4] border-t-2 border-[#2b3a1f] px-2 py-1.5">
              {phase === 'menu' ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 h-full items-center font-mono text-[9px] text-[#2b3a1f] tracking-wider">
                  <button disabled={menuDisabled} onClick={() => act('fix')} className="text-left hover:text-[#4a8a3a]">▸ FIX</button>
                  <button disabled={menuDisabled} onClick={() => act('refactor')} className="text-left hover:text-[#4a8a3a]">▸ REFACTOR</button>
                  <button disabled={menuDisabled} onClick={() => act('coffee')} className="text-left hover:text-[#4a8a3a]">▸ CAFÉ</button>
                  <button disabled={menuDisabled} onClick={() => act('run')} className="text-left hover:text-[#4a8a3a]">▸ HUIR</button>
                </div>
              ) : (
                <p className="font-mono text-[9px] leading-relaxed text-[#2b3a1f]">{typed}</p>
              )}
            </div>
          </>
        )}
      </div>
    </GameBoyShell>
  );
};
