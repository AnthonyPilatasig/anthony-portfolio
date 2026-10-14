// Builds public/music/playlist.json so the cassette player can play full songs from
// YouTube (Spotify's embed only plays 30-second previews to visitors without a login).
//
// No accounts or API keys: it reads the track list from the public Spotify embed page and
// takes YouTube's top search result that can actually be played on the site (embedding
// allowed). Length doesn't have to match; only hour-long compilations are skipped. If the
// first search finds nothing, simpler queries are tried. Run it whenever the playlist changes:
//
//   npm run music:sync
//
// Tracks already in playlist.json keep their YouTube video, so a wrong match can be fixed
// by editing its `youtubeId` by hand — later runs won't overwrite it. To re-search a song,
// delete its entry.
//
// Note: this reads public web pages instead of the official APIs, so it can break if
// Spotify or YouTube change their markup. Keep usage occasional and low-volume.
//
// Env (optional): SPOTIFY_PLAYLIST_ID (defaults to AnthonWorld).
import fs from 'node:fs/promises';
import path from 'node:path';

const OUTPUT = path.resolve('public/music/playlist.json');
const PLAYLIST_ID = process.env.SPOTIFY_PLAYLIST_ID || '4QIxKoffJwBltogNu8cGU8';
const DELAY_MS = 800; // pause between YouTube searches to keep the traffic light
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36',
  'Accept-Language': 'es-EC,es;q=0.9,en;q=0.8',
  Cookie: 'CONSENT=YES+1',
};

const RETRY_DELAYS_MS = [2000, 5000, 10000];
// Stop early when YouTube keeps failing (likely rate-limited); found tracks are kept and
// the next run continues with the missing ones.
const MAX_CONSECUTIVE_FAILURES = 5;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// fetch with retries for network errors and 429/5xx responses.
async function fetchWithRetry(url, options) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, options);
      if ((res.status === 429 || res.status >= 500) && attempt < RETRY_DELAYS_MS.length) {
        await sleep(RETRY_DELAYS_MS[attempt]);
        continue;
      }
      return res;
    } catch (err) {
      if (attempt >= RETRY_DELAYS_MS.length) {
        throw new Error(`network error (${err.cause?.code ?? err.message})`);
      }
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
}

const embeddedJson = (html, pattern, what) => {
  const match = html.match(pattern);
  if (!match) throw new Error(`Could not find ${what} in the page (its markup may have changed).`);
  return JSON.parse(match[1]);
};

async function readSpotifyPlaylist() {
  const res = await fetchWithRetry(`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Spotify embed page: HTTP ${res.status}`);
  const data = embeddedJson(
    await res.text(),
    /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s,
    'the Spotify playlist data'
  );
  const entity = data?.props?.pageProps?.state?.data?.entity;
  if (!entity?.trackList) throw new Error('Spotify playlist data has no track list.');

  // Track covers aren't in the embed data; the playlist cover is used for every track.
  const sources = entity.coverArt?.sources ?? [];
  const cover = [...sources].sort((a, b) => (a.width ?? 0) - (b.width ?? 0)).find((s) => (s.width ?? 0) >= 60)?.url
    ?? sources[0]?.url ?? null;

  return {
    name: entity.name ?? entity.title,
    url: `https://open.spotify.com/playlist/${PLAYLIST_ID}`,
    tracks: entity.trackList
      .filter((t) => t.entityType === 'track' && t.uri)
      .map((t) => ({
        spotifyId: t.uri.split(':').pop(),
        title: t.title,
        artist: t.subtitle,
        durationMs: t.duration,
        cover,
      })),
  };
}

const toSeconds = (text) => (text ? text.split(':').reduce((acc, n) => acc * 60 + Number(n), 0) : null);

// Videos in YouTube's own ranking order for a query.
async function youtubeResults(query) {
  // sp=EgIQAQ%3D%3D limits results to videos (no channels/playlists).
  const res = await fetchWithRetry(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error(`YouTube search: HTTP ${res.status}`);
  const data = embeddedJson(await res.text(), /var ytInitialData = (\{.*?\});<\/script>/s, 'YouTube search results');

  const videos = [];
  const walk = (node) => {
    if (!node || typeof node !== 'object' || videos.length >= 8) return;
    if (node.videoRenderer?.videoId) {
      videos.push({ id: node.videoRenderer.videoId, seconds: toSeconds(node.videoRenderer.lengthText?.simpleText) });
      return;
    }
    for (const key in node) walk(node[key]);
  };
  walk(data);
  return videos;
}

// YouTube's public oEmbed answers 200 only for videos that allow embedding, i.e. the ones
// the cassette can actually play.
async function isEmbeddable(videoId) {
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
  const res = await fetchWithRetry(url, { headers: HEADERS });
  return res.ok;
}

// Anything longer than this is a compilation or an hour-long loop, not the song.
const MAX_VIDEO_SECONDS = 15 * 60;

async function findVideo(track) {
  // From most to least specific; the simpler queries rescue songs whose artist name is
  // written differently on YouTube (romanized, translated, featuring credits...).
  const queries = [...new Set([`${track.artist} - ${track.title}`, `${track.title} ${track.artist.split(',')[0]}`, track.title])];
  for (const [n, query] of queries.entries()) {
    if (n > 0) await sleep(DELAY_MS);
    const candidates = (await youtubeResults(query)).filter((v) => v.seconds === null || v.seconds <= MAX_VIDEO_SECONDS);
    for (const video of candidates.slice(0, 4)) {
      if (await isEmbeddable(video.id)) return video.id;
    }
  }
  return null;
}

async function readPrevious() {
  try {
    return JSON.parse(await fs.readFile(OUTPUT, 'utf8'));
  } catch {
    return { tracks: [] };
  }
}

const previous = await readPrevious();
const known = new Map(previous.tracks.filter((t) => t.youtubeId).map((t) => [t.spotifyId, t.youtubeId]));

const playlist = await readSpotifyPlaylist();
console.log(`"${playlist.name}": ${playlist.tracks.length} tracks.`);

const tracks = [];
let searched = 0;
let notFound = 0;
let consecutiveFailures = 0;
let stoppedEarly = false;
for (const [i, track] of playlist.tracks.entries()) {
  let youtubeId = known.get(track.spotifyId) ?? null;
  if (!youtubeId && !stoppedEarly) {
    try {
      if (searched > 0) await sleep(DELAY_MS);
      searched++;
      youtubeId = await findVideo(track);
      consecutiveFailures = 0;
      console.log(`  [${i + 1}/${playlist.tracks.length}] ${track.artist} - ${track.title} → ${youtubeId ?? 'not found'}`);
    } catch (err) {
      console.warn(`  [${i + 1}/${playlist.tracks.length}] ${track.title}: ${err.message}`);
      if (++consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        stoppedEarly = true;
        console.warn('  YouTube keeps failing; stopping here. Run the script again later to continue.');
      }
    }
  }
  if (youtubeId) tracks.push({ ...track, youtubeId });
  else notFound++;
}

const output = { playlist: { id: PLAYLIST_ID, name: playlist.name, url: playlist.url }, tracks };
await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
await fs.writeFile(OUTPUT, JSON.stringify(output, null, 2) + '\n');
console.log(
  `Done: ${tracks.length} tracks with a video, ${searched} searched now, ${notFound} without a match. ` +
    `Saved to public/music/playlist.json`
);
