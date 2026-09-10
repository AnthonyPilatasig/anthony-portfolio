import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlobalAudioPlayer } from '../GlobalAudioPlayer';
import {
  ANTHONY_SPOTIFY_PLAYLIST_NAME,
  ANTHONY_SPOTIFY_PLAYLIST_ID,
  formatSpotifyEmbedUrl,
} from '../../player/musicService';

describe('GlobalAudioPlayer (Compact 8-Bit Pixel Cassette connected to Anthony\'s Spotify)', () => {
  it('debe renderizar el casete pixelado 8-bit compacto con la playlist AnthonWorld', () => {
    render(<GlobalAudioPlayer />);
    
    // Debe mostrar el nombre de la playlist de Anthony
    expect(screen.getByText(ANTHONY_SPOTIFY_PLAYLIST_NAME)).toBeInTheDocument();
    expect(screen.getAllByText(/SPOTIFY/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/LIKED SONGS/i)).toBeInTheDocument();
  });

  it('debe formatear correctamente la URL de embed con el ID de la playlist de Anthony', () => {
    const embed = formatSpotifyEmbedUrl(
      'https://open.spotify.com/playlist/4QIxKoffJwBltogNu8cGU8?si=e148fa82f8cf4c7a'
    );
    expect(embed).toContain(ANTHONY_SPOTIFY_PLAYLIST_ID);
    expect(embed).toContain('open.spotify.com/embed/playlist');
  });

  it('debe expandir el reproductor de Spotify al pulsar en REPRODUCIR', () => {
    render(<GlobalAudioPlayer />);

    const playBtn = screen.getByText(/REPRODUCIR/i);
    fireEvent.click(playBtn);

    // Debe renderizar el iframe embebido de Spotify con la playlist de Anthony
    const iframe = screen.getByTitle(/reproductor spotify anthonworld/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute('src')).toContain(ANTHONY_SPOTIFY_PLAYLIST_ID);
  });
});
