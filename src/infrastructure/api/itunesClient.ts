export interface ITunesSearchResult {
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
  artworkUrl60?: string;
}

/**
 * Raw adapter over the public, key-free iTunes Search API. Returns the first
 * match for a search term, or null when nothing matched / the request failed.
 */
export const searchItunesTrack = async (
  term: string,
  signal?: AbortSignal
): Promise<ITunesSearchResult | null> => {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=1`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.results?.[0] ?? null;
};
