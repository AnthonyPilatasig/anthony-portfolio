/** A song from the Spotify playlist, matched to a YouTube video that plays it in full. */
export interface MusicTrack {
  spotifyId: string;
  title: string;
  artist: string;
  durationMs: number;
  cover: string | null;
  youtubeId: string;
}

export interface MusicPlaylist {
  playlist: { id: string; name: string; url: string };
  tracks: MusicTrack[];
}
