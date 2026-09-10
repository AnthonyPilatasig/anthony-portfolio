export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artworkUrl?: string;
  audioUrl: string;
  durationSeconds?: number;
  category: 'anime' | 'ecuador' | 'radio' | 'search';
}

export type IpodMenuMode = 'home' | 'playlist' | 'nowPlaying' | 'search' | 'radio';

export interface PlaylistCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  searchTerm: string;
}
