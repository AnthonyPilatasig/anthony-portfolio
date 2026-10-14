import { useEffect, useRef } from 'react';

export interface GamepadActions {
  left: () => void;
  right: () => void;
  /** Ⓐ / Cross */
  confirm: () => void;
  /** Ⓑ / Circle */
  back: () => void;
  /** Ⓧ / Square */
  info: () => void;
}

// Standard Gamepad mapping (https://w3c.github.io/gamepad/#remapping).
const BUTTON = { A: 0, B: 1, X: 2, DPAD_UP: 12, DPAD_DOWN: 13, DPAD_LEFT: 14, DPAD_RIGHT: 15 } as const;
const STICK_THRESHOLD = 0.55;
// Holding a direction repeats like a console menu: first after 380 ms, then every 160 ms.
const REPEAT_DELAY_MS = 380;
const REPEAT_RATE_MS = 160;

/**
 * Polls connected gamepads while `enabled` and maps them to menu actions. Buttons fire on
 * press (not while held); directions auto-repeat. Games handle their own input, so callers
 * disable this while one is running.
 */
export const useGamepadNavigation = (enabled: boolean, actions: GamepadActions) => {
  // Latest handlers without restarting the polling loop on every render.
  const actionsRef = useRef(actions);
  useEffect(() => {
    actionsRef.current = actions;
  });

  useEffect(() => {
    if (!enabled || typeof navigator.getGamepads !== 'function') return;

    let frame = 0;
    const pressed = new Set<number>();
    let heldDirection: 'left' | 'right' | null = null;
    let nextRepeatAt = 0;

    const poll = (now: number) => {
      const pad = Array.from(navigator.getGamepads()).find((p): p is Gamepad => !!p);
      if (pad) {
        const isDown = (i: number) => !!pad.buttons[i]?.pressed;
        const onPress = (i: number, run: () => void) => {
          if (isDown(i) && !pressed.has(i)) { pressed.add(i); run(); }
          else if (!isDown(i)) pressed.delete(i);
        };
        onPress(BUTTON.A, () => actionsRef.current.confirm());
        onPress(BUTTON.B, () => actionsRef.current.back());
        onPress(BUTTON.X, () => actionsRef.current.info());

        // Up/down act as previous/next too, for themes whose game list is vertical.
        const x = pad.axes[0] ?? 0;
        const y = pad.axes[1] ?? 0;
        const direction =
          isDown(BUTTON.DPAD_LEFT) || isDown(BUTTON.DPAD_UP) || x < -STICK_THRESHOLD || y < -STICK_THRESHOLD ? 'left'
          : isDown(BUTTON.DPAD_RIGHT) || isDown(BUTTON.DPAD_DOWN) || x > STICK_THRESHOLD || y > STICK_THRESHOLD ? 'right'
          : null;

        if (direction !== heldDirection) {
          heldDirection = direction;
          if (direction) {
            actionsRef.current[direction]();
            nextRepeatAt = now + REPEAT_DELAY_MS;
          }
        } else if (direction && now >= nextRepeatAt) {
          actionsRef.current[direction]();
          nextRepeatAt = now + REPEAT_RATE_MS;
        }
      }
      frame = requestAnimationFrame(poll);
    };

    frame = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);
};
