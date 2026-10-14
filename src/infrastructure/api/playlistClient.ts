import type { MusicPlaylist } from '@domain/entities/music-playlist.entity';

/**
 * Reads the playlist generated at build time by scripts/sync-playlist.mjs. Returns null
 * when the file is missing or malformed so callers can fall back to the Spotify embed.
 */
export const fetchMusicPlaylist = async (signal?: AbortSignal): Promise<MusicPlaylist | null> => {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}music/playlist.json`, { signal });
    if (!res.ok) return null;
    const data = (await res.json()) as MusicPlaylist;
    return Array.isArray(data?.tracks) ? data : null;
  } catch {
    return null;
  }
};
