/**
 * Whether the device can afford purely decorative, continuously running effects
 * (smooth-scroll loop, particle canvas). Touch devices, visitors who asked for reduced
 * motion and low-core CPUs (typical mid-range phones) get the lightweight version.
 */
export const prefersRichMotion = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  return finePointer && !reducedMotion && cores > 4;
};
