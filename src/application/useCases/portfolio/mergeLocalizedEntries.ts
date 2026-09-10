/**
 * Merges the Spanish source-of-truth entries (from portfolioData) with the
 * optional per-locale overrides coming from an i18n `*Data` key, matched by `id`.
 *
 * Pure and framework-free on purpose: presentation calls `useTranslation()` to get
 * the raw override array, then hands both arrays here instead of every page
 * reimplementing the same find-and-spread merge.
 */
export const mergeLocalizedEntries = <T extends { id: number }>(
  baseEntries: T[],
  translatedEntries: unknown
): T[] => {
  const overrides = Array.isArray(translatedEntries) ? (translatedEntries as Partial<T>[]) : [];
  return baseEntries.map((entry) => {
    const override = overrides.find((item) => item.id === entry.id) ?? {};
    return { ...entry, ...override };
  });
};
