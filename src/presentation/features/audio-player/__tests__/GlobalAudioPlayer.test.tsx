import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { GlobalAudioPlayer } from '../GlobalAudioPlayer';
import {
  ANTHONY_SPOTIFY_PLAYLIST_NAME,
  ANTHONY_SPOTIFY_PLAYLIST_ID,
  formatSpotifyEmbedUrl,
} from '../musicService';
import type { MusicPlaylist } from '@domain/entities/music-playlist.entity';

const mockPlaylistResponse = (body: MusicPlaylist | null) => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).endsWith('music/playlist.json') && body) {
        return new Response(JSON.stringify(body), { status: 200 });
      }
      return new Response('not found', { status: 404 });
    })
  );
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('GlobalAudioPlayer', () => {
  describe('sin playlist sincronizada (respaldo con Spotify)', () => {
    it('muestra el casete con la playlist AnthonWorld de Spotify', async () => {
      mockPlaylistResponse(null);
      render(<GlobalAudioPlayer />);

      expect(await screen.findByText(ANTHONY_SPOTIFY_PLAYLIST_NAME)).toBeInTheDocument();
      expect(screen.getAllByText(/SPOTIFY/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/LIKED SONGS/i)).toBeInTheDocument();
    });

    it('no finge reproducir hasta que el controller real de Spotify esté listo', async () => {
      mockPlaylistResponse(null);
      render(<GlobalAudioPlayer />);

      // The Spotify iFrame API doesn't exist in jsdom, so the button stays disabled on
      // "CARGANDO" instead of toggling a fake local state.
      const playBtn = await screen.findByRole('button', { name: /cargando/i });
      expect(playBtn).toBeDisabled();
      fireEvent.click(playBtn);
      expect(screen.queryByText(/PAUSAR/i)).not.toBeInTheDocument();
    });
  });

  describe('con playlist sincronizada (YouTube)', () => {
    const playlist: MusicPlaylist = {
      playlist: { id: 'x', name: 'AnthonWorld', url: 'https://open.spotify.com/playlist/x' },
      tracks: [
        { spotifyId: 'a', title: 'Canción de prueba', artist: 'Artista Demo', durationMs: 200000, cover: null, youtubeId: 'abc123' },
        { spotifyId: 'b', title: 'Segunda canción', artist: 'Otro Artista', durationMs: 180000, cover: null, youtubeId: 'def456' },
      ],
    };

    it('muestra la canción actual, el contador y los controles de anterior/siguiente', async () => {
      mockPlaylistResponse(playlist);
      render(<GlobalAudioPlayer />);

      expect(await screen.findByText('Canción de prueba')).toBeInTheDocument();
      expect(screen.getByText('Artista Demo')).toBeInTheDocument();
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /canción siguiente/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /canción anterior/i })).toBeInTheDocument();
    });
  });

  it('formatea la URL de embed con el ID de la playlist de Anthony', () => {
    const embed = formatSpotifyEmbedUrl(
      'https://open.spotify.com/playlist/4QIxKoffJwBltogNu8cGU8?si=e148fa82f8cf4c7a'
    );
    expect(embed).toContain(ANTHONY_SPOTIFY_PLAYLIST_ID);
    expect(embed).toContain('open.spotify.com/embed/playlist');
  });
});
