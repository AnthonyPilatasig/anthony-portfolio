import type { MusicPlaylist } from '@domain/entities/music-playlist.entity';
import { fetchMusicPlaylist } from '@infrastructure/api/playlistClient';

/**
 * The synced Spotify→YouTube playlist, or null when there is nothing playable yet
 * (the sync workflow hasn't run, or every track failed to match).
 */
export const getMusicPlaylist = async (signal?: AbortSignal): Promise<MusicPlaylist | null> => {
  const playlist = await fetchMusicPlaylist(signal);
  return playlist && playlist.tracks.length > 0 ? playlist : null;
};
