// Anthony's official Spotify Playlist (Liked Songs / Favorites)
export const ANTHONY_SPOTIFY_PLAYLIST_ID = '4QIxKoffJwBltogNu8cGU8';
export const ANTHONY_SPOTIFY_PLAYLIST_NAME = 'AnthonWorld';
export const DEFAULT_SPOTIFY_URL = `https://open.spotify.com/playlist/${ANTHONY_SPOTIFY_PLAYLIST_ID}`;

const STORAGE_KEY = 'anthony_portfolio_spotify_playlist';

/**
 * Extracts a clean embed URL from any Spotify URL or ID
 */
export function formatSpotifyEmbedUrl(input: string): string {
  if (!input || !input.trim()) {
    return `https://open.spotify.com/embed/playlist/${ANTHONY_SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`;
  }

  const trimmed = input.trim();

  // If it's just an ID
  if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) {
    return `https://open.spotify.com/embed/playlist/${trimmed}?utm_source=generator&theme=0`;
  }

  // If it's already an embed URL
  if (trimmed.includes('open.spotify.com/embed/')) {
    return trimmed;
  }

  // If it's a playlist URL
  const playlistMatch = trimmed.match(/playlist\/([a-zA-Z0-9]+)/);
  if (playlistMatch) {
    return `https://open.spotify.com/embed/playlist/${playlistMatch[1]}?utm_source=generator&theme=0`;
  }

  // If it's an album URL
  const albumMatch = trimmed.match(/album\/([a-zA-Z0-9]+)/);
  if (albumMatch) {
    return `https://open.spotify.com/embed/album/${albumMatch[1]}?utm_source=generator&theme=0`;
  }

  // If it's a track URL
  const trackMatch = trimmed.match(/track\/([a-zA-Z0-9]+)/);
  if (trackMatch) {
    return `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator&theme=0`;
  }

  return `https://open.spotify.com/embed/playlist/${ANTHONY_SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`;
}

/**
 * Get the currently configured Spotify playlist (from localStorage or default to AnthonWorld)
 */
export function getSavedSpotifyUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_SPOTIFY_URL;
}

/**
 * Save user custom playlist
 */
export function saveSpotifyUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, url);
  } catch {
    /* ignore */
  }
}
