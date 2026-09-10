import type { MusicPreviewTrack } from '@domain/entities/music-preview.entity';
import { searchItunesTrack } from '@infrastructure/api/itunesClient';

/**
 * Resolves one preview track per search term via the public iTunes Search API.
 * Terms that fail or have no match are silently dropped rather than failing the batch.
 */
export const getMusicPreviewTracks = async (
  searchTerms: string[],
  signal?: AbortSignal
): Promise<MusicPreviewTrack[]> => {
  const results = await Promise.all(
    searchTerms.map(async (term): Promise<MusicPreviewTrack | null> => {
      const item = await searchItunesTrack(term, signal);
      if (!item?.previewUrl) return null;
      return {
        title: item.trackName ?? term,
        artist: item.artistName ?? 'Unknown Artist',
        src: item.previewUrl,
        artwork: item.artworkUrl60,
      };
    })
  );

  return results.filter((track): track is MusicPreviewTrack => track !== null);
};
