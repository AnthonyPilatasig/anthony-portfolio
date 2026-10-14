import { useEffect, useState } from 'react';

// Battery Status API: Chromium only, and not in TypeScript's DOM lib.
interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
}

export interface BatteryInfo {
  /** 0–100 */
  level: number;
  charging: boolean;
}

/**
 * Real device status for the console's status bar: network connectivity and, when the
 * browser exposes it, the battery. `battery` stays null where the API doesn't exist
 * (Firefox, Safari) so the UI can simply hide it instead of showing made-up values.
 */
export const useDeviceStatus = () => {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [battery, setBattery] = useState<BatteryInfo | null>(null);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    if (typeof nav.getBattery !== 'function') return;

    let manager: BatteryManager | null = null;
    let cancelled = false;
    const read = () => {
      if (manager && !cancelled) setBattery({ level: Math.round(manager.level * 100), charging: manager.charging });
    };

    nav.getBattery().then((m) => {
      if (cancelled) return;
      manager = m;
      read();
      m.addEventListener('levelchange', read);
      m.addEventListener('chargingchange', read);
    }).catch(() => { /* battery info not available */ });

    return () => {
      cancelled = true;
      manager?.removeEventListener('levelchange', read);
      manager?.removeEventListener('chargingchange', read);
    };
  }, []);

  return { online, battery };
};
