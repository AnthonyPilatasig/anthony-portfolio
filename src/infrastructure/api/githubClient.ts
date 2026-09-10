import type { GithubEvent } from '@domain/entities/github.entity';

/**
 * Raw adapter over the public GitHub REST API — no shaping/business logic here,
 * that belongs to the application layer (see useCases/github).
 */
export const fetchGithubPublicEvents = async (
  username: string,
  perPage = 15,
  signal?: AbortSignal
): Promise<GithubEvent[]> => {
  const res = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=${perPage}`,
    { signal }
  );
  if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
  return res.json();
};
