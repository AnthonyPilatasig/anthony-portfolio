// Anthony's official Spotify Playlist (Liked Songs / Favorites)
export const ANTHONY_SPOTIFY_PLAYLIST_ID = '4QIxKoffJwBltogNu8cGU8';
export const ANTHONY_SPOTIFY_PLAYLIST_NAME = 'AnthonWorld';
export const DEFAULT_SPOTIFY_URL = `https://open.spotify.com/playlist/${ANTHONY_SPOTIFY_PLAYLIST_ID}`;

const STORAGE_KEY = 'anthony_portfolio_spotify_playlist';

export type SpotifyEntityType = 'playlist' | 'album' | 'track';

export interface SpotifyEntity {
  type: SpotifyEntityType;
  id: string;
}

const DEFAULT_ENTITY: SpotifyEntity = { type: 'playlist', id: ANTHONY_SPOTIFY_PLAYLIST_ID };

/**
 * Parses any Spotify playlist/album/track URL, embed URL, URI, or bare ID into
 * its entity type + id. Falls back to Anthony's default playlist when the input
 * doesn't look like anything recognizable.
 */
export function parseSpotifyEntity(input: string): SpotifyEntity {
  const trimmed = input?.trim();
  if (!trimmed) return DEFAULT_ENTITY;

  if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) {
    return { type: 'playlist', id: trimmed };
  }

  const uriMatch = trimmed.match(/^spotify:(playlist|album|track):([a-zA-Z0-9]+)$/);
  if (uriMatch) {
    return { type: uriMatch[1] as SpotifyEntityType, id: uriMatch[2] };
  }

  const urlMatch = trimmed.match(/(playlist|album|track)\/([a-zA-Z0-9]+)/);
  if (urlMatch) {
    return { type: urlMatch[1] as SpotifyEntityType, id: urlMatch[2] };
  }

  return DEFAULT_ENTITY;
}

/**
 * Extracts a clean embed URL from any Spotify URL or ID
 */
export function formatSpotifyEmbedUrl(input: string): string {
  const { type, id } = parseSpotifyEntity(input);
  return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
}

/**
 * Converts any Spotify URL or ID into the `spotify:type:id` URI the iFrame API expects.
 */
export function toSpotifyUri(input: string): string {
  const { type, id } = parseSpotifyEntity(input);
  return `spotify:${type}:${id}`;
}

export interface SpotifyOEmbedInfo {
  title: string;
  thumbnailUrl?: string;
}

/**
 * Spotify's public oEmbed endpoint — no API key or OAuth required. Used to show the
 * real playlist/track name and cover art instead of made-up placeholder text.
 */
export async function fetchSpotifyOEmbed(input: string): Promise<SpotifyOEmbedInfo | null> {
  const { type, id } = parseSpotifyEntity(input);
  const url = `https://open.spotify.com/${type}/${id}`;
  try {
    const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.title) return null;
    return { title: data.title, thumbnailUrl: data.thumbnail_url };
  } catch {
    return null;
  }
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
