import React, { useEffect, useState } from 'react';
import type { MusicPlaylist } from '@domain/entities/music-playlist.entity';
import { getMusicPlaylist } from '@application/useCases/music/getMusicPlaylist';
import { RetroPixelPlayer } from './RetroPixelPlayer';
import { YouTubeCassettePlayer } from './YouTubeCassettePlayer';

/**
 * Cassette music player. Plays full songs from YouTube using the playlist synced from
 * Spotify (public/music/playlist.json); until that playlist exists it falls back to the
 * Spotify embed, which only gives 30-second previews to visitors without a Spotify login.
 */
export const GlobalAudioPlayer: React.FC = () => {
  // undefined = still loading, null = no synced playlist available.
  const [playlist, setPlaylist] = useState<MusicPlaylist | null | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    getMusicPlaylist(controller.signal).then((p) => {
      if (!controller.signal.aborted) setPlaylist(p);
    });
    return () => controller.abort();
  }, []);

  if (playlist === undefined) return null;
  return playlist ? <YouTubeCassettePlayer playlist={playlist} /> : <RetroPixelPlayer />;
};

export default GlobalAudioPlayer;
