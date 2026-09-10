// Thin adapter over Spotify's official embed iFrame API (no API key needed):
// https://developer.spotify.com/documentation/embeds/references/iframe-api
// The only place in the app that touches `window.onSpotifyIframeApiReady` / the
// injected <script> tag — presentation code just calls loadSpotifyIframeApi().

export interface SpotifyPlaybackUpdateEvent {
  data: {
    isBuffering: boolean;
    isPaused: boolean;
    duration: number;
    position: number;
  };
}

export interface SpotifyEmbedController {
  play(): void;
  pause(): void;
  resume(): void;
  togglePlay(): void;
  seek(seconds: number): void;
  loadUri(uri: string): void;
  addListener(event: 'ready', callback: () => void): void;
  addListener(event: 'playback_update', callback: (e: SpotifyPlaybackUpdateEvent) => void): void;
  removeListener(event: 'ready' | 'playback_update'): void;
}

export interface SpotifyEmbedOptions {
  uri: string;
  width?: string | number;
  height?: string | number;
}

interface SpotifyIFrameAPI {
  createController(
    element: HTMLElement,
    options: SpotifyEmbedOptions,
    callback: (controller: SpotifyEmbedController) => void
  ): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: SpotifyIFrameAPI) => void;
  }
}

const SCRIPT_SRC = 'https://open.spotify.com/embed/iframe-api/v1';
let apiPromise: Promise<SpotifyIFrameAPI> | null = null;

/**
 * Injects Spotify's embed iFrame API script (once) and resolves with the API
 * object once it signals readiness.
 */
export const loadSpotifyIframeApi = (): Promise<SpotifyIFrameAPI> => {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => resolve(IFrameAPI);

    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return apiPromise;
};
