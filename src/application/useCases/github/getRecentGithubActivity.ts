import type { GithubActivityItem, GithubActivityKind, GithubEvent } from '@domain/entities/github.entity';
import { fetchGithubPublicEvents } from '@infrastructure/api/githubClient';

const relativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days}d`;
  return new Date(iso).toLocaleDateString('es-EC', { month: 'short', day: 'numeric' });
};

const describeEvent = (event: GithubEvent): GithubActivityItem | null => {
  const repo = event.repo.name;
  switch (event.type) {
    case 'PushEvent': {
      const commits = (event.payload.commits as unknown[] | undefined)?.length ?? 1;
      return {
        id: event.id,
        kind: 'push',
        text: `Push de ${commits} commit${commits !== 1 ? 's' : ''}`,
        repo,
        date: relativeTime(event.created_at),
      };
    }
    case 'PullRequestEvent': {
      const action = event.payload.action as string;
      return {
        id: event.id,
        kind: 'pull-request',
        text: action === 'opened' ? 'Abrió un Pull Request' : action === 'merged' ? 'Mergeó un Pull Request' : `PR ${action}`,
        repo,
        date: relativeTime(event.created_at),
      };
    }
    case 'CreateEvent': {
      const refType = event.payload.ref_type as string;
      return {
        id: event.id,
        kind: 'branch',
        text: refType === 'repository' ? 'Creó el repositorio' : `Creó ${refType} en`,
        repo,
        date: relativeTime(event.created_at),
      };
    }
    case 'IssuesEvent': {
      const action = event.payload.action as string;
      return {
        id: event.id,
        kind: 'issue',
        text: `Issue ${action === 'opened' ? 'abierto' : action}`,
        repo,
        date: relativeTime(event.created_at),
      };
    }
    default:
      return null;
  }
};

export type { GithubActivityItem, GithubActivityKind };

/**
 * Fetches a user's recent public GitHub activity and shapes it into display-ready
 * items. Presentation is responsible for mapping `kind` to an icon — this use case
 * stays framework-free.
 */
export const getRecentGithubActivity = async (
  username: string,
  limit = 5,
  signal?: AbortSignal
): Promise<GithubActivityItem[]> => {
  const events = await fetchGithubPublicEvents(username, 15, signal);
  return events
    .map(describeEvent)
    .filter((item): item is GithubActivityItem => item !== null)
    .slice(0, limit);
};
