import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiAward, FiHeart, FiPause, FiPlay, FiVolume2, FiVolumeX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// ─── Neon Breaker ────────────────────────────────────────────────────────────
// Brick-breaker arcade game on a canvas: paddle angle physics, sub-stepped collisions
// (no tunnelling at high speed), procedurally generated levels, power-ups, combos,
// particles and synthesized sound. Plays with mouse/touch, keyboard and gamepad.

export const NEON_BREAKER_BEST_KEY = 'neon-breaker-best';

const W = 960;
const H = 600;
const PADDLE_Y = H - 46;
const PADDLE_H = 14;
const PADDLE_W = 130;
const BALL_R = 8;
const BRICK_COLS = 12;
const BRICK_GAP = 6;
const BRICK_TOP = 70;
const BRICK_H = 24;
const MAX_BOUNCE = (60 * Math.PI) / 180;
const POWERUP_CHANCE = 0.14;
const MAX_PARTICLES = 320;

type PowerType = 'wide' | 'multi' | 'slow' | 'life';
type Phase = 'ready' | 'playing' | 'paused' | 'cleared' | 'over';

interface Ball { x: number; y: number; vx: number; vy: number; stuck: boolean; trail: { x: number; y: number }[] }
interface Brick { x: number; y: number; w: number; hp: number; maxHp: number; hue: number; steel: boolean }
interface Power { x: number; y: number; type: PowerType }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; hue: number }
interface Popup { x: number; y: number; text: string; life: number }

const POWER_STYLE: Record<PowerType, { label: string; hue: number }> = {
  wide: { label: 'W', hue: 190 },
  multi: { label: 'M', hue: 300 },
  slow: { label: 'S', hue: 140 },
  life: { label: '+', hue: 350 },
};

const baseSpeed = (level: number) => Math.min(420 + (level - 1) * 28, 760);

/** Brick layout for a level: four patterns rotate, rows and toughness grow with level. */
const buildLevel = (level: number): Brick[] => {
  const rows = Math.min(4 + Math.floor(level / 2), 8);
  const pattern = (level - 1) % 4;
  const brickW = (W - 40 - BRICK_GAP * (BRICK_COLS - 1)) / BRICK_COLS;
  const bricks: Brick[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      const mid = (BRICK_COLS - 1) / 2;
      const keep =
        pattern === 0 ? true
        : pattern === 1 ? (r + c) % 2 === 0
        : pattern === 2 ? Math.abs(c - mid) + Math.abs(r - rows / 2) <= rows / 2 + 3
        : Math.abs(c - mid) <= r + 1;
      if (!keep) continue;
      const steel = level >= 3 && r === 0 && c % 3 === 1;
      const hp = steel ? 3 : 1 + Math.floor((rows - 1 - r) / 3) + (level >= 5 ? 1 : 0);
      bricks.push({
        x: 20 + c * (brickW + BRICK_GAP),
        y: BRICK_TOP + r * (BRICK_H + BRICK_GAP),
        w: brickW,
        hp,
        maxHp: hp,
        hue: steel ? 220 : (190 + r * 28 + level * 17) % 360,
        steel,
      });
    }
  }
  return bricks;
};

// Tiny Web Audio synth for hit/break/power/lose sounds.
class Sfx {
  private ctx: AudioContext | null = null;
  muted = false;
  private tone(freq: number, dur: number, type: OscillatorType, vol = 0.07, slide?: number) {
    if (this.muted) return;
    try {
      if (!this.ctx) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new Ctx();
      }
      const ctx = this.ctx;
      if (ctx.state === 'suspended') ctx.resume();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t + dur);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch { /* audio unavailable */ }
  }
  paddle() { this.tone(330, 0.06, 'square', 0.05); }
  brick(combo: number) { this.tone(520 + Math.min(combo, 8) * 60, 0.07, 'triangle'); }
  steel() { this.tone(180, 0.08, 'square', 0.05); }
  power() { this.tone(660, 0.18, 'sine', 0.08, 1320); }
  lose() { this.tone(300, 0.4, 'sawtooth', 0.06, 80); }
  clear() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, 0.16, 'triangle', 0.07), i * 90)); }
}

export const NeonBreaker: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sfx = useRef(new Sfx());
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [phase, setPhaseState] = useState<Phase>('ready');
  const [best, setBest] = useState(() => Number(localStorage.getItem(NEON_BREAKER_BEST_KEY) ?? 0));
  const [muted, setMuted] = useState(false);

  // Mutable game world, read by the animation loop without re-rendering React.
  const world = useRef({
    paddleX: W / 2,
    targetX: null as number | null,
    keys: { left: false, right: false },
    balls: [] as Ball[],
    bricks: buildLevel(1),
    powers: [] as Power[],
    particles: [] as Particle[],
    popups: [] as Popup[],
    wideUntil: 0,
    slowUntil: 0,
    combo: 0,
    shake: 0,
    score: 0,
    lives: 3,
    level: 1,
    phase: 'ready' as Phase,
  });

  const setPhase = useCallback((p: Phase) => {
    world.current.phase = p;
    setPhaseState(p);
  }, []);

  const resetBall = useCallback(() => {
    world.current.balls = [{ x: world.current.paddleX, y: PADDLE_Y - BALL_R - 1, vx: 0, vy: 0, stuck: true, trail: [] }];
  }, []);

  const launch = useCallback(() => {
    const w = world.current;
    if (w.phase === 'over') return;
    if (w.phase === 'cleared') {
      w.level += 1;
      setLevel(w.level);
      w.bricks = buildLevel(w.level);
      w.powers = [];
      resetBall();
      setPhase('ready');
      return;
    }
    if (w.phase === 'paused') { setPhase('playing'); return; }
    const speed = baseSpeed(w.level);
    w.balls.forEach((b) => {
      if (!b.stuck) return;
      const angle = (Math.random() - 0.5) * 0.6;
      b.vx = Math.sin(angle) * speed;
      b.vy = -Math.cos(angle) * speed;
      b.stuck = false;
    });
    setPhase('playing');
  }, [resetBall, setPhase]);

  const restart = useCallback(() => {
    const w = world.current;
    Object.assign(w, {
      bricks: buildLevel(1), powers: [], particles: [], popups: [],
      wideUntil: 0, slowUntil: 0, combo: 0, score: 0, lives: 3, level: 1,
    });
    setScore(0);
    setLives(3);
    setLevel(1);
    resetBall();
    setPhase('ready');
    containerRef.current?.focus();
  }, [resetBall, setPhase]);

  const togglePause = useCallback(() => {
    const p = world.current.phase;
    if (p === 'playing') setPhase('paused');
    else if (p === 'paused') setPhase('playing');
  }, [setPhase]);

  useEffect(() => {
    resetBall();
    containerRef.current?.focus();
  }, [resetBall]);

  useEffect(() => { sfx.current.muted = muted; }, [muted]);

  // ─── Main loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;

    let frame = 0;
    let last = performance.now();
    const padPressed = new Set<number>();

    const burst = (x: number, y: number, hue: number, n: number) => {
      const w = world.current;
      for (let i = 0; i < n && w.particles.length < MAX_PARTICLES; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 60 + Math.random() * 260;
        w.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.5 + Math.random() * 0.4, hue });
      }
    };

    const addScore = (pts: number, x: number, y: number) => {
      const w = world.current;
      w.score += pts;
      setScore(w.score);
      w.popups.push({ x, y, text: `+${pts}${w.combo > 1 ? `  x${Math.min(w.combo, 5)}` : ''}`, life: 0.8 });
    };

    const applyPower = (type: PowerType, now: number) => {
      const w = world.current;
      sfx.current.power();
      if (type === 'wide') w.wideUntil = now + 12000;
      else if (type === 'slow') w.slowUntil = now + 10000;
      else if (type === 'life') { w.lives = Math.min(w.lives + 1, 5); setLives(w.lives); }
      else if (type === 'multi') {
        const extra: Ball[] = [];
        w.balls.filter((b) => !b.stuck).forEach((b) => {
          const sp = Math.hypot(b.vx, b.vy);
          [-0.35, 0.35].forEach((da) => {
            const a = Math.atan2(b.vx, -b.vy) + da;
            extra.push({ x: b.x, y: b.y, vx: Math.sin(a) * sp, vy: -Math.cos(a) * sp, stuck: false, trail: [] });
          });
        });
        w.balls.push(...extra.slice(0, 8));
      }
    };

    const loseLife = () => {
      const w = world.current;
      sfx.current.lose();
      w.lives -= 1;
      w.combo = 0;
      setLives(w.lives);
      w.shake = reducedMotion.current ? 0 : 14;
      if (w.lives <= 0) {
        setPhase('over');
        const prevBest = Number(localStorage.getItem(NEON_BREAKER_BEST_KEY) ?? 0);
        if (w.score > prevBest) {
          localStorage.setItem(NEON_BREAKER_BEST_KEY, String(w.score));
          setBest(w.score);
        }
      } else {
        w.powers = [];
        w.wideUntil = 0;
        resetBall();
        setPhase('ready');
      }
    };

    const step = (dt: number, now: number) => {
      const w = world.current;
      const paddleW = now < w.wideUntil ? PADDLE_W * 1.5 : PADDLE_W;
      const speedMul = now < w.slowUntil ? 0.65 : 1;

      // Gamepad (standard mapping): stick/D-pad move, A launches, Start pauses.
      const pad = typeof navigator.getGamepads === 'function'
        ? Array.from(navigator.getGamepads()).find((g): g is Gamepad => !!g)
        : undefined;
      let padDir = 0;
      if (pad) {
        const ax = pad.axes[0] ?? 0;
        padDir = pad.buttons[14]?.pressed || ax < -0.3 ? -1 : pad.buttons[15]?.pressed || ax > 0.3 ? 1 : 0;
        const edge = (i: number, run: () => void) => {
          if (pad.buttons[i]?.pressed) { if (!padPressed.has(i)) { padPressed.add(i); run(); } }
          else padPressed.delete(i);
        };
        edge(0, launch);
        edge(9, togglePause);
      }

      // Paddle: pointer target eases in; keys / gamepad move at a fixed speed.
      const dir = (w.keys.right ? 1 : 0) - (w.keys.left ? 1 : 0) + padDir;
      if (dir !== 0) {
        w.targetX = null;
        w.paddleX += Math.sign(dir) * 760 * dt;
      } else if (w.targetX !== null) {
        w.paddleX += (w.targetX - w.paddleX) * Math.min(1, dt * 18);
      }
      w.paddleX = Math.max(paddleW / 2, Math.min(W - paddleW / 2, w.paddleX));

      if (w.phase !== 'playing') {
        w.balls.forEach((b) => { if (b.stuck) { b.x = w.paddleX; b.y = PADDLE_Y - BALL_R - 1; } });
        return;
      }

      // Balls, sub-stepped so a fast ball never skips through a brick.
      for (const b of w.balls) {
        if (b.stuck) { b.x = w.paddleX; continue; }
        const dist = Math.hypot(b.vx, b.vy) * speedMul * dt;
        const steps = Math.max(1, Math.ceil(dist / (BALL_R * 0.75)));
        const sdt = (dt * speedMul) / steps;
        for (let s = 0; s < steps; s++) {
          b.x += b.vx * sdt;
          b.y += b.vy * sdt;

          if (b.x < BALL_R) { b.x = BALL_R; b.vx = Math.abs(b.vx); }
          if (b.x > W - BALL_R) { b.x = W - BALL_R; b.vx = -Math.abs(b.vx); }
          if (b.y < BALL_R) { b.y = BALL_R; b.vy = Math.abs(b.vy); }

          // Paddle: bounce angle depends on where it hits, speed is preserved.
          if (b.vy > 0 && b.y + BALL_R >= PADDLE_Y && b.y - BALL_R <= PADDLE_Y + PADDLE_H &&
              Math.abs(b.x - w.paddleX) <= paddleW / 2 + BALL_R) {
            const rel = Math.max(-1, Math.min(1, (b.x - w.paddleX) / (paddleW / 2)));
            const sp = Math.hypot(b.vx, b.vy);
            b.vx = Math.sin(rel * MAX_BOUNCE) * sp;
            b.vy = -Math.cos(rel * MAX_BOUNCE) * sp;
            b.y = PADDLE_Y - BALL_R - 0.5;
            w.combo = 0;
            sfx.current.paddle();
          }

          // Bricks: circle vs rectangle, reflect on the axis of least penetration.
          for (const br of w.bricks) {
            if (br.hp <= 0) continue;
            const cx = Math.max(br.x, Math.min(b.x, br.x + br.w));
            const cy = Math.max(br.y, Math.min(b.y, br.y + BRICK_H));
            const dx = b.x - cx;
            const dy = b.y - cy;
            if (dx * dx + dy * dy > BALL_R * BALL_R) continue;

            const overlapX = Math.min(b.x + BALL_R - br.x, br.x + br.w - (b.x - BALL_R));
            const overlapY = Math.min(b.y + BALL_R - br.y, br.y + BRICK_H - (b.y - BALL_R));
            if (overlapX < overlapY) { b.vx = b.x < br.x + br.w / 2 ? -Math.abs(b.vx) : Math.abs(b.vx); }
            else { b.vy = b.y < br.y + BRICK_H / 2 ? -Math.abs(b.vy) : Math.abs(b.vy); }

            br.hp -= 1;
            const bx = br.x + br.w / 2;
            const by = br.y + BRICK_H / 2;
            if (br.hp <= 0) {
              w.combo += 1;
              const mult = Math.min(w.combo, 5);
              addScore(10 * br.maxHp * w.level * mult, bx, by);
              burst(bx, by, br.hue, 18);
              sfx.current.brick(w.combo);
              if (!reducedMotion.current) w.shake = Math.min(w.shake + 3, 8);
              if (Math.random() < POWERUP_CHANCE) {
                const types: PowerType[] = ['wide', 'multi', 'slow', 'wide', 'multi', 'life'];
                w.powers.push({ x: bx, y: by, type: types[Math.floor(Math.random() * types.length)] });
              }
            } else {
              burst(bx, by, br.hue, 5);
              if (br.steel) sfx.current.steel(); else sfx.current.brick(0);
            }
            break;
          }
        }
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 8) b.trail.shift();
      }

      // Balls that fell off the bottom
      w.balls = w.balls.filter((b) => b.y < H + 40);
      if (w.balls.length === 0) { loseLife(); return; }

      // Falling power-ups
      for (const p of w.powers) {
        p.y += 170 * dt;
        if (p.y >= PADDLE_Y - 8 && p.y <= PADDLE_Y + PADDLE_H + 8 && Math.abs(p.x - w.paddleX) <= paddleW / 2 + 14) {
          applyPower(p.type, now);
          p.y = H + 100;
        }
      }
      w.powers = w.powers.filter((p) => p.y < H + 20);

      // Level cleared
      if (w.bricks.every((br) => br.hp <= 0)) {
        sfx.current.clear();
        w.balls.forEach((b) => { b.vx = 0; b.vy = 0; });
        setPhase('cleared');
      }
    };

    const draw = (now: number) => {
      const w = world.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sx = w.shake ? (Math.random() - 0.5) * w.shake : 0;
      const sy = w.shake ? (Math.random() - 0.5) * w.shake : 0;
      ctx.translate(sx, sy);

      // Background: deep gradient + subtle perspective grid
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0B0620');
      g.addColorStop(1, '#03020A');
      ctx.fillStyle = g;
      ctx.fillRect(-20, -20, W + 40, H + 40);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
      ctx.lineWidth = 1;
      for (let i = -10; i <= 20; i++) {
        ctx.beginPath();
        ctx.moveTo(W / 2 + i * 22, H * 0.55);
        ctx.lineTo(W / 2 + i * 90, H);
        ctx.stroke();
      }
      for (let y = H * 0.55; y < H; y += 26) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Bricks
      for (const br of w.bricks) {
        if (br.hp <= 0) continue;
        const lightness = br.steel ? 62 : 45 + (br.hp / br.maxHp) * 15;
        ctx.fillStyle = `hsla(${br.hue}, ${br.steel ? 15 : 90}%, ${lightness}%, 0.18)`;
        ctx.fillRect(br.x - 3, br.y - 3, br.w + 6, BRICK_H + 6);
        ctx.fillStyle = `hsl(${br.hue}, ${br.steel ? 15 : 90}%, ${lightness}%)`;
        ctx.beginPath();
        ctx.roundRect(br.x, br.y, br.w, BRICK_H, 5);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.fillRect(br.x + 4, br.y + 3, br.w - 8, 3);
        if (br.maxHp > 1) {
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          for (let k = 0; k < br.hp; k++) ctx.fillRect(br.x + 6 + k * 7, br.y + BRICK_H - 7, 4, 3);
        }
      }

      // Power-ups
      for (const p of w.powers) {
        const st = POWER_STYLE[p.type];
        ctx.fillStyle = `hsla(${st.hue}, 95%, 60%, 0.25)`;
        ctx.beginPath(); ctx.roundRect(p.x - 18, p.y - 11, 36, 22, 11); ctx.fill();
        ctx.fillStyle = `hsl(${st.hue}, 95%, 60%)`;
        ctx.beginPath(); ctx.roundRect(p.x - 14, p.y - 8, 28, 16, 8); ctx.fill();
        ctx.fillStyle = '#0B0620';
        ctx.font = 'bold 12px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.label, p.x, p.y + 1);
      }

      // Paddle with glow
      const paddleW = now < w.wideUntil ? PADDLE_W * 1.5 : PADDLE_W;
      const px = w.paddleX - paddleW / 2;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.beginPath(); ctx.roundRect(px - 6, PADDLE_Y - 6, paddleW + 12, PADDLE_H + 12, 12); ctx.fill();
      const pg = ctx.createLinearGradient(px, 0, px + paddleW, 0);
      pg.addColorStop(0, '#38BDF8');
      pg.addColorStop(1, '#A78BFA');
      ctx.fillStyle = pg;
      ctx.beginPath(); ctx.roundRect(px, PADDLE_Y, paddleW, PADDLE_H, 7); ctx.fill();

      // Balls with trails
      for (const b of w.balls) {
        b.trail.forEach((t, i) => {
          ctx.fillStyle = `rgba(244, 114, 182, ${(i / b.trail.length) * 0.35})`;
          ctx.beginPath(); ctx.arc(t.x, t.y, BALL_R * (i / b.trail.length), 0, Math.PI * 2); ctx.fill();
        });
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.beginPath(); ctx.arc(b.x, b.y, BALL_R * 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2); ctx.fill();
      }

      // Particles & score popups
      for (const pt of w.particles) {
        ctx.fillStyle = `hsla(${pt.hue}, 95%, 65%, ${Math.max(0, pt.life)})`;
        ctx.fillRect(pt.x - 2, pt.y - 2, 4, 4);
      }
      ctx.textAlign = 'center';
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      for (const pop of w.popups) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, pop.life)})`;
        ctx.fillText(pop.text, pop.x, pop.y);
      }

      // Active power-up timers
      ctx.textAlign = 'left';
      ctx.font = '600 13px Inter, system-ui, sans-serif';
      let ty = H - 12;
      if (now < w.wideUntil) { ctx.fillStyle = 'hsl(190,95%,65%)'; ctx.fillText(`Paleta ancha ${Math.ceil((w.wideUntil - now) / 1000)}s`, 14, ty); ty -= 18; }
      if (now < w.slowUntil) { ctx.fillStyle = 'hsl(140,95%,60%)'; ctx.fillText(`Cámara lenta ${Math.ceil((w.slowUntil - now) / 1000)}s`, 14, ty); }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const w = world.current;
      step(dt, now);
      // Effects keep animating even while paused/ready so the screen feels alive.
      for (const pt of w.particles) { pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy += 400 * dt; pt.life -= dt; }
      w.particles = w.particles.filter((pt) => pt.life > 0);
      for (const pop of w.popups) { pop.y -= 40 * dt; pop.life -= dt; }
      w.popups = w.popups.filter((pop) => pop.life > 0);
      w.shake = Math.max(0, w.shake - 40 * dt);
      draw(now);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [launch, togglePause, resetBall, setPhase]);

  // ─── Input ─────────────────────────────────────────────────────────────────
  const toCanvasX = (clientX: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * W;
  };

  const handleKey = (e: React.KeyboardEvent, down: boolean) => {
    const keys = world.current.keys;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { keys.left = down; e.preventDefault(); }
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { keys.right = down; e.preventDefault(); }
    else if (!down) return;
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (world.current.phase === 'over') restart(); else launch(); }
    else if (e.key === 'p' || e.key === 'P') togglePause();
    else if (e.key === 'm' || e.key === 'M') setMuted((m) => !m);
    else if (e.key === 'Escape') onBack?.();
  };

  const hold = (side: 'left' | 'right', value: boolean) => { world.current.keys[side] = value; };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={(e) => handleKey(e, true)}
      onKeyUp={(e) => handleKey(e, false)}
      className="w-full h-full flex flex-col bg-[#05030F] text-white select-none overflow-hidden relative outline-none"
    >
      {/* HUD */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#0B0620]/80 border-b border-fuchsia-500/20 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-pulse shrink-0" />
          <span className="font-extrabold text-sm tracking-wider text-fuchsia-300 truncate">NEON BREAKER</span>
          <span className="text-xs text-slate-400 font-mono">NIVEL {level}</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
          <span>PUNTOS <strong className="text-sky-300 text-sm">{score}</strong></span>
          <span className="flex items-center gap-1 text-rose-300" aria-label={`${lives} vidas`}>
            {Array.from({ length: lives }).map((_, i) => <FiHeart key={i} className="w-3.5 h-3.5 fill-current" />)}
          </span>
          <span className="hidden sm:flex items-center gap-1 text-slate-400">
            <FiAward className="w-3.5 h-3.5 text-amber-400" /> RÉCORD <strong className="text-amber-400">{best}</strong>
          </span>
          <button onClick={() => setMuted((m) => !m)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/15" aria-label={muted ? 'Activar sonido' : 'Silenciar'}>
            {muted ? <FiVolumeX className="w-3.5 h-3.5" /> : <FiVolume2 className="w-3.5 h-3.5" />}
          </button>
          <button onClick={togglePause} disabled={phase !== 'playing' && phase !== 'paused'} className="p-1.5 rounded-full bg-white/10 hover:bg-white/15 disabled:opacity-40" aria-label="Pausa">
            {phase === 'paused' ? <FiPlay className="w-3.5 h-3.5" /> : <FiPause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 gap-3">
        <div className="relative w-full max-w-5xl max-h-full aspect-[8/5] rounded-2xl overflow-hidden border border-fuchsia-500/25 shadow-[0_0_60px_rgba(168,85,247,0.15)]">
          <canvas
            ref={canvasRef}
            className="w-full h-full block touch-none cursor-none"
            onPointerMove={(e) => { world.current.targetX = toCanvasX(e.clientX); }}
            onPointerDown={(e) => {
              world.current.targetX = toCanvasX(e.clientX);
              if (world.current.phase === 'over') restart(); else launch();
            }}
          />

          {phase !== 'playing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center pointer-events-none px-6">
              {phase === 'ready' && (
                <>
                  <p className="text-2xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-sky-300 to-fuchsia-300 bg-clip-text text-transparent">
                    {level === 1 && score === 0 ? 'NEON BREAKER' : `NIVEL ${level}`}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300">Toca, haz clic o pulsa Espacio para lanzar</p>
                  <p className="hidden sm:block text-[11px] text-slate-500">Mouse o ← → para mover · P pausa · M sonido · Esc salir</p>
                </>
              )}
              {phase === 'paused' && <p className="text-3xl font-black">PAUSA</p>}
              {phase === 'cleared' && (
                <>
                  <p className="text-3xl sm:text-4xl font-black text-emerald-300">¡NIVEL {level} COMPLETADO!</p>
                  <p className="text-sm text-slate-300">Toca o pulsa Espacio para el siguiente nivel</p>
                </>
              )}
              {phase === 'over' && (
                <div className="pointer-events-auto flex flex-col items-center gap-3 rounded-3xl bg-[#05030F]/85 backdrop-blur-md px-8 py-6 border border-white/10">
                  <p className="text-3xl sm:text-4xl font-black text-rose-400">FIN DE LA PARTIDA</p>
                  <p className="text-sm text-slate-300">
                    Puntos: <strong className="text-sky-300">{score}</strong> · Nivel {level}
                    {score > 0 && score >= best && <span className="block text-amber-300 font-bold mt-1">¡Nuevo récord!</span>}
                  </p>
                  <div className="flex gap-3 pt-1">
                    <button onClick={restart} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400 text-slate-950 font-bold text-xs uppercase tracking-wider active:scale-95">
                      Jugar de nuevo
                    </button>
                    <button onClick={onBack} className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 font-bold text-xs uppercase tracking-wider">
                      Volver al menú
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Touch controls (phones): hold to move, tap to launch */}
        <div className="sm:hidden flex items-center justify-between w-full max-w-sm gap-3">
          {(['left', 'right'] as const).map((side) => (
            <button
              key={side}
              onPointerDown={() => hold(side, true)}
              onPointerUp={() => hold(side, false)}
              onPointerLeave={() => hold(side, false)}
              onPointerCancel={() => hold(side, false)}
              className={`h-14 w-20 rounded-2xl bg-white/10 active:bg-white/20 flex items-center justify-center ${side === 'right' ? 'order-3' : ''}`}
              aria-label={side === 'left' ? 'Mover a la izquierda' : 'Mover a la derecha'}
            >
              {side === 'left' ? <FiChevronLeft className="w-6 h-6" /> : <FiChevronRight className="w-6 h-6" />}
            </button>
          ))}
          <button
            onClick={() => (phase === 'over' ? restart() : launch())}
            className="order-2 h-14 flex-1 rounded-2xl bg-gradient-to-r from-sky-500 to-fuchsia-500 font-bold text-sm"
          >
            {phase === 'over' ? 'Reintentar' : 'Lanzar'}
          </button>
        </div>
      </div>
    </div>
  );
};
