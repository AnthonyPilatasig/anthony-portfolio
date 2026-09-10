import { Nostalgist } from 'nostalgist';

export type NostalgistInstance = Nostalgist;
export type NostalgistLaunchOptions = Parameters<typeof Nostalgist.launch>[0];

/**
 * Thin adapter over the `nostalgist` package — the only place in the app that
 * imports it directly. Presentation depends on this port instead of the
 * third-party library, so the emulator engine could be swapped without
 * touching the RPG Maker player component.
 */
export const launchNostalgistCore = (options: NostalgistLaunchOptions) => Nostalgist.launch(options);
