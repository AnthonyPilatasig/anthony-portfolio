// Thin adapter over YouTube's official IFrame Player API (no API key needed):
// https://developers.google.com/youtube/iframe_api_reference
// The only place that touches `window.onYouTubeIframeAPIReady` / the injected script.

export const YT_STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 } as const;

export interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(videoId: string): void;
  cueVideoById(videoId: string): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

export interface YouTubePlayerOptions {
  videoId: string;
  width: number | string;
  height: number | string;
  host?: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: () => void;
    onStateChange?: (e: { data: number }) => void;
    onError?: (e: { data: number }) => void;
  };
}

interface YouTubeNamespace {
  Player: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const SCRIPT_SRC = 'https://www.youtube.com/iframe_api';
let apiPromise: Promise<YouTubeNamespace> | null = null;

/** Injects the IFrame API script once and resolves with the `YT` namespace. */
export const loadYouTubeIframeApi = (): Promise<YouTubeNamespace> => {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT!);
    };
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return apiPromise;
};
