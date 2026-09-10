// Ambient augmentations for web-platform attributes React's own typings don't know
// about yet.
import 'react';

declare module 'react' {
  // `T` must stay to match the original declaration's type param count, so TS can
  // merge the two interfaces, even though nothing below references it directly.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface IframeHTMLAttributes<T> {
    /**
     * Loads the iframe in COEP: credentialless mode (no CORP header required from the
     * embedded content) instead of the stricter `require-corp`. Ships in current
     * browsers but isn't in React's DOM typings yet — this site enables it globally
     * (see index.html's `window.coi` config) for embeds like Spotify/YouTube that
     * don't send CORP headers.
     */
    credentialless?: boolean | string;
  }
}
