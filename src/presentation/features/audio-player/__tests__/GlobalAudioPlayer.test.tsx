import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlobalAudioPlayer } from '../GlobalAudioPlayer';
import {
  ANTHONY_SPOTIFY_PLAYLIST_NAME,
  ANTHONY_SPOTIFY_PLAYLIST_ID,
  formatSpotifyEmbedUrl,
} from '../musicService';

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

  it('no debe fingir que reproduce hasta que el controller real de Spotify esté listo', () => {
    render(<GlobalAudioPlayer />);

    // El botón espera la conexión real con el iFrame API de Spotify (que no existe
    // en este entorno de test) en vez de alternar un estado local falso — por eso
    // arranca deshabilitado mostrando "CARGANDO", nunca "PAUSAR" de inmediato.
    const playBtn = screen.getByRole('button', { name: /cargando/i });
    expect(playBtn).toBeDisabled();
    fireEvent.click(playBtn);
    expect(screen.queryByText(/PAUSAR/i)).not.toBeInTheDocument();
  });
});
